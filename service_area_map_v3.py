#!/usr/bin/env python3
"""
DFW HVAC Service Area Map - Version 3
With zip code boundary lines, city names, and adjusted transparency
"""

import requests
import json
import geopandas as gpd
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from shapely.geometry import shape, box
import numpy as np
import os
import zipfile
import io

# OpenRouteService API Key
ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjhhMDQ1YzYyYzYwZjQwYTI4Y2Y5NTY4NDIzNDkzNTNhIiwiaCI6Im11cm11cjY0In0="

# DFW HVAC headquarters location (Coppell, TX - 75019)
HQ_COORDS = [-96.9903, 32.9546]

# DFW bounding box
DFW_BOUNDS = {'min_lon': -97.5, 'max_lon': -96.3, 'min_lat': 32.5, 'max_lat': 33.4}

# Zone colors - using lighter alpha for 50% more transparency
ZONE_COLORS = {
    'zone1': '#22c55e',  # Green
    'zone2': '#eab308',  # Yellow  
    'zone3': '#3b82f6',  # Blue
    'zone4': '#d1d5db',  # Light Gray
}

# Reduced alpha (was 0.7, now 0.35 for 50% more transparency)
ZONE_ALPHA = 0.35

def download_texas_zcta():
    """Download Texas ZCTA shapefile"""
    cache_dir = "/tmp/tx_zcta"
    shapefile_path = f"{cache_dir}/tl_2023_48_zcta520.shp"
    
    if os.path.exists(shapefile_path):
        print("Using cached Texas ZCTA shapefile...")
        return shapefile_path
    
    print("Downloading Texas ZCTA shapefile...")
    # Texas state FIPS code is 48
    url = "https://www2.census.gov/geo/tiger/TIGER2023/ZCTA520/tl_2023_48_zcta520.zip"
    
    try:
        response = requests.get(url, timeout=120)
        if response.status_code == 200:
            os.makedirs(cache_dir, exist_ok=True)
            with zipfile.ZipFile(io.BytesIO(response.content)) as z:
                z.extractall(cache_dir)
            print("Texas ZCTA shapefile downloaded.")
            return shapefile_path
    except Exception as e:
        print(f"Could not download Texas-specific file: {e}")
    
    # Fallback to national file
    print("Falling back to national ZCTA file...")
    cache_dir = "/tmp/zcta_national"
    shapefile_path = f"{cache_dir}/tl_2023_us_zcta520.shp"
    
    if os.path.exists(shapefile_path):
        return shapefile_path
        
    url = "https://www2.census.gov/geo/tiger/TIGER2023/ZCTA520/tl_2023_us_zcta520.zip"
    response = requests.get(url, timeout=600, stream=True)
    
    if response.status_code == 200:
        os.makedirs(cache_dir, exist_ok=True)
        with zipfile.ZipFile(io.BytesIO(response.content)) as z:
            z.extractall(cache_dir)
        return shapefile_path
    
    return None

def get_dfw_boundaries():
    """Get zip code boundaries for DFW area"""
    shapefile_path = download_texas_zcta()
    
    if not shapefile_path or not os.path.exists(shapefile_path):
        print("Could not load shapefile")
        return None
    
    print("Loading ZCTA boundaries...")
    gdf = gpd.read_file(shapefile_path)
    
    # Create DFW bounding box
    dfw_bbox = box(DFW_BOUNDS['min_lon'], DFW_BOUNDS['min_lat'], 
                   DFW_BOUNDS['max_lon'], DFW_BOUNDS['max_lat'])
    
    # Filter to DFW area
    gdf = gdf[gdf.geometry.intersects(dfw_bbox)]
    
    if gdf.crs != "EPSG:4326":
        gdf = gdf.to_crs("EPSG:4326")
    
    print(f"Found {len(gdf)} zip codes in DFW area")
    return gdf

def get_isochrones():
    """Fetch drive-time isochrones"""
    print("Fetching isochrones...")
    
    url = "https://api.openrouteservice.org/v2/isochrones/driving-car"
    headers = {'Authorization': ORS_API_KEY, 'Content-Type': 'application/json'}
    body = {
        "locations": [HQ_COORDS],
        "range": [900, 1800, 2700],  # 15, 30, 45 min
        "range_type": "time",
        "smoothing": 25
    }
    
    response = requests.post(url, json=body, headers=headers)
    if response.status_code == 200:
        print("Isochrones retrieved successfully")
        return response.json()
    return None

def load_drive_time_data():
    """Load drive time data"""
    df = pd.read_csv('/app/frontend/public/DFW_HVAC_Service_Area_Zones.csv')
    df.columns = ['zip_code', 'city', 'drive_time_min', 'zone1_pct', 'zone2_pct', 'zone3_pct', 'zone4_pct']
    df['zip_code'] = df['zip_code'].astype(str).str.zfill(5)
    
    def get_zone(row):
        if row['zone1_pct'] > 0: return 1
        elif row['zone2_pct'] > 0: return 2
        elif row['zone3_pct'] > 0: return 3
        return 4
    
    df['zone'] = df.apply(get_zone, axis=1)
    return df

def create_map(zcta_gdf, isochrone_data, drive_time_df, output_path):
    """Create the enhanced map"""
    print("Generating map...")
    
    fig, ax = plt.subplots(1, 1, figsize=(20, 16))
    ax.set_facecolor('#f1f5f9')
    
    zone_to_color = {1: ZONE_COLORS['zone1'], 2: ZONE_COLORS['zone2'], 
                     3: ZONE_COLORS['zone3'], 4: ZONE_COLORS['zone4']}
    
    if zcta_gdf is not None:
        # Get zip code column name
        zip_col = 'ZCTA5CE20' if 'ZCTA5CE20' in zcta_gdf.columns else 'ZCTA5CE10'
        zcta_gdf[zip_col] = zcta_gdf[zip_col].astype(str).str.zfill(5)
        
        # Merge with drive time data
        merged = zcta_gdf.merge(drive_time_df, left_on=zip_col, right_on='zip_code', how='left')
        merged['zone'] = merged['zone'].fillna(4).astype(int)
        
        # Plot each zone with VISIBLE BOUNDARY LINES
        for zone_num in [4, 3, 2, 1]:
            zone_data = merged[merged['zone'] == zone_num]
            if len(zone_data) > 0:
                zone_data.plot(ax=ax, 
                              facecolor=zone_to_color[zone_num], 
                              edgecolor='#374151',  # Dark gray boundary lines
                              linewidth=0.8,        # Visible line width
                              alpha=ZONE_ALPHA)     # 50% more transparent
        
        # Add zip code labels for zones 1 and 2
        for idx, row in merged[merged['zone'] <= 2].iterrows():
            centroid = row.geometry.centroid
            ax.annotate(row[zip_col], xy=(centroid.x, centroid.y),
                       fontsize=7, ha='center', va='center', color='#1f2937', weight='bold',
                       bbox=dict(boxstyle='round,pad=0.15', facecolor='white', alpha=0.8, edgecolor='none'))
    
    # Plot isochrone boundary outlines
    if isochrone_data and 'features' in isochrone_data:
        styles = {2700: (ZONE_COLORS['zone3'], 3), 1800: (ZONE_COLORS['zone2'], 3), 900: (ZONE_COLORS['zone1'], 3.5)}
        
        for feature in isochrone_data['features']:
            geom = shape(feature['geometry'])
            value = feature['properties']['value']
            if value in styles:
                color, lw = styles[value]
                if geom.geom_type == 'Polygon':
                    x, y = geom.exterior.xy
                    ax.plot(x, y, color=color, linewidth=lw, alpha=0.9, zorder=5)
                elif geom.geom_type == 'MultiPolygon':
                    for poly in geom.geoms:
                        x, y = poly.exterior.xy
                        ax.plot(x, y, color=color, linewidth=lw, alpha=0.9, zorder=5)
    
    # City labels
    cities = {
        'Coppell': (-96.99, 32.96), 'Irving': (-96.94, 32.82), 'Carrollton': (-96.89, 32.97),
        'Grapevine': (-97.08, 32.93), 'Lewisville': (-96.99, 33.05), 'Flower Mound': (-97.10, 33.02),
        'Dallas': (-96.77, 32.78), 'Plano': (-96.70, 33.02), 'Frisco': (-96.82, 33.15),
        'McKinney': (-96.63, 33.20), 'Arlington': (-97.11, 32.70), 'Fort Worth': (-97.35, 32.76),
        'Denton': (-97.13, 33.22), 'Richardson': (-96.70, 32.95), 'Garland': (-96.62, 32.91),
        'Grand Prairie': (-97.00, 32.72), 'Bedford': (-97.14, 32.85), 'Euless': (-97.08, 32.85),
        'Southlake': (-97.15, 32.95), 'Colleyville': (-97.16, 32.88), 'The Colony': (-96.89, 33.09),
        'Allen': (-96.65, 33.11), 'Mesquite': (-96.60, 32.77), 'Addison': (-96.83, 32.96),
        'N. Richland Hills': (-97.22, 32.87), 'Hurst': (-97.18, 32.84), 'Keller': (-97.27, 32.93),
    }
    
    for city, (lon, lat) in cities.items():
        ax.annotate(city, xy=(lon, lat), fontsize=9, ha='center', va='center',
                   color='#1e293b', weight='bold', style='italic',
                   bbox=dict(boxstyle='round,pad=0.2', facecolor='white', alpha=0.85, edgecolor='#94a3b8'))
    
    # HQ marker
    ax.scatter(HQ_COORDS[0], HQ_COORDS[1], c='#dc2626', s=400, marker='*', 
               edgecolors='white', linewidth=2, zorder=10)
    ax.annotate('DFW HVAC HQ', xy=(HQ_COORDS[0], HQ_COORDS[1]),
               xytext=(HQ_COORDS[0] + 0.04, HQ_COORDS[1] + 0.025),
               fontsize=10, ha='left', color='#dc2626', weight='bold',
               bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.95, edgecolor='#dc2626'))
    
    # Legend
    legend_elements = [
        mpatches.Patch(facecolor=ZONE_COLORS['zone1'], alpha=ZONE_ALPHA, edgecolor='#374151', linewidth=0.8, label='Zone 1: <15 min (Primary)'),
        mpatches.Patch(facecolor=ZONE_COLORS['zone2'], alpha=ZONE_ALPHA, edgecolor='#374151', linewidth=0.8, label='Zone 2: 15-30 min (Standard)'),
        mpatches.Patch(facecolor=ZONE_COLORS['zone3'], alpha=ZONE_ALPHA, edgecolor='#374151', linewidth=0.8, label='Zone 3: 30-45 min (Extended)'),
        mpatches.Patch(facecolor=ZONE_COLORS['zone4'], alpha=ZONE_ALPHA, edgecolor='#374151', linewidth=0.8, label='Zone 4: >45 min (Outside)'),
        plt.Line2D([0], [0], marker='*', color='w', markerfacecolor='#dc2626', markersize=15, label='DFW HVAC Headquarters')
    ]
    ax.legend(handles=legend_elements, loc='upper right', fontsize=11, framealpha=0.95, title='Service Zones', title_fontsize=12)
    
    # Stats box
    stats = f"""Service Area Statistics
━━━━━━━━━━━━━━━━━━━━━━━
Zone 1 (<15 min):     {len(drive_time_df[drive_time_df['zone']==1]):>3} zip codes
Zone 2 (15-30 min):  {len(drive_time_df[drive_time_df['zone']==2]):>3} zip codes
Zone 3 (30-45 min):  {len(drive_time_df[drive_time_df['zone']==3]):>3} zip codes
━━━━━━━━━━━━━━━━━━━━━━━
Total Service Area: {len(drive_time_df):>3} zip codes"""
    
    ax.text(0.02, 0.02, stats, transform=ax.transAxes, fontsize=10, verticalalignment='bottom',
           fontfamily='monospace', bbox=dict(boxstyle='round,pad=0.5', facecolor='white', alpha=0.9, edgecolor='#d1d5db'))
    
    # Styling
    ax.set_xlabel('Longitude', fontsize=12)
    ax.set_ylabel('Latitude', fontsize=12)
    ax.set_title('DFW HVAC Service Area\nDrive-Time Coverage Zones with Zip Code Boundaries', fontsize=18, fontweight='bold', pad=20)
    ax.grid(True, alpha=0.4, linestyle='--', color='#94a3b8')
    ax.set_xlim(DFW_BOUNDS['min_lon'], DFW_BOUNDS['max_lon'])
    ax.set_ylim(DFW_BOUNDS['min_lat'], DFW_BOUNDS['max_lat'])
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"Map saved to {output_path}")

def main():
    print("=" * 50)
    print("DFW HVAC Service Area Map - Enhanced Version")
    print("=" * 50)
    
    drive_time_df = load_drive_time_data()
    print(f"Loaded {len(drive_time_df)} zip codes")
    
    zcta_gdf = get_dfw_boundaries()
    isochrone_data = get_isochrones()
    
    create_map(zcta_gdf, isochrone_data, drive_time_df, '/app/frontend/public/dfw_service_area_map.png')
    
    print("\n" + "=" * 50)
    print("Complete!")
    print("=" * 50)

if __name__ == "__main__":
    main()
