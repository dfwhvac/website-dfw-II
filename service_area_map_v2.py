#!/usr/bin/env python3
"""
DFW HVAC Service Area Map - Enhanced Version (Memory Efficient)
Uses OpenStreetMap tiles as base map with drive-time zones overlay
"""

import requests
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
from shapely.geometry import shape, Point, Polygon
import numpy as np
import contextily as ctx
from pyproj import Transformer

# OpenRouteService API Key
ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjhhMDQ1YzYyYzYwZjQwYTI4Y2Y5NTY4NDIzNDkzNTNhIiwiaCI6Im11cm11cjY0In0="

# DFW HVAC headquarters location (Coppell, TX - 75019)
HQ_COORDS = [-96.9903, 32.9546]  # [longitude, latitude]

# Zone colors with alpha
ZONE_COLORS = {
    'zone1': '#22c55e',  # Green
    'zone2': '#eab308',  # Yellow  
    'zone3': '#3b82f6',  # Blue
    'zone4': '#9ca3af',  # Gray
}

# Zip code centroids for DFW area (comprehensive list)
ZIP_CENTROIDS = {
    '75019': {'city': 'Coppell', 'lat': 32.9546, 'lon': -96.9903},
    '75063': {'city': 'Irving', 'lat': 32.9179, 'lon': -96.9647},
    '75006': {'city': 'Carrollton', 'lat': 32.9537, 'lon': -96.9000},
    '76051': {'city': 'Grapevine', 'lat': 32.9343, 'lon': -97.0781},
    '75067': {'city': 'Lewisville', 'lat': 33.0023, 'lon': -96.9536},
    '75007': {'city': 'Carrollton', 'lat': 32.9756, 'lon': -96.8897},
    '75057': {'city': 'Lewisville', 'lat': 33.0462, 'lon': -96.9942},
    '75039': {'city': 'Irving', 'lat': 32.8846, 'lon': -96.9419},
    '75234': {'city': 'Farmers Branch', 'lat': 32.9265, 'lon': -96.8961},
    '75077': {'city': 'Flower Mound', 'lat': 33.0557, 'lon': -97.0036},
    '75010': {'city': 'Carrollton', 'lat': 33.0018, 'lon': -96.8536},
    '75062': {'city': 'Irving', 'lat': 32.8437, 'lon': -96.9428},
    '75244': {'city': 'Dallas', 'lat': 32.9304, 'lon': -96.8339},
    '76092': {'city': 'Southlake', 'lat': 32.9546, 'lon': -97.1503},
    '75022': {'city': 'Flower Mound', 'lat': 33.0146, 'lon': -97.0697},
    '75229': {'city': 'Dallas', 'lat': 32.8879, 'lon': -96.8686},
    '75038': {'city': 'Irving', 'lat': 32.8571, 'lon': -96.9686},
    '76022': {'city': 'Bedford', 'lat': 32.8540, 'lon': -97.1242},
    '75247': {'city': 'Dallas', 'lat': 32.8118, 'lon': -96.8647},
    '76021': {'city': 'Bedford', 'lat': 32.8418, 'lon': -97.1356},
    '75240': {'city': 'Dallas', 'lat': 32.9318, 'lon': -96.7867},
    '75220': {'city': 'Dallas', 'lat': 32.8666, 'lon': -96.8719},
    '76039': {'city': 'Euless', 'lat': 32.8571, 'lon': -97.0756},
    '76155': {'city': 'Fort Worth', 'lat': 32.8304, 'lon': -97.0461},
    '76040': {'city': 'Euless', 'lat': 32.8432, 'lon': -97.0819},
    '75056': {'city': 'The Colony', 'lat': 33.0907, 'lon': -96.8922},
    '76262': {'city': 'Roanoke', 'lat': 33.0040, 'lon': -97.2258},
    '75050': {'city': 'Grand Prairie', 'lat': 32.7593, 'lon': -97.0217},
    '76053': {'city': 'Hurst', 'lat': 32.8329, 'lon': -97.1686},
    '76034': {'city': 'Colleyville', 'lat': 32.8804, 'lon': -97.1550},
    '75230': {'city': 'Dallas', 'lat': 32.8996, 'lon': -96.7933},
    '75001': {'city': 'Addison', 'lat': 32.9601, 'lon': -96.8319},
    '75061': {'city': 'Irving', 'lat': 32.8140, 'lon': -96.9503},
    '75083': {'city': 'Richardson', 'lat': 32.9482, 'lon': -96.7297},
    '75235': {'city': 'Dallas', 'lat': 32.8329, 'lon': -96.8453},
    '75287': {'city': 'Dallas', 'lat': 32.9893, 'lon': -96.8200},
    '75243': {'city': 'Dallas', 'lat': 32.9004, 'lon': -96.7264},
    '75254': {'city': 'Dallas', 'lat': 32.9443, 'lon': -96.7750},
    '75207': {'city': 'Dallas', 'lat': 32.7879, 'lon': -96.8272},
    '75252': {'city': 'Dallas', 'lat': 32.9896, 'lon': -96.7697},
    '75209': {'city': 'Dallas', 'lat': 32.8429, 'lon': -96.8214},
    '75225': {'city': 'Dallas', 'lat': 32.8579, 'lon': -96.7917},
    '75212': {'city': 'Dallas', 'lat': 32.7854, 'lon': -96.8772},
    '76210': {'city': 'Denton', 'lat': 33.1746, 'lon': -97.0725},
    '75248': {'city': 'Dallas', 'lat': 32.9654, 'lon': -96.8006},
    '75270': {'city': 'Dallas', 'lat': 32.7829, 'lon': -96.8019},
    '76011': {'city': 'Arlington', 'lat': 32.7568, 'lon': -97.0886},
    '75201': {'city': 'Dallas', 'lat': 32.7879, 'lon': -96.8022},
    '75034': {'city': 'Frisco', 'lat': 33.1118, 'lon': -96.7772},
    '75238': {'city': 'Dallas', 'lat': 32.8768, 'lon': -96.7008},
    '75219': {'city': 'Dallas', 'lat': 32.8104, 'lon': -96.8097},
    '75231': {'city': 'Dallas', 'lat': 32.8818, 'lon': -96.7592},
    '75060': {'city': 'Irving', 'lat': 32.7979, 'lon': -96.9672},
    '76006': {'city': 'Arlington', 'lat': 32.7757, 'lon': -97.0778},
    '75033': {'city': 'Frisco', 'lat': 33.1507, 'lon': -96.8236},
    '75205': {'city': 'Dallas', 'lat': 32.8329, 'lon': -96.7978},
    '75080': {'city': 'Richardson', 'lat': 32.9629, 'lon': -96.7053},
    '76054': {'city': 'Hurst', 'lat': 32.8571, 'lon': -97.1897},
    '75051': {'city': 'Grand Prairie', 'lat': 32.7379, 'lon': -96.9953},
    '76118': {'city': 'Fort Worth', 'lat': 32.8004, 'lon': -97.2028},
    '75075': {'city': 'Plano', 'lat': 33.0129, 'lon': -96.7350},
    '76180': {'city': 'North Richland Hills', 'lat': 32.8596, 'lon': -97.2175},
    '76182': {'city': 'North Richland Hills', 'lat': 32.8871, 'lon': -97.1989},
    '75202': {'city': 'Dallas', 'lat': 32.7829, 'lon': -96.7917},
    '75211': {'city': 'Dallas', 'lat': 32.7418, 'lon': -96.8914},
    '75028': {'city': 'Flower Mound', 'lat': 33.0362, 'lon': -97.1142},
    '76205': {'city': 'Denton', 'lat': 33.1879, 'lon': -97.1281},
    '75052': {'city': 'Grand Prairie', 'lat': 32.6893, 'lon': -97.0119},
    '75204': {'city': 'Dallas', 'lat': 32.7979, 'lon': -96.7861},
    '75093': {'city': 'Plano', 'lat': 33.0318, 'lon': -96.7597},
    '75208': {'city': 'Dallas', 'lat': 32.7593, 'lon': -96.8511},
    '75035': {'city': 'Frisco', 'lat': 33.1407, 'lon': -96.7031},
    '76248': {'city': 'Keller', 'lat': 32.9346, 'lon': -97.2519},
    '75036': {'city': 'Frisco', 'lat': 33.1607, 'lon': -96.7506},
    '76148': {'city': 'Fort Worth', 'lat': 32.8646, 'lon': -97.2658},
    '75082': {'city': 'Richardson', 'lat': 32.9818, 'lon': -96.6544},
    '75025': {'city': 'Plano', 'lat': 33.0854, 'lon': -96.7303},
    '76201': {'city': 'Denton', 'lat': 33.2143, 'lon': -97.1367},
    '76010': {'city': 'Arlington', 'lat': 32.7168, 'lon': -97.0894},
    '76014': {'city': 'Arlington', 'lat': 32.7004, 'lon': -97.0747},
    '76244': {'city': 'Keller', 'lat': 32.9418, 'lon': -97.2858},
    '75214': {'city': 'Dallas', 'lat': 32.8204, 'lon': -96.7528},
    '76209': {'city': 'Denton', 'lat': 33.2193, 'lon': -97.1156},
    '76226': {'city': 'Argyle', 'lat': 33.1118, 'lon': -97.1836},
    '76012': {'city': 'Arlington', 'lat': 32.7346, 'lon': -97.1114},
    '76120': {'city': 'Fort Worth', 'lat': 32.7768, 'lon': -97.1778},
    '76177': {'city': 'Fort Worth', 'lat': 32.9307, 'lon': -97.3236},
    '75044': {'city': 'Garland', 'lat': 32.9593, 'lon': -96.6281},
    '76208': {'city': 'Denton', 'lat': 33.2179, 'lon': -97.0706},
    '75054': {'city': 'Grand Prairie', 'lat': 32.6568, 'lon': -97.0017},
    '75023': {'city': 'Plano', 'lat': 33.0543, 'lon': -96.6867},
    '76013': {'city': 'Arlington', 'lat': 32.7254, 'lon': -97.1322},
    '75042': {'city': 'Garland', 'lat': 32.9082, 'lon': -96.6503},
    '75071': {'city': 'McKinney', 'lat': 33.1743, 'lon': -96.6092},
    '75041': {'city': 'Garland', 'lat': 32.8768, 'lon': -96.6319},
    '76207': {'city': 'Denton', 'lat': 33.2318, 'lon': -97.1747},
    '75218': {'city': 'Dallas', 'lat': 32.8318, 'lon': -96.7119},
    '76137': {'city': 'Fort Worth', 'lat': 32.8554, 'lon': -97.2986},
    '75116': {'city': 'Duncanville', 'lat': 32.6518, 'lon': -96.9125},
    '75078': {'city': 'Prosper', 'lat': 33.2368, 'lon': -96.7867},
    '75043': {'city': 'Garland', 'lat': 32.8593, 'lon': -96.6039},
    '75024': {'city': 'Plano', 'lat': 33.0729, 'lon': -96.7178},
    '76018': {'city': 'Arlington', 'lat': 32.6618, 'lon': -97.0950},
    '76017': {'city': 'Arlington', 'lat': 32.6843, 'lon': -97.1269},
    '75150': {'city': 'Mesquite', 'lat': 32.7754, 'lon': -96.6117},
    '75069': {'city': 'McKinney', 'lat': 33.2143, 'lon': -96.6317},
    '76015': {'city': 'Arlington', 'lat': 32.6968, 'lon': -97.1089},
    '76052': {'city': 'Haslet', 'lat': 32.9693, 'lon': -97.3486},
    '75040': {'city': 'Garland', 'lat': 32.9218, 'lon': -96.6164},
    '75045': {'city': 'Garland', 'lat': 32.8543, 'lon': -96.5858},
    '75070': {'city': 'McKinney', 'lat': 33.1868, 'lon': -96.6478},
    '75074': {'city': 'Plano', 'lat': 33.0254, 'lon': -96.6558},
    '75068': {'city': 'Little Elm', 'lat': 33.1557, 'lon': -96.9375},
    '75228': {'city': 'Dallas', 'lat': 32.8154, 'lon': -96.6875},
    '76247': {'city': 'Justin', 'lat': 33.0829, 'lon': -97.2978},
    '75088': {'city': 'Rowlett', 'lat': 32.9168, 'lon': -96.5594},
    '75149': {'city': 'Mesquite', 'lat': 32.7418, 'lon': -96.6367},
    '75072': {'city': 'McKinney', 'lat': 33.2268, 'lon': -96.6581},
    '76016': {'city': 'Arlington', 'lat': 32.7082, 'lon': -97.1464},
    '75013': {'city': 'Allen', 'lat': 33.1204, 'lon': -96.6256},
    '75089': {'city': 'Rowlett', 'lat': 32.9004, 'lon': -96.5519},
    '75048': {'city': 'Sachse', 'lat': 32.9782, 'lon': -96.5783},
    '75002': {'city': 'Allen', 'lat': 33.1018, 'lon': -96.6428},
    '75104': {'city': 'Cedar Hill', 'lat': 32.5882, 'lon': -96.9478},
    '75081': {'city': 'Richardson', 'lat': 32.9482, 'lon': -96.6725},
}

def get_isochrones():
    """Fetch drive-time isochrones from OpenRouteService API"""
    print("Fetching drive-time isochrones...")
    
    url = "https://api.openrouteservice.org/v2/isochrones/driving-car"
    headers = {'Authorization': ORS_API_KEY, 'Content-Type': 'application/json'}
    
    body = {
        "locations": [HQ_COORDS],
        "range": [15*60, 30*60, 45*60],
        "range_type": "time",
        "smoothing": 25
    }
    
    response = requests.post(url, json=body, headers=headers, timeout=30)
    
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        return None
    
    return response.json()

def load_drive_time_data():
    """Load drive time data from CSV"""
    df = pd.read_csv('/app/frontend/public/DFW_HVAC_Service_Area_Zones.csv')
    df.columns = ['zip_code', 'city', 'drive_time_min', 'zone1_pct', 'zone2_pct', 'zone3_pct', 'zone4_pct']
    df['zip_code'] = df['zip_code'].astype(str).str.zfill(5)
    
    # Assign zone based on percentages
    def get_zone(row):
        if row['zone1_pct'] > 0: return 1
        elif row['zone2_pct'] > 0: return 2
        elif row['zone3_pct'] > 0: return 3
        return 4
    
    df['zone'] = df.apply(get_zone, axis=1)
    return df

def create_map_with_basemap(isochrone_data, drive_time_df, output_path):
    """Create map with OpenStreetMap basemap"""
    print("Generating enhanced map with basemap...")
    
    fig, ax = plt.subplots(figsize=(20, 16))
    
    # Convert coordinates to Web Mercator for contextily
    transformer = Transformer.from_crs("EPSG:4326", "EPSG:3857", always_xy=True)
    
    # Map bounds in Web Mercator
    min_x, min_y = transformer.transform(-97.5, 32.5)
    max_x, max_y = transformer.transform(-96.4, 33.35)
    
    ax.set_xlim(min_x, max_x)
    ax.set_ylim(min_y, max_y)
    
    # Plot isochrone zones
    if isochrone_data and 'features' in isochrone_data:
        features = sorted(isochrone_data['features'], 
                         key=lambda x: x['properties']['value'], reverse=True)
        
        zone_config = {
            2700: (ZONE_COLORS['zone3'], 0.35, 'Zone 3: 30-45 min'),
            1800: (ZONE_COLORS['zone2'], 0.45, 'Zone 2: 15-30 min'),
            900: (ZONE_COLORS['zone1'], 0.55, 'Zone 1: <15 min'),
        }
        
        for feature in features:
            geom = shape(feature['geometry'])
            value = feature['properties']['value']
            
            if value in zone_config:
                color, alpha, label = zone_config[value]
                
                if geom.geom_type == 'Polygon':
                    coords = np.array(geom.exterior.coords)
                    x_merc, y_merc = transformer.transform(coords[:, 0], coords[:, 1])
                    ax.fill(x_merc, y_merc, alpha=alpha, fc=color, ec=color, linewidth=2)
                elif geom.geom_type == 'MultiPolygon':
                    for poly in geom.geoms:
                        coords = np.array(poly.exterior.coords)
                        x_merc, y_merc = transformer.transform(coords[:, 0], coords[:, 1])
                        ax.fill(x_merc, y_merc, alpha=alpha, fc=color, ec=color, linewidth=2)
    
    # Plot zip code points
    zone_colors_map = {1: ZONE_COLORS['zone1'], 2: ZONE_COLORS['zone2'], 
                       3: ZONE_COLORS['zone3'], 4: ZONE_COLORS['zone4']}
    
    for _, row in drive_time_df.iterrows():
        zip_code = row['zip_code']
        if zip_code in ZIP_CENTROIDS:
            info = ZIP_CENTROIDS[zip_code]
            x, y = transformer.transform(info['lon'], info['lat'])
            color = zone_colors_map.get(row['zone'], ZONE_COLORS['zone4'])
            
            ax.scatter(x, y, c=color, s=80, edgecolors='white', linewidth=1, zorder=6, alpha=0.9)
            
            # Label zones 1-2 with zip codes
            if row['zone'] <= 2:
                ax.annotate(zip_code, (x, y), fontsize=7, ha='center', va='bottom',
                           xytext=(0, 5), textcoords='offset points',
                           color='#1f2937', weight='bold',
                           bbox=dict(boxstyle='round,pad=0.15', fc='white', alpha=0.8, ec='none'))
    
    # Plot HQ
    hq_x, hq_y = transformer.transform(HQ_COORDS[0], HQ_COORDS[1])
    ax.scatter(hq_x, hq_y, c='#dc2626', s=400, marker='*', edgecolors='white', 
               linewidth=2.5, zorder=10, label='HQ')
    ax.annotate('DFW HVAC\nHeadquarters', (hq_x, hq_y), fontsize=10, ha='left', va='bottom',
               xytext=(15, 10), textcoords='offset points', color='#dc2626', weight='bold',
               bbox=dict(boxstyle='round,pad=0.4', fc='white', alpha=0.95, ec='#dc2626', lw=1.5))
    
    # Add city labels
    cities = {
        'Dallas': (-96.80, 32.78), 'Fort Worth': (-97.33, 32.76),
        'Arlington': (-97.11, 32.70), 'Plano': (-96.70, 33.02),
        'Irving': (-96.95, 32.83), 'Garland': (-96.62, 32.91),
        'Frisco': (-96.82, 33.15), 'McKinney': (-96.63, 33.20),
        'Denton': (-97.13, 33.22), 'Carrollton': (-96.89, 32.97),
        'Lewisville': (-96.99, 33.05), 'Richardson': (-96.70, 32.95),
        'Grand Prairie': (-97.00, 32.72), 'Flower Mound': (-97.10, 33.03),
        'Grapevine': (-97.08, 32.93), 'Bedford': (-97.14, 32.85),
        'Mesquite': (-96.60, 32.77), 'Coppell': (-96.99, 32.96),
    }
    
    for city, (lon, lat) in cities.items():
        cx, cy = transformer.transform(lon, lat)
        ax.annotate(city, (cx, cy), fontsize=11, ha='center', va='center',
                   color='#1e3a5f', weight='bold', style='italic',
                   bbox=dict(boxstyle='round,pad=0.25', fc='white', alpha=0.85, ec='#94a3b8', lw=0.5))
    
    # Add basemap
    try:
        ctx.add_basemap(ax, source=ctx.providers.CartoDB.Positron, zoom=11, alpha=0.6)
    except Exception as e:
        print(f"Could not add basemap: {e}")
        ax.set_facecolor('#f0f4f8')
    
    # Legend
    legend_elements = [
        mpatches.Patch(fc=ZONE_COLORS['zone1'], alpha=0.55, ec='white', label='Zone 1: <15 min (Primary)'),
        mpatches.Patch(fc=ZONE_COLORS['zone2'], alpha=0.45, ec='white', label='Zone 2: 15-30 min (Standard)'),
        mpatches.Patch(fc=ZONE_COLORS['zone3'], alpha=0.35, ec='white', label='Zone 3: 30-45 min (Extended)'),
        mpatches.Patch(fc=ZONE_COLORS['zone4'], alpha=0.3, ec='white', label='Zone 4: >45 min (Outside)'),
        plt.Line2D([0], [0], marker='*', color='w', markerfacecolor='#dc2626', 
                   markersize=18, label='DFW HVAC Headquarters'),
    ]
    ax.legend(handles=legend_elements, loc='upper right', fontsize=11, framealpha=0.95,
             title='Service Coverage Zones', title_fontsize=12)
    
    # Stats box
    stats = f"""Service Area Statistics
━━━━━━━━━━━━━━━━━━━━
Zone 1 (<15 min):    {len(drive_time_df[drive_time_df['zone']==1]):>3} zip codes
Zone 2 (15-30 min): {len(drive_time_df[drive_time_df['zone']==2]):>3} zip codes
Zone 3 (30-45 min): {len(drive_time_df[drive_time_df['zone']==3]):>3} zip codes
━━━━━━━━━━━━━━━━━━━━
Total:                    {len(drive_time_df):>3} zip codes"""
    
    ax.text(0.02, 0.02, stats, transform=ax.transAxes, fontsize=10,
           verticalalignment='bottom', fontfamily='monospace',
           bbox=dict(boxstyle='round,pad=0.5', fc='white', alpha=0.92, ec='#d1d5db'))
    
    # Title and labels
    ax.set_title('DFW HVAC Service Area\nDrive-Time Coverage with City Boundaries', 
                fontsize=20, fontweight='bold', pad=20)
    ax.set_xlabel('')
    ax.set_ylabel('')
    ax.tick_params(left=False, bottom=False, labelleft=False, labelbottom=False)
    
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
    
    isochrone_data = get_isochrones()
    if isochrone_data:
        print(f"Retrieved {len(isochrone_data['features'])} isochrone zones")
    
    output_path = '/app/frontend/public/dfw_service_area_map.png'
    create_map_with_basemap(isochrone_data, drive_time_df, output_path)
    
    print("\n" + "=" * 50)
    print("Map generation complete!")
    print("=" * 50)

if __name__ == "__main__":
    main()
