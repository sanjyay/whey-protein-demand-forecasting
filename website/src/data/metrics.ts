import { SummaryMetrics } from "../types";

export const metricsData: SummaryMetrics = {
  "project_title": "Whey Protein Demand Forecasting",
  "subtitle": "ANN-based weekly sales forecasting across the USA, UK, and Canada",
  "dataset_scope": {
    "total_raw_rows": 4384,
    "total_whey_rows": 274,
    "date_range": "2020-01-06 to 2025-03-31",
    "unique_dates": 274,
    "regions_count": 3,
    "platforms_count": 3,
    "target_mean": 150.6,
    "target_std": 12.02
  },
  "leakage_audit": {
    "original_leaked_mae": 0.0,
    "original_leaked_r2": 1.0,
    "flaws_identified": [
      "Contemporaneous Revenue (Price * Units Sold) directly revealed the target value.",
      "Effective Units Sold (Units Sold - Units Returned) acted as an almost identical clone of target (r = 0.995).",
      "Unshifted Rolling Window (rolling mean of size 3) included current target period t.",
      "Return rate and Revenue per Unit algebraically contained Units Sold."
    ]
  },
  "benchmarks": [
    {
      "Model": "Expanding Mean",
      "mae": 9.6491,
      "rmse": 11.9962,
      "r2": -0.0112,
      "mape_pct": 6.42,
      "mean_residual": 1.2008,
      "std_residual": 11.9359,
      "max_error": 26.6255,
      "directional_accuracy_pct": 32.08,
      "n_samples": 54
    },
    {
      "Model": "Ridge Regression",
      "mae": 10.1265,
      "rmse": 12.735,
      "r2": -0.1395,
      "mape_pct": 6.75,
      "mean_residual": 1.5011,
      "std_residual": 12.6462,
      "max_error": 29.6089,
      "directional_accuracy_pct": 54.72,
      "n_samples": 54
    },
    {
      "Model": "ANN Forecast",
      "mae": 10.8131,
      "rmse": 13.6427,
      "r2": -0.3078,
      "mape_pct": 7.2,
      "mean_residual": 0.6201,
      "std_residual": 13.6286,
      "max_error": 34.4053,
      "directional_accuracy_pct": 45.28,
      "n_samples": 54
    },
    {
      "Model": "Rolling 3-Week",
      "mae": 11.2778,
      "rmse": 13.512,
      "r2": -0.2828,
      "mape_pct": 7.56,
      "mean_residual": -0.3765,
      "std_residual": 13.5067,
      "max_error": 31.6667,
      "directional_accuracy_pct": 35.85,
      "n_samples": 54
    },
    {
      "Model": "Naive (Lag-1)",
      "mae": 13.2593,
      "rmse": 16.1107,
      "r2": -0.8237,
      "mape_pct": 8.88,
      "mean_residual": -0.3704,
      "std_residual": 16.1065,
      "max_error": 42.0,
      "directional_accuracy_pct": 32.08,
      "n_samples": 54
    }
  ],
  "best_hyperparameters": {
    "units_input": 64,
    "num_layers": 1,
    "hidden_units": [
      48
    ],
    "activation": "tanh",
    "learning_rate": 0.0006426228293037218,
    "epochs": 40
  },
  "epoch_tuning_results": [
    {
      "epochs": 10,
      "val_mae": 8.9647,
      "units_input": 64,
      "num_layers": 2,
      "learning_rate": 0.005,
      "activation": "relu"
    },
    {
      "epochs": 25,
      "val_mae": 9.4661,
      "units_input": 64,
      "num_layers": 2,
      "learning_rate": 0.005,
      "activation": "relu"
    },
    {
      "epochs": 50,
      "val_mae": 8.7007,
      "units_input": 64,
      "num_layers": 2,
      "learning_rate": 0.005,
      "activation": "relu"
    },
    {
      "epochs": 75,
      "val_mae": 8.4145,
      "units_input": 64,
      "num_layers": 2,
      "learning_rate": 0.005,
      "activation": "relu"
    },
    {
      "epochs": 100,
      "val_mae": 9.1149,
      "units_input": 64,
      "num_layers": 2,
      "learning_rate": 0.005,
      "activation": "relu"
    }
  ],
  "regional_breakdown": [
    {
      "region": "USA",
      "observations": 81,
      "mean": 152.4,
      "std": 12.44,
      "min": 124,
      "max": 187,
      "median": 150.0
    },
    {
      "region": "UK",
      "observations": 93,
      "mean": 151.63,
      "std": 11.6,
      "min": 126,
      "max": 178,
      "median": 150.0
    },
    {
      "region": "Canada",
      "observations": 100,
      "mean": 148.18,
      "std": 11.79,
      "min": 122,
      "max": 178,
      "median": 147.0
    }
  ],
  "platform_breakdown": [
    {
      "platform": "Amazon",
      "observations": 81,
      "mean": 151.98,
      "std": 11.8,
      "min": 130,
      "max": 187,
      "median": 150.0
    },
    {
      "platform": "Walmart",
      "observations": 96,
      "mean": 151.83,
      "std": 12.77,
      "min": 123,
      "max": 178,
      "median": 150.0
    },
    {
      "platform": "iHerb",
      "observations": 97,
      "mean": 148.23,
      "std": 11.17,
      "min": 122,
      "max": 175,
      "median": 148.0
    }
  ],
  "walk_forward_series": [
    {
      "step": 1,
      "date": "2024-03-25",
      "actual": 148.0,
      "ann": 148.4,
      "naive": 168.0,
      "ridge": 147.1,
      "rolling_3": 163.7,
      "expanding_mean": 150.3,
      "residual_ann": -0.4
    },
    {
      "step": 2,
      "date": "2024-04-01",
      "actual": 148.0,
      "ann": 160.1,
      "naive": 148.0,
      "ridge": 154.2,
      "rolling_3": 158.7,
      "expanding_mean": 150.3,
      "residual_ann": -12.1
    },
    {
      "step": 3,
      "date": "2024-04-08",
      "actual": 128.0,
      "ann": 149.7,
      "naive": 148.0,
      "ridge": 141.3,
      "rolling_3": 154.7,
      "expanding_mean": 150.3,
      "residual_ann": -21.7
    },
    {
      "step": 4,
      "date": "2024-04-15",
      "actual": 153.0,
      "ann": 147.1,
      "naive": 128.0,
      "ridge": 145.7,
      "rolling_3": 141.3,
      "expanding_mean": 150.2,
      "residual_ann": 5.9
    },
    {
      "step": 5,
      "date": "2024-04-22",
      "actual": 162.0,
      "ann": 164.2,
      "naive": 153.0,
      "ridge": 150.1,
      "rolling_3": 143.0,
      "expanding_mean": 150.2,
      "residual_ann": -2.2
    },
    {
      "step": 6,
      "date": "2024-04-29",
      "actual": 155.0,
      "ann": 166.9,
      "naive": 162.0,
      "ridge": 150.1,
      "rolling_3": 147.7,
      "expanding_mean": 150.3,
      "residual_ann": -11.9
    },
    {
      "step": 7,
      "date": "2024-05-06",
      "actual": 163.0,
      "ann": 153.2,
      "naive": 155.0,
      "ridge": 158.5,
      "rolling_3": 156.7,
      "expanding_mean": 150.3,
      "residual_ann": 9.8
    },
    {
      "step": 8,
      "date": "2024-05-13",
      "actual": 149.0,
      "ann": 147.6,
      "naive": 163.0,
      "ridge": 139.3,
      "rolling_3": 160.0,
      "expanding_mean": 150.4,
      "residual_ann": 1.4
    },
    {
      "step": 9,
      "date": "2024-05-20",
      "actual": 136.0,
      "ann": 152.0,
      "naive": 149.0,
      "ridge": 151.1,
      "rolling_3": 155.7,
      "expanding_mean": 150.3,
      "residual_ann": -16.0
    },
    {
      "step": 10,
      "date": "2024-05-27",
      "actual": 130.0,
      "ann": 155.0,
      "naive": 136.0,
      "ridge": 148.1,
      "rolling_3": 149.3,
      "expanding_mean": 150.3,
      "residual_ann": -25.0
    },
    {
      "step": 11,
      "date": "2024-06-03",
      "actual": 138.0,
      "ann": 146.2,
      "naive": 130.0,
      "ridge": 150.9,
      "rolling_3": 138.3,
      "expanding_mean": 150.2,
      "residual_ann": -8.2
    },
    {
      "step": 12,
      "date": "2024-06-10",
      "actual": 143.0,
      "ann": 154.1,
      "naive": 138.0,
      "ridge": 144.2,
      "rolling_3": 134.7,
      "expanding_mean": 150.1,
      "residual_ann": -11.1
    },
    {
      "step": 13,
      "date": "2024-06-17",
      "actual": 138.0,
      "ann": 140.7,
      "naive": 143.0,
      "ridge": 154.2,
      "rolling_3": 137.0,
      "expanding_mean": 150.1,
      "residual_ann": -2.7
    },
    {
      "step": 14,
      "date": "2024-06-24",
      "actual": 130.0,
      "ann": 164.4,
      "naive": 138.0,
      "ridge": 158.0,
      "rolling_3": 139.7,
      "expanding_mean": 150.1,
      "residual_ann": -34.4
    },
    {
      "step": 15,
      "date": "2024-07-01",
      "actual": 144.0,
      "ann": 139.1,
      "naive": 130.0,
      "ridge": 154.7,
      "rolling_3": 137.0,
      "expanding_mean": 150.0,
      "residual_ann": 4.9
    },
    {
      "step": 16,
      "date": "2024-07-08",
      "actual": 158.0,
      "ann": 145.7,
      "naive": 144.0,
      "ridge": 149.7,
      "rolling_3": 137.3,
      "expanding_mean": 149.9,
      "residual_ann": 12.3
    },
    {
      "step": 17,
      "date": "2024-07-15",
      "actual": 149.0,
      "ann": 153.5,
      "naive": 158.0,
      "ridge": 148.5,
      "rolling_3": 144.0,
      "expanding_mean": 150.0,
      "residual_ann": -4.5
    },
    {
      "step": 18,
      "date": "2024-07-22",
      "actual": 154.0,
      "ann": 155.1,
      "naive": 149.0,
      "ridge": 152.7,
      "rolling_3": 150.3,
      "expanding_mean": 150.0,
      "residual_ann": -1.1
    },
    {
      "step": 19,
      "date": "2024-07-29",
      "actual": 151.0,
      "ann": 142.0,
      "naive": 154.0,
      "ridge": 147.4,
      "rolling_3": 153.7,
      "expanding_mean": 150.0,
      "residual_ann": 9.0
    },
    {
      "step": 20,
      "date": "2024-08-05",
      "actual": 168.0,
      "ann": 150.2,
      "naive": 151.0,
      "ridge": 152.9,
      "rolling_3": 151.3,
      "expanding_mean": 150.0,
      "residual_ann": 17.8
    },
    {
      "step": 21,
      "date": "2024-08-12",
      "actual": 126.0,
      "ann": 151.9,
      "naive": 168.0,
      "ridge": 155.6,
      "rolling_3": 157.7,
      "expanding_mean": 150.1,
      "residual_ann": -25.9
    },
    {
      "step": 22,
      "date": "2024-08-19",
      "actual": 163.0,
      "ann": 148.5,
      "naive": 126.0,
      "ridge": 151.5,
      "rolling_3": 148.3,
      "expanding_mean": 150.0,
      "residual_ann": 14.5
    },
    {
      "step": 23,
      "date": "2024-08-26",
      "actual": 165.0,
      "ann": 146.9,
      "naive": 163.0,
      "ridge": 156.5,
      "rolling_3": 152.3,
      "expanding_mean": 150.0,
      "residual_ann": 18.1
    },
    {
      "step": 24,
      "date": "2024-09-02",
      "actual": 153.0,
      "ann": 148.9,
      "naive": 165.0,
      "ridge": 146.3,
      "rolling_3": 151.3,
      "expanding_mean": 150.1,
      "residual_ann": 4.1
    },
    {
      "step": 25,
      "date": "2024-09-09",
      "actual": 175.0,
      "ann": 148.3,
      "naive": 153.0,
      "ridge": 151.1,
      "rolling_3": 160.3,
      "expanding_mean": 150.1,
      "residual_ann": 26.7
    },
    {
      "step": 26,
      "date": "2024-09-16",
      "actual": 143.0,
      "ann": 142.6,
      "naive": 175.0,
      "ridge": 147.1,
      "rolling_3": 164.3,
      "expanding_mean": 150.2,
      "residual_ann": 0.4
    },
    {
      "step": 27,
      "date": "2024-09-23",
      "actual": 158.0,
      "ann": 151.0,
      "naive": 143.0,
      "ridge": 149.3,
      "rolling_3": 157.0,
      "expanding_mean": 150.2,
      "residual_ann": 7.0
    },
    {
      "step": 28,
      "date": "2024-09-30",
      "actual": 153.0,
      "ann": 142.3,
      "naive": 158.0,
      "ridge": 141.1,
      "rolling_3": 158.7,
      "expanding_mean": 150.2,
      "residual_ann": 10.7
    },
    {
      "step": 29,
      "date": "2024-10-07",
      "actual": 140.0,
      "ann": 145.8,
      "naive": 153.0,
      "ridge": 149.1,
      "rolling_3": 151.3,
      "expanding_mean": 150.2,
      "residual_ann": -5.8
    },
    {
      "step": 30,
      "date": "2024-10-14",
      "actual": 146.0,
      "ann": 137.6,
      "naive": 140.0,
      "ridge": 144.9,
      "rolling_3": 150.3,
      "expanding_mean": 150.2,
      "residual_ann": 8.4
    },
    {
      "step": 31,
      "date": "2024-10-21",
      "actual": 156.0,
      "ann": 147.4,
      "naive": 146.0,
      "ridge": 153.8,
      "rolling_3": 146.3,
      "expanding_mean": 150.2,
      "residual_ann": 8.6
    },
    {
      "step": 32,
      "date": "2024-10-28",
      "actual": 150.0,
      "ann": 151.3,
      "naive": 156.0,
      "ridge": 153.9,
      "rolling_3": 147.3,
      "expanding_mean": 150.2,
      "residual_ann": -1.3
    },
    {
      "step": 33,
      "date": "2024-11-04",
      "actual": 156.0,
      "ann": 161.6,
      "naive": 150.0,
      "ridge": 146.8,
      "rolling_3": 150.7,
      "expanding_mean": 150.2,
      "residual_ann": -5.6
    },
    {
      "step": 34,
      "date": "2024-11-11",
      "actual": 163.0,
      "ann": 146.2,
      "naive": 156.0,
      "ridge": 152.8,
      "rolling_3": 154.0,
      "expanding_mean": 150.2,
      "residual_ann": 16.8
    },
    {
      "step": 35,
      "date": "2024-11-18",
      "actual": 153.0,
      "ann": 149.5,
      "naive": 163.0,
      "ridge": 151.5,
      "rolling_3": 156.3,
      "expanding_mean": 150.3,
      "residual_ann": 3.5
    },
    {
      "step": 36,
      "date": "2024-11-25",
      "actual": 159.0,
      "ann": 178.2,
      "naive": 153.0,
      "ridge": 156.5,
      "rolling_3": 157.3,
      "expanding_mean": 150.3,
      "residual_ann": -19.2
    },
    {
      "step": 37,
      "date": "2024-12-02",
      "actual": 168.0,
      "ann": 149.2,
      "naive": 159.0,
      "ridge": 141.4,
      "rolling_3": 158.3,
      "expanding_mean": 150.3,
      "residual_ann": 18.8
    },
    {
      "step": 38,
      "date": "2024-12-09",
      "actual": 150.0,
      "ann": 152.9,
      "naive": 168.0,
      "ridge": 152.2,
      "rolling_3": 160.0,
      "expanding_mean": 150.4,
      "residual_ann": -2.9
    },
    {
      "step": 39,
      "date": "2024-12-16",
      "actual": 143.0,
      "ann": 137.7,
      "naive": 150.0,
      "ridge": 149.8,
      "rolling_3": 159.0,
      "expanding_mean": 150.4,
      "residual_ann": 5.3
    },
    {
      "step": 40,
      "date": "2024-12-23",
      "actual": 169.0,
      "ann": 172.3,
      "naive": 143.0,
      "ridge": 152.3,
      "rolling_3": 153.7,
      "expanding_mean": 150.3,
      "residual_ann": -3.3
    },
    {
      "step": 41,
      "date": "2024-12-30",
      "actual": 131.0,
      "ann": 134.7,
      "naive": 169.0,
      "ridge": 152.3,
      "rolling_3": 154.0,
      "expanding_mean": 150.4,
      "residual_ann": -3.7
    },
    {
      "step": 42,
      "date": "2025-01-06",
      "actual": 148.0,
      "ann": 149.1,
      "naive": 131.0,
      "ridge": 149.4,
      "rolling_3": 147.7,
      "expanding_mean": 150.3,
      "residual_ann": -1.1
    },
    {
      "step": 43,
      "date": "2025-01-13",
      "actual": 138.0,
      "ann": 161.1,
      "naive": 148.0,
      "ridge": 150.4,
      "rolling_3": 149.3,
      "expanding_mean": 150.3,
      "residual_ann": -23.1
    },
    {
      "step": 44,
      "date": "2025-01-20",
      "actual": 155.0,
      "ann": 144.0,
      "naive": 138.0,
      "ridge": 150.7,
      "rolling_3": 139.0,
      "expanding_mean": 150.3,
      "residual_ann": 11.0
    },
    {
      "step": 45,
      "date": "2025-01-27",
      "actual": 170.0,
      "ann": 155.7,
      "naive": 155.0,
      "ridge": 150.1,
      "rolling_3": 147.0,
      "expanding_mean": 150.3,
      "residual_ann": 14.3
    },
    {
      "step": 46,
      "date": "2025-02-03",
      "actual": 177.0,
      "ann": 147.7,
      "naive": 170.0,
      "ridge": 151.3,
      "rolling_3": 154.3,
      "expanding_mean": 150.4,
      "residual_ann": 29.3
    },
    {
      "step": 47,
      "date": "2025-02-10",
      "actual": 158.0,
      "ann": 145.0,
      "naive": 177.0,
      "ridge": 151.2,
      "rolling_3": 167.3,
      "expanding_mean": 150.5,
      "residual_ann": 13.0
    },
    {
      "step": 48,
      "date": "2025-02-17",
      "actual": 145.0,
      "ann": 164.3,
      "naive": 158.0,
      "ridge": 156.9,
      "rolling_3": 168.3,
      "expanding_mean": 150.5,
      "residual_ann": -19.3
    },
    {
      "step": 49,
      "date": "2025-02-24",
      "actual": 150.0,
      "ann": 148.0,
      "naive": 145.0,
      "ridge": 151.6,
      "rolling_3": 160.0,
      "expanding_mean": 150.5,
      "residual_ann": 2.0
    },
    {
      "step": 50,
      "date": "2025-03-03",
      "actual": 160.0,
      "ann": 149.0,
      "naive": 150.0,
      "ridge": 143.5,
      "rolling_3": 151.0,
      "expanding_mean": 150.5,
      "residual_ann": 11.0
    },
    {
      "step": 51,
      "date": "2025-03-10",
      "actual": 140.0,
      "ann": 141.2,
      "naive": 160.0,
      "ridge": 146.8,
      "rolling_3": 151.7,
      "expanding_mean": 150.5,
      "residual_ann": -1.2
    },
    {
      "step": 52,
      "date": "2025-03-17",
      "actual": 166.0,
      "ann": 147.0,
      "naive": 140.0,
      "ridge": 143.9,
      "rolling_3": 150.0,
      "expanding_mean": 150.5,
      "residual_ann": 19.0
    },
    {
      "step": 53,
      "date": "2025-03-24",
      "actual": 158.0,
      "ann": 153.0,
      "naive": 166.0,
      "ridge": 150.7,
      "rolling_3": 155.3,
      "expanding_mean": 150.5,
      "residual_ann": 5.0
    },
    {
      "step": 54,
      "date": "2025-03-31",
      "actual": 148.0,
      "ann": 159.5,
      "naive": 158.0,
      "ridge": 145.7,
      "rolling_3": 154.7,
      "expanding_mean": 150.6,
      "residual_ann": -11.5
    }
  ]
};
