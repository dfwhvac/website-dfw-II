#!/usr/bin/env python3
"""
DFW HVAC Service Area Map - Version 2
Overlays drive-time zones on actual zip code boundaries with city names
"""

import requests
import json
import geopandas as gpd
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.colors import LinearSegmentedColormap
from shapely.geometry import shape, Point, Polygon, MultiPolygon, box
from shapely.ops import unary_union
import numpy as np
import time
import os
import zipfile
import io

# OpenRouteService API Key
ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjhhMDQ1YzYyYzYwZjQwYTI4Y2Y5NTY4NDIzNDkzNTNhIiwiaCI6Im11cm11cjY0In0="

# DFW HVAC headquarters location (Coppell, TX - 75019)
HQ_COORDS = [-96.9903, 32.9546]  # [longitude, latitude]

# DFW bounding box for filtering
DFW_BOUNDS = {
    'min_lon': -97.6,
    'max_lon': -96.2,
    'min_lat': 32.4,
    'max_lat': 33.5
}

# Zone colors
ZONE_COLORS = {
    'zone1': '#22c55e',  # Green
    'zone2': '#eab308',  # Yellow
    'zone3': '#3b82f6',  # Blue
    'zone4': '#9ca3af',  # Gray
}

def download_zcta_shapefile():
    """Download and extract Texas ZCTA shapefile from Census Bureau"""
    print("Downloading ZCTA (Zip Code) boundaries from Census Bureau...")
    
    # Use 2020 ZCTA data - smaller file focused on Texas
    # We'll download the national file and filter to DFW area
    url = "https://www2.census.gov/geo/tiger/TIGER2023/ZCTA520/tl_2023_us_zcta520.zip"
    
    cache_path = "/tmp/zcta_shapefile"
    shapefile_path = f"{cache_path}/tl_2023_us_zcta520.shp"
    
    if os.path.exists(shapefile_path):
        print("Using cached ZCTA shapefile...")
        return shapefile_path
    
    print("Downloading ZCTA shapefile (this may take a moment)...")
    response = requests.get(url, stream=True, timeout=300)
    
    if response.status_code != 200:
        print(f"Error downloading shapefile: {response.status_code}")
        return None
    
    # Extract zip file
    os.makedirs(cache_path, exist_ok=True)
    with zipfile.ZipFile(io.BytesIO(response.content)) as z:
        z.extractall(cache_path)
    
    print("ZCTA shapefile downloaded and extracted.")
    return shapefile_path

def get_dfw_zcta_boundaries():
    """Get zip code boundaries for DFW area"""
    shapefile_path = download_zcta_shapefile()
    
    if not shapefile_path:
        print("Failed to get ZCTA shapefile, using fallback method...")
        return None
    
    print("Loading and filtering ZCTA boundaries for DFW area...")
    
    # Read the shapefile
    gdf = gpd.read_file(shapefile_path)
    
    # Create bounding box for DFW
    dfw_bbox = box(DFW_BOUNDS['min_lon'], DFW_BOUNDS['min_lat'], 
                   DFW_BOUNDS['max_lon'], DFW_BOUNDS['max_lat'])
    
    # Filter to DFW area (intersects with bounding box)
    gdf = gdf[gdf.geometry.intersects(dfw_bbox)]
    
    # Ensure correct CRS
    if gdf.crs != "EPSG:4326":
        gdf = gdf.to_crs("EPSG:4326")
    
    print(f"Found {len(gdf)} zip codes in DFW area")
    return gdf

def get_isochrones():
    """Fetch drive-time isochrones from OpenRouteService API"""
    print("Fetching drive-time isochrones from OpenRouteService...")
    
    url = "https://api.openrouteservice.org/v2/isochrones/driving-car"
    
    headers = {
        'Authorization': ORS_API_KEY,
        'Content-Type': 'application/json'
    }
    
    # Request all three zones
    body = {
        "locations": [HQ_COORDS],
        "range": [15*60, 30*60, 45*60],  # 15, 30, 45 minutes in seconds
        "range_type": "time",
        "smoothing": 25
    }
    
    response = requests.post(url, json=body, headers=headers)
    
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None
    
    data = response.json()
    print(f"Successfully retrieved {len(data['features'])} isochrone zones")
    return data

def load_drive_time_data():
    """Load the drive time data from CSV"""
    csv_path = '/app/frontend/public/DFW_HVAC_Service_Area_Zones.csv'
    df = pd.read_csv(csv_path)
    df.columns = ['zip_code', 'city', 'drive_time_min', 'zone1_pct', 'zone2_pct', 'zone3_pct', 'zone4_pct']
    df['zip_code'] = df['zip_code'].astype(str).str.zfill(5)
    
    # Determine primary zone
    def get_zone(row):
        if row['zone1_pct'] > 0:
            return 1
        elif row['zone2_pct'] > 0:
            return 2
        elif row['zone3_pct'] > 0:
            return 3
        else:
            return 4
    
    df['zone'] = df.apply(get_zone, axis=1)
    return df

def create_enhanced_map(zcta_gdf, isochrone_data, drive_time_df, output_path):
    """Create an enhanced map with zip code boundaries and city names"""
    print("Generating enhanced service area map...")
    
    fig, ax = plt.subplots(1, 1, figsize=(20, 16))
    
    # Merge drive time data with ZCTA boundaries
    if zcta_gdf is not None:
        zcta_gdf['ZCTA5CE20'] = zcta_gdf['ZCTA5CE20'].astype(str).str.zfill(5)
        merged = zcta_gdf.merge(drive_time_df, left_on='ZCTA5CE20', right_on='zip_code', how='left')
        
        # Fill NaN zones with 4 (outside service area)
        merged['zone'] = merged['zone'].fillna(4).astype(int)
        
        # Create color mapping
        zone_to_color = {
            1: ZONE_COLORS['zone1'],
            2: ZONE_COLORS['zone2'],
            3: ZONE_COLORS['zone3'],
            4: ZONE_COLORS['zone4']
        }
        
        # Plot zip code boundaries colored by zone
        for zone_num in [4, 3, 2, 1]:  # Plot in reverse order so zone 1 is on top
            zone_data = merged[merged['zone'] == zone_num]
            if len(zone_data) > 0:
                zone_data.plot(ax=ax, 
                              color=zone_to_color[zone_num], 
                              edgecolor='white', 
                              linewidth=0.5, 
                              alpha=0.7)
        
        # Add zip code labels for zones 1 and 2
        for idx, row in merged[merged['zone'] <= 2].iterrows():
            centroid = row.geometry.centroid
            ax.annotate(row['ZCTA5CE20'], 
                       xy=(centroid.x, centroid.y),
                       fontsize=6, 
                       ha='center', 
                       va='center',
                       color='#1f2937',
                       weight='bold',
                       bbox=dict(boxstyle='round,pad=0.1', facecolor='white', alpha=0.7, edgecolor='none'))
    
    # Plot isochrone boundaries (as outlines only)
    if isochrone_data and 'features' in isochrone_data:
        zone_styles = {
            2700: (ZONE_COLORS['zone3'], 'Zone 3 boundary', '--'),
            1800: (ZONE_COLORS['zone2'], 'Zone 2 boundary', '--'),
            900: (ZONE_COLORS['zone1'], 'Zone 1 boundary', '-'),
        }
        
        for feature in isochrone_data['features']:
            geom = shape(feature['geometry'])
            value = feature['properties']['value']
            
            if value in zone_styles:
                color, label, linestyle = zone_styles[value]
                
                if geom.geom_type == 'Polygon':
                    x, y = geom.exterior.xy
                    ax.plot(x, y, color=color, linewidth=2.5, linestyle=linestyle, alpha=0.9)
                elif geom.geom_type == 'MultiPolygon':
                    for poly in geom.geoms:
                        x, y = poly.exterior.xy
                        ax.plot(x, y, color=color, linewidth=2.5, linestyle=linestyle, alpha=0.9)
    
    # Add city name labels
    city_locations = {
        'Coppell': (-96.99, 32.965),
        'Irving': (-96.94, 32.83),
        'Carrollton': (-96.89, 32.98),
        'Grapevine': (-97.08, 32.93),
        'Lewisville': (-96.99, 33.05),
        'Flower Mound': (-97.10, 33.03),
        'Dallas': (-96.77, 32.78),
        'Plano': (-96.70, 33.02),
        'Frisco': (-96.82, 33.15),
        'McKinney': (-96.63, 33.20),
        'Arlington': (-97.11, 32.70),
        'Fort Worth': (-97.33, 32.76),
        'Denton': (-97.13, 33.21),
        'Richardson': (-96.70, 32.95),
        'Garland': (-96.62, 32.91),
        'Grand Prairie': (-97.00, 32.72),
        'Bedford': (-97.14, 32.85),
        'Euless': (-97.08, 32.85),
        'Southlake': (-97.15, 32.95),
        'Colleyville': (-97.16, 32.88),
        'The Colony': (-96.89, 33.09),
        'Allen': (-96.65, 33.11),
        'Mesquite': (-96.60, 32.77),
        'Rowlett': (-96.55, 32.91),
        'Addison': (-96.83, 32.96),
        'Farmers Branch': (-96.88, 32.93),
        'North Richland Hills': (-97.22, 32.86),
        'Hurst': (-97.18, 32.84),
        'Keller': (-97.25, 32.93),
    }
    
    for city, (lon, lat) in city_locations.items():
        if DFW_BOUNDS['min_lon'] < lon < DFW_BOUNDS['max_lon'] and DFW_BOUNDS['min_lat'] < lat < DFW_BOUNDS['max_lat']:
            ax.annotate(city, 
                       xy=(lon, lat),
                       fontsize=9,
                       ha='center',
                       va='center',
                       color='#374151',
                       weight='bold',
                       style='italic',
                       bbox=dict(boxstyle='round,pad=0.2', facecolor='white', alpha=0.85, edgecolor='#d1d5db'))
    
    # Plot HQ location
    ax.scatter(HQ_COORDS[0], HQ_COORDS[1], c='#dc2626', s=300, marker='*', 
               edgecolors='white', linewidth=2, zorder=10)
    ax.annotate('DFW HVAC\nHeadquarters', 
               xy=(HQ_COORDS[0], HQ_COORDS[1]),
               xytext=(HQ_COORDS[0] + 0.05, HQ_COORDS[1] + 0.03),
               fontsize=9,
               ha='left',
               va='bottom',
               color='#dc2626',
               weight='bold',
               bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.9, edgecolor='#dc2626'))
    
    # Create legend
    legend_elements = [
        mpatches.Patch(facecolor=ZONE_COLORS['zone1'], alpha=0.7, edgecolor='white',
                      label='Zone 1: <15 min (Primary)'),
        mpatches.Patch(facecolor=ZONE_COLORS['zone2'], alpha=0.7, edgecolor='white',
                      label='Zone 2: 15-30 min (Standard)'),
        mpatches.Patch(facecolor=ZONE_COLORS['zone3'], alpha=0.7, edgecolor='white',
                      label='Zone 3: 30-45 min (Extended)'),
        mpatches.Patch(facecolor=ZONE_COLORS['zone4'], alpha=0.7, edgecolor='white',
                      label='Zone 4: >45 min (Outside Service Area)'),
        plt.Line2D([0], [0], marker='*', color='w', markerfacecolor='#dc2626', 
                   markersize=15, label='DFW HVAC Headquarters')
    ]
    
    ax.legend(handles=legend_elements, loc='upper right', fontsize=11, framealpha=0.95,
             title='Service Zones', title_fontsize=12)
    
    # Styling
    ax.set_xlabel('Longitude', fontsize=12, labelpad=10)
    ax.set_ylabel('Latitude', fontsize=12, labelpad=10)
    ax.set_title('DFW HVAC Service Area\nDrive-Time Coverage Zones with Zip Code Boundaries', 
                fontsize=18, fontweight='bold', pad=20)
    ax.grid(True, alpha=0.3, linestyle='--', color='#9ca3af')
    ax.set_facecolor('#f8fafc')
    
    # Set bounds
    ax.set_xlim(DFW_BOUNDS['min_lon'], DFW_BOUNDS['max_lon'])
    ax.set_ylim(DFW_BOUNDS['min_lat'], DFW_BOUNDS['max_lat'])
    
    # Add stats box
    stats_text = f"""Service Area Statistics
━━━━━━━━━━━━━━━━━━━━━━
Zone 1 (<15 min):    {len(drive_time_df[drive_time_df['zone']==1])} zip codes
Zone 2 (15-30 min): {len(drive_time_df[drive_time_df['zone']==2])} zip codes
Zone 3 (30-45 min): {len(drive_time_df[drive_time_df['zone']==3])} zip codes
━━━━━━━━━━━━━━━━━━━━━━
Total Service Area: {len(drive_time_df)} zip codes"""
    
    ax.text(0.02, 0.02, stats_text, transform=ax.transAxes, fontsize=10,
           verticalalignment='bottom', fontfamily='monospace',
           bbox=dict(boxstyle='round,pad=0.5', facecolor='white', alpha=0.9, edgecolor='#d1d5db'))
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    
    print(f"Enhanced map saved to {output_path}")

def main():
    print("=" * 60)
    print("DFW HVAC Service Area Map - Enhanced Version")
    print("With Zip Code Boundaries and City Names")
    print("=" * 60)
    print()
    
    # Step 1: Load drive time data
    drive_time_df = load_drive_time_data()
    print(f"Loaded drive time data for {len(drive_time_df)} zip codes")
    
    # Step 2: Get ZCTA boundaries
    zcta_gdf = get_dfw_zcta_boundaries()
    
    # Step 3: Get isochrones
    isochrone_data = get_isochrones()
    
    # Step 4: Create enhanced map
    output_path = '/app/frontend/public/dfw_service_area_map.png'
    create_enhanced_map(zcta_gdf, isochrone_data, drive_time_df, output_path)
    
    print()
    print("=" * 60)
    print("Map Generation Complete!")
    print("=" * 60)
    print(f"Output: {output_path}")

if __name__ == "__main__":
    main()
