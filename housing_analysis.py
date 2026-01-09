#!/usr/bin/env python3
"""
Housing Type Analysis by Zip Code
Pulls single-family detached vs. other dwelling types from Census ACS data
"""

import requests
import pandas as pd
import time

# Census API endpoint for ACS 5-year estimates
# Table B25024: Units in Structure
CENSUS_API_BASE = "https://api.census.gov/data/2022/acs/acs5"

def get_housing_data_by_zcta(zip_codes):
    """
    Fetch housing unit type data from Census Bureau
    B25024_001E = Total housing units
    B25024_002E = 1-unit detached (single-family detached)
    B25024_003E = 1-unit attached (townhomes)
    B25024_004E = 2 units
    B25024_005E = 3-4 units
    B25024_006E = 5-9 units
    B25024_007E = 10-19 units
    B25024_008E = 20-49 units
    B25024_009E = 50+ units
    B25024_010E = Mobile homes
    B25024_011E = Boat, RV, van, etc.
    """
    
    print(f"Fetching housing data for {len(zip_codes)} zip codes...")
    
    # Variables to fetch
    variables = "NAME,B25024_001E,B25024_002E"
    
    # Census API allows querying multiple ZCTAs at once
    # But we need to batch them to avoid URL length limits
    batch_size = 50
    all_results = []
    
    for i in range(0, len(zip_codes), batch_size):
        batch = zip_codes[i:i+batch_size]
        zcta_list = ",".join(batch)
        
        url = f"{CENSUS_API_BASE}?get={variables}&for=zip%20code%20tabulation%20area:{zcta_list}"
        
        try:
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                data = response.json()
                # First row is headers
                headers = data[0]
                for row in data[1:]:
                    all_results.append(dict(zip(headers, row)))
            else:
                print(f"  Batch {i//batch_size + 1} error: {response.status_code}")
        except Exception as e:
            print(f"  Batch {i//batch_size + 1} exception: {e}")
        
        time.sleep(0.5)  # Rate limiting
        
        if (i // batch_size + 1) % 3 == 0:
            print(f"  Processed {min(i + batch_size, len(zip_codes))}/{len(zip_codes)} zip codes...")
    
    return all_results

def main():
    print("=" * 60)
    print("Housing Type Analysis: Single-Family Detached vs. Other")
    print("=" * 60)
    print()
    
    # Load service area zip codes
    service_area_df = pd.read_csv('/app/frontend/public/DFW_HVAC_Service_Area_Zones.csv')
    zip_codes = service_area_df['Zip Code'].astype(str).str.zfill(5).tolist()
    
    print(f"Loaded {len(zip_codes)} service area zip codes")
    print()
    
    # Fetch Census data
    census_data = get_housing_data_by_zcta(zip_codes)
    
    if not census_data:
        print("Error: No data returned from Census API")
        return
    
    print(f"\nReceived data for {len(census_data)} zip codes")
    
    # Process results
    results = []
    for record in census_data:
        try:
            zcta = record.get('zip code tabulation area', '')
            total_units = int(record.get('B25024_001E', 0) or 0)
            sf_detached = int(record.get('B25024_002E', 0) or 0)
            
            if total_units > 0:
                sf_detached_pct = round((sf_detached / total_units) * 100, 1)
                other_pct = round(100 - sf_detached_pct, 1)
            else:
                sf_detached_pct = 0
                other_pct = 0
            
            results.append({
                'zip_code': zcta,
                'total_housing_units': total_units,
                'single_family_detached': sf_detached,
                'other_dwelling_types': total_units - sf_detached,
                'pct_single_family_detached': sf_detached_pct,
                'pct_other': other_pct
            })
        except Exception as e:
            print(f"  Error processing {record}: {e}")
    
    # Create DataFrame and merge with service area data
    housing_df = pd.DataFrame(results)
    housing_df['zip_code'] = housing_df['zip_code'].astype(str).str.zfill(5)
    
    # Merge with original service area data to get city names
    service_area_df['Zip Code'] = service_area_df['Zip Code'].astype(str).str.zfill(5)
    merged_df = service_area_df.merge(
        housing_df, 
        left_on='Zip Code', 
        right_on='zip_code', 
        how='left'
    )
    
    # Select and rename columns
    output_df = merged_df[[
        'Zip Code', 'City', 
        'total_housing_units', 'single_family_detached', 'other_dwelling_types',
        'pct_single_family_detached', 'pct_other',
        'Zone 1 (%)', 'Zone 2 (%)', 'Zone 3 (%)'
    ]].copy()
    
    output_df.columns = [
        'Zip Code', 'City',
        'Total Housing Units', 'Single-Family Detached', 'Other Dwellings',
        '% Single-Family Detached', '% Other',
        'Zone 1 (%)', 'Zone 2 (%)', 'Zone 3 (%)'
    ]
    
    # Sort by % single-family detached (highest first)
    output_df = output_df.sort_values('% Single-Family Detached', ascending=False)
    
    # Save to CSV
    output_path = '/app/frontend/public/DFW_HVAC_Housing_Types.csv'
    output_df.to_csv(output_path, index=False)
    print(f"\nSaved to {output_path}")
    
    # Print summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    total_units = output_df['Total Housing Units'].sum()
    total_sf = output_df['Single-Family Detached'].sum()
    total_other = output_df['Other Dwellings'].sum()
    
    print(f"Total Housing Units in Service Area: {total_units:,}")
    print(f"Single-Family Detached: {total_sf:,} ({total_sf/total_units*100:.1f}%)")
    print(f"Other Dwelling Types: {total_other:,} ({total_other/total_units*100:.1f}%)")
    
    print("\n" + "-" * 60)
    print("TOP 15 ZIP CODES BY % SINGLE-FAMILY DETACHED")
    print("-" * 60)
    print(output_df[['Zip Code', 'City', '% Single-Family Detached', 'Total Housing Units']].head(15).to_string(index=False))
    
    print("\n" + "-" * 60)
    print("BOTTOM 15 ZIP CODES BY % SINGLE-FAMILY DETACHED")
    print("-" * 60)
    print(output_df[['Zip Code', 'City', '% Single-Family Detached', 'Total Housing Units']].tail(15).to_string(index=False))

if __name__ == "__main__":
    main()
