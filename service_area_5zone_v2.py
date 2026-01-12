#!/usr/bin/env python3
"""
DFW HVAC Service Area - 5-Zone Geospatial Analysis
Calculates actual % of each zip code area in each drive-time zone
"""

import requests
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from shapely.geometry import shape, box
import numpy as np
import time
import warnings
warnings.filterwarnings('ignore')

# ============================================================================
# CONFIGURATION
# ============================================================================

HQ_COORDS = [-97.006677, 32.958239]  # 556 S. Coppell Rd, Coppell TX
HQ_ADDRESS = "556 S. Coppell Rd, Coppell, TX 75019"

ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjhhMDQ1YzYyYzYwZjQwYTI4Y2Y5NTY4NDIzNDkzNTNhIiwiaCI6Im11cm11cjY0In0="

# Zone definitions
ZONES = {
    1: {'max_min': 11, 'label': '<11 min', 'color': '#90EE90'},       # Light Green
    2: {'max_min': 20, 'label': '11-20 min', 'color': '#ADD8E6'},     # Light Blue
    3: {'max_min': 30, 'label': '21-30 min', 'color': '#FFFFE0'},     # Light Yellow
    4: {'max_min': 45, 'label': '31-45 min', 'color': '#FFDAB9'},     # Light Orange
    5: {'max_min': 999, 'label': '>45 min', 'color': '#D3D3D3'},      # Gray
}

DFW_BOUNDS = {'min_lon': -97.6, 'max_lon': -96.3, 'min_lat': 32.4, 'max_lat': 33.5}

CENSUS_API = "https://api.census.gov/data/2022/acs/acs5"

# City mapping
ZIP_TO_CITY = {
    "75001": "Addison", "75002": "Allen", "75006": "Carrollton", "75007": "Carrollton",
    "75010": "Carrollton", "75013": "Allen", "75019": "Coppell", "75022": "Flower Mound",
    "75023": "Plano", "75024": "Plano", "75025": "Plano", "75028": "Flower Mound",
    "75032": "Rockwall", "75033": "Frisco", "75034": "Frisco", "75035": "Frisco",
    "75036": "Frisco", "75038": "Irving", "75039": "Irving", "75040": "Garland",
    "75041": "Garland", "75042": "Garland", "75043": "Garland", "75044": "Garland",
    "75048": "Sachse", "75050": "Grand Prairie", "75051": "Grand Prairie",
    "75052": "Grand Prairie", "75054": "Grand Prairie", "75056": "The Colony",
    "75057": "Lewisville", "75060": "Irving", "75061": "Irving", "75062": "Irving",
    "75063": "Irving", "75065": "Lake Dallas", "75067": "Lewisville",
    "75068": "Little Elm", "75069": "McKinney", "75070": "McKinney", "75071": "McKinney",
    "75072": "McKinney", "75074": "Plano", "75075": "Plano", "75077": "Flower Mound",
    "75078": "Prosper", "75080": "Richardson", "75081": "Richardson", "75082": "Richardson",
    "75087": "Rockwall", "75088": "Rowlett", "75089": "Rowlett", "75093": "Plano",
    "75098": "Wylie", "75104": "Cedar Hill", "75115": "DeSoto", "75116": "Duncanville",
    "75149": "Mesquite", "75150": "Mesquite", "75181": "Mesquite", "75182": "Sunnyvale",
    "75201": "Dallas", "75202": "Dallas", "75204": "Dallas", "75205": "Dallas",
    "75206": "Dallas", "75207": "Dallas", "75208": "Dallas", "75209": "Dallas",
    "75211": "Dallas", "75212": "Dallas", "75214": "Dallas", "75218": "Dallas",
    "75219": "Dallas", "75220": "Dallas", "75225": "Dallas", "75226": "Dallas",
    "75228": "Dallas", "75229": "Dallas", "75230": "Dallas", "75231": "Dallas",
    "75234": "Farmers Branch", "75235": "Dallas", "75236": "Dallas", "75238": "Dallas",
    "75240": "Dallas", "75243": "Dallas", "75244": "Dallas", "75246": "Dallas",
    "75247": "Dallas", "75248": "Dallas", "75251": "Dallas", "75252": "Dallas",
    "75254": "Dallas", "75287": "Dallas",
    "76001": "Arlington", "76002": "Arlington", "76006": "Arlington", "76010": "Arlington",
    "76011": "Arlington", "76012": "Arlington", "76013": "Arlington", "76014": "Arlington",
    "76015": "Arlington", "76016": "Arlington", "76017": "Arlington", "76018": "Arlington",
    "76021": "Bedford", "76022": "Bedford", "76034": "Colleyville", "76039": "Euless",
    "76040": "Euless", "76051": "Grapevine", "76052": "Haslet", "76053": "Hurst",
    "76054": "Hurst", "76063": "Mansfield", "76092": "Southlake", "76117": "Haltom City",
    "76118": "Fort Worth", "76120": "Fort Worth", "76137": "Fort Worth",
    "76148": "North Richland Hills", "76155": "Fort Worth", "76177": "Fort Worth",
    "76180": "North Richland Hills", "76182": "North Richland Hills",
    "76201": "Denton", "76205": "Denton", "76207": "Denton", "76208": "Denton",
    "76209": "Denton", "76210": "Denton", "76226": "Argyle", "76227": "Aubrey",
    "76244": "Keller", "76247": "Justin", "76248": "Keller", "76262": "Roanoke",
}

# ============================================================================
# FUNCTIONS
# ============================================================================

def get_isochrones():
    """Get drive-time polygons from OpenRouteService"""
    print("Fetching isochrones from OpenRouteService...")
    
    url = "https://api.openrouteservice.org/v2/isochrones/driving-car"
    headers = {'Authorization': ORS_API_KEY, 'Content-Type': 'application/json'}
    
    # Times in seconds: 11, 20, 30, 45 minutes
    times = [11*60, 20*60, 30*60, 45*60]
    
    body = {
        "locations": [HQ_COORDS],
        "range": times,
        "range_type": "time",
        "smoothing": 25
    }
    
    response = requests.post(url, json=body, headers=headers, timeout=60)
    if response.status_code != 200:
        print(f"  Error: {response.status_code}")
        return None, None
    
    data = response.json()
    
    # Cumulative zones (each includes all closer zones)
    cumulative = {}
    for feature in data['features']:
        value = feature['properties']['value']
        geom = shape(feature['geometry'])
        if value == 11*60: cumulative[1] = geom
        elif value == 20*60: cumulative[2] = geom
        elif value == 30*60: cumulative[3] = geom
        elif value == 45*60: cumulative[4] = geom
    
    # Exclusive zones (donut rings)
    exclusive = {1: cumulative.get(1)}
    if cumulative.get(2) and cumulative.get(1):
        exclusive[2] = cumulative[2].difference(cumulative[1])
    if cumulative.get(3) and cumulative.get(2):
        exclusive[3] = cumulative[3].difference(cumulative[2])
    if cumulative.get(4) and cumulative.get(3):
        exclusive[4] = cumulative[4].difference(cumulative[3])
    
    print(f"  Retrieved {len(cumulative)} zone boundaries")
    return cumulative, exclusive


def load_zcta():
    """Load ZCTA boundaries for DFW"""
    print("Loading ZCTA boundaries...")
    
    gdf = gpd.read_file("/tmp/zcta_data/tl_2023_us_zcta520.shp")
    
    # Filter to DFW
    dfw_box = box(DFW_BOUNDS['min_lon'], DFW_BOUNDS['min_lat'],
                  DFW_BOUNDS['max_lon'], DFW_BOUNDS['max_lat'])
    gdf = gdf[gdf.geometry.intersects(dfw_box)]
    
    if gdf.crs != "EPSG:4326":
        gdf = gdf.to_crs("EPSG:4326")
    
    print(f"  Found {len(gdf)} zip codes in DFW area")
    return gdf


def calculate_zone_percentages(zcta_gdf, exclusive_zones, cumulative_zones):
    """Calculate actual % of each zip's area in each zone"""
    print("Calculating zone percentages (geospatial intersection)...")
    
    zip_col = 'ZCTA5CE20' if 'ZCTA5CE20' in zcta_gdf.columns else 'ZCTA5CE10'
    results = []
    total = len(zcta_gdf)
    
    for idx, (_, row) in enumerate(zcta_gdf.iterrows()):
        if idx % 50 == 0:
            print(f"  Processing {idx}/{total}...")
        
        zip_code = str(row[zip_col]).zfill(5)
        zip_geom = row.geometry
        zip_area = zip_geom.area
        
        if zip_area == 0:
            continue
        
        pcts = {i: 0.0 for i in range(1, 6)}
        
        try:
            for zone_num in [1, 2, 3, 4]:
                if zone_num in exclusive_zones and exclusive_zones[zone_num]:
                    zone_geom = exclusive_zones[zone_num]
                    if zone_geom.is_valid:
                        intersection = zip_geom.intersection(zone_geom)
                        if not intersection.is_empty:
                            pcts[zone_num] = (intersection.area / zip_area) * 100
            
            # Zone 5 = remainder
            pcts[5] = max(0, 100 - sum(pcts[i] for i in range(1, 5)))
        except:
            continue
        
        # Only include if >10% in zones 1-4
        service_pct = sum(pcts[i] for i in range(1, 5))
        if service_pct > 10:
            # Primary zone = first zone with coverage
            primary = 5
            for i in range(1, 6):
                if pcts[i] > 0:
                    primary = i
                    break
            
            results.append({
                'zip_code': zip_code,
                'city': ZIP_TO_CITY.get(zip_code, 'Unknown'),
                'primary_zone': primary,
                'zone1_pct': round(pcts[1], 1),
                'zone2_pct': round(pcts[2], 1),
                'zone3_pct': round(pcts[3], 1),
                'zone4_pct': round(pcts[4], 1),
                'zone5_pct': round(pcts[5], 1),
            })
    
    df = pd.DataFrame(results)
    df = df.sort_values(['primary_zone', 'zone1_pct', 'zone2_pct'], ascending=[True, False, False])
    print(f"  Found {len(df)} zip codes with >10% service coverage")
    return df


def get_demographics(zip_codes):
    """Fetch housing and income data from Census"""
    print(f"Fetching demographics for {len(zip_codes)} zip codes...")
    
    variables = "B25024_001E,B25024_002E,B19013_001E"
    batch_size = 50
    results = {}
    
    for i in range(0, len(zip_codes), batch_size):
        batch = zip_codes[i:i+batch_size]
        url = f"{CENSUS_API}?get={variables}&for=zip%20code%20tabulation%20area:{','.join(batch)}"
        
        try:
            resp = requests.get(url, timeout=30)
            if resp.status_code == 200:
                data = resp.json()
                for row in data[1:]:
                    zcta = row[3]
                    total = int(row[0] or 0)
                    sf = int(row[1] or 0)
                    income = int(row[2]) if row[2] and int(row[2]) > 0 else None
                    results[zcta] = {
                        'total_units': total,
                        'sf_detached': sf,
                        'sf_pct': round(sf/total*100, 1) if total > 0 else 0,
                        'other': total - sf,
                        'other_pct': round((total-sf)/total*100, 1) if total > 0 else 0,
                        'income': income
                    }
        except Exception as e:
            print(f"  Batch error: {e}")
        time.sleep(0.3)
    
    print(f"  Retrieved demographics for {len(results)} zip codes")
    return results


def create_map(zcta_gdf, cumulative_zones, df, output_path):
    """Generate the service area map"""
    print("Generating map...")
    
    fig, ax = plt.subplots(1, 1, figsize=(20, 16))
    ax.set_facecolor('#f8fafc')
    
    zip_col = 'ZCTA5CE20' if 'ZCTA5CE20' in zcta_gdf.columns else 'ZCTA5CE10'
    zcta_gdf = zcta_gdf.copy()
    zcta_gdf[zip_col] = zcta_gdf[zip_col].astype(str).str.zfill(5)
    
    merged = zcta_gdf.merge(df, left_on=zip_col, right_on='zip_code', how='left')
    merged['primary_zone'] = merged['primary_zone'].fillna(5).astype(int)
    
    colors = {i: ZONES[i]['color'] for i in range(1, 6)}
    
    for zone in [5, 4, 3, 2, 1]:
        zone_data = merged[merged['primary_zone'] == zone]
        if len(zone_data) > 0:
            zone_data.plot(ax=ax, facecolor=colors[zone], edgecolor='#374151', linewidth=0.5, alpha=0.7)
    
    # Zone boundaries
    for zone_num, geom in cumulative_zones.items():
        if geom and geom.is_valid:
            color = colors.get(zone_num, '#000')
            if geom.geom_type == 'Polygon':
                x, y = geom.exterior.xy
                ax.plot(x, y, color=color, linewidth=2.5, alpha=0.9, zorder=5)
            elif geom.geom_type == 'MultiPolygon':
                for poly in geom.geoms:
                    x, y = poly.exterior.xy
                    ax.plot(x, y, color=color, linewidth=2.5, alpha=0.9, zorder=5)
    
    # Zip labels for zones 1-2
    for _, row in merged[merged['primary_zone'] <= 2].iterrows():
        c = row.geometry.centroid
        ax.annotate(row[zip_col], xy=(c.x, c.y), fontsize=6, ha='center', va='center',
                   color='#1f2937', weight='bold',
                   bbox=dict(boxstyle='round,pad=0.1', facecolor='white', alpha=0.7, edgecolor='none'))
    
    # City labels
    cities = {
        'Coppell': (-97.01, 32.96), 'Irving': (-96.94, 32.82), 'Carrollton': (-96.89, 32.97),
        'Grapevine': (-97.08, 32.93), 'Lewisville': (-96.99, 33.05), 'Flower Mound': (-97.10, 33.02),
        'Dallas': (-96.77, 32.78), 'Plano': (-96.70, 33.02), 'Frisco': (-96.82, 33.15),
        'Arlington': (-97.11, 32.70), 'Fort Worth': (-97.35, 32.76), 'Denton': (-97.13, 33.22),
    }
    for city, (lon, lat) in cities.items():
        ax.annotate(city, xy=(lon, lat), fontsize=9, ha='center', color='#1e293b', weight='bold', style='italic',
                   bbox=dict(boxstyle='round,pad=0.2', facecolor='white', alpha=0.85, edgecolor='#94a3b8'))
    
    # HQ
    ax.scatter(HQ_COORDS[0], HQ_COORDS[1], c='#dc2626', s=400, marker='*', edgecolors='white', linewidth=2, zorder=10)
    ax.annotate('DFW HVAC HQ', xy=(HQ_COORDS[0], HQ_COORDS[1]), xytext=(HQ_COORDS[0]+0.04, HQ_COORDS[1]+0.02),
               fontsize=10, color='#dc2626', weight='bold',
               bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.95, edgecolor='#dc2626'))
    
    # Legend
    legend = [mpatches.Patch(facecolor=ZONES[i]['color'], alpha=0.7, edgecolor='#374151', label=f"Zone {i}: {ZONES[i]['label']}") for i in range(1, 6)]
    legend.append(plt.Line2D([0], [0], marker='*', color='w', markerfacecolor='#dc2626', markersize=15, label='HQ'))
    ax.legend(handles=legend, loc='upper right', fontsize=11, framealpha=0.95, title='Service Zones')
    
    # Stats
    counts = df['primary_zone'].value_counts().sort_index()
    stats = f"HQ: {HQ_ADDRESS}\n" + "━"*30 + "\n"
    for z in range(1, 5):
        stats += f"Zone {z} ({ZONES[z]['label']}): {counts.get(z, 0)} zips\n"
    stats += "━"*30 + f"\nTotal: {len(df)} zip codes"
    ax.text(0.02, 0.02, stats, transform=ax.transAxes, fontsize=10, verticalalignment='bottom',
           fontfamily='monospace', bbox=dict(boxstyle='round,pad=0.5', facecolor='white', alpha=0.9))
    
    ax.set_title('DFW HVAC Service Area - 5-Zone Model', fontsize=18, fontweight='bold', pad=20)
    ax.set_xlim(DFW_BOUNDS['min_lon'], DFW_BOUNDS['max_lon'])
    ax.set_ylim(DFW_BOUNDS['min_lat'], DFW_BOUNDS['max_lat'])
    ax.grid(True, alpha=0.3, linestyle='--')
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"  Map saved")


def main():
    print("="*70)
    print("DFW HVAC SERVICE AREA - 5-ZONE GEOSPATIAL ANALYSIS")
    print("="*70)
    print(f"\nHQ: {HQ_ADDRESS}")
    print(f"Zones: <11min, 11-20min, 21-30min, 31-45min, >45min\n")
    
    # Step 1: Isochrones
    cumulative, exclusive = get_isochrones()
    if not cumulative:
        return
    
    # Step 2: ZCTA
    zcta = load_zcta()
    
    # Step 3: Zone percentages
    df = calculate_zone_percentages(zcta, exclusive, cumulative)
    
    # Step 4: Demographics
    demo = get_demographics(df['zip_code'].tolist())
    
    # Merge demographics
    df['total_housing_units'] = df['zip_code'].map(lambda z: demo.get(z, {}).get('total_units', 0))
    df['sf_detached'] = df['zip_code'].map(lambda z: demo.get(z, {}).get('sf_detached', 0))
    df['sf_pct'] = df['zip_code'].map(lambda z: demo.get(z, {}).get('sf_pct', 0))
    df['other_dwellings'] = df['zip_code'].map(lambda z: demo.get(z, {}).get('other', 0))
    df['other_pct'] = df['zip_code'].map(lambda z: demo.get(z, {}).get('other_pct', 0))
    df['median_income'] = df['zip_code'].map(lambda z: demo.get(z, {}).get('income'))
    
    # Save CSV
    out_df = df.rename(columns={
        'zip_code': 'Zip Code', 'city': 'City', 'primary_zone': 'Primary Zone',
        'zone1_pct': 'Zone 1 (%)', 'zone2_pct': 'Zone 2 (%)', 'zone3_pct': 'Zone 3 (%)',
        'zone4_pct': 'Zone 4 (%)', 'zone5_pct': 'Zone 5 (%)',
        'total_housing_units': 'Total Housing Units', 'sf_detached': 'SF Detached',
        'sf_pct': '% SF Detached', 'other_dwellings': 'Other Dwellings',
        'other_pct': '% Other', 'median_income': 'Median Income'
    })
    
    csv_path = '/app/frontend/public/DFW_HVAC_Service_Area_Zones.csv'
    out_df.to_csv(csv_path, index=False)
    print(f"\nCSV saved to {csv_path}")
    
    # Map
    create_map(zcta, cumulative, df, '/app/frontend/public/dfw_service_area_map.png')
    
    # Summary
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    counts = df['primary_zone'].value_counts().sort_index()
    for z in range(1, 5):
        print(f"Zone {z}: {counts.get(z, 0)} zip codes")
    print(f"Total: {len(df)} zip codes")
    
    # Show sample of split zip codes
    print("\n" + "-"*70)
    print("SAMPLE: ZIP CODES SPANNING MULTIPLE ZONES")
    print("-"*70)
    split = df[(df['zone1_pct'] > 0) & (df['zone1_pct'] < 100) & (df['zone2_pct'] > 0)]
    if len(split) > 0:
        print(split[['zip_code', 'city', 'zone1_pct', 'zone2_pct', 'zone3_pct']].head(10).to_string(index=False))
    
    print("\n" + "="*70)
    print("COMPLETE")
    print("="*70)

if __name__ == "__main__":
    main()
