#!/usr/bin/env python3
"""
Merge Service Area Zones with Housing Demographics
All zip codes from service area, sorted by zone proximity
"""

import requests
import pandas as pd
import time

CENSUS_API_BASE = "https://api.census.gov/data/2022/acs/acs5"

# Zip code to city mapping for DFW area
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
    "75083": "Richardson", "75087": "Rockwall", "75088": "Rowlett", "75089": "Rowlett",
    "75093": "Plano", "75098": "Wylie", "75104": "Cedar Hill", "75115": "DeSoto",
    "75116": "Duncanville", "75149": "Mesquite", "75150": "Mesquite",
    "75181": "Mesquite", "75182": "Sunnyvale", "75201": "Dallas (Downtown)",
    "75202": "Dallas (Downtown)", "75204": "Dallas (Uptown)", "75205": "Dallas (Highland Park)",
    "75206": "Dallas (Lower Greenville)", "75207": "Dallas (Design District)",
    "75208": "Dallas (Oak Cliff)", "75209": "Dallas (Love Field)", "75211": "Dallas (West)",
    "75212": "Dallas (Northwest)", "75214": "Dallas (Lakewood)", "75218": "Dallas (Casa Linda)",
    "75219": "Dallas (Oak Lawn)", "75220": "Dallas (Northwest)", "75225": "Dallas (University Park)",
    "75226": "Dallas (Deep Ellum)", "75228": "Dallas (East)", "75229": "Dallas (Northwest)",
    "75230": "Dallas (North)", "75231": "Dallas (Northeast)", "75234": "Farmers Branch",
    "75235": "Dallas (Love Field)", "75236": "Dallas (Southwest)", "75238": "Dallas (Lake Highlands)",
    "75240": "Dallas (North)", "75243": "Dallas (Lake Highlands)", "75244": "Dallas (North)",
    "75246": "Dallas (East)", "75247": "Dallas (Stemmons)", "75248": "Dallas (Far North)",
    "75251": "Dallas (North)", "75252": "Dallas (Far North)", "75254": "Dallas (North)",
    "75261": "DFW Airport", "75270": "Dallas (PO Boxes)", "75287": "Dallas (Far North)",
    "75390": "Dallas (UT Southwestern)",
    "76001": "Arlington", "76002": "Arlington", "76005": "Arlington", "76006": "Arlington",
    "76010": "Arlington", "76011": "Arlington", "76012": "Arlington", "76013": "Arlington",
    "76014": "Arlington", "76015": "Arlington", "76016": "Arlington", "76017": "Arlington",
    "76018": "Arlington", "76021": "Bedford", "76022": "Bedford", "76034": "Colleyville",
    "76039": "Euless", "76040": "Euless", "76051": "Grapevine", "76052": "Haslet",
    "76053": "Hurst", "76054": "Hurst", "76063": "Mansfield", "76092": "Southlake",
    "76117": "Haltom City", "76118": "Fort Worth (Northeast)", "76120": "Fort Worth (East)",
    "76137": "Fort Worth (North)", "76148": "North Richland Hills", "76155": "Fort Worth (DFW Airport)",
    "76177": "Fort Worth (Alliance)", "76180": "North Richland Hills", "76182": "North Richland Hills",
    "76201": "Denton", "76205": "Denton", "76207": "Denton", "76208": "Denton",
    "76209": "Denton", "76210": "Denton", "76226": "Argyle", "76227": "Aubrey",
    "76244": "Keller", "76247": "Justin", "76248": "Keller", "76262": "Roanoke",
}

def get_census_data(zip_codes):
    """Fetch housing and income data from Census Bureau"""
    print(f"Fetching Census data for {len(zip_codes)} zip codes...")
    
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
                print(f"  Batch {i//batch_size + 1}: Retrieved {len(data) - 1} zip codes")
            else:
                print(f"  Batch {i//batch_size + 1} error: {response.status_code}")
        except Exception as e:
            print(f"  Batch {i//batch_size + 1} exception: {e}")
        
        time.sleep(0.5)
    
    return all_results

def process_census_data(census_data):
    """Process raw Census data into DataFrame"""
    results = []
    for record in census_data:
        try:
            zcta = record.get('zip code tabulation area', '')
            total_units = int(record.get('B25024_001E', 0) or 0)
            sf_detached = int(record.get('B25024_002E', 0) or 0)
            other = total_units - sf_detached
            income_raw = record.get('B19013_001E', None)
            median_income = int(income_raw) if income_raw and int(income_raw) > 0 else None
            
            if total_units > 0:
                sf_pct = round((sf_detached / total_units) * 100, 1)
                other_pct = round(100 - sf_pct, 1)
            else:
                sf_pct = 0
                other_pct = 0
            
            results.append({
                'Zip Code': zcta,
                'Total Housing Units': total_units,
                'Single-Family Detached': sf_detached,
                '% Single-Family Detached': sf_pct,
                'Other Dwellings': other,
                '% Other': other_pct,
                'Median Household Income': median_income
            })
        except Exception as e:
            print(f"  Error processing record: {e}")
    
    return pd.DataFrame(results)

def main():
    print("=" * 80)
    print("MERGING SERVICE AREA ZONES WITH HOUSING DEMOGRAPHICS")
    print("=" * 80)
    print()
    
    # Load service area data
    print("Loading service area data...")
    service_df = pd.read_csv('/app/frontend/public/DFW_HVAC_Service_Area_Zones.csv')
    service_df['Zip Code'] = service_df['Zip Code'].astype(str).str.zfill(5)
    print(f"  Found {len(service_df)} zip codes in service area")
    
    # Get all zip codes from service area
    all_zips = service_df['Zip Code'].tolist()
    
    # Fetch Census data for all service area zip codes
    print()
    census_data = get_census_data(all_zips)
    demo_df = process_census_data(census_data)
    demo_df['Zip Code'] = demo_df['Zip Code'].astype(str).str.zfill(5)
    print(f"\nReceived demographic data for {len(demo_df)} zip codes")
    
    # Merge datasets
    print("\nMerging datasets...")
    merged_df = service_df.merge(demo_df, on='Zip Code', how='left')
    
    # Add city names
    merged_df['City'] = merged_df['Zip Code'].map(ZIP_TO_CITY).fillna('Unknown')
    
    # Determine primary zone for sorting
    def get_primary_zone(row):
        if row['Zone 1 (%)'] > 0:
            return 1
        elif row['Zone 2 (%)'] > 0:
            return 2
        elif row['Zone 3 (%)'] > 0:
            return 3
        else:
            return 4
    
    merged_df['Primary Zone'] = merged_df.apply(get_primary_zone, axis=1)
    
    # Sort by Primary Zone, then by zone percentage within each zone
    merged_df['Sort Key'] = merged_df.apply(
        lambda r: (r['Primary Zone'], -r[f"Zone {int(r['Primary Zone'])} (%)"]), axis=1
    )
    merged_df = merged_df.sort_values('Sort Key').drop('Sort Key', axis=1)
    
    # Reorder columns
    column_order = [
        'Zip Code', 'City', 'Primary Zone',
        'Zone 1 (%)', 'Zone 2 (%)', 'Zone 3 (%)', 'Zone 4 (%)',
        'Total Housing Units', 'Single-Family Detached', '% Single-Family Detached',
        'Other Dwellings', '% Other', 'Median Household Income'
    ]
    
    # Only include columns that exist
    column_order = [c for c in column_order if c in merged_df.columns]
    merged_df = merged_df[column_order]
    
    # Save
    output_path = '/app/frontend/public/DFW_HVAC_Master_Service_Area.csv'
    merged_df.to_csv(output_path, index=False)
    print(f"\nSaved to {output_path}")
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    
    print(f"\nTotal Zip Codes: {len(merged_df)}")
    print(f"\nBy Primary Zone:")
    for zone in [1, 2, 3, 4]:
        count = len(merged_df[merged_df['Primary Zone'] == zone])
        print(f"  Zone {zone}: {count} zip codes")
    
    total_units = merged_df['Total Housing Units'].sum()
    total_sf = merged_df['Single-Family Detached'].sum()
    avg_income = merged_df['Median Household Income'].dropna().mean()
    
    print(f"\nTotal Housing Units: {total_units:,}")
    print(f"Single-Family Detached: {total_sf:,} ({total_sf/total_units*100:.1f}%)")
    print(f"Average Median Income: ${avg_income:,.0f}")
    
    print("\n" + "-" * 80)
    print("ZONE 1 ZIP CODES (<15 min from HQ)")
    print("-" * 80)
    zone1 = merged_df[merged_df['Primary Zone'] == 1][['Zip Code', 'City', 'Zone 1 (%)', '% Single-Family Detached', 'Median Household Income']]
    zone1['Median Household Income'] = zone1['Median Household Income'].apply(lambda x: f"${x:,.0f}" if pd.notna(x) else "N/A")
    print(zone1.to_string(index=False))
    
    print("\n" + "-" * 80)
    print("ZONE 2 SAMPLE (15-30 min) - First 15")
    print("-" * 80)
    zone2 = merged_df[merged_df['Primary Zone'] == 2][['Zip Code', 'City', 'Zone 2 (%)', '% Single-Family Detached', 'Median Household Income']].head(15)
    zone2['Median Household Income'] = zone2['Median Household Income'].apply(lambda x: f"${x:,.0f}" if pd.notna(x) else "N/A")
    print(zone2.to_string(index=False))

if __name__ == "__main__":
    main()
