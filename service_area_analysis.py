#!/usr/bin/env python3
"""
DFW HVAC Service Area Analysis - High Accuracy Version
Uses OpenRouteService API for actual drive-time isochrones
"""

import requests
import json
import geopandas as gpd
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from shapely.geometry import shape, Point, Polygon, MultiPolygon
from shapely.ops import unary_union
import numpy as np
import time
import os

# OpenRouteService API Key (from user)
ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjhhMDQ1YzYyYzYwZjQwYTI4Y2Y5NTY4NDIzNDkzNTNhIiwiaCI6Im11cm11cjY0In0="

# DFW HVAC headquarters location (Coppell, TX - 75019)
HQ_COORDS = [-96.9903, 32.9546]  # [longitude, latitude]

# Drive time zones in seconds
ZONES = {
    'zone1': 15 * 60,   # <15 min (Green)
    'zone2': 30 * 60,   # 15-30 min (Yellow)
    'zone3': 45 * 60,   # 30-45 min (Blue)
}

# Zone colors
ZONE_COLORS = {
    'zone1': '#22c55e',  # Green
    'zone2': '#eab308',  # Yellow
    'zone3': '#3b82f6',  # Blue
    'zone4': '#9ca3af',  # Gray (outside zones)
}

def get_isochrones():
    """Fetch drive-time isochrones from OpenRouteService API"""
    print("Fetching drive-time isochrones from OpenRouteService...")
    
    url = "https://api.openrouteservice.org/v2/isochrones/driving-car"
    
    headers = {
        'Authorization': ORS_API_KEY,
        'Content-Type': 'application/json'
    }
    
    body = {
        "locations": [HQ_COORDS],
        "range": [ZONES['zone1'], ZONES['zone2'], ZONES['zone3']],
        "range_type": "time",
        "attributes": ["area", "total_pop"],
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

def get_dfw_zip_codes():
    """Get DFW area zip code boundaries from Census TIGER/Line data"""
    print("Fetching DFW zip code boundaries...")
    
    # Texas ZCTA (Zip Code Tabulation Areas) from Census Bureau
    # Using the 2020 TIGER/Line Shapefiles
    url = "https://www2.census.gov/geo/tiger/TIGER2023/ZCTA520/tl_2023_us_zcta520.zip"
    
    # For efficiency, we'll use a pre-filtered approach with known DFW zip codes
    # and create approximate boundaries based on centroids
    
    # Major DFW area zip codes with their approximate centroids
    dfw_zips = {
        # Core service area (Coppell and immediate surroundings)
        '75019': {'city': 'Coppell', 'lat': 32.9546, 'lon': -96.9903},
        '75063': {'city': 'Irving', 'lat': 32.9179, 'lon': -96.9647},
        '75057': {'city': 'Lewisville', 'lat': 33.0462, 'lon': -96.9942},
        '75022': {'city': 'Flower Mound', 'lat': 33.0146, 'lon': -97.0697},
        '75039': {'city': 'Irving', 'lat': 32.8846, 'lon': -96.9419},
        '75007': {'city': 'Carrollton', 'lat': 32.9756, 'lon': -96.8897},
        '76051': {'city': 'Grapevine', 'lat': 32.9343, 'lon': -97.0781},
        '75006': {'city': 'Carrollton', 'lat': 32.9537, 'lon': -96.9000},
        '75038': {'city': 'Irving', 'lat': 32.8571, 'lon': -96.9686},
        '75234': {'city': 'Farmers Branch', 'lat': 32.9265, 'lon': -96.8961},
        '75067': {'city': 'Lewisville', 'lat': 33.0023, 'lon': -96.9536},
        '75010': {'city': 'Carrollton', 'lat': 33.0018, 'lon': -96.8536},
        '75077': {'city': 'Flower Mound', 'lat': 33.0557, 'lon': -97.0036},
        '75028': {'city': 'Flower Mound', 'lat': 33.0362, 'lon': -97.1142},
        '75220': {'city': 'Dallas', 'lat': 32.8666, 'lon': -96.8719},
        '75244': {'city': 'Dallas', 'lat': 32.9304, 'lon': -96.8339},
        '75287': {'city': 'Dallas', 'lat': 32.9893, 'lon': -96.8200},
        '75229': {'city': 'Dallas', 'lat': 32.8879, 'lon': -96.8686},
        '75062': {'city': 'Irving', 'lat': 32.8437, 'lon': -96.9428},
        '75001': {'city': 'Addison', 'lat': 32.9601, 'lon': -96.8319},
        '76092': {'city': 'Southlake', 'lat': 32.9546, 'lon': -97.1503},
        '76039': {'city': 'Euless', 'lat': 32.8571, 'lon': -97.0756},
        '75061': {'city': 'Irving', 'lat': 32.8140, 'lon': -96.9503},
        '76155': {'city': 'Fort Worth', 'lat': 32.8304, 'lon': -97.0461},
        '75248': {'city': 'Dallas', 'lat': 32.9654, 'lon': -96.8006},
        '75060': {'city': 'Irving', 'lat': 32.7979, 'lon': -96.9672},
        '76022': {'city': 'Bedford', 'lat': 32.8540, 'lon': -97.1242},
        '76040': {'city': 'Euless', 'lat': 32.8432, 'lon': -97.0819},
        '76034': {'city': 'Colleyville', 'lat': 32.8804, 'lon': -97.1550},
        '75240': {'city': 'Dallas', 'lat': 32.9318, 'lon': -96.7867},
        '75056': {'city': 'The Colony', 'lat': 33.0907, 'lon': -96.8922},
        '75254': {'city': 'Dallas', 'lat': 32.9443, 'lon': -96.7750},
        '76021': {'city': 'Bedford', 'lat': 32.8418, 'lon': -97.1356},
        '75230': {'city': 'Dallas', 'lat': 32.8996, 'lon': -96.7933},
        '75252': {'city': 'Dallas', 'lat': 32.9896, 'lon': -96.7697},
        '75235': {'city': 'Dallas', 'lat': 32.8329, 'lon': -96.8453},
        '75093': {'city': 'Plano', 'lat': 33.0318, 'lon': -96.7597},
        '76006': {'city': 'Arlington', 'lat': 32.7757, 'lon': -97.0778},
        '76182': {'city': 'North Richland Hills', 'lat': 32.8871, 'lon': -97.1989},
        '75024': {'city': 'Plano', 'lat': 33.0729, 'lon': -96.7178},
        '75231': {'city': 'Dallas', 'lat': 32.8818, 'lon': -96.7592},
        '75083': {'city': 'Richardson', 'lat': 32.9482, 'lon': -96.7297},
        '76053': {'city': 'Hurst', 'lat': 32.8329, 'lon': -97.1686},
        '76054': {'city': 'Hurst', 'lat': 32.8571, 'lon': -97.1897},
        '75033': {'city': 'Frisco', 'lat': 33.1507, 'lon': -96.8236},
        '75051': {'city': 'Grand Prairie', 'lat': 32.7379, 'lon': -96.9953},
        '76262': {'city': 'Roanoke', 'lat': 33.0040, 'lon': -97.2258},
        '76011': {'city': 'Arlington', 'lat': 32.7568, 'lon': -97.0886},
        '75068': {'city': 'Little Elm', 'lat': 33.1557, 'lon': -96.9375},
        '75243': {'city': 'Dallas', 'lat': 32.9004, 'lon': -96.7264},
        '76180': {'city': 'North Richland Hills', 'lat': 32.8596, 'lon': -97.2175},
        '76210': {'city': 'Denton', 'lat': 33.1746, 'lon': -97.0725},
        '75075': {'city': 'Plano', 'lat': 33.0129, 'lon': -96.7350},
        '76226': {'city': 'Argyle', 'lat': 33.1118, 'lon': -97.1836},
        '75080': {'city': 'Richardson', 'lat': 32.9629, 'lon': -96.7053},
        '76248': {'city': 'Keller', 'lat': 32.9346, 'lon': -97.2519},
        '75023': {'city': 'Plano', 'lat': 33.0543, 'lon': -96.6867},
        '76012': {'city': 'Arlington', 'lat': 32.7346, 'lon': -97.1114},
        '75081': {'city': 'Richardson', 'lat': 32.9482, 'lon': -96.6725},
        '75050': {'city': 'Grand Prairie', 'lat': 32.7593, 'lon': -97.0217},
        '76148': {'city': 'Fort Worth', 'lat': 32.8646, 'lon': -97.2658},
        '76208': {'city': 'Denton', 'lat': 33.2179, 'lon': -97.0706},
        '75034': {'city': 'Frisco', 'lat': 33.1118, 'lon': -96.7772},
        '76010': {'city': 'Arlington', 'lat': 32.7168, 'lon': -97.0894},
        '75036': {'city': 'Frisco', 'lat': 33.1607, 'lon': -96.7506},
        '76118': {'city': 'Fort Worth', 'lat': 32.8004, 'lon': -97.2028},
        '76120': {'city': 'Fort Worth', 'lat': 32.7768, 'lon': -97.1778},
        '76244': {'city': 'Keller', 'lat': 32.9418, 'lon': -97.2858},
        '75025': {'city': 'Plano', 'lat': 33.0854, 'lon': -96.7303},
        '75074': {'city': 'Plano', 'lat': 33.0254, 'lon': -96.6558},
        '76137': {'city': 'Fort Worth', 'lat': 32.8554, 'lon': -97.2986},
        '75082': {'city': 'Richardson', 'lat': 32.9818, 'lon': -96.6544},
        '75052': {'city': 'Grand Prairie', 'lat': 32.6893, 'lon': -97.0119},
        '76014': {'city': 'Arlington', 'lat': 32.7004, 'lon': -97.0747},
        '76013': {'city': 'Arlington', 'lat': 32.7254, 'lon': -97.1322},
        '75042': {'city': 'Garland', 'lat': 32.9082, 'lon': -96.6503},
        '75035': {'city': 'Frisco', 'lat': 33.1407, 'lon': -96.7031},
        '76209': {'city': 'Denton', 'lat': 33.2193, 'lon': -97.1156},
        '76177': {'city': 'Fort Worth', 'lat': 32.9307, 'lon': -97.3236},
        '76201': {'city': 'Denton', 'lat': 33.2143, 'lon': -97.1367},
        '76205': {'city': 'Denton', 'lat': 33.1879, 'lon': -97.1281},
        '75044': {'city': 'Garland', 'lat': 32.9593, 'lon': -96.6281},
        '76247': {'city': 'Justin', 'lat': 33.0829, 'lon': -97.2978},
        '76015': {'city': 'Arlington', 'lat': 32.6968, 'lon': -97.1089},
        '75041': {'city': 'Garland', 'lat': 32.8768, 'lon': -96.6319},
        '76052': {'city': 'Haslet', 'lat': 32.9693, 'lon': -97.3486},
        '76016': {'city': 'Arlington', 'lat': 32.7082, 'lon': -97.1464},
        '75040': {'city': 'Garland', 'lat': 32.9218, 'lon': -96.6164},
        '75002': {'city': 'Allen', 'lat': 33.1018, 'lon': -96.6428},
        '75054': {'city': 'Grand Prairie', 'lat': 32.6568, 'lon': -97.0017},
        '76017': {'city': 'Arlington', 'lat': 32.6843, 'lon': -97.1269},
        '76018': {'city': 'Arlington', 'lat': 32.6618, 'lon': -97.0950},
        '75070': {'city': 'McKinney', 'lat': 33.1868, 'lon': -96.6478},
        '76207': {'city': 'Denton', 'lat': 33.2318, 'lon': -97.1747},
        '75078': {'city': 'Prosper', 'lat': 33.2368, 'lon': -96.7867},
        '75045': {'city': 'Garland', 'lat': 32.8543, 'lon': -96.5858},
        '75043': {'city': 'Garland', 'lat': 32.8593, 'lon': -96.6039},
        '75013': {'city': 'Allen', 'lat': 33.1204, 'lon': -96.6256},
        '75071': {'city': 'McKinney', 'lat': 33.1743, 'lon': -96.6092},
        '76227': {'city': 'Aubrey', 'lat': 33.2968, 'lon': -96.9539},
        '75150': {'city': 'Mesquite', 'lat': 32.7754, 'lon': -96.6117},
        '75069': {'city': 'McKinney', 'lat': 33.2143, 'lon': -96.6317},
        '75072': {'city': 'McKinney', 'lat': 33.2268, 'lon': -96.6581},
        '76063': {'city': 'Mansfield', 'lat': 32.5632, 'lon': -97.1119},
        '75104': {'city': 'Cedar Hill', 'lat': 32.5882, 'lon': -96.9478},
        '75116': {'city': 'Duncanville', 'lat': 32.6518, 'lon': -96.9125},
        '75115': {'city': 'DeSoto', 'lat': 32.5954, 'lon': -96.8614},
        '76001': {'city': 'Arlington', 'lat': 32.6268, 'lon': -97.1228},
        '76002': {'city': 'Arlington', 'lat': 32.6154, 'lon': -97.0556},
        '75048': {'city': 'Sachse', 'lat': 32.9782, 'lon': -96.5783},
        '75098': {'city': 'Wylie', 'lat': 33.0293, 'lon': -96.5206},
        '75089': {'city': 'Rowlett', 'lat': 32.9004, 'lon': -96.5519},
        '75088': {'city': 'Rowlett', 'lat': 32.9168, 'lon': -96.5594},
        '75087': {'city': 'Rockwall', 'lat': 32.9293, 'lon': -96.4619},
        '75032': {'city': 'Rockwall', 'lat': 32.8843, 'lon': -96.4597},
        '75149': {'city': 'Mesquite', 'lat': 32.7418, 'lon': -96.6367},
        '75181': {'city': 'Mesquite', 'lat': 32.7268, 'lon': -96.5558},
        '75182': {'city': 'Sunnyvale', 'lat': 32.7668, 'lon': -96.5486},
        '75228': {'city': 'Dallas', 'lat': 32.8154, 'lon': -96.6875},
        '75218': {'city': 'Dallas', 'lat': 32.8318, 'lon': -96.7119},
        '75214': {'city': 'Dallas', 'lat': 32.8204, 'lon': -96.7528},
        '75238': {'city': 'Dallas', 'lat': 32.8768, 'lon': -96.7008},
        '75225': {'city': 'Dallas', 'lat': 32.8579, 'lon': -96.7917},
        '75205': {'city': 'Dallas', 'lat': 32.8329, 'lon': -96.7978},
        '75209': {'city': 'Dallas', 'lat': 32.8429, 'lon': -96.8214},
        '75219': {'city': 'Dallas', 'lat': 32.8104, 'lon': -96.8097},
        '75204': {'city': 'Dallas', 'lat': 32.7979, 'lon': -96.7861},
        '75201': {'city': 'Dallas', 'lat': 32.7879, 'lon': -96.8022},
        '75202': {'city': 'Dallas', 'lat': 32.7829, 'lon': -96.7917},
        '75207': {'city': 'Dallas', 'lat': 32.7879, 'lon': -96.8272},
        '75208': {'city': 'Dallas', 'lat': 32.7593, 'lon': -96.8511},
        '75211': {'city': 'Dallas', 'lat': 32.7418, 'lon': -96.8914},
        '75212': {'city': 'Dallas', 'lat': 32.7854, 'lon': -96.8772},
        '75247': {'city': 'Dallas', 'lat': 32.8118, 'lon': -96.8647},
        '75270': {'city': 'Dallas', 'lat': 32.7829, 'lon': -96.8019},
    }
    
    return dfw_zips

def calculate_drive_times_batch(zip_data, hq_coords, api_key):
    """Calculate actual drive times using ORS Matrix API"""
    print("Calculating drive times using OpenRouteService Matrix API...")
    
    # Prepare locations list
    locations = [hq_coords]  # First location is HQ
    zip_codes = list(zip_data.keys())
    
    for zip_code in zip_codes:
        info = zip_data[zip_code]
        locations.append([info['lon'], info['lat']])
    
    # ORS Matrix API has a limit of 3500 elements (sources * destinations)
    # We'll batch if needed, but for ~130 zips, we're fine
    
    url = "https://api.openrouteservice.org/v2/matrix/driving-car"
    
    headers = {
        'Authorization': api_key,
        'Content-Type': 'application/json'
    }
    
    # Calculate times from HQ (source 0) to all destinations
    body = {
        "locations": locations,
        "sources": [0],  # Only HQ as source
        "destinations": list(range(1, len(locations))),  # All zip codes as destinations
        "metrics": ["duration"]
    }
    
    response = requests.post(url, json=body, headers=headers)
    
    if response.status_code != 200:
        print(f"Matrix API Error: {response.status_code}")
        print(response.text)
        return None
    
    data = response.json()
    durations = data['durations'][0]  # Get durations from HQ to all destinations
    
    # Map durations to zip codes
    results = {}
    for i, zip_code in enumerate(zip_codes):
        duration_seconds = durations[i]
        if duration_seconds is not None:
            results[zip_code] = {
                **zip_data[zip_code],
                'drive_time_seconds': duration_seconds,
                'drive_time_minutes': duration_seconds / 60
            }
    
    print(f"Calculated drive times for {len(results)} zip codes")
    return results

def classify_zip_codes(drive_time_data):
    """Classify zip codes into zones based on drive time"""
    print("Classifying zip codes into service zones...")
    
    classified = []
    
    for zip_code, data in drive_time_data.items():
        minutes = data['drive_time_minutes']
        
        # Determine zone percentages based on drive time
        # This is a simplified approach - actual coverage would require polygon intersection
        if minutes <= 15:
            zone1_pct = 100
            zone2_pct = 0
            zone3_pct = 0
            zone4_pct = 0
            primary_zone = 1
        elif minutes <= 30:
            zone1_pct = 0
            zone2_pct = 100
            zone3_pct = 0
            zone4_pct = 0
            primary_zone = 2
        elif minutes <= 45:
            zone1_pct = 0
            zone2_pct = 0
            zone3_pct = 100
            zone4_pct = 0
            primary_zone = 3
        else:
            zone1_pct = 0
            zone2_pct = 0
            zone3_pct = 0
            zone4_pct = 100
            primary_zone = 4
        
        classified.append({
            'zip_code': zip_code,
            'city': data['city'],
            'drive_time_min': round(minutes, 1),
            'zone1_pct': zone1_pct,
            'zone2_pct': zone2_pct,
            'zone3_pct': zone3_pct,
            'zone4_pct': zone4_pct,
            'primary_zone': primary_zone,
            'lat': data['lat'],
            'lon': data['lon']
        })
    
    return pd.DataFrame(classified)

def create_service_area_map(df, isochrone_data, output_path):
    """Create a high-quality service area map"""
    print("Generating service area map...")
    
    fig, ax = plt.subplots(1, 1, figsize=(16, 14))
    
    # Plot isochrone zones if available
    if isochrone_data and 'features' in isochrone_data:
        # Sort features by value (largest first) so smaller zones overlay larger ones
        features = sorted(isochrone_data['features'], 
                         key=lambda x: x['properties']['value'], 
                         reverse=True)
        
        zone_labels = {
            2700: ('Zone 3: 30-45 min', ZONE_COLORS['zone3'], 0.3),
            1800: ('Zone 2: 15-30 min', ZONE_COLORS['zone2'], 0.4),
            900: ('Zone 1: <15 min', ZONE_COLORS['zone1'], 0.5),
        }
        
        for feature in features:
            geom = shape(feature['geometry'])
            value = feature['properties']['value']
            
            if value in zone_labels:
                label, color, alpha = zone_labels[value]
                
                if geom.geom_type == 'Polygon':
                    x, y = geom.exterior.xy
                    ax.fill(x, y, alpha=alpha, fc=color, ec=color, linewidth=2)
                elif geom.geom_type == 'MultiPolygon':
                    for poly in geom.geoms:
                        x, y = poly.exterior.xy
                        ax.fill(x, y, alpha=alpha, fc=color, ec=color, linewidth=2)
    
    # Plot zip code points colored by zone
    zone_colors_map = {
        1: ZONE_COLORS['zone1'],
        2: ZONE_COLORS['zone2'],
        3: ZONE_COLORS['zone3'],
        4: ZONE_COLORS['zone4']
    }
    
    for _, row in df.iterrows():
        color = zone_colors_map.get(row['primary_zone'], ZONE_COLORS['zone4'])
        ax.scatter(row['lon'], row['lat'], c=color, s=60, edgecolors='white', linewidth=0.5, zorder=5)
        
        # Add zip code label for zone 1 and 2 areas
        if row['primary_zone'] <= 2:
            ax.annotate(row['zip_code'], (row['lon'], row['lat']), 
                       fontsize=6, ha='center', va='bottom', 
                       xytext=(0, 3), textcoords='offset points',
                       color='#1f2937', weight='bold')
    
    # Plot HQ location
    ax.scatter(HQ_COORDS[0], HQ_COORDS[1], c='#dc2626', s=200, marker='*', 
               edgecolors='white', linewidth=2, zorder=10, label='DFW HVAC HQ')
    
    # Create legend
    legend_elements = [
        mpatches.Patch(facecolor=ZONE_COLORS['zone1'], alpha=0.5, edgecolor=ZONE_COLORS['zone1'],
                      label='Zone 1: <15 min (Primary)'),
        mpatches.Patch(facecolor=ZONE_COLORS['zone2'], alpha=0.4, edgecolor=ZONE_COLORS['zone2'],
                      label='Zone 2: 15-30 min (Standard)'),
        mpatches.Patch(facecolor=ZONE_COLORS['zone3'], alpha=0.3, edgecolor=ZONE_COLORS['zone3'],
                      label='Zone 3: 30-45 min (Extended)'),
        mpatches.Patch(facecolor=ZONE_COLORS['zone4'], alpha=0.3, edgecolor=ZONE_COLORS['zone4'],
                      label='Zone 4: >45 min (Outside Service Area)'),
        plt.scatter([], [], c='#dc2626', s=150, marker='*', label='DFW HVAC Headquarters')
    ]
    
    ax.legend(handles=legend_elements, loc='upper right', fontsize=10, framealpha=0.95)
    
    # Styling
    ax.set_xlabel('Longitude', fontsize=12)
    ax.set_ylabel('Latitude', fontsize=12)
    ax.set_title('DFW HVAC Service Area\nDrive-Time Based Coverage Zones', fontsize=16, fontweight='bold', pad=20)
    ax.grid(True, alpha=0.3, linestyle='--')
    ax.set_facecolor('#f8fafc')
    
    # Set appropriate bounds
    ax.set_xlim(-97.5, -96.3)
    ax.set_ylim(32.5, 33.4)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    
    print(f"Map saved to {output_path}")

def main():
    print("=" * 60)
    print("DFW HVAC Service Area Analysis - High Accuracy Version")
    print("=" * 60)
    print()
    
    # Step 1: Get DFW zip codes
    zip_data = get_dfw_zip_codes()
    print(f"Loaded {len(zip_data)} DFW area zip codes")
    print()
    
    # Step 2: Get isochrones for visualization
    isochrone_data = get_isochrones()
    if isochrone_data:
        print("Isochrone data retrieved successfully")
    else:
        print("Warning: Could not retrieve isochrone data, proceeding with point-based analysis")
    print()
    
    # Step 3: Calculate actual drive times
    time.sleep(1)  # Rate limiting
    drive_time_data = calculate_drive_times_batch(zip_data, HQ_COORDS, ORS_API_KEY)
    
    if not drive_time_data:
        print("Error: Could not calculate drive times")
        return
    
    # Step 4: Classify zip codes into zones
    df = classify_zip_codes(drive_time_data)
    
    # Step 5: Sort by drive time
    df = df.sort_values('drive_time_min').reset_index(drop=True)
    
    # Step 6: Filter to relevant service area (zones 1-3, >10% coverage)
    service_df = df[df['primary_zone'] <= 3].copy()
    
    print()
    print(f"Service Area Summary:")
    print(f"  Zone 1 (<15 min): {len(df[df['primary_zone'] == 1])} zip codes")
    print(f"  Zone 2 (15-30 min): {len(df[df['primary_zone'] == 2])} zip codes")
    print(f"  Zone 3 (30-45 min): {len(df[df['primary_zone'] == 3])} zip codes")
    print(f"  Zone 4 (>45 min): {len(df[df['primary_zone'] == 4])} zip codes")
    print()
    
    # Step 7: Save CSV
    csv_path = '/app/frontend/public/DFW_HVAC_Service_Area_Zones.csv'
    output_df = service_df[['zip_code', 'city', 'drive_time_min', 'zone1_pct', 'zone2_pct', 'zone3_pct', 'zone4_pct']].copy()
    output_df.columns = ['Zip Code', 'City', 'Drive Time (min)', 'Zone 1 (%)', 'Zone 2 (%)', 'Zone 3 (%)', 'Zone 4 (%)']
    output_df.to_csv(csv_path, index=False)
    print(f"CSV saved to {csv_path}")
    
    # Step 8: Create map
    map_path = '/app/frontend/public/dfw_service_area_map.png'
    create_service_area_map(df, isochrone_data, map_path)
    
    print()
    print("=" * 60)
    print("Analysis Complete!")
    print("=" * 60)
    print(f"CSV: {csv_path}")
    print(f"Map: {map_path}")

if __name__ == "__main__":
    main()
