"""
Expanding window walk-forward validation for time-series forecasting.
Strictly fits input and target scalers at each step without leaking future information.
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.linear_model import Ridge
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input
from tensorflow.keras.optimizers import Adam
from tqdm import tqdm


def run_walk_forward_evaluation(
    X: pd.DataFrame,
    y: pd.Series,
    train_ratio: float = 0.8,
    scaler_type: str = 'standard',
    ann_epochs: int = 25,
    ann_lr: float = 0.005,
    verbose: bool = True
) -> dict:
    """
    Executes expanding window walk-forward validation across the test period.
    Compares:
      1. Naive (lag 1)
      2. Rolling 3-Week Mean
      3. Expanding Mean
      4. Ridge Regression
      5. ANN (Target-scaled for numerical stability)
    """
    history_size = round(len(X) * train_ratio)
    total_steps = len(X) - history_size
    
    actuals = []
    preds_naive = []
    preds_roll3 = []
    preds_exp_mean = []
    preds_ridge = []
    preds_ann = []
    
    input_dim = X.shape[1]
    
    iterator = range(history_size, len(X))
    if verbose:
        iterator = tqdm(iterator, desc=f"Walk-Forward ({scaler_type}, ep={ann_epochs})")
        
    for i in iterator:
        X_tr = X.iloc[:i]
        y_tr = y.iloc[:i]
        X_te = X.iloc[i:i+1]
        y_te = y.iloc[i]
        
        actuals.append(float(y_te))
        
        # 1. Naive Baseline (Lag 1)
        preds_naive.append(float(X_te['Units_Sold_lag_1'].values[0]))
        
        # 2. Rolling 3-week mean baseline
        preds_roll3.append(float(X_te['Units_Sold_rolling_3_mean'].values[0]))
        
        # 3. Expanding Historical Mean
        preds_exp_mean.append(float(np.mean(y_tr)))
        
        # 4. Scaler setup for machine learning inputs and targets
        if scaler_type == 'minmax':
            scaler_X = MinMaxScaler()
            scaler_y = MinMaxScaler()
        else:
            scaler_X = StandardScaler()
            scaler_y = StandardScaler()
            
        X_tr_sc = scaler_X.fit_transform(X_tr)
        X_te_sc = scaler_X.transform(X_te)
        y_tr_sc = scaler_y.fit_transform(y_tr.values.reshape(-1, 1)).flatten()
        
        # 5. Ridge Regression
        ridge = Ridge(alpha=10.0)
        ridge.fit(X_tr_sc, y_tr)
        preds_ridge.append(float(ridge.predict(X_te_sc)[0]))
        
        # 6. ANN Model with scaled target
        tf.random.set_seed(42 + i)
        model = Sequential([
            Input(shape=(input_dim,)),
            Dense(64, activation='relu'),
            Dense(32, activation='relu'),
            Dense(1)
        ])
        model.compile(optimizer=Adam(learning_rate=ann_lr), loss='mse', metrics=['mae'])
        model.fit(X_tr_sc, y_tr_sc, epochs=ann_epochs, batch_size=16, verbose=0)
        
        pred_sc = model.predict(X_te_sc, verbose=0)[0][0]
        ann_pred = float(scaler_y.inverse_transform([[pred_sc]])[0][0])
        preds_ann.append(ann_pred)
        
    return {
        'actuals': actuals,
        'naive': preds_naive,
        'rolling_3': preds_roll3,
        'expanding_mean': preds_exp_mean,
        'ridge': preds_ridge,
        'ann': preds_ann,
        'history_size': history_size,
        'total_steps': total_steps,
        'scaler_type': scaler_type,
        'ann_epochs': ann_epochs
    }
