# Replacement-Estimator Pricing Matrix — Google Sheet Template

**Purpose:** This is the authoritative source for the price ranges shown on `/replacement-estimator`. Copy-paste the table below into a new Google Sheet tab titled `Replacement Estimator — Pricing Matrix`. Fill in the numbers you're comfortable quoting. Send the sheet back (or just the cell values) and the agent imports them into `/app/frontend/lib/estimator-matrix.js`.

**Current state:** the live code uses **conservative DFW-market placeholders** (values shown in the "Current (placeholder)" column). All calculations run server-side — no redeploy of client code is needed when you update these numbers.

**Units:** USD, installed cost to DFW homeowners (includes equipment, installation, permits, disposal of old unit, standard line-set work, refrigerant fill, thermostat).

---

## Sheet A — Home Size → Tonnage

One number per row. This is the Manual J proxy. Real on-site Manual J calcs will shift ±0.5 tons but this is within our published variance.

| Sqft range      | Estimated tonnage (tons) | Current (placeholder) |
| --------------- | ------------------------ | --------------------- |
| Under 1,500     |                          | 2.5                   |
| 1,500 – 2,500   |                          | 3.5                   |
| 2,500 – 3,500   |                          | 4                     |
| 3,500 – 5,000   |                          | 5                     |
| Over 5,000      |                          | 6                     |

---

## Sheet B — System Type → Base Cost per Ton (USD)

Two numbers per row: low and high dollars-per-ton for each system type. These are the main range drivers.

| System type                      | Low $/ton | High $/ton | Current placeholder |
| -------------------------------- | --------- | ---------- | ------------------- |
| AC only                          |           |            | $1,500 – $2,200     |
| Furnace only                     |           |            | $1,200 – $1,800     |
| Matched (AC + furnace together)  |           |            | $2,500 – $3,500     |
| Heat pump (all-electric)         |           |            | $2,700 – $3,700     |
| Ductless mini-split (per zone)   |           |            | $2,000 – $3,200     |
| Not sure (defaults to "matched") |           |            | $2,500 – $3,500     |

---

## Sheet C — Equipment Tier → Multiplier

Applied to Sheet B base cost. Enter multipliers, not dollars. (1.0 = no change, 1.2 = +20%, etc.)

| Equipment tier              | Multiplier | Current placeholder |
| --------------------------- | ---------- | ------------------- |
| Value (single-stage)        |            | 1.0                 |
| Standard (two-stage)        |            | 1.2                 |
| Premium (variable-speed)    |            | 1.45                |
| Not sure (defaults to mid)  |            | 1.1                 |

---

## Sheet D — Efficiency Tier (SEER2) → Flat Dollar Adder

Added to the base before the global variance. Flat dollars, not a multiplier.

| Efficiency tier             | Flat add (USD) | Current placeholder |
| --------------------------- | -------------- | ------------------- |
| Baseline (14 SEER2)         |                | $0                  |
| Mid (17 SEER2)              |                | $600                |
| High (20+ SEER2)            |                | $1,500              |
| Not sure (defaults to mid)  |                | $300                |

---

## Sheet E — Duct Condition → Range Adder (USD)

Two numbers per row — the amount added to the low and high ends of the range.

| Duct condition                 | Low add | High add | Current placeholder |
| ------------------------------ | ------- | -------- | ------------------- |
| Newer / in great shape         |         |          | $0 – $0             |
| Older but working OK           |         |          | $200 – $600         |
| Probably needs some work       |         |          | $1,500 – $3,500     |
| Needs full replacement         |         |          | $3,500 – $7,000     |
| Don't know (defaults mid-low)  |         |          | $0 – $1,500         |

---

## Sheet F — Global Variance Band (%)

Applied to the final range AFTER all calculations above. Gives the range final "breathing room" to cover permit, electrical, attic-access surprises.

| Variance                | % of base | Current placeholder |
| ----------------------- | --------- | ------------------- |
| Low-end swing (down)    |           | -8% (0.92×)         |
| High-end swing (up)     |           | +8% (1.08×)         |

Keep this conservative. ±8% is usually right; anything wider and customers stop trusting the tool.

---

## 🧮 How the numbers combine (worked example)

**Homeowner answers:** 3,000 sqft, matched system, standard tier, mid SEER, older-but-OK ducts

Using the placeholder values:

```
tonnage      = Sheet A [2,500–3,500 sqft] = 4
base_low     = Sheet B [matched low] × tonnage × Sheet C [standard]
             = 2500 × 4 × 1.2 = 12,000
base_high    = Sheet B [matched high] × tonnage × Sheet C [standard]
             = 3500 × 4 × 1.2 = 16,800
low          = base_low + Sheet D [mid] + Sheet E [older_ok low]
             = 12,000 + 600 + 200 = 12,800
high         = base_high + Sheet D [mid] + Sheet E [older_ok high]
             = 16,800 + 600 + 600 = 18,000
final_low    = low × Sheet F [0.92] = 11,776 → rounds to $11,800
final_high   = high × Sheet F [1.08] = 19,440 → rounds to $19,400

→ Displayed range: $11,800 – $19,400
```

---

## ✅ Edit checklist for the user

1. Copy this markdown (or just the 6 tables above) into a new Google Sheet
2. Fill in the first blank column with the numbers you're comfortable quoting
3. Share the sheet (view access) with the agent OR paste the cell values back in chat
4. Agent imports the values into `/app/frontend/lib/estimator-matrix.js`, rebuilds, pushes to `preview` branch
5. Verify on preview URL — try a handful of combinations, confirm the ranges feel right
6. Merge `preview` → `main`

**Total time:** ~30 minutes of thinking on your end.

---

## 🔧 File references

- **Current live matrix:** `/app/frontend/lib/estimator-matrix.js`
- **Calculation endpoint:** `/app/frontend/app/api/estimator/calculate/route.js`
- **Wizard UI:** `/app/frontend/app/replacement-estimator/EstimatorWizard.jsx`
- **Page shell:** `/app/frontend/app/replacement-estimator/page.jsx`

Edit the matrix file values; no schema change needed.
