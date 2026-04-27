# Service Area Maps — Internal Reference

These two PNG maps were originally in `frontend/public/` but **were deleted on Apr 27, 2026** during the F2 image optimization audit because they had zero references in the codebase yet were costing ~1.4 MB of CDN/build weight.

The user requested that copies be **preserved internally** for reference (e.g., GBP service area definition, sales materials, brochures) but **not deployed to the public site**.

## Files

| File | Size | Purpose |
|---|---|---|
| `dfw_service_area_map.png` | 318 KB | DFW HVAC service area boundary map |
| `dfw_service_area_map_4zone.png` | 1.1 MB | 4-zone service-tier breakdown of DFW |

## Rules

- ❌ **Do NOT copy these into `/frontend/public/`** — that re-introduces the dead-weight problem.
- ❌ **Do NOT reference these from any rendered page** — they are not part of the public site.
- ✅ Use them in internal docs (memory/, audits/, off-site brochures, GBP service-area screenshots).
- ✅ If you need to display a service-area map ON the public site, generate a fresh, optimized AVIF/WebP version of the appropriate scope, NOT these legacy PNGs.

## Provenance

Restored from git history Apr 27, 2026:
- `dfw_service_area_map.png` — commit `75e5cb4`
- `dfw_service_area_map_4zone.png` — commit `9adf13e`
