#!/usr/bin/env python3
"""
DFW HVAC Service Area Analysis - Geospatial Intersection
Calculates the actual percentage of each zip code's area within each drive-time zone
"""

import requests
import json
import geopandas as gpd
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from shapely.geometry import shape, box, Polygon, MultiPolygon
from shapely.ops import unary_union
import numpy as np
import os
import zipfile
import io
import warnings
warnings.filterwarnings('ignore')

# OpenRouteService API Key
ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjhhMDQ1YzYyYzYwZjQwYTI4Y2Y5NTY4NDIzNDkzNTNhIiwiaCI6Im11cm11cjY0In0="

# DFW HVAC headquarters location (Coppell, TX - 75019)
HQ_COORDS = [-96.9903, 32.9546]

# DFW bounding box
DFW_BOUNDS = {'min_lon': -97.5, 'max_lon': -96.3, 'min_lat': 32.5, 'max_lat': 33.4}

# Zone colors
ZONE_COLORS = {
    'zone1': '#22c55e',  # Green
    'zone2': '#eab308',  # Yellow  
    'zone3': '#3b82f6',  # Blue
    'zone4': '#d1d5db',  # Light Gray
}

ZONE_ALPHA = 0.35

def get_zcta_boundaries():
    """Get zip code boundaries for DFW area"""
    cache_dir = "/tmp/zcta_national"
    shapefile_path = f"{cache_dir}/tl_2023_us_zcta520.shp"
    
    if not os.path.exists(shapefile_path):
        print("Downloading ZCTA shapefile...")
        url = "https://www2.census.gov/geo/tiger/TIGER2023/ZCTA520/tl_2023_us_zcta520.zip"
        response = requests.get(url, timeout=600, stream=True)
        if response.status_code == 200:
            os.makedirs(cache_dir, exist_ok=True)
            with zipfile.ZipFile(io.BytesIO(response.content)) as z:
                z.extractall(cache_dir)
    
    print("Loading ZCTA boundaries...")
    gdf = gpd.read_file(shapefile_path)
    
    # Filter to DFW area
    dfw_bbox = box(DFW_BOUNDS['min_lon'], DFW_BOUNDS['min_lat'], 
                   DFW_BOUNDS['max_lon'], DFW_BOUNDS['max_lat'])
    gdf = gdf[gdf.geometry.intersects(dfw_bbox)]
    
    if gdf.crs != "EPSG:4326":
        gdf = gdf.to_crs("EPSG:4326")
    
    print(f"Found {len(gdf)} zip codes in DFW area")
    return gdf

def get_isochrones():
    """Fetch drive-time isochrones from OpenRouteService API"""
    print("Fetching drive-time isochrones...")
    
    url = "https://api.openrouteservice.org/v2/isochrones/driving-car"
    headers = {'Authorization': ORS_API_KEY, 'Content-Type': 'application/json'}
    
    body = {
        "locations": [HQ_COORDS],
        "range": [900, 1800, 2700],  # 15, 30, 45 minutes in seconds
        "range_type": "time",
        "smoothing": 25
    }
    
    response = requests.post(url, json=body, headers=headers)
    
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        return None
    
    data = response.json()
    
    # Convert to GeoDataFrame and create zone polygons
    zones = {}
    for feature in data['features']:
        value = feature['properties']['value']
        geom = shape(feature['geometry'])
        
        if value == 900:
            zones['zone1'] = geom  # <15 min
        elif value == 1800:
            zones['zone2'] = geom  # <30 min (includes zone1)
        elif value == 2700:
            zones['zone3'] = geom  # <45 min (includes zone1 and zone2)
    
    # Create exclusive zones (donut rings)
    # Zone 1: <15 min (as is)
    # Zone 2: 15-30 min (zone2 minus zone1)
    # Zone 3: 30-45 min (zone3 minus zone2)
    
    exclusive_zones = {}
    exclusive_zones['zone1'] = zones['zone1']
    
    if 'zone2' in zones and 'zone1' in zones:
        exclusive_zones['zone2'] = zones['zone2'].difference(zones['zone1'])
    
    if 'zone3' in zones and 'zone2' in zones:
        exclusive_zones['zone3'] = zones['zone3'].difference(zones['zone2'])
    
    print("Isochrones processed into exclusive zones")
    return zones, exclusive_zones

def calculate_zone_percentages(zcta_gdf, exclusive_zones, cumulative_zones):
    """Calculate the percentage of each zip code in each zone"""
    print("Calculating zone percentages for each zip code...")
    
    zip_col = 'ZCTA5CE20' if 'ZCTA5CE20' in zcta_gdf.columns else 'ZCTA5CE10'
    
    results = []
    total = len(zcta_gdf)
    
    for idx, (_, row) in enumerate(zcta_gdf.iterrows()):
        if idx % 50 == 0:
            print(f"  Processing {idx+1}/{total}...")
        
        zip_code = str(row[zip_col]).zfill(5)
        zip_geom = row.geometry
        zip_area = zip_geom.area
        
        if zip_area == 0:
            continue
        
        # Calculate intersection with each exclusive zone
        zone_pcts = {'zone1': 0, 'zone2': 0, 'zone3': 0, 'zone4': 0}
        
        try:
            # Zone 1: <15 min
            if 'zone1' in exclusive_zones and exclusive_zones['zone1'].is_valid:
                intersection = zip_geom.intersection(exclusive_zones['zone1'])
                if not intersection.is_empty:
                    zone_pcts['zone1'] = (intersection.area / zip_area) * 100
            
            # Zone 2: 15-30 min
            if 'zone2' in exclusive_zones and exclusive_zones['zone2'].is_valid:
                intersection = zip_geom.intersection(exclusive_zones['zone2'])
                if not intersection.is_empty:
                    zone_pcts['zone2'] = (intersection.area / zip_area) * 100
            
            # Zone 3: 30-45 min
            if 'zone3' in exclusive_zones and exclusive_zones['zone3'].is_valid:
                intersection = zip_geom.intersection(exclusive_zones['zone3'])
                if not intersection.is_empty:
                    zone_pcts['zone3'] = (intersection.area / zip_area) * 100
            
            # Zone 4: Everything outside zone 3
            total_service = zone_pcts['zone1'] + zone_pcts['zone2'] + zone_pcts['zone3']
            zone_pcts['zone4'] = max(0, 100 - total_service)
            
        except Exception as e:
            # If intersection fails, skip this zip code
            continue
        
        # Only include zip codes with >10% in any service zone (1-3)
        if zone_pcts['zone1'] + zone_pcts['zone2'] + zone_pcts['zone3'] > 10:
            # Get city name from centroid lookup
            centroid = zip_geom.centroid
            city = get_city_for_zip(zip_code, centroid.y, centroid.x)
            
            results.append({
                'zip_code': zip_code,
                'city': city,
                'zone1_pct': round(zone_pcts['zone1'], 1),
                'zone2_pct': round(zone_pcts['zone2'], 1),
                'zone3_pct': round(zone_pcts['zone3'], 1),
                'zone4_pct': round(zone_pcts['zone4'], 1),
                'lat': centroid.y,
                'lon': centroid.x
            })
    
    df = pd.DataFrame(results)
    
    # Sort by zone priority (zone1 first, then zone2, etc.)
    df['sort_key'] = df['zone1_pct'] * 10000 + df['zone2_pct'] * 100 + df['zone3_pct']
    df = df.sort_values('sort_key', ascending=False).drop('sort_key', axis=1)
    
    return df

def get_city_for_zip(zip_code, lat, lon):
    """Get city name for a zip code based on known data"""
    # Known zip code to city mappings
    zip_cities = {
        '75019': 'Coppell', '75063': 'Irving', '75006': 'Carrollton', '76051': 'Grapevine',
        '75067': 'Lewisville', '75007': 'Carrollton', '75057': 'Lewisville', '75039': 'Irving',
        '75234': 'Farmers Branch', '75077': 'Flower Mound', '75010': 'Carrollton', '75062': 'Irving',
        '75244': 'Dallas', '76092': 'Southlake', '75022': 'Flower Mound', '75229': 'Dallas',
        '75038': 'Irving', '76022': 'Bedford', '75247': 'Dallas', '76021': 'Bedford',
        '75240': 'Dallas', '75220': 'Dallas', '76039': 'Euless', '76155': 'Fort Worth',
        '76040': 'Euless', '75056': 'The Colony', '76262': 'Roanoke', '75050': 'Grand Prairie',
        '76053': 'Hurst', '76034': 'Colleyville', '75230': 'Dallas', '75001': 'Addison',
        '75061': 'Irving', '75083': 'Richardson', '75235': 'Dallas', '75287': 'Dallas',
        '75243': 'Dallas', '75254': 'Dallas', '75207': 'Dallas', '75252': 'Dallas',
        '75209': 'Dallas', '75225': 'Dallas', '75212': 'Dallas', '76210': 'Denton',
        '75248': 'Dallas', '75270': 'Dallas', '76011': 'Arlington', '75201': 'Dallas',
        '75034': 'Frisco', '75238': 'Dallas', '75219': 'Dallas', '75231': 'Dallas',
        '75060': 'Irving', '76006': 'Arlington', '75033': 'Frisco', '75205': 'Dallas',
        '75080': 'Richardson', '76054': 'Hurst', '75051': 'Grand Prairie', '76118': 'Fort Worth',
        '75075': 'Plano', '76180': 'North Richland Hills', '76182': 'North Richland Hills',
        '75202': 'Dallas', '75211': 'Dallas', '75028': 'Flower Mound', '76205': 'Denton',
        '75052': 'Grand Prairie', '75204': 'Dallas', '75093': 'Plano', '75208': 'Dallas',
        '75035': 'Frisco', '76248': 'Keller', '75036': 'Frisco', '76148': 'Fort Worth',
        '75082': 'Richardson', '75025': 'Plano', '76201': 'Denton', '76010': 'Arlington',
        '76014': 'Arlington', '76244': 'Keller', '75214': 'Dallas', '76209': 'Denton',
        '76226': 'Argyle', '76012': 'Arlington', '76120': 'Fort Worth', '76177': 'Fort Worth',
        '75044': 'Garland', '76208': 'Denton', '75054': 'Grand Prairie', '75023': 'Plano',
        '76013': 'Arlington', '75042': 'Garland', '75071': 'McKinney', '75041': 'Garland',
        '75081': 'Richardson', '76207': 'Denton', '75218': 'Dallas', '76137': 'Fort Worth',
        '75116': 'Duncanville', '75078': 'Prosper', '75043': 'Garland', '75024': 'Plano',
        '76018': 'Arlington', '76017': 'Arlington', '75150': 'Mesquite', '75069': 'McKinney',
        '76015': 'Arlington', '76052': 'Haslet', '75040': 'Garland', '75045': 'Garland',
        '75070': 'McKinney', '75074': 'Plano', '75068': 'Little Elm', '75228': 'Dallas',
        '76247': 'Justin', '75088': 'Rowlett', '75149': 'Mesquite', '75072': 'McKinney',
        '76016': 'Arlington', '75013': 'Allen', '75089': 'Rowlett', '75048': 'Sachse',
        '75002': 'Allen', '75104': 'Cedar Hill', '75115': 'DeSoto', '76001': 'Arlington',
        '76002': 'Arlington', '75098': 'Wylie', '75087': 'Rockwall', '75032': 'Rockwall',
        '75181': 'Mesquite', '75182': 'Sunnyvale', '76063': 'Mansfield',
    }
    
    if zip_code in zip_cities:
        return zip_cities[zip_code]
    
    # Fallback: determine city based on approximate location
    if lat > 33.15:
        return 'Denton Area'
    elif lon < -97.2:
        return 'Fort Worth Area'
    elif lon > -96.6:
        return 'East DFW'
    else:
        return 'DFW Metro'

def create_map(zcta_gdf, cumulative_zones, exclusive_zones, df, output_path):
    """Create the map with zone percentages"""
    print("Generating map...")
    
    fig, ax = plt.subplots(1, 1, figsize=(20, 16))
    ax.set_facecolor('#f1f5f9')
    
    zip_col = 'ZCTA5CE20' if 'ZCTA5CE20' in zcta_gdf.columns else 'ZCTA5CE10'
    zcta_gdf[zip_col] = zcta_gdf[zip_col].astype(str).str.zfill(5)
    
    # Merge with calculated data
    merged = zcta_gdf.merge(df, left_on=zip_col, right_on='zip_code', how='left')
    
    # Determine primary zone for coloring
    def get_primary_zone(row):
        if pd.isna(row['zone1_pct']):
            return 4
        if row['zone1_pct'] >= row['zone2_pct'] and row['zone1_pct'] >= row['zone3_pct']:
            return 1 if row['zone1_pct'] > 0 else 4
        elif row['zone2_pct'] >= row['zone3_pct']:
            return 2 if row['zone2_pct'] > 0 else 4
        elif row['zone3_pct'] > 0:
            return 3
        return 4
    
    merged['primary_zone'] = merged.apply(get_primary_zone, axis=1)
    
    zone_to_color = {1: ZONE_COLORS['zone1'], 2: ZONE_COLORS['zone2'], 
                     3: ZONE_COLORS['zone3'], 4: ZONE_COLORS['zone4']}
    
    # Plot zip codes colored by primary zone
    for zone_num in [4, 3, 2, 1]:
        zone_data = merged[merged['primary_zone'] == zone_num]
        if len(zone_data) > 0:
            zone_data.plot(ax=ax, facecolor=zone_to_color[zone_num], 
                          edgecolor='#374151', linewidth=0.8, alpha=ZONE_ALPHA)
    
    # Add zip code labels for zones 1 and 2 (with high percentage)
    for idx, row in merged[(merged['primary_zone'] <= 2) & (merged['zone1_pct'] + merged['zone2_pct'] > 50)].iterrows():
        centroid = row.geometry.centroid
        ax.annotate(row[zip_col], xy=(centroid.x, centroid.y),
                   fontsize=7, ha='center', va='center', color='#1f2937', weight='bold',
                   bbox=dict(boxstyle='round,pad=0.15', facecolor='white', alpha=0.8, edgecolor='none'))
    
    # Plot isochrone boundaries
    for zone_name, geom in cumulative_zones.items():
        if geom and geom.is_valid:
            color = ZONE_COLORS[zone_name]
            if geom.geom_type == 'Polygon':
                x, y = geom.exterior.xy
                ax.plot(x, y, color=color, linewidth=3, alpha=0.9, zorder=5)
            elif geom.geom_type == 'MultiPolygon':
                for poly in geom.geoms:
                    x, y = poly.exterior.xy
                    ax.plot(x, y, color=color, linewidth=3, alpha=0.9, zorder=5)
    
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
    zone1_count = len(df[df['zone1_pct'] > 50])
    zone2_count = len(df[(df['zone2_pct'] > 50) | ((df['zone1_pct'] + df['zone2_pct'] > 50) & (df['zone1_pct'] <= 50))])
    zone3_count = len(df) - zone1_count - zone2_count
    
    stats = f"""Service Area Statistics
━━━━━━━━━━━━━━━━━━━━━━━
Total Zip Codes: {len(df)}
(with >10% in service zones)
━━━━━━━━━━━━━━━━━━━━━━━
Zone percentages calculated
by geographic area overlap"""
    
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
    print("=" * 60)
    print("DFW HVAC Service Area Analysis")
    print("Geospatial Intersection Method")
    print("=" * 60)
    print()
    
    # Step 1: Get ZCTA boundaries
    zcta_gdf = get_zcta_boundaries()
    
    # Step 2: Get isochrones
    cumulative_zones, exclusive_zones = get_isochrones()
    
    # Step 3: Calculate zone percentages
    df = calculate_zone_percentages(zcta_gdf, exclusive_zones, cumulative_zones)
    
    print(f"\nProcessed {len(df)} zip codes with >10% service area coverage")
    
    # Step 4: Save CSV
    csv_path = '/app/frontend/public/DFW_HVAC_Service_Area_Zones.csv'
    output_df = df[['zip_code', 'city', 'zone1_pct', 'zone2_pct', 'zone3_pct', 'zone4_pct']].copy()
    output_df.columns = ['Zip Code', 'City', 'Zone 1 (%)', 'Zone 2 (%)', 'Zone 3 (%)', 'Zone 4 (%)']
    output_df.to_csv(csv_path, index=False)
    print(f"CSV saved to {csv_path}")
    
    # Show sample of mixed-zone zip codes
    print("\nSample zip codes with split zone coverage:")
    mixed = df[(df['zone1_pct'] > 0) & (df['zone1_pct'] < 100) & (df['zone2_pct'] > 0)]
    if len(mixed) > 0:
        print(mixed[['zip_code', 'city', 'zone1_pct', 'zone2_pct', 'zone3_pct']].head(10).to_string(index=False))
    
    # Step 5: Create map
    map_path = '/app/frontend/public/dfw_service_area_map.png'
    create_map(zcta_gdf, cumulative_zones, exclusive_zones, df, map_path)
    
    print("\n" + "=" * 60)
    print("Analysis Complete!")
    print("=" * 60)
    print(f"CSV: {csv_path}")
    print(f"Map: {map_path}")

if __name__ == "__main__":
    main()
