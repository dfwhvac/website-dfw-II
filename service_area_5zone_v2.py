#!/usr/bin/env python3
"""
DFW HVAC Service Area Analysis - 5-Zone Model (Memory Optimized)
"""

import requests
import pandas as pd
import numpy as np
import os
import time
import warnings
warnings.filterwarnings('ignore')

# Configuration
HQ_COORDS = [-97.006677, 32.958239]
HQ_ADDRESS = "556 S. Coppell Rd, Coppell, TX 75019"
ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjhhMDQ1YzYyYzYwZjQwYTI4Y2Y5NTY4NDIzNDkzNTNhIiwiaCI6Im11cm11cjY0In0="

ZONES = {
    'zone1': {'max_time': 11, 'label': '<11 min', 'color': '#90EE90'},
    'zone2': {'max_time': 20, 'label': '11-20 min', 'color': '#ADD8E6'},
    'zone3': {'max_time': 30, 'label': '21-30 min', 'color': '#FFFFE0'},
    'zone4': {'max_time': 45, 'label': '31-45 min', 'color': '#FFDAB9'},
    'zone5': {'max_time': 999, 'label': '>45 min', 'color': '#D3D3D3'},
}

CENSUS_API_BASE = "https://api.census.gov/data/2022/acs/acs5"

# Comprehensive DFW zip codes with cities
DFW_ZIPS = {
    "75001": ("Addison", 32.960, -96.832), "75002": ("Allen", 33.103, -96.671),
    "75006": ("Carrollton", 32.954, -96.900), "75007": ("Carrollton", 32.976, -96.890),
    "75010": ("Carrollton", 33.002, -96.854), "75013": ("Allen", 33.120, -96.626),
    "75019": ("Coppell", 32.955, -97.010), "75022": ("Flower Mound", 33.015, -97.070),
    "75023": ("Plano", 33.054, -96.687), "75024": ("Plano", 33.073, -96.718),
    "75025": ("Plano", 33.085, -96.730), "75028": ("Flower Mound", 33.036, -97.114),
    "75032": ("Rockwall", 32.884, -96.460), "75033": ("Frisco", 33.151, -96.824),
    "75034": ("Frisco", 33.112, -96.777), "75035": ("Frisco", 33.141, -96.703),
    "75036": ("Frisco", 33.161, -96.751), "75038": ("Irving", 32.857, -96.969),
    "75039": ("Irving", 32.885, -96.942), "75040": ("Garland", 32.922, -96.616),
    "75041": ("Garland", 32.877, -96.632), "75042": ("Garland", 32.908, -96.650),
    "75043": ("Garland", 32.859, -96.604), "75044": ("Garland", 32.959, -96.628),
    "75048": ("Sachse", 32.978, -96.578), "75050": ("Grand Prairie", 32.738, -96.995),
    "75051": ("Grand Prairie", 32.693, -97.012), "75052": ("Grand Prairie", 32.689, -97.012),
    "75054": ("Grand Prairie", 32.657, -97.002), "75056": ("The Colony", 33.091, -96.892),
    "75057": ("Lewisville", 33.046, -96.994), "75060": ("Irving", 32.798, -96.967),
    "75061": ("Irving", 32.814, -96.950), "75062": ("Irving", 32.844, -96.943),
    "75063": ("Irving", 32.918, -96.965), "75065": ("Lake Dallas", 33.119, -96.959),
    "75067": ("Lewisville", 33.002, -96.954), "75068": ("Little Elm", 33.156, -96.938),
    "75069": ("McKinney", 33.214, -96.632), "75070": ("McKinney", 33.187, -96.648),
    "75071": ("McKinney", 33.174, -96.609), "75072": ("McKinney", 33.227, -96.658),
    "75074": ("Plano", 33.025, -96.656), "75075": ("Plano", 33.013, -96.735),
    "75077": ("Flower Mound", 33.056, -97.004), "75078": ("Prosper", 33.237, -96.787),
    "75080": ("Richardson", 32.963, -96.705), "75081": ("Richardson", 32.948, -96.673),
    "75082": ("Richardson", 32.982, -96.654), "75087": ("Rockwall", 32.929, -96.462),
    "75088": ("Rowlett", 32.917, -96.559), "75089": ("Rowlett", 32.900, -96.552),
    "75093": ("Plano", 33.032, -96.760), "75098": ("Wylie", 33.029, -96.521),
    "75104": ("Cedar Hill", 32.588, -96.948), "75115": ("DeSoto", 32.595, -96.861),
    "75116": ("Duncanville", 32.652, -96.913), "75134": ("Lancaster", 32.571, -96.804),
    "75137": ("Duncanville", 32.621, -96.895), "75141": ("Hutchins", 32.642, -96.713),
    "75146": ("Lancaster", 32.617, -96.756), "75149": ("Mesquite", 32.774, -96.612),
    "75150": ("Mesquite", 32.775, -96.637), "75159": ("Seagoville", 32.649, -96.558),
    "75172": ("Wilmer", 32.588, -96.685), "75181": ("Mesquite", 32.727, -96.556),
    "75182": ("Sunnyvale", 32.767, -96.549), "75201": ("Dallas", 32.788, -96.802),
    "75202": ("Dallas", 32.783, -96.792), "75203": ("Dallas", 32.745, -96.813),
    "75204": ("Dallas", 32.798, -96.786), "75205": ("Dallas", 32.833, -96.798),
    "75206": ("Dallas", 32.820, -96.771), "75207": ("Dallas", 32.788, -96.827),
    "75208": ("Dallas", 32.759, -96.851), "75209": ("Dallas", 32.843, -96.821),
    "75210": ("Dallas", 32.770, -96.753), "75211": ("Dallas", 32.742, -96.891),
    "75212": ("Dallas", 32.785, -96.877), "75214": ("Dallas", 32.820, -96.753),
    "75215": ("Dallas", 32.752, -96.767), "75216": ("Dallas", 32.706, -96.783),
    "75217": ("Dallas", 32.716, -96.698), "75218": ("Dallas", 32.832, -96.712),
    "75219": ("Dallas", 32.810, -96.810), "75220": ("Dallas", 32.867, -96.872),
    "75223": ("Dallas", 32.787, -96.753), "75224": ("Dallas", 32.716, -96.838),
    "75225": ("Dallas", 32.858, -96.792), "75226": ("Dallas", 32.785, -96.769),
    "75227": ("Dallas", 32.752, -96.699), "75228": ("Dallas", 32.815, -96.688),
    "75229": ("Dallas", 32.888, -96.869), "75230": ("Dallas", 32.900, -96.793),
    "75231": ("Dallas", 32.882, -96.759), "75232": ("Dallas", 32.671, -96.839),
    "75233": ("Dallas", 32.708, -96.867), "75234": ("Farmers Branch", 32.927, -96.896),
    "75235": ("Dallas", 32.833, -96.845), "75236": ("Dallas", 32.695, -96.929),
    "75237": ("Dallas", 32.666, -96.878), "75238": ("Dallas", 32.877, -96.701),
    "75240": ("Dallas", 32.932, -96.787), "75241": ("Dallas", 32.667, -96.755),
    "75243": ("Dallas", 32.900, -96.726), "75244": ("Dallas", 32.930, -96.834),
    "75246": ("Dallas", 32.795, -96.775), "75247": ("Dallas", 32.812, -96.865),
    "75248": ("Dallas", 32.965, -96.801), "75249": ("Dallas", 32.652, -96.897),
    "75251": ("Dallas", 32.912, -96.771), "75252": ("Dallas", 32.990, -96.770),
    "75253": ("Dallas", 32.692, -96.627), "75254": ("Dallas", 32.944, -96.775),
    "75261": ("DFW Airport", 32.903, -97.040), "75270": ("Dallas", 32.787, -96.800),
    "75287": ("Dallas", 32.989, -96.820), "75390": ("Dallas", 32.813, -96.840),
    "76001": ("Arlington", 32.627, -97.123), "76002": ("Arlington", 32.615, -97.056),
    "76005": ("Arlington", 32.704, -97.126), "76006": ("Arlington", 32.776, -97.078),
    "76010": ("Arlington", 32.717, -97.089), "76011": ("Arlington", 32.757, -97.089),
    "76012": ("Arlington", 32.735, -97.111), "76013": ("Arlington", 32.725, -97.132),
    "76014": ("Arlington", 32.700, -97.075), "76015": ("Arlington", 32.697, -97.109),
    "76016": ("Arlington", 32.708, -97.146), "76017": ("Arlington", 32.684, -97.127),
    "76018": ("Arlington", 32.662, -97.095), "76021": ("Bedford", 32.842, -97.136),
    "76022": ("Bedford", 32.854, -97.124), "76028": ("Burleson", 32.542, -97.321),
    "76034": ("Colleyville", 32.880, -97.155), "76039": ("Euless", 32.857, -97.082),
    "76040": ("Euless", 32.843, -97.082), "76051": ("Grapevine", 32.934, -97.078),
    "76052": ("Haslet", 32.969, -97.349), "76053": ("Hurst", 32.833, -97.169),
    "76054": ("Hurst", 32.857, -97.190), "76060": ("Kennedale", 32.647, -97.212),
    "76063": ("Mansfield", 32.563, -97.112), "76092": ("Southlake", 32.955, -97.150),
    "76117": ("Haltom City", 32.804, -97.262), "76118": ("Fort Worth", 32.800, -97.203),
    "76119": ("Fort Worth", 32.699, -97.257), "76120": ("Fort Worth", 32.777, -97.178),
    "76131": ("Fort Worth", 32.882, -97.358), "76132": ("Fort Worth", 32.680, -97.402),
    "76133": ("Fort Worth", 32.652, -97.367), "76134": ("Fort Worth", 32.643, -97.306),
    "76137": ("Fort Worth", 32.856, -97.299), "76140": ("Fort Worth", 32.601, -97.256),
    "76148": ("Fort Worth", 32.865, -97.266), "76155": ("Fort Worth", 32.830, -97.046),
    "76164": ("Fort Worth", 32.782, -97.360), "76177": ("Fort Worth", 32.931, -97.324),
    "76179": ("Fort Worth", 32.891, -97.417), "76180": ("North Richland Hills", 32.860, -97.218),
    "76182": ("North Richland Hills", 32.887, -97.199), "76201": ("Denton", 33.214, -97.137),
    "76205": ("Denton", 33.188, -97.128), "76207": ("Denton", 33.232, -97.175),
    "76208": ("Denton", 33.218, -97.071), "76209": ("Denton", 33.219, -97.116),
    "76210": ("Denton", 33.175, -97.073), "76226": ("Argyle", 33.112, -97.184),
    "76227": ("Aubrey", 33.297, -96.954), "76244": ("Keller", 32.942, -97.286),
    "76247": ("Justin", 33.083, -97.298), "76248": ("Keller", 32.935, -97.252),
    "76262": ("Roanoke", 33.004, -97.226),
}

def get_drive_times_matrix():
    """Get actual drive times from HQ to all zip code centroids using ORS Matrix API"""
    print("Calculating drive times to all zip codes...")
    
    # Prepare locations
    locations = [HQ_COORDS]  # First is HQ
    zip_list = list(DFW_ZIPS.keys())
    
    for zip_code in zip_list:
        city, lat, lon = DFW_ZIPS[zip_code]
        locations.append([lon, lat])
    
    # ORS Matrix API - batch requests
    url = "https://api.openrouteservice.org/v2/matrix/driving-car"
    headers = {'Authorization': ORS_API_KEY, 'Content-Type': 'application/json'}
    
    all_durations = {}
    batch_size = 50
    
    for i in range(0, len(zip_list), batch_size):
        batch_zips = zip_list[i:i+batch_size]
        batch_locations = [HQ_COORDS]
        
        for zip_code in batch_zips:
            city, lat, lon = DFW_ZIPS[zip_code]
            batch_locations.append([lon, lat])
        
        body = {
            "locations": batch_locations,
            "sources": [0],
            "destinations": list(range(1, len(batch_locations))),
            "metrics": ["duration"]
        }
        
        try:
            response = requests.post(url, json=body, headers=headers, timeout=60)
            if response.status_code == 200:
                data = response.json()
                durations = data['durations'][0]
                
                for j, zip_code in enumerate(batch_zips):
                    if durations[j] is not None:
                        all_durations[zip_code] = durations[j] / 60  # Convert to minutes
                
                print(f"  Batch {i//batch_size + 1}: Got {len(batch_zips)} drive times")
            else:
                print(f"  Batch {i//batch_size + 1} error: {response.status_code}")
        except Exception as e:
            print(f"  Batch {i//batch_size + 1} exception: {e}")
        
        time.sleep(0.5)
    
    return all_durations

def classify_zones(drive_times):
    """Classify zip codes into zones based on drive time"""
    results = []
    
    for zip_code, minutes in drive_times.items():
        city, lat, lon = DFW_ZIPS.get(zip_code, ("Unknown", 0, 0))
        
        # Determine zone
        if minutes < 11:
            primary_zone = 1
            zone_pcts = [100, 0, 0, 0, 0]
        elif minutes < 20:
            primary_zone = 2
            zone_pcts = [0, 100, 0, 0, 0]
        elif minutes < 30:
            primary_zone = 3
            zone_pcts = [0, 0, 100, 0, 0]
        elif minutes < 45:
            primary_zone = 4
            zone_pcts = [0, 0, 0, 100, 0]
        else:
            primary_zone = 5
            zone_pcts = [0, 0, 0, 0, 100]
        
        results.append({
            'zip_code': zip_code,
            'city': city,
            'drive_time_min': round(minutes, 1),
            'primary_zone': primary_zone,
            'zone1_pct': zone_pcts[0],
            'zone2_pct': zone_pcts[1],
            'zone3_pct': zone_pcts[2],
            'zone4_pct': zone_pcts[3],
            'zone5_pct': zone_pcts[4],
            'lat': lat,
            'lon': lon
        })
    
    df = pd.DataFrame(results)
    df = df.sort_values(['primary_zone', 'drive_time_min'])
    return df

def get_demographics(zip_codes):
    """Fetch Census demographics"""
    print(f"Fetching Census demographics for {len(zip_codes)} zip codes...")
    
    variables = "B25024_001E,B25024_002E,B19013_001E"
    batch_size = 50
    results = {}
    
    for i in range(0, len(zip_codes), batch_size):
        batch = zip_codes[i:i+batch_size]
        zcta_list = ",".join(batch)
        url = f"{CENSUS_API_BASE}?get={variables}&for=zip%20code%20tabulation%20area:{zcta_list}"
        
        try:
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                data = response.json()
                headers = data[0]
                for row in data[1:]:
                    record = dict(zip(headers, row))
                    zcta = record['zip code tabulation area']
                    total = int(record.get('B25024_001E', 0) or 0)
                    sf = int(record.get('B25024_002E', 0) or 0)
                    income = record.get('B19013_001E')
                    income = int(income) if income and int(income) > 0 else None
                    
                    results[zcta] = {
                        'total_units': total,
                        'sf_detached': sf,
                        'sf_pct': round((sf/total)*100, 1) if total > 0 else 0,
                        'other': total - sf,
                        'other_pct': round(((total-sf)/total)*100, 1) if total > 0 else 0,
                        'income': income
                    }
            time.sleep(0.3)
        except Exception as e:
            print(f"  Error: {e}")
    
    print(f"  Retrieved {len(results)} records")
    return results

def create_map(df, output_path):
    """Create service area map"""
    import matplotlib.pyplot as plt
    import matplotlib.patches as mpatches
    
    print("Generating map...")
    
    fig, ax = plt.subplots(1, 1, figsize=(18, 14))
    ax.set_facecolor('#f8fafc')
    
    zone_colors = {
        1: ZONES['zone1']['color'],
        2: ZONES['zone2']['color'],
        3: ZONES['zone3']['color'],
        4: ZONES['zone4']['color'],
        5: ZONES['zone5']['color']
    }
    
    # Plot zip code points by zone
    for zone in [5, 4, 3, 2, 1]:
        zone_data = df[df['primary_zone'] == zone]
        if len(zone_data) > 0:
            ax.scatter(zone_data['lon'], zone_data['lat'], 
                      c=zone_colors[zone], s=100, alpha=0.7,
                      edgecolors='#374151', linewidth=0.5, zorder=5-zone+1)
    
    # Add labels for zones 1-2
    for _, row in df[df['primary_zone'] <= 2].iterrows():
        ax.annotate(row['zip_code'], (row['lon'], row['lat']),
                   fontsize=6, ha='center', va='bottom',
                   xytext=(0, 4), textcoords='offset points',
                   bbox=dict(boxstyle='round,pad=0.1', facecolor='white', alpha=0.7, edgecolor='none'))
    
    # City labels
    cities = {
        'Coppell': (-97.01, 32.96), 'Irving': (-96.94, 32.82), 'Carrollton': (-96.89, 32.97),
        'Grapevine': (-97.08, 32.93), 'Lewisville': (-96.99, 33.05), 'Flower Mound': (-97.10, 33.02),
        'Dallas': (-96.77, 32.78), 'Plano': (-96.70, 33.02), 'Frisco': (-96.82, 33.15),
        'Arlington': (-97.11, 32.70), 'Fort Worth': (-97.35, 32.76), 'Denton': (-97.13, 33.22),
    }
    
    for city, (lon, lat) in cities.items():
        ax.annotate(city, xy=(lon, lat), fontsize=10, ha='center', va='center',
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
    
    # Stats
    zone_counts = df['primary_zone'].value_counts().sort_index()
    stats = f"""Service Area Statistics
━━━━━━━━━━━━━━━━━━━━━━
HQ: {HQ_ADDRESS}
━━━━━━━━━━━━━━━━━━━━━━
Zone 1 (<11 min):   {zone_counts.get(1, 0):>3}
Zone 2 (11-20):     {zone_counts.get(2, 0):>3}
Zone 3 (21-30):     {zone_counts.get(3, 0):>3}
Zone 4 (31-45):     {zone_counts.get(4, 0):>3}
Zone 5 (>45):       {zone_counts.get(5, 0):>3}
━━━━━━━━━━━━━━━━━━━━━━
Total: {len(df)} zip codes"""
    
    ax.text(0.02, 0.02, stats, transform=ax.transAxes, fontsize=9, verticalalignment='bottom',
           fontfamily='monospace', bbox=dict(boxstyle='round,pad=0.5', facecolor='white', alpha=0.9))
    
    ax.set_xlabel('Longitude', fontsize=12)
    ax.set_ylabel('Latitude', fontsize=12)
    ax.set_title('DFW HVAC Service Area - 5-Zone Model', fontsize=16, fontweight='bold', pad=15)
    ax.grid(True, alpha=0.3, linestyle='--')
    ax.set_xlim(-97.6, -96.4)
    ax.set_ylim(32.5, 33.4)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"  Map saved to {output_path}")


def main():
    print("=" * 60)
    print("DFW HVAC SERVICE AREA - 5-ZONE MODEL")
    print("=" * 60)
    print(f"\nHQ: {HQ_ADDRESS}")
    print(f"Zones: <11min, 11-20, 21-30, 31-45, >45\n")
    
    # Step 1: Get drive times
    drive_times = get_drive_times_matrix()
    print(f"  Got drive times for {len(drive_times)} zip codes\n")
    
    # Step 2: Classify into zones
    df = classify_zones(drive_times)
    
    # Step 3: Get demographics
    zip_list = df['zip_code'].tolist()
    demographics = get_demographics(zip_list)
    
    # Step 4: Merge demographics
    df['total_housing_units'] = df['zip_code'].map(lambda z: demographics.get(z, {}).get('total_units', 0))
    df['sf_detached'] = df['zip_code'].map(lambda z: demographics.get(z, {}).get('sf_detached', 0))
    df['sf_pct'] = df['zip_code'].map(lambda z: demographics.get(z, {}).get('sf_pct', 0))
    df['other_dwellings'] = df['zip_code'].map(lambda z: demographics.get(z, {}).get('other', 0))
    df['other_pct'] = df['zip_code'].map(lambda z: demographics.get(z, {}).get('other_pct', 0))
    df['median_income'] = df['zip_code'].map(lambda z: demographics.get(z, {}).get('income'))
    
    # Step 5: Save CSV
    output_df = df[[
        'zip_code', 'city', 'primary_zone', 'drive_time_min',
        'zone1_pct', 'zone2_pct', 'zone3_pct', 'zone4_pct', 'zone5_pct',
        'total_housing_units', 'sf_detached', 'sf_pct', 'other_dwellings', 'other_pct', 'median_income'
    ]].copy()
    
    output_df.columns = [
        'Zip Code', 'City', 'Primary Zone', 'Drive Time (min)',
        'Zone 1 (%)', 'Zone 2 (%)', 'Zone 3 (%)', 'Zone 4 (%)', 'Zone 5 (%)',
        'Total Housing Units', 'SF Detached', '% SF Detached', 'Other Dwellings', '% Other', 'Median Income'
    ]
    
    csv_path = '/app/frontend/public/DFW_HVAC_Service_Area_Zones.csv'
    output_df.to_csv(csv_path, index=False)
    print(f"\nCSV saved: {csv_path}")
    
    # Step 6: Create map
    create_map(df, '/app/frontend/public/dfw_service_area_map.png')
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    zone_counts = df['primary_zone'].value_counts().sort_index()
    for z in range(1, 6):
        print(f"Zone {z}: {zone_counts.get(z, 0)} zip codes")
    print(f"\nTotal: {len(df)} zip codes")
    
    print("\n--- ZONE 1 (<11 min) ---")
    z1 = df[df['primary_zone'] == 1][['zip_code', 'city', 'drive_time_min', 'sf_pct', 'median_income']]
    print(z1.to_string(index=False))


if __name__ == "__main__":
    main()
