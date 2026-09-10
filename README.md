# Whey Protein Demand Forecasting

### ANN-Based Weekly Sales Forecasting Across the USA, UK, and Canada

[![Live Site](https://img.shields.io/badge/Live_Case_Study-GitHub_Pages-22c55e?style=for-the-badge&logo=github)](https://sanjyay.github.io/whey-protein-demand-forecasting/)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![TensorFlow 2.21](https://img.shields.io/badge/TensorFlow-2.21-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://tensorflow.org)
[![Keras](https://img.shields.io/badge/Keras-3.15-D00000?style=for-the-badge&logo=keras&logoColor=white)](https://keras.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

An end-to-end, reproducible machine learning demand forecasting study that audits an exploratory time-series notebook (`ts.ipynb`), eliminates severe contemporaneous target leakage, establishes causal forecasting boundaries, benchmarks multiple baseline estimators, and evaluates an Artificial Neural Network (ANN) using expanding-window walk-forward validation across 54 out-of-sample weeks.

**Live Interactive Portfolio Site**: [https://sanjyay.github.io/whey-protein-demand-forecasting/](https://sanjyay.github.io/whey-protein-demand-forecasting/)

---

## 1. Project Overview & Business Problem

Accurate retail demand forecasting for fast-moving nutritional supplements enables supply chain managers to minimize costly stockouts while avoiding over-stocking and spoilage.

This project investigates weekly unit sales demand for **Whey Protein** sold via major e-commerce platforms (**Amazon, Walmart, iHerb**) across three primary geographic markets (**USA, UK, Canada**) over a 5-year observation window (January 2020 to March 2025).

The primary forecasting goal:
$$\text{Predict } \text{Units Sold}_t \text{ strictly using information available at or before time } t-1 \text{ (plus planned marketing inputs for week } t\text{).}$$

---

## 2. Target Leakage Audit (Methodological Refinement)

The original exploratory study (`notebooks/original-study.ipynb`) attempted an ANN forecasting model but contained **contemporaneous target leakage** in several engineered features:

| Leaked Feature | Formula | The Violation | Audit Verification |
|:---|:---|:---|:---|
| `Revenue` | $\text{Price}_t \times \text{Units Sold}_t$ | Contained current week's sales volume algebraically ($\text{Units} = \frac{\text{Revenue}}{\text{Price}}$). | Fitting an OLS regression on original features yielded $R^2 = 1.0000$ and $\text{MAE} = 0.0000$. |
| `Effective_Units_Sold` | $\text{Units Sold}_t - \text{Units Returned}_t$ | Since returns average only 1.49 units, this was an almost identical clone of the target ($r = +0.9950$). | Allowed trivial reconstruction of ground truth. |
| `Rolling_Units` | `Units Sold.rolling(3).mean()` | Unshifted pandas rolling window includes row $t$: $\frac{y_t + y_{t-1} + y_{t-2}}{3}$ ($r = +0.5739$). | Directly leaked ground truth into input matrix. |
| `Return_rate` / `Revenue_per_Unit` | $\frac{\text{Returns}_t}{\text{Units}_t}$, $\frac{\text{Revenue}_t}{\text{Units}_t}$ | Denominators explicitly contain current-week $\text{Units Sold}_t$. | Inverse target leakage. |

### Causal Correction
In the production pipeline (`src/features/engineering.py`), all contemporaneous sales variables are purged at time $t$. Historical variables are strictly lagged ($t-1, t-2, t-3$), and rolling averages are calculated after an explicit `shift(1)` operation:
$$\text{Rolling Mean}_t = \frac{y_{t-1} + y_{t-2} + y_{t-3}}{3}$$

---

## 3. Dataset Description

* **Source**: Kaggle *Supplement Sales Data* (Weekly Expanded Retail Benchmark)
* **Total Observations**: 4,384 records across 16 supplement categories (2020-01-06 to 2025-03-31)
* **Whey Protein Cohort**: 274 consecutive weekly observation dates (1 observation/week across alternating locations and platforms)
* **Target Variable (`Units Sold`)**:
  * Mean: $150.60$ units | Std: $12.02$ units | Min: $122$ | Max: $187$
* **Geographic Distribution**: Canada ($100$ weeks), UK ($93$ weeks), USA ($81$ weeks)
* **Platform Distribution**: Walmart ($96$ weeks), iHerb ($97$ weeks), Amazon ($81$ weeks)
* **Pricing & Promotions**: Average price $\$34.44$ ($\$10.05$ – $\$59.64$), average discount $12.1\%$ ($0\%$ – $25\%$)

---

## 4. Leakage-Safe Feature Architecture

The cleaned feature matrix contains 30 predictor dimensions categorized strictly by causality:

```text
Known in Advance:
  ├── Planned Retail List Price (Price_t)
  ├── Planned Promotional Discount % (Discount_t)
  ├── Planned Promo Dollars (Price_t * Discount_t)
  ├── Calendar Indicators (Week_1 .. Week_5)
  ├── Geographic Markets (Location_UK, Location_USA [ref: Canada])
  └── E-Commerce Platforms (Platform_Amazon, Platform_Walmart [ref: iHerb])

Strict Historical Lags (t-1, t-2, t-3):
  ├── Units Sold (lags 1, 2, 3)
  ├── Price (lags 1, 2, 3)
  ├── Discount (lags 1, 2, 3)
  ├── Revenue (lags 1, 2, 3)
  └── Units Returned (lags 1, 2, 3)

Shifted Historical Rolling Windows:
  ├── Units_Sold.shift(1).rolling(3).mean()   [Short-term baseline demand]
  ├── Units_Sold.shift(1).rolling(3).std()    [Short-term volatility]
  └── Units_Sold.shift(1).rolling(6).mean()   [Medium-term trend]
```

---

## 5. Model Architecture & Hyperparameter Optimization

The Artificial Neural Network architecture was explored using **Keras Tuner RandomSearch** across layer depth, neuron counts, activations, and learning rates:

```text
Input Features (30 dimensions)
          ↓
Dense (64 units, activation: ReLU / Tanh)
          ↓
Dense (32 or 48 units, activation: ReLU / Tanh)
          ↓
Dense (1 output unit, Linear activation)
          ↓
Predicted Units Sold (yt)
```

* **Optimizer**: Adam (learning rate: $0.00064$ to $0.005$)
* **Loss Function**: Mean Squared Error (MSE)
* **Optimization Metric**: Mean Absolute Error (MAE)
* **Target Preprocessing**: Standardized using `StandardScaler` during backpropagation to ensure numerical stability and prevent gradient saturation.

---

## 6. Expanding-Window Walk-Forward Validation Results

To avoid lookahead bias and respect chronological sequencing, the models were evaluated across **54 sequential out-of-sample weeks** (the final 20% test slice). At each step $t \in [214, 268]$:
1. Training slice: historical weeks $[0, \dots, t-1]$
2. Input and target scalers refitted strictly on historical slice
3. Model trained and evaluated on unseen week $t$

| Model | MAE (Units) | RMSE (Units) | $R^2$ | MAPE (%) | Directional Acc (%) |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Expanding Historical Mean** | **9.65** | **12.00** | **-0.01** | **6.42%** | 32.08% |
| **Ridge Regression (L2)** | **10.13** | **12.74** | **-0.14** | **6.75%** | **54.72%** |
| **Tuned ANN Forecast** | **10.81** | **13.64** | **-0.31** | **7.20%** | 45.28% |
| **Rolling 3-Week Mean** | 11.28 | 13.51 | -0.28 | 7.56% | 35.85% |
| **Naive Persistence (Lag-1)** | 13.26 | 16.11 | -0.82 | 8.88% | 32.08% |

---

## 7. Key Findings & Takeaways

1. **Target Leakage Remediation Restores Empirical Honesty**:
   The original study's low MAE was an artifact of contemporaneous inputs. Once purged, true out-of-sample forecast error is established at $\approx 10.8$ units MAE.
2. **ANN Substantially Beats Naive Persistence**:
   Naive persistence ($y_t = y_{t-1}$) yields high error ($13.26$ MAE) because records alternate across distinct geographic markets and platforms. The ANN achieves **$10.81$ MAE**, reducing error by **$18.5\%$** over naive forecasting.
3. **Statistical Baseline Competitiveness**:
   The expanding historical mean ($9.65$ MAE) and Ridge regression ($10.13$ MAE) demonstrate that aggregate sales in this benchmark series fluctuate symmetrically around the conditional mean ($\approx 150$ units).
4. **Target Standardization is Crucial**:
   Unscaled neural networks suffered from output scale mismatch. Standardizing the target prior to MSE calculation stabilized gradient propagation.

---

## 8. Repository Structure

```text
whey-protein-demand-forecasting/
├── README.md                                # Comprehensive technical documentation
├── LICENSE                                  # MIT License
├── requirements.txt                         # Python runtime dependencies
├── package.json                             # Root forwarding scripts for web build
├── run_pipeline.py                          # Master execution runner
│
├── data/
│   ├── README.md                            # Data provenance and schema documentation
│   └── Supplement_Sales_Weekly_Expanded.csv # 4,384-row Kaggle benchmark dataset
│
├── notebooks/
│   ├── original-study.ipynb                 # Preserved original study (historical artifact)
│   └── forecasting-analysis.ipynb           # Clean, reproducible Jupyter notebook
│
├── src/
│   ├── preprocessing/cleaner.py             # Ingestion, validation, and cohort filtering
│   ├── features/engineering.py              # Temporal features, lags, rolling stats & audit
│   ├── modeling/baselines.py                # Naive, Rolling, Expanding Mean & Ridge baselines
│   ├── modeling/neural_network.py           # Keras Dense builder, tuner & epoch experiments
│   ├── modeling/walk_forward.py             # Expanding window walk-forward validation
│   └── evaluation/
│       ├── metrics.py                       # MAE, RMSE, R2, MAPE, Directional Accuracy
│       └── plots.py                         # Publication-grade Matplotlib figure generator
│
├── outputs/
│   ├── figures/                             # High-resolution PNG publication charts
│   └── metrics/                             # JSON & CSV serialized benchmark outputs
│
├── website/                                 # Vite + React + TypeScript portfolio site
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts                       # Configured for GitHub Pages base path
│   ├── tailwind.config.js
│   └── src/
│       ├── components/                      # Analytical dashboard UI components
│       ├── data/metrics.ts                  # Baked verified pipeline metrics
│       └── types.ts                         # Strict TypeScript data contracts
│
└── .github/
    └── workflows/deploy.yml                 # Automated GitHub Pages CI/CD workflow
```

---

## 9. Local Reproduction & Setup

### Python Pipeline Reproduction

```bash
# 1. Clone repository
git clone https://github.com/sanjyay/whey-protein-demand-forecasting.git
cd whey-protein-demand-forecasting

# 2. Set up Python virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run master end-to-end pipeline
python run_pipeline.py

# 5. (Optional) Run Jupyter notebook
jupyter notebook notebooks/forecasting-analysis.ipynb
```

### Portfolio Website Local Development

```bash
# Install dependencies and launch Vite development server
yarn dev

# Or build static production distribution
yarn build
yarn preview
```

---

## 10. Limitations

* **Single-Product Cohort**: The model specifically forecasts Whey Protein. Cross-product substitution (e.g. Creatine, BCAA) is not evaluated.
* **Alternating Observation Format**: The benchmark dataset captures one primary market/platform observation per week rather than continuous parallel series for all 9 market-channel combinations.
* **Unobserved External Demand Shocks**: Key retail drivers such as digital advertising spend, social media campaigns, retail inventory stockouts, and competitor pricing are unobserved.

---

## 11. License & Citation

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.  
Dataset credit: Kaggle *Supplement Sales Data* (Weekly Expanded).
