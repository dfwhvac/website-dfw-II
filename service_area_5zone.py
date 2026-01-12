#!/usr/bin/env python3
"""
DFW HVAC Service Area Analysis - Full Rebuild
New 5-Zone Model with Demographics

HQ Address: 556 S. Coppell Rd, Coppell, TX 75019
"""

import requests
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from shapely.geometry import shape, box
from shapely.ops import unary_union
import numpy as np
import os
import zipfile
import io
import time
import warnings
warnings.filterwarnings('ignore')

# ============================================================================
# CONFIGURATION
# ============================================================================

# HQ Location: 556 S. Coppell Rd, Coppell, TX 75019
HQ_COORDS = [-97.006677, 32.958239]  # [longitude, latitude]
HQ_ADDRESS = "556 S. Coppell Rd, Coppell, TX 75019"

# OpenRouteService API Key
ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjhhMDQ1YzYyYzYwZjQwYTI4Y2Y5NTY4NDIzNDkzNTNhIiwiaCI6Im11cm11cjY0In0="

# Zone definitions (in minutes)
ZONES = {
    'zone1': {'max_time': 11, 'label': '<11 min', 'color': '#90EE90'},      # Light Green
    'zone2': {'max_time': 20, 'label': '11-20 min', 'color': '#ADD8E6'},    # Light Blue
    'zone3': {'max_time': 30, 'label': '21-30 min', 'color': '#FFFFE0'},    # Light Yellow
    'zone4': {'max_time': 45, 'label': '31-45 min', 'color': '#FFDAB9'},    # Light Orange
    'zone5': {'max_time': 999, 'label': '>45 min', 'color': '#D3D3D3'},     # Gray
}

# DFW bounding box (expanded for full metro)
DFW_BOUNDS = {
    'min_lon': -97.8,
    'max_lon': -96.2,
    'min_lat': 32.4,
    'max_lat': 33.5
}

# Census API
CENSUS_API_BASE = "https://api.census.gov/data/2022/acs/acs5"

# ============================================================================
# ZIP CODE TO CITY MAPPING
# ============================================================================

ZIP_TO_CITY = {
    "75001": "Addison", "75002": "Allen", "75006": "Carrollton", "75007": "Carrollton",
    "75010": "Carrollton", "75013": "Allen", "75019": "Coppell", "75022": "Flower Mound",
    "75023": "Plano", "75024": "Plano", "75025": "Plano", "75028": "Flower Mound",
    "75032": "Rockwall", "75033": "Frisco", "75034": "Frisco", "75035": "Frisco",
    "75036": "Frisco", "75038": "Irving", "75039": "Irving", "75040": "Garland",
    "75041": "Garland", "75042": "Garland", "75043": "Garland", "75044": "Garland",
    "75045": "Garland", "75048": "Sachse", "75050": "Grand Prairie", "75051": "Grand Prairie",
    "75052": "Grand Prairie", "75054": "Grand Prairie", "75056": "The Colony",
    "75057": "Lewisville", "75060": "Irving", "75061": "Irving", "75062": "Irving",
    "75063": "Irving", "75065": "Lake Dallas", "75067": "Lewisville",
    "75068": "Little Elm", "75069": "McKinney", "75070": "McKinney", "75071": "McKinney",
    "75072": "McKinney", "75074": "Plano", "75075": "Plano", "75077": "Flower Mound",
    "75078": "Prosper", "75080": "Richardson", "75081": "Richardson", "75082": "Richardson",
    "75083": "Richardson", "75087": "Rockwall", "75088": "Rowlett", "75089": "Rowlett",
    "75093": "Plano", "75098": "Wylie", "75104": "Cedar Hill", "75115": "DeSoto",
    "75116": "Duncanville", "75134": "Lancaster", "75137": "Duncanville",
    "75141": "Hutchins", "75146": "Lancaster", "75149": "Mesquite", "75150": "Mesquite",
    "75159": "Seagoville", "75172": "Wilmer", "75181": "Mesquite", "75182": "Sunnyvale",
    "75201": "Dallas", "75202": "Dallas", "75203": "Dallas", "75204": "Dallas",
    "75205": "Dallas", "75206": "Dallas", "75207": "Dallas", "75208": "Dallas",
    "75209": "Dallas", "75210": "Dallas", "75211": "Dallas", "75212": "Dallas",
    "75214": "Dallas", "75215": "Dallas", "75216": "Dallas", "75217": "Dallas",
    "75218": "Dallas", "75219": "Dallas", "75220": "Dallas", "75223": "Dallas",
    "75224": "Dallas", "75225": "Dallas", "75226": "Dallas", "75227": "Dallas",
    "75228": "Dallas", "75229": "Dallas", "75230": "Dallas", "75231": "Dallas",
    "75232": "Dallas", "75233": "Dallas", "75234": "Farmers Branch", "75235": "Dallas",
    "75236": "Dallas", "75237": "Dallas", "75238": "Dallas", "75240": "Dallas",
    "75241": "Dallas", "75243": "Dallas", "75244": "Dallas", "75246": "Dallas",
    "75247": "Dallas", "75248": "Dallas", "75249": "Dallas", "75251": "Dallas",
    "75252": "Dallas", "75253": "Dallas", "75254": "Dallas", "75261": "DFW Airport",
    "75270": "Dallas", "75287": "Dallas", "75390": "Dallas",
    "76001": "Arlington", "76002": "Arlington", "76005": "Arlington", "76006": "Arlington",
    "76010": "Arlington", "76011": "Arlington", "76012": "Arlington", "76013": "Arlington",
    "76014": "Arlington", "76015": "Arlington", "76016": "Arlington", "76017": "Arlington",
    "76018": "Arlington", "76021": "Bedford", "76022": "Bedford", "76028": "Burleson",
    "76034": "Colleyville", "76039": "Euless", "76040": "Euless", "76051": "Grapevine",
    "76052": "Haslet", "76053": "Hurst", "76054": "Hurst", "76060": "Kennedale",
    "76063": "Mansfield", "76092": "Southlake", "76109": "Fort Worth", "76111": "Fort Worth",
    "76112": "Fort Worth", "76116": "Fort Worth", "76117": "Haltom City", "76118": "Fort Worth",
    "76119": "Fort Worth", "76120": "Fort Worth", "76123": "Fort Worth", "76131": "Fort Worth",
    "76132": "Fort Worth", "76133": "Fort Worth", "76134": "Fort Worth", "76135": "Fort Worth",
    "76137": "Fort Worth", "76140": "Fort Worth", "76148": "Fort Worth",
    "76155": "Fort Worth", "76164": "Fort Worth", "76177": "Fort Worth",
    "76179": "Fort Worth", "76180": "North Richland Hills", "76182": "North Richland Hills",
    "76201": "Denton", "76205": "Denton", "76207": "Denton", "76208": "Denton",
    "76209": "Denton", "76210": "Denton", "76226": "Argyle", "76227": "Aubrey",
    "76244": "Keller", "76247": "Justin", "76248": "Keller", "76262": "Roanoke",
}

# ============================================================================
# FUNCTIONS
# ============================================================================

def get_isochrones():
    """Fetch drive-time isochrones from OpenRouteService API"""
    print("Fetching drive-time isochrones from OpenRouteService...")
    
    url = "https://api.openrouteservice.org/v2/isochrones/driving-car"
    headers = {'Authorization': ORS_API_KEY, 'Content-Type': 'application/json'}
    
    # Request isochrones for 11, 20, 30, and 45 minutes
    times = [11*60, 20*60, 30*60, 45*60]  # Convert to seconds
    
    body = {
        "locations": [HQ_COORDS],
        "range": times,
        "range_type": "time",
        "smoothing": 25
    }
    
    response = requests.post(url, json=body, headers=headers, timeout=60)
    
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None
    
    data = response.json()
    
    # Process into cumulative and exclusive zones
    cumulative = {}
    for feature in data['features']:
        value = feature['properties']['value']
        geom = shape(feature['geometry'])
        
        if value == 11*60:
            cumulative['zone1'] = geom
        elif value == 20*60:
            cumulative['zone2'] = geom
        elif value == 30*60:
            cumulative['zone3'] = geom
        elif value == 45*60:
            cumulative['zone4'] = geom
    
    # Create exclusive zones (donut rings)
    exclusive = {}
    exclusive['zone1'] = cumulative.get('zone1')
    
    if cumulative.get('zone2') and cumulative.get('zone1'):
        exclusive['zone2'] = cumulative['zone2'].difference(cumulative['zone1'])
    
    if cumulative.get('zone3') and cumulative.get('zone2'):
        exclusive['zone3'] = cumulative['zone3'].difference(cumulative['zone2'])
    
    if cumulative.get('zone4') and cumulative.get('zone3'):
        exclusive['zone4'] = cumulative['zone4'].difference(cumulative['zone3'])
    
    print(f"  Retrieved {len(cumulative)} isochrone boundaries")
    return cumulative, exclusive


def get_zcta_boundaries():
    """Download and load ZCTA boundaries for DFW area"""
    cache_dir = "/tmp/zcta_data"
    shapefile_path = f"{cache_dir}/tl_2023_us_zcta520.shp"
    
    if not os.path.exists(shapefile_path):
        print("Downloading ZCTA shapefile from Census Bureau...")
        url = "https://www2.census.gov/geo/tiger/TIGER2023/ZCTA520/tl_2023_us_zcta520.zip"
        
        response = requests.get(url, timeout=600, stream=True)
        if response.status_code != 200:
            print(f"Error downloading: {response.status_code}")
            return None
        
        os.makedirs(cache_dir, exist_ok=True)
        with zipfile.ZipFile(io.BytesIO(response.content)) as z:
            z.extractall(cache_dir)
        print("  Download complete")
    else:
        print("Using cached ZCTA shapefile...")
    
    print("Loading and filtering to DFW area...")
    gdf = gpd.read_file(shapefile_path)
    
    # Filter to DFW bounding box
    dfw_bbox = box(DFW_BOUNDS['min_lon'], DFW_BOUNDS['min_lat'],
                   DFW_BOUNDS['max_lon'], DFW_BOUNDS['max_lat'])
    gdf = gdf[gdf.geometry.intersects(dfw_bbox)]
    
    if gdf.crs != "EPSG:4326":
        gdf = gdf.to_crs("EPSG:4326")
    
    print(f"  Found {len(gdf)} zip codes in DFW area")
    return gdf


def calculate_zone_percentages(zcta_gdf, exclusive_zones, cumulative_zones):
    """Calculate what percentage of each zip code falls in each zone"""
    print("Calculating zone percentages for each zip code...")
    
    zip_col = 'ZCTA5CE20' if 'ZCTA5CE20' in zcta_gdf.columns else 'ZCTA5CE10'
    results = []
    total = len(zcta_gdf)
    
    for idx, row in zcta_gdf.iterrows():
        if idx % 100 == 0:
            print(f"  Processing {idx}/{total}...")
        
        zip_code = str(row[zip_col]).zfill(5)
        zip_geom = row.geometry
        zip_area = zip_geom.area
        
        if zip_area == 0:
            continue
        
        zone_pcts = {f'zone{i}_pct': 0.0 for i in range(1, 6)}
        
        try:
            # Calculate intersection with each exclusive zone
            for zone_name in ['zone1', 'zone2', 'zone3', 'zone4']:
                if zone_name in exclusive_zones and exclusive_zones[zone_name] and exclusive_zones[zone_name].is_valid:
                    intersection = zip_geom.intersection(exclusive_zones[zone_name])
                    if not intersection.is_empty:
                        zone_pcts[f'{zone_name}_pct'] = (intersection.area / zip_area) * 100
            
            # Zone 5 is everything outside zone 4
            total_in_zones = sum(zone_pcts[f'zone{i}_pct'] for i in range(1, 5))
            zone_pcts['zone5_pct'] = max(0, 100 - total_in_zones)
            
        except Exception as e:
            continue
        
        # Only include if >10% in service zones (1-4)
        service_coverage = sum(zone_pcts[f'zone{i}_pct'] for i in range(1, 5))
        if service_coverage > 10:
            centroid = zip_geom.centroid
            city = ZIP_TO_CITY.get(zip_code, 'Unknown')
            
            # Determine primary zone
            primary_zone = 5
            for i in range(1, 6):
                if zone_pcts[f'zone{i}_pct'] > 0:
                    primary_zone = i
                    break
            
            results.append({
                'zip_code': zip_code,
                'city': city,
                'primary_zone': primary_zone,
                'zone1_pct': round(zone_pcts['zone1_pct'], 1),
                'zone2_pct': round(zone_pcts['zone2_pct'], 1),
                'zone3_pct': round(zone_pcts['zone3_pct'], 1),
                'zone4_pct': round(zone_pcts['zone4_pct'], 1),
                'zone5_pct': round(zone_pcts['zone5_pct'], 1),
                'lat': centroid.y,
                'lon': centroid.x
            })
    
    df = pd.DataFrame(results)
    
    # Sort by primary zone, then by zone percentage
    df = df.sort_values(['primary_zone', 'zone1_pct', 'zone2_pct', 'zone3_pct', 'zone4_pct'],
                        ascending=[True, False, False, False, False])
    
    print(f"  Found {len(df)} zip codes with >10% service coverage")
    return df


def get_census_demographics(zip_codes):
    """Fetch housing and income data from Census Bureau"""
    print(f"Fetching Census demographics for {len(zip_codes)} zip codes...")
    
    variables = "NAME,B25024_001E,B25024_002E,B19013_001E"
    batch_size = 50
    all_results = []
    
    for i in range(0, len(zip_codes), batch_size):
        batch = zip_codes[i:i+batch_size]
        zcta_list = ",".join(batch)
        url = f"{CENSUS_API_BASE}?get={variables}&for=zip%20code%20tabulation%20area:{zcta_list}"
        
        try:
            response = requests.get(url, timeout=60)
            if response.status_code == 200:
                data = response.json()
                headers = data[0]
                for row in data[1:]:
                    all_results.append(dict(zip(headers, row)))
            time.sleep(0.3)
        except Exception as e:
            print(f"  Batch error: {e}")
    
    # Process results
    demo_data = {}
    for record in all_results:
        try:
            zcta = record.get('zip code tabulation area', '')
            total_units = int(record.get('B25024_001E', 0) or 0)
            sf_detached = int(record.get('B25024_002E', 0) or 0)
            income_raw = record.get('B19013_001E', None)
            median_income = int(income_raw) if income_raw and int(income_raw) > 0 else None
            
            if total_units > 0:
                sf_pct = round((sf_detached / total_units) * 100, 1)
            else:
                sf_pct = 0
            
            demo_data[zcta] = {
                'total_housing_units': total_units,
                'sf_detached': sf_detached,
                'sf_detached_pct': sf_pct,
                'other_dwellings': total_units - sf_detached,
                'other_pct': round(100 - sf_pct, 1) if total_units > 0 else 0,
                'median_income': median_income
            }
        except:
            continue
    
    print(f"  Retrieved demographics for {len(demo_data)} zip codes")
    return demo_data


def create_map(zcta_gdf, cumulative_zones, df, output_path):
    """Generate the service area map"""
    print("Generating service area map...")
    
    fig, ax = plt.subplots(1, 1, figsize=(20, 16))
    ax.set_facecolor('#f8fafc')
    
    zip_col = 'ZCTA5CE20' if 'ZCTA5CE20' in zcta_gdf.columns else 'ZCTA5CE10'
    zcta_gdf[zip_col] = zcta_gdf[zip_col].astype(str).str.zfill(5)
    
    # Merge with zone data
    merged = zcta_gdf.merge(df, left_on=zip_col, right_on='zip_code', how='left')
    merged['primary_zone'] = merged['primary_zone'].fillna(5).astype(int)
    
    zone_colors = {
        1: ZONES['zone1']['color'],
        2: ZONES['zone2']['color'],
        3: ZONES['zone3']['color'],
        4: ZONES['zone4']['color'],
        5: ZONES['zone5']['color']
    }
    
    # Plot zip codes by zone
    for zone_num in [5, 4, 3, 2, 1]:
        zone_data = merged[merged['primary_zone'] == zone_num]
        if len(zone_data) > 0:
            zone_data.plot(ax=ax, facecolor=zone_colors[zone_num],
                          edgecolor='#374151', linewidth=0.5, alpha=0.7)
    
    # Plot isochrone boundaries
    boundary_colors = {
        'zone1': ZONES['zone1']['color'],
        'zone2': ZONES['zone2']['color'],
        'zone3': ZONES['zone3']['color'],
        'zone4': ZONES['zone4']['color']
    }
    
    for zone_name, geom in cumulative_zones.items():
        if geom and geom.is_valid:
            color = boundary_colors.get(zone_name, '#000000')
            if geom.geom_type == 'Polygon':
                x, y = geom.exterior.xy
                ax.plot(x, y, color=color, linewidth=2.5, alpha=0.9, zorder=5)
            elif geom.geom_type == 'MultiPolygon':
                for poly in geom.geoms:
                    x, y = poly.exterior.xy
                    ax.plot(x, y, color=color, linewidth=2.5, alpha=0.9, zorder=5)
    
    # Add zip code labels for zones 1-2
    for idx, row in merged[merged['primary_zone'] <= 2].iterrows():
        centroid = row.geometry.centroid
        ax.annotate(row[zip_col], xy=(centroid.x, centroid.y),
                   fontsize=6, ha='center', va='center', color='#1f2937', weight='bold',
                   bbox=dict(boxstyle='round,pad=0.1', facecolor='white', alpha=0.7, edgecolor='none'))
    
    # City labels
    cities = {
        'Coppell': (-97.01, 32.96), 'Irving': (-96.94, 32.82), 'Carrollton': (-96.89, 32.97),
        'Grapevine': (-97.08, 32.93), 'Lewisville': (-96.99, 33.05), 'Flower Mound': (-97.10, 33.02),
        'Dallas': (-96.77, 32.78), 'Plano': (-96.70, 33.02), 'Frisco': (-96.82, 33.15),
        'McKinney': (-96.63, 33.20), 'Arlington': (-97.11, 32.70), 'Fort Worth': (-97.35, 32.76),
        'Denton': (-97.13, 33.22), 'Richardson': (-96.70, 32.95), 'Garland': (-96.62, 32.91),
        'Grand Prairie': (-97.00, 32.72), 'Southlake': (-97.15, 32.95), 'Colleyville': (-97.16, 32.88),
        'The Colony': (-96.89, 33.09), 'Allen': (-96.65, 33.11), 'Addison': (-96.83, 32.96),
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
        mpatches.Patch(facecolor=ZONES['zone1']['color'], alpha=0.7, edgecolor='#374151', label=f"Zone 1: {ZONES['zone1']['label']}"),
        mpatches.Patch(facecolor=ZONES['zone2']['color'], alpha=0.7, edgecolor='#374151', label=f"Zone 2: {ZONES['zone2']['label']}"),
        mpatches.Patch(facecolor=ZONES['zone3']['color'], alpha=0.7, edgecolor='#374151', label=f"Zone 3: {ZONES['zone3']['label']}"),
        mpatches.Patch(facecolor=ZONES['zone4']['color'], alpha=0.7, edgecolor='#374151', label=f"Zone 4: {ZONES['zone4']['label']}"),
        mpatches.Patch(facecolor=ZONES['zone5']['color'], alpha=0.7, edgecolor='#374151', label=f"Zone 5: {ZONES['zone5']['label']}"),
        plt.Line2D([0], [0], marker='*', color='w', markerfacecolor='#dc2626', markersize=15, label='DFW HVAC HQ')
    ]
    ax.legend(handles=legend_elements, loc='upper right', fontsize=11, framealpha=0.95, title='Service Zones', title_fontsize=12)
    
    # Stats box
    zone_counts = df['primary_zone'].value_counts().sort_index()
    stats = f"""Service Area Statistics
━━━━━━━━━━━━━━━━━━━━━━━━━
HQ: {HQ_ADDRESS}
━━━━━━━━━━━━━━━━━━━━━━━━━
Zone 1 (<11 min):   {zone_counts.get(1, 0):>3} zip codes
Zone 2 (11-20 min): {zone_counts.get(2, 0):>3} zip codes
Zone 3 (21-30 min): {zone_counts.get(3, 0):>3} zip codes
Zone 4 (31-45 min): {zone_counts.get(4, 0):>3} zip codes
━━━━━━━━━━━━━━━━━━━━━━━━━
Total Service Area: {len(df)} zip codes"""
    
    ax.text(0.02, 0.02, stats, transform=ax.transAxes, fontsize=10, verticalalignment='bottom',
           fontfamily='monospace', bbox=dict(boxstyle='round,pad=0.5', facecolor='white', alpha=0.9, edgecolor='#d1d5db'))
    
    ax.set_xlabel('Longitude', fontsize=12)
    ax.set_ylabel('Latitude', fontsize=12)
    ax.set_title('DFW HVAC Service Area\n5-Zone Drive-Time Model', fontsize=18, fontweight='bold', pad=20)
    ax.grid(True, alpha=0.3, linestyle='--')
    ax.set_xlim(DFW_BOUNDS['min_lon'], DFW_BOUNDS['max_lon'])
    ax.set_ylim(DFW_BOUNDS['min_lat'], DFW_BOUNDS['max_lat'])
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"  Map saved to {output_path}")


def main():
    print("=" * 70)
    print("DFW HVAC SERVICE AREA ANALYSIS - 5-ZONE MODEL")
    print("=" * 70)
    print(f"\nHQ Address: {HQ_ADDRESS}")
    print(f"Coordinates: {HQ_COORDS[1]}, {HQ_COORDS[0]}")
    print("\nZone Definitions:")
    for zone_id, zone_info in ZONES.items():
        print(f"  {zone_id.upper()}: {zone_info['label']}")
    print()
    
    # Step 1: Get isochrones
    cumulative_zones, exclusive_zones = get_isochrones()
    if not cumulative_zones:
        print("ERROR: Failed to get isochrones")
        return
    
    # Step 2: Get ZCTA boundaries
    zcta_gdf = get_zcta_boundaries()
    if zcta_gdf is None:
        print("ERROR: Failed to get ZCTA boundaries")
        return
    
    # Step 3: Calculate zone percentages
    zone_df = calculate_zone_percentages(zcta_gdf, exclusive_zones, cumulative_zones)
    
    # Step 4: Get demographics
    zip_codes = zone_df['zip_code'].tolist()
    demographics = get_census_demographics(zip_codes)
    
    # Step 5: Merge demographics
    print("Merging zone data with demographics...")
    zone_df['total_housing_units'] = zone_df['zip_code'].map(lambda z: demographics.get(z, {}).get('total_housing_units', 0))
    zone_df['sf_detached'] = zone_df['zip_code'].map(lambda z: demographics.get(z, {}).get('sf_detached', 0))
    zone_df['sf_detached_pct'] = zone_df['zip_code'].map(lambda z: demographics.get(z, {}).get('sf_detached_pct', 0))
    zone_df['other_dwellings'] = zone_df['zip_code'].map(lambda z: demographics.get(z, {}).get('other_dwellings', 0))
    zone_df['other_pct'] = zone_df['zip_code'].map(lambda z: demographics.get(z, {}).get('other_pct', 0))
    zone_df['median_income'] = zone_df['zip_code'].map(lambda z: demographics.get(z, {}).get('median_income'))
    
    # Step 6: Save CSV
    output_df = zone_df[[
        'zip_code', 'city', 'primary_zone',
        'zone1_pct', 'zone2_pct', 'zone3_pct', 'zone4_pct', 'zone5_pct',
        'total_housing_units', 'sf_detached', 'sf_detached_pct',
        'other_dwellings', 'other_pct', 'median_income'
    ]].copy()
    
    output_df.columns = [
        'Zip Code', 'City', 'Primary Zone',
        'Zone 1 (%)', 'Zone 2 (%)', 'Zone 3 (%)', 'Zone 4 (%)', 'Zone 5 (%)',
        'Total Housing Units', 'Single-Family Detached', '% SF Detached',
        'Other Dwellings', '% Other', 'Median Household Income'
    ]
    
    csv_path = '/app/frontend/public/DFW_HVAC_Service_Area_Zones.csv'
    output_df.to_csv(csv_path, index=False)
    print(f"\nCSV saved to {csv_path}")
    
    # Step 7: Generate map
    map_path = '/app/frontend/public/dfw_service_area_map.png'
    create_map(zcta_gdf, cumulative_zones, zone_df, map_path)
    
    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    
    zone_counts = zone_df['primary_zone'].value_counts().sort_index()
    print(f"\nTotal Zip Codes in Service Area: {len(zone_df)}")
    print("\nBy Zone:")
    for zone in range(1, 6):
        count = zone_counts.get(zone, 0)
        print(f"  Zone {zone}: {count} zip codes")
    
    total_units = zone_df['total_housing_units'].sum()
    total_sf = zone_df['sf_detached'].sum()
    avg_income = zone_df['median_income'].dropna().mean()
    
    print(f"\nTotal Housing Units: {total_units:,}")
    print(f"Single-Family Detached: {total_sf:,} ({total_sf/total_units*100:.1f}%)" if total_units > 0 else "")
    print(f"Average Median Income: ${avg_income:,.0f}" if avg_income else "")
    
    print("\n" + "-" * 70)
    print("ZONE 1 ZIP CODES (<11 min)")
    print("-" * 70)
    zone1 = zone_df[zone_df['primary_zone'] == 1][['zip_code', 'city', 'zone1_pct', 'sf_detached_pct', 'median_income']]
    if len(zone1) > 0:
        zone1_display = zone1.copy()
        zone1_display['median_income'] = zone1_display['median_income'].apply(lambda x: f"${x:,.0f}" if pd.notna(x) else "N/A")
        print(zone1_display.to_string(index=False))
    else:
        print("  No zip codes in Zone 1")
    
    print("\n" + "=" * 70)
    print("COMPLETE")
    print("=" * 70)
    print(f"\nOutputs:")
    print(f"  CSV: {csv_path}")
    print(f"  Map: {map_path}")


if __name__ == "__main__":
    main()
