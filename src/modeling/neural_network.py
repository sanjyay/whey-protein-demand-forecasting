"""
Artificial Neural Network (ANN) architecture, tuning, and training procedures.
Preserves the core architectural design of the original study while enforcing valid time-series protocols.
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input, Dropout
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import StandardScaler
import keras_tuner as kt

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'


def build_ann_model(
    input_dim: int,
    units_input: int = 64,
    hidden_units: list[int] = None,
    activation: str = 'relu',
    learning_rate: float = 0.005,
    dropout_rate: float = 0.0
) -> Sequential:
    """Construct an Artificial Neural Network with fully connected Dense layers."""
    if hidden_units is None:
        hidden_units = [32]
        
    model = Sequential()
    model.add(Input(shape=(input_dim,)))
    model.add(Dense(units_input, activation=activation))
    if dropout_rate > 0.0:
        model.add(Dropout(dropout_rate))
        
    for units in hidden_units:
        model.add(Dense(units, activation=activation))
        if dropout_rate > 0.0:
            model.add(Dropout(dropout_rate))
            
    model.add(Dense(1))
    
    optimizer = Adam(learning_rate=learning_rate)
    model.compile(optimizer=optimizer, loss='mse', metrics=['mae'])
    return model


def tune_ann(
    X_train_scaled: np.ndarray,
    y_train: np.ndarray,
    max_trials: int = 10,
    epochs: int = 40,
    seed: int = 42,
    project_name: str = 'ann_tuning'
) -> tuple[dict, Sequential, StandardScaler]:
    """
    Search hyperparameter space using Keras Tuner RandomSearch with target scaling.
    """
    input_dim = X_train_scaled.shape[1]
    y_scaler = StandardScaler()
    y_train_scaled = y_scaler.fit_transform(y_train.reshape(-1, 1)).flatten()
    
    def model_builder(hp):
        model = Sequential()
        model.add(Input(shape=(input_dim,)))
        
        act = hp.Choice('activation', ['relu', 'tanh'])
        model.add(Dense(
            hp.Int('units_input', 32, 128, step=16),
            activation=act
        ))
        
        num_layers = hp.Int('num_layers', 1, 3)
        for i in range(num_layers):
            model.add(Dense(
                hp.Int(f'units_{i}', 16, 128, step=16),
                activation=act
            ))
            
        model.add(Dense(1))
        lr = hp.Float('learning_rate', 1e-4, 1e-2, sampling='log')
        model.compile(optimizer=Adam(learning_rate=lr), loss='mse', metrics=['mae'])
        return model

    tuner_dir = f'/tmp/{project_name}'
    tuner = kt.RandomSearch(
        model_builder,
        objective='val_mae',
        max_trials=max_trials,
        executions_per_trial=1,
        directory=tuner_dir,
        project_name='whey_forecasting',
        seed=seed,
        overwrite=True
    )
    
    tuner.search(
        X_train_scaled,
        y_train_scaled,
        epochs=epochs,
        validation_split=0.2,
        verbose=0
    )
    
    best_hp = tuner.get_best_hyperparameters(1)[0]
    best_model = tuner.get_best_models(num_models=1)[0]
    
    hp_summary = {
        'units_input': int(best_hp.get('units_input')),
        'num_layers': int(best_hp.get('num_layers')),
        'hidden_units': [int(best_hp.get(f'units_{i}')) for i in range(best_hp.get('num_layers'))],
        'activation': str(best_hp.get('activation')),
        'learning_rate': float(best_hp.get('learning_rate')),
        'epochs': int(epochs),
    }
    
    return hp_summary, best_model, y_scaler


def run_epoch_experiments(
    X_train_scaled: np.ndarray,
    y_train: np.ndarray,
    epoch_list: list[int] = [10, 25, 50, 75, 100],
    seed: int = 42
) -> list[dict]:
    """Replicates the epoch variation experiment from the original notebook with target scaling."""
    results = []
    input_dim = X_train_scaled.shape[1]
    y_scaler = StandardScaler()
    y_train_scaled = y_scaler.fit_transform(y_train.reshape(-1, 1)).flatten()
    
    for ep in epoch_list:
        tf.random.set_seed(seed)
        model = Sequential([
            Input(shape=(input_dim,)),
            Dense(64, activation='relu'),
            Dense(32, activation='relu'),
            Dense(1)
        ])
        model.compile(optimizer=Adam(learning_rate=0.005), loss='mse', metrics=['mae'])
        history = model.fit(
            X_train_scaled, y_train_scaled,
            epochs=ep,
            validation_split=0.2,
            verbose=0
        )
        # Scaled MAE back to unscaled units
        val_mae_scaled = float(min(history.history['val_mae']))
        val_mae_units = val_mae_scaled * float(y_scaler.scale_[0])
        
        results.append({
            'epochs': int(ep),
            'val_mae': round(val_mae_units, 4),
            'units_input': 64,
            'num_layers': 2,
            'learning_rate': 0.005,
            'activation': 'relu'
        })
        
    return results
