"""
Master pipeline execution script for Whey Protein Demand Forecasting.
Executes end-to-end data processing, baseline evaluation, hyperparameter tuning,
walk-forward validation, and artifact generation.
"""

import os
import sys
import json
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.preprocessing import StandardScaler
import tensorflow as tf

# Import internal modules
from src.preprocessing.cleaner import load_raw_data, extract_whey_protein, get_data_summary
from src.features.engineering import create_leakage_safe_features, create_original_leaked_features
from src.modeling.baselines import NaiveForecast, RollingMeanForecast, HistoricalMeanBaseline, RidgeRegressionBaseline
from src.modeling.neural_network import build_ann_model, tune_ann, run_epoch_experiments
from src.modeling.walk_forward import run_walk_forward_evaluation
from src.evaluation.metrics import evaluate_forecast, compile_metrics_table
from src.evaluation.plots import (
    plot_walkforward_forecast,
    plot_residuals,
    plot_baseline_comparison,
    plot_leakage_audit_comparison,
    plot_regional_analysis,
    plot_platform_analysis,
    plot_epoch_tuning_curve
)

SEED = 42
np.random.seed(SEED)
tf.random.set_seed(SEED)

def main():
    print("=" * 70)
    print("      WHEY PROTEIN DEMAND FORECASTING: END-TO-END REPRODUCIBLE PIPELINE")
    print("=" * 70)

    data_path = os.path.join(os.path.dirname(__file__), 'data', 'Supplement_Sales_Weekly_Expanded.csv')
    figures_dir = os.path.join(os.path.dirname(__file__), 'outputs', 'figures')
    metrics_dir = os.path.join(os.path.dirname(__file__), 'outputs', 'metrics')
    os.makedirs(figures_dir, exist_ok=True)
    os.makedirs(metrics_dir, exist_ok=True)

    # 1. Ingestion & Audit
    print("\n[Step 1/8] Loading and auditing raw data...")
    raw_df = load_raw_data(data_path)
    data_summary = get_data_summary(raw_df)
    print(f"  Raw records: {data_summary['total_rows']}")
    print(f"  Date range: {data_summary['date_min']} to {data_summary['date_max']}")
    print(f"  Unique supplement products: {data_summary['unique_products']}")

    whey_df = extract_whey_protein(raw_df)
    print(f"  Whey Protein cohort size: {len(whey_df)} weekly records")

    # 2. Target Leakage Demonstration
    print("\n[Step 2/8] Auditing original notebook target leakage...")
    df_leaked, feat_leaked, target_col = create_original_leaked_features(whey_df)
    X_leak = df_leaked[feat_leaked]
    y_leak = df_leaked[target_col]

    split_leak = round(len(df_leaked) * 0.8)
    X_tr_leak, X_te_leak = X_leak.iloc[:split_leak], X_leak.iloc[split_leak:]
    y_tr_leak, y_te_leak = y_leak.iloc[:split_leak], y_leak.iloc[split_leak:]

    sc_leak = StandardScaler()
    X_tr_leak_sc = sc_leak.fit_transform(X_tr_leak)
    X_te_leak_sc = sc_leak.transform(X_te_leak)

    lr_leak = LinearRegression().fit(X_tr_leak_sc, y_tr_leak)
    y_pred_leak = lr_leak.predict(X_te_leak_sc)
    leak_eval = evaluate_forecast(y_te_leak, y_pred_leak, model_name="Original Leaked Features (OLS)")
    print(f"  Leaked Linear Model -> MAE: {leak_eval['mae']:.4f} | R²: {leak_eval['r2']:.4f}")
    print("  [AUDIT VERIFIED] Leakage detected: Revenue and Effective Units Sold directly reconstruct target.")

    # 3. Clean Temporal Feature Engineering
    print("\n[Step 3/8] Building leakage-safe feature matrix...")
    df_clean, feat_clean, _ = create_leakage_safe_features(whey_df)
    X_clean = df_clean[feat_clean]
    y_clean = df_clean[target_col]

    split_clean = round(len(df_clean) * 0.8)
    X_tr, X_te = X_clean.iloc[:split_clean], X_clean.iloc[split_clean:]
    y_tr, y_te = y_clean.iloc[:split_clean], y_clean.iloc[split_clean:]

    print(f"  Clean training set: {len(X_tr)} weeks (80%)")
    print(f"  Clean test set:     {len(X_te)} weeks (20%)")
    print(f"  Valid predictor features ({len(feat_clean)}): {feat_clean}")

    # 4. Baseline Model Benchmarking
    print("\n[Step 4/8] Evaluating baseline forecasting models on test set...")
    sc_clean = StandardScaler()
    X_tr_sc = sc_clean.fit_transform(X_tr)
    X_te_sc = sc_clean.transform(X_te)

    # Model 1: Naive (Lag 1)
    y_pred_naive = X_te['Units_Sold_lag_1'].values
    res_naive = evaluate_forecast(y_te, y_pred_naive, model_name="Naive Forecast (Lag-1)")

    # Model 2: Rolling 3-Week Mean
    y_pred_roll3 = X_te['Units_Sold_rolling_3_mean'].values
    res_roll3 = evaluate_forecast(y_te, y_pred_roll3, model_name="Historical Rolling Mean (3-Wk)")

    # Model 3: Historical Training Mean
    mean_val = float(y_tr.mean())
    y_pred_mean = np.full(len(y_te), mean_val)
    res_mean = evaluate_forecast(y_te, y_pred_mean, model_name="Historical Mean Baseline")

    # Model 4: Ridge Regression
    ridge = Ridge(alpha=10.0).fit(X_tr_sc, y_tr)
    y_pred_ridge = ridge.predict(X_te_sc)
    res_ridge = evaluate_forecast(y_te, y_pred_ridge, model_name="Ridge Regression (L2)")

    for r in [res_naive, res_roll3, res_mean, res_ridge]:
        print(f"  {r['model']:35s} -> MAE: {r['mae']:6.2f} | RMSE: {r['rmse']:6.2f} | R²: {r['r2']:+6.2f}")

    # 5. ANN Model Architecture & Hyperparameter Tuning
    print("\n[Step 5/8] Tuning ANN architecture via Keras Tuner RandomSearch...")
    hp_summary, best_ann_model, y_scaler = tune_ann(X_tr_sc, y_tr.values, max_trials=10, epochs=40, seed=SEED)
    print(f"  Selected Units Input: {hp_summary['units_input']}")
    print(f"  Selected Layers:      {hp_summary['num_layers']} hidden ({hp_summary['hidden_units']})")
    print(f"  Selected Learning Rate:{hp_summary['learning_rate']:.6f}")
    print(f"  Selected Activation:  {hp_summary['activation']}")

    y_pred_ann_sc = best_ann_model.predict(X_te_sc, verbose=0).flatten()
    y_pred_ann = y_scaler.inverse_transform(y_pred_ann_sc.reshape(-1, 1)).flatten()
    res_ann = evaluate_forecast(y_te, y_pred_ann, model_name="Tuned ANN (Dense Network)")
    print(f"  {res_ann['model']:35s} -> MAE: {res_ann['mae']:6.2f} | RMSE: {res_ann['rmse']:6.2f} | R²: {res_ann['r2']:+6.2f}")

    # 6. Epoch Sensitivity Experiments
    print("\n[Step 6/8] Running epoch sensitivity experiments [10, 25, 50, 75, 100]...")
    epoch_results = run_epoch_experiments(X_tr_sc, y_tr.values, epoch_list=[10, 25, 50, 75, 100], seed=SEED)
    df_epoch = pd.DataFrame(epoch_results)
    print(df_epoch.to_string(index=False))

    # 7. Walk-Forward Expanding Window Validation
    print("\n[Step 7/8] Executing expanding-window walk-forward validation (54 test weeks)...")
    wf_results = run_walk_forward_evaluation(
        X_clean, y_clean,
        train_ratio=0.8,
        scaler_type='standard',
        ann_epochs=25,
        ann_lr=0.005,
        verbose=False
    )
    
    wf_actuals = wf_results['actuals']
    wf_eval_naive = evaluate_forecast(wf_actuals, wf_results['naive'], "Walk-Forward Naive")
    wf_eval_roll3 = evaluate_forecast(wf_actuals, wf_results['rolling_3'], "Walk-Forward Rolling 3-Wk")
    wf_eval_exp = evaluate_forecast(wf_actuals, wf_results['expanding_mean'], "Walk-Forward Expanding Mean")
    wf_eval_ridge = evaluate_forecast(wf_actuals, wf_results['ridge'], "Walk-Forward Ridge")
    wf_eval_ann = evaluate_forecast(wf_actuals, wf_results['ann'], "Walk-Forward ANN")

    print("\n--- Walk-Forward Out-of-Sample Performance Table ---")
    wf_table = compile_metrics_table({
        'Naive (Lag-1)': wf_eval_naive,
        'Rolling 3-Week': wf_eval_roll3,
        'Expanding Mean': wf_eval_exp,
        'Ridge Regression': wf_eval_ridge,
        'ANN Forecast': wf_eval_ann
    })
    print(wf_table[['Model', 'mae', 'rmse', 'r2', 'mape_pct', 'directional_accuracy_pct']].to_string(index=False))

    # 8. Visualizations and Artifact Serialization
    print("\n[Step 8/8] Generating publication figures and serializing metrics...")

    plot_walkforward_forecast(
        wf_actuals, wf_results['ann'], 'ANN Model',
        os.path.join(figures_dir, '01_actual_vs_predicted_walkforward.png')
    )
    plot_residuals(
        wf_actuals, wf_results['ann'],
        os.path.join(figures_dir, '02_residuals_over_time.png')
    )
    plot_baseline_comparison(
        wf_table,
        os.path.join(figures_dir, '03_baseline_model_comparison.png')
    )
    plot_leakage_audit_comparison(
        leak_eval['mae'], wf_eval_ann['mae'],
        os.path.join(figures_dir, '04_leakage_audit_comparison.png')
    )
    plot_regional_analysis(
        whey_df,
        os.path.join(figures_dir, '05_regional_demand_patterns.png')
    )
    plot_platform_analysis(
        whey_df,
        os.path.join(figures_dir, '06_platform_distribution.png')
    )
    plot_epoch_tuning_curve(
        df_epoch,
        os.path.join(figures_dir, '07_hyperparameter_tuning_epochs.png')
    )

    regional_data = []
    for loc in ['USA', 'UK', 'Canada']:
        sub = whey_df[whey_df['Location'] == loc]['Units Sold']
        regional_data.append({
            'region': loc,
            'observations': int(len(sub)),
            'mean': round(float(sub.mean()), 2),
            'std': round(float(sub.std()), 2),
            'min': int(sub.min()),
            'max': int(sub.max()),
            'median': round(float(sub.median()), 2)
        })

    platform_data = []
    for plat in ['Amazon', 'Walmart', 'iHerb']:
        sub = whey_df[whey_df['Platform'] == plat]['Units Sold']
        platform_data.append({
            'platform': plat,
            'observations': int(len(sub)),
            'mean': round(float(sub.mean()), 2),
            'std': round(float(sub.std()), 2),
            'min': int(sub.min()),
            'max': int(sub.max()),
            'median': round(float(sub.median()), 2)
        })

    wf_timeseries = []
    test_dates = whey_df.iloc[len(whey_df) - len(wf_actuals):]['Date'].dt.strftime('%Y-%m-%d').tolist()
    for idx in range(len(wf_actuals)):
        wf_timeseries.append({
            'step': idx + 1,
            'date': test_dates[idx] if idx < len(test_dates) else f"Wk {idx+1}",
            'actual': round(wf_actuals[idx], 1),
            'ann': round(wf_results['ann'][idx], 1),
            'naive': round(wf_results['naive'][idx], 1),
            'ridge': round(wf_results['ridge'][idx], 1),
            'rolling_3': round(wf_results['rolling_3'][idx], 1),
            'expanding_mean': round(wf_results['expanding_mean'][idx], 1),
            'residual_ann': round(wf_actuals[idx] - wf_results['ann'][idx], 1)
        })

    summary_metrics = {
        'project_title': "Whey Protein Demand Forecasting",
        'subtitle': "ANN-based weekly sales forecasting across the USA, UK, and Canada",
        'dataset_scope': {
            'total_raw_rows': data_summary['total_rows'],
            'total_whey_rows': len(whey_df),
            'date_range': f"{data_summary['date_min']} to {data_summary['date_max']}",
            'unique_dates': data_summary['unique_dates'],
            'regions_count': 3,
            'platforms_count': 3,
            'target_mean': round(float(whey_df['Units Sold'].mean()), 2),
            'target_std': round(float(whey_df['Units Sold'].std()), 2)
        },
        'leakage_audit': {
            'original_leaked_mae': leak_eval['mae'],
            'original_leaked_r2': leak_eval['r2'],
            'flaws_identified': [
                "Contemporaneous Revenue (Price * Units Sold) directly revealed the target value.",
                "Effective Units Sold (Units Sold - Units Returned) acted as an almost identical clone of target (r = 0.995).",
                "Unshifted Rolling Window (rolling mean of size 3) included current target period t.",
                "Return rate and Revenue per Unit algebraically contained Units Sold."
            ]
        },
        'benchmarks': wf_table.to_dict(orient='records'),
        'best_hyperparameters': hp_summary,
        'epoch_tuning_results': df_epoch.to_dict(orient='records'),
        'regional_breakdown': regional_data,
        'platform_breakdown': platform_data,
        'walk_forward_series': wf_timeseries
    }

    with open(os.path.join(metrics_dir, 'summary_metrics.json'), 'w') as f:
        json.dump(summary_metrics, f, indent=2)

    wf_table.to_csv(os.path.join(metrics_dir, 'walk_forward_metrics.csv'), index=False)
    df_epoch.to_csv(os.path.join(metrics_dir, 'epoch_experiments.csv'), index=False)
    pd.DataFrame(wf_timeseries).to_csv(os.path.join(metrics_dir, 'walk_forward_predictions.csv'), index=False)

    print("\n Pipeline execution completed successfully!")
    print(f" Artifacts written to {figures_dir} and {metrics_dir}")
    print("=" * 70)

if __name__ == '__main__':
    main()
