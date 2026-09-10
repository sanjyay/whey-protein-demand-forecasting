# Supplement Sales Weekly Dataset

This directory contains the primary data used in the **Whey Protein Demand Forecasting** project.

## Dataset Provenance & Attribution
* **Dataset Title**: Supplement Sales Data (Weekly Expanded Retail Benchmark)
* **Author / Publisher**: Zahid Mughal (`zahidmughal2343`)
* **Source Platform**: Kaggle
* **Verified Kaggle URL**: [https://www.kaggle.com/datasets/zahidmughal2343/supplement-sales-data](https://www.kaggle.com/datasets/zahidmughal2343/supplement-sales-data)
* **Direct Raw CSV Download**: [Raw GitHub Link](https://raw.githubusercontent.com/sanjyay/whey-protein-demand-forecasting/main/data/Supplement_Sales_Weekly_Expanded.csv)
* **Target File Name**: `Supplement_Sales_Weekly_Expanded.csv`
* **File Size**: 297,207 bytes (~297 kB)
* **Total Rows**: 4,384 records
* **Total Columns**: 10 columns
* **Temporal Scope**: January 6, 2020 to March 31, 2025 (274 consecutive weekly observation dates)
* **Cadence**: Weekly (every Monday)
* **License**: Public Domain / Open Benchmark

### Download Options

#### Option A: Direct Download (No Kaggle Account Required)
```bash
curl -o data/Supplement_Sales_Weekly_Expanded.csv https://raw.githubusercontent.com/sanjyay/whey-protein-demand-forecasting/main/data/Supplement_Sales_Weekly_Expanded.csv
```

#### Option B: Download via Kaggle CLI
```bash
kaggle datasets download -d zahidmughal2343/supplement-sales-data -f Supplement_Sales_Weekly_Expanded.csv -p data/ --unzip
```

## Schema

| Column Name | Data Type | Description | Forecasting Validity |
|:---|:---|:---|:---|
| `Date` | Date (`YYYY-MM-DD`) | Sales week start date (Mondays) | Metadata / Indexing |
| `Product Name` | String | Name of the supplement product (16 distinct products) | Filtered to `Whey Protein` |
| `Category` | String | Supplement category (e.g. `Protein`, `Vitamin`, `Omega`) | Product metadata |
| `Units Sold` | Integer | Total units sold during the week | **Target Variable ($y_t$)** |
| `Price` | Float | Unit selling price ($ USD) | Valid as planned list price / Historical lag |
| `Revenue` | Float | Total weekly sales revenue ($ USD) | **Target Leakage ($Price \times Units\ Sold$)** — Only valid as lag ($t-1, \dots$) |
| `Discount` | Float | Promotional discount percentage (0.00 to 0.25) | Valid as planned promotional discount |
| `Units Returned`| Integer | Total units returned during the week | **Target Leakage** — Only valid as lag ($t-1, \dots$) |
| `Location` | String | Geographic market (`USA`, `UK`, `Canada`) | Known in advance (one-hot encoded) |
| `Platform` | String | E-commerce sales channel (`Amazon`, `Walmart`, `iHerb`) | Known in advance (one-hot encoded) |

## Whey Protein Subset Summary
* **Total Observations**: 274 weekly records
* **Date Range**: 2020-01-06 through 2025-03-31
* **Target Statistics (`Units Sold`)**:
  * Mean: 150.60 units
  * Standard Deviation: 12.02 units
  * Median: 149.00 units
  * Min: 122 units
  * Max: 187 units
* **Geographic Distribution**:
  * Canada: 100 weeks (36.5%)
  * UK: 93 weeks (33.9%)
  * USA: 81 weeks (29.6%)
* **Platform Distribution**:
  * Walmart: 96 weeks (35.0%)
  * iHerb: 97 weeks (35.4%)
  * Amazon: 81 weeks (29.6%)
