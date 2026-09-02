# DFW HVAC service-area analysis (archive)

**Created:** early 2025 (Emergent) · **Archived in-repo:** Sep 2, 2026  
**Not part of the public website.** Do not copy maps into `frontend/public/`.

This folder keeps the drive-time + demographics work that defined coverage from HQ. Spreadsheets stay in `frontend/internal/` (same files, already in git). Maps and generator scripts live here so the method is not only in old chat history.

## What was studied

From **556 S. Coppell Rd, Coppell, TX 75019** (`[-97.006677, 32.958239]`), OpenRouteService driving isochrones were overlapped with Census ZIP (ZCTA) boundaries. Each ZIP got a **percent-in-zone** mix, then ACS 2022 housing and income:

| Zone | Drive time | Meaning |
|---|---|---|
| 1 | under 11 min | Core |
| 2 | 11–20 min | Primary |
| 3 | 21–30 min | Secondary |
| 4 | 31–45 min | Outer service area |
| 5 | over 45 min | Outside (gray on the map; not in the 4-zone CSV) |

An earlier draft used 15 / 30 / 45-minute rings. The **4-zone model above is the one to keep** (200 ZIPs in Zones 1–4). `DFW_HVAC_Service_Area_Zones.csv` is a related cut with an explicit **Drive Time (min)** column (173 ZIPs).

## Files

### Data (canonical copies — do not duplicate)

| Path | Role |
|---|---|
| `frontend/internal/DFW_HVAC_Service_Area_4Zone.csv` | **Canonical.** 200 ZIPs: zone mix %, housing units, SF detached %, median income |
| `frontend/internal/DFW_HVAC_Service_Area_Zones.csv` | Same idea + drive minutes from HQ |
| `frontend/internal/DFW_HVAC_Master_Service_Area.csv` | Zones merged with Census demographics |
| `frontend/internal/DFW_HVAC_Housing_Types.csv` | Housing mix + income, sorted by % single-family |

### Maps (this folder)

| File | Purpose |
|---|---|
| [`maps/dfw_service_area_map.png`](maps/dfw_service_area_map.png) | Overall service-area boundary |
| [`maps/dfw_service_area_map_4zone.png`](maps/dfw_service_area_map_4zone.png) | Color rings, ZIP labels, HQ star, zone counts |

Use for GBP service-area screenshots, sales, brochures. If a **public** page needs a map, generate a new optimized AVIF/WebP — do not ship these PNGs.

### Scripts (this folder)

| File | Purpose | Needs a key? |
|---|---|---|
| `scripts/generate_4zone_map.py` | Recreate 4-zone CSV + map (TIGERweb + ORS + ACS) | Yes — `ORS_API_KEY` |
| `scripts/housing_analysis.py` | ACS housing types + median income | No (Census public API) |
| `scripts/merge_service_area.py` | Join zone CSV to Census demographics | No |

To regenerate the map (optional; saved PNG/CSV already exist):

```bash
# from repo root; key from openrouteservice.org (free tier)
ORS_API_KEY=... python3 memory/assets/service-area-analysis/scripts/generate_4zone_map.py
```

Python extras if regenerating: `pandas`, `geopandas`, `matplotlib`, `shapely`, `requests`.

## Data sources

- **Drive time:** OpenRouteService `driving-car` isochrones  
- **ZIP shapes:** Census TIGERweb (ZCTA), not a full national shapefile download  
- **Demographics:** ACS 5-year 2022 — `B25024` (units / 1-unit detached), `B19013` (median household income)

## How this showed up on the site

City-page priorities and the 28-city service list were updated from these zones. The maps themselves were removed from `frontend/public/` on Apr 27, 2026 so they would not ship on the CDN (~1.4 MB unused).

## Older scripts (git only)

These were deleted May 4, 2026 because they contained live API keys. **Do not restore them as-is.** The sanitized 4-zone generator above replaces them.

Still recoverable from git parent of `7df879d` if you need a draft: `service_area_analysis.py`, `service_area_5zone.py`, `service_area_5zone_v2.py`, `service_area_intersection.py`, `service_area_map_v2.py`, `service_area_map_v3.py`.
