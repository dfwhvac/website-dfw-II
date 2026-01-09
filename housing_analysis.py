#!/usr/bin/env python3
"""
Housing Type Analysis by Zip Code
Single-Family Detached vs. Other Dwelling Types + Median Household Income
Data Source: US Census Bureau, American Community Survey (ACS) 5-year estimates
"""

import requests
import pandas as pd
import time

# Census API endpoint for ACS 5-year estimates
CENSUS_API_BASE = "https://api.census.gov/data/2022/acs/acs5"

# Zip codes provided by user
ZIP_CODES = [
    "75019", "75063", "75067", "76051", "75039", "75006", "75010", "75234", "75007", "75057",
    "75261", "75028", "75038", "75056", "75229", "75022", "76092", "75025", "75093", "75248",
    "75065", "76022", "75024", "76180", "75050", "75023", "75077", "75034", "75252", "75051",
    "76148", "75240", "75219", "75061", "76040", "75220", "76021", "76005", "75062", "75244",
    "75205", "75060", "76248", "75235", "76053", "75036", "76039", "75001", "76054", "76210",
    "75212", "75204", "76034", "75225", "75287", "76182", "75209", "75251", "75390", "75231",
    "75270", "75230", "75238", "75254", "75081", "75206", "75247", "75202", "76155", "75075",
    "75080", "76006", "75243", "76118", "75211", "75201", "76244", "76011", "75042", "76262",
    "75207", "75208", "75246", "75214", "75013", "76137", "76205", "75035", "76226", "75041",
    "75074", "75033", "75082", "76117", "76120", "76010", "75044", "75218", "76012", "75070",
    "76208", "75236", "75068", "76177", "75052", "75226"
]

def get_census_data(zip_codes):
    """
    Fetch housing unit type data and median household income from Census Bureau
    B25024_001E = Total housing units
    B25024_002E = 1-unit detached (single-family detached)
    B19013_001E = Median household income
    """
    
    print(f"Fetching data for {len(zip_codes)} zip codes from Census Bureau...")
    print()
    
    # Variables to fetch
    variables = "NAME,B25024_001E,B25024_002E,B19013_001E"
    
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

def main():
    print("=" * 70)
    print("HOUSING TYPE & INCOME ANALYSIS")
    print("Single-Family Detached vs. Other + Median Household Income")
    print("=" * 70)
    print()
    
    # Fetch Census data
    census_data = get_census_data(ZIP_CODES)
    
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
            other = total_units - sf_detached
            
            # Median household income (can be negative for suppressed data)
            income_raw = record.get('B19013_001E', None)
            if income_raw and int(income_raw) > 0:
                median_income = int(income_raw)
            else:
                median_income = None
            
            if total_units > 0:
                sf_detached_pct = round((sf_detached / total_units) * 100, 1)
                other_pct = round(100 - sf_detached_pct, 1)
            else:
                sf_detached_pct = 0
                other_pct = 0
            
            results.append({
                'Zip Code': zcta,
                'Total Housing Units': total_units,
                'Single-Family Detached': sf_detached,
                '% Single-Family Detached': sf_detached_pct,
                'Other Dwellings': other,
                '% Other': other_pct,
                'Median Household Income': median_income
            })
        except Exception as e:
            print(f"  Error processing {record}: {e}")
    
    # Create DataFrame
    df = pd.DataFrame(results)
    df['Zip Code'] = df['Zip Code'].astype(str).str.zfill(5)
    
    # Sort by % single-family detached (highest first)
    df = df.sort_values('% Single-Family Detached', ascending=False)
    
    # Save to CSV
    output_path = '/app/frontend/public/DFW_HVAC_Housing_Types.csv'
    df.to_csv(output_path, index=False)
    print(f"\nSaved to {output_path}")
    
    # Print summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    
    total_units = df['Total Housing Units'].sum()
    total_sf = df['Single-Family Detached'].sum()
    total_other = df['Other Dwellings'].sum()
    avg_income = df['Median Household Income'].dropna().mean()
    
    print(f"\nTotal Housing Units Across All Zip Codes: {total_units:,}")
    print(f"Single-Family Detached:                   {total_sf:,} ({total_sf/total_units*100:.1f}%)")
    print(f"Other Dwelling Types:                     {total_other:,} ({total_other/total_units*100:.1f}%)")
    print(f"Average Median Household Income:          ${avg_income:,.0f}")
    
    print("\n" + "-" * 70)
    print("TOP 20 ZIP CODES BY % SINGLE-FAMILY DETACHED")
    print("-" * 70)
    top20 = df[['Zip Code', '% Single-Family Detached', 'Total Housing Units', 'Median Household Income']].head(20).copy()
    top20['Median Household Income'] = top20['Median Household Income'].apply(lambda x: f"${x:,.0f}" if pd.notna(x) else "N/A")
    print(top20.to_string(index=False))
    
    print("\n" + "-" * 70)
    print("TOP 20 ZIP CODES BY MEDIAN HOUSEHOLD INCOME")
    print("-" * 70)
    by_income = df.dropna(subset=['Median Household Income']).sort_values('Median Household Income', ascending=False)
    top_income = by_income[['Zip Code', 'Median Household Income', '% Single-Family Detached', 'Total Housing Units']].head(20).copy()
    top_income['Median Household Income'] = top_income['Median Household Income'].apply(lambda x: f"${x:,.0f}")
    print(top_income.to_string(index=False))
    
    # Zip codes not found
    found_zips = set(df['Zip Code'].tolist())
    requested_zips = set([z.zfill(5) for z in ZIP_CODES])
    missing = requested_zips - found_zips
    if missing:
        print(f"\n⚠️  Zip codes not found in Census data: {', '.join(sorted(missing))}")

if __name__ == "__main__":
    main()
