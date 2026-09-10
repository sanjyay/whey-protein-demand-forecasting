"""
Evaluation metrics and diagnostic calculations for sales forecasting models.
"""

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def evaluate_forecast(y_true: np.ndarray, y_pred: np.ndarray, model_name: str = "") -> dict:
    """
    Calculate comprehensive forecasting accuracy metrics.
    """
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)
    
    mae = float(mean_absolute_error(y_true, y_pred))
    mse = float(mean_squared_error(y_true, y_pred))
    rmse = float(np.sqrt(mse))
    r2 = float(r2_score(y_true, y_pred))
    
    # MAPE calculation avoiding zero division
    valid_mask = y_true != 0
    if np.any(valid_mask):
        mape = float(np.mean(np.abs((y_true[valid_mask] - y_pred[valid_mask]) / y_true[valid_mask])) * 100)
    else:
        mape = float('nan')
        
    residuals = y_true - y_pred
    max_error = float(np.max(np.abs(residuals)))
    mean_residual = float(np.mean(residuals))
    std_residual = float(np.std(residuals))
    
    # Directional Accuracy (did the model predict the correct direction of week-over-week change?)
    if len(y_true) > 1:
        true_diff = np.diff(y_true)
        pred_diff = np.diff(y_pred)
        direction_match = np.sign(true_diff) == np.sign(pred_diff)
        mda = float(np.mean(direction_match) * 100)
    else:
        mda = float('nan')
        
    return {
        'model': model_name,
        'mae': round(mae, 4),
        'rmse': round(rmse, 4),
        'r2': round(r2, 4),
        'mape_pct': round(mape, 2),
        'mean_residual': round(mean_residual, 4),
        'std_residual': round(std_residual, 4),
        'max_error': round(max_error, 4),
        'directional_accuracy_pct': round(mda, 2),
        'n_samples': int(len(y_true)),
    }


def compile_metrics_table(results_dict: dict[str, dict]) -> pd.DataFrame:
    """Combine dictionary of model evaluations into a styled comparative DataFrame."""
    rows = []
    for name, res in results_dict.items():
        row = {'Model': name}
        row.update({k: v for k, v in res.items() if k != 'model'})
        rows.append(row)
    df = pd.DataFrame(rows)
    return df.sort_values('mae').reset_index(drop=True)
