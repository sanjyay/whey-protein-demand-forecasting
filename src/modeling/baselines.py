"""
Baseline forecasting models for establishing demand performance benchmarks.
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge, LinearRegression
from sklearn.preprocessing import StandardScaler


class NaiveForecast:
    """Naive persistence forecast: y_hat_t = y_{t-1}."""
    def fit(self, X, y):
        return self
        
    def predict(self, df_features: pd.DataFrame) -> np.ndarray:
        # Use lag 1 units sold feature
        if 'Units_Sold_lag_1' in df_features.columns:
            return df_features['Units_Sold_lag_1'].values
        raise KeyError("Units_Sold_lag_1 feature required for NaiveForecast")


class RollingMeanForecast:
    """Historical rolling mean forecast using previous k periods."""
    def __init__(self, window: int = 3):
        self.window = window

    def fit(self, X, y):
        return self

    def predict(self, df_features: pd.DataFrame) -> np.ndarray:
        col = f'Units_Sold_rolling_{self.window}_mean'
        if col in df_features.columns:
            return df_features[col].values
        # Fallback calculation from lags
        lag_cols = [f'Units_Sold_lag_{i}' for i in range(1, self.window + 1)]
        return df_features[lag_cols].mean(axis=1).values


class HistoricalMeanBaseline:
    """Forecasts the historical training average across all future test periods."""
    def __init__(self):
        self.mean_val = None

    def fit(self, X, y):
        self.mean_val = float(np.mean(y))
        return self

    def predict(self, df_features: pd.DataFrame) -> np.ndarray:
        return np.full(len(df_features), self.mean_val)


class RidgeRegressionBaseline:
    """L2 Regularized Linear Regression using StandardScaler."""
    def __init__(self, alpha: float = 10.0):
        self.alpha = alpha
        self.scaler = StandardScaler()
        self.model = Ridge(alpha=alpha)

    def fit(self, X_train: pd.DataFrame, y_train: pd.Series):
        X_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_scaled, y_train)
        return self

    def predict(self, X_test: pd.DataFrame) -> np.ndarray:
        X_scaled = self.scaler.transform(X_test)
        return self.model.predict(X_scaled)
