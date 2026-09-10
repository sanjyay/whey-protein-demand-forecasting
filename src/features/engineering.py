"""
Feature engineering module for Whey Protein Demand Forecasting.
Provides strict temporal feature extraction without target leakage,
along with an audit generator to reproduce the original notebook's leaked feature set.
"""

import pandas as pd
import numpy as np


def add_calendar_features(df: pd.DataFrame) -> pd.DataFrame:
    """Extract week of month and calendar indicators."""
    df = df.copy()
    # Week of Month calculation matching original study: ((day - 1) // 7) + 1
    df['Week of Month'] = df['Date'].apply(lambda x: ((x.day - 1) // 7) + 1)
    for w in [1, 2, 3, 4, 5]:
        df[f'Week_{w}'] = (df['Week of Month'] == w).astype(float)
    return df


def create_leakage_safe_features(df_whey: pd.DataFrame) -> tuple[pd.DataFrame, list[str], str]:
    """
    Construct strictly leakage-safe features for one-step-ahead weekly sales forecasting.
    
    Forecasting Boundary:
      Predict Units Sold at week t using ONLY:
      1. Known in advance: Planned retail price, planned promotional discount, location, platform, week-of-month.
      2. Historical observations: Units sold, prices, discounts, revenues from t-1, t-2, t-3.
      3. Historical rolling statistics: Prior 3-week and 6-week rolling means/stds shifted by 1 period.
      
    Excluded (Target Leakage):
      - Revenue at week t (Price * Units Sold)
      - Units Returned at week t
      - Effective Units Sold (Units Sold - Units Returned)
      - Return Rate (Units Returned / Units Sold)
      - Unshifted rolling windows (includes Units Sold at week t)
    """
    df = df_whey.sort_values('Date').reset_index(drop=True).copy()
    df = add_calendar_features(df)
    
    # One-hot encode Categoricals (drop reference levels: Canada, iHerb)
    df = pd.get_dummies(df, columns=['Location', 'Platform'], dtype=float)
    df = df.drop(columns=['Location_Canada', 'Platform_iHerb'], errors='ignore')
    
    # Planned retail & promotion features known prior to weekly selling window
    df['Planned_Discount_Amount'] = df['Price'] * df['Discount']
    
    # Historical Lags (t-1, t-2, t-3)
    for lag in range(1, 4):
        df[f'Units_Sold_lag_{lag}'] = df['Units Sold'].shift(lag)
        df[f'Price_lag_{lag}'] = df['Price'].shift(lag)
        df[f'Discount_lag_{lag}'] = df['Discount'].shift(lag)
        df[f'Revenue_lag_{lag}'] = df['Revenue'].shift(lag)
        df[f'Units_Returned_lag_{lag}'] = df['Units Returned'].shift(lag)
        
    # Strictly Historical Rolling Windows (shift(1) ensures t is never included)
    df['Units_Sold_rolling_3_mean'] = df['Units Sold'].shift(1).rolling(3).mean()
    df['Units_Sold_rolling_3_std'] = df['Units Sold'].shift(1).rolling(3).std().fillna(0)
    df['Units_Sold_rolling_6_mean'] = df['Units Sold'].shift(1).rolling(6).mean()
    
    # Drop contemporaneous leakage columns & drop initial lag NaNs
    leakage_cols = ['Revenue', 'Units Returned', 'Date', 'Product Name', 'Category', 'Week of Month']
    clean_df = df.drop(columns=leakage_cols, errors='ignore').dropna().reset_index(drop=True)
    
    target_col = 'Units Sold'
    feature_cols = [c for c in clean_df.columns if c != target_col]
    
    return clean_df, feature_cols, target_col


def create_original_leaked_features(df_whey: pd.DataFrame) -> tuple[pd.DataFrame, list[str], str]:
    """
    Reproduces the exact feature engineering steps from the original study (ts.ipynb cells 18-24).
    Contains severe contemporaneous target leakage:
      - Revenue (Price * Units Sold)
      - Effective_Units_Sold (Units Sold - Units Returned)
      - Return_rate (Units Returned / Units Sold)
      - Rolling_Units (Unshifted rolling 3-period mean of Units Sold)
      - Revenue_per_Unit (Revenue / Units Sold)
    """
    df = df_whey.sort_values('Date').reset_index(drop=True).copy()
    df['Week of Month'] = df['Date'].apply(lambda x: f"Week {((x.day - 1) // 7) + 1}")
    df['Week of Month'] = df['Week of Month'].str.extract(r'(\d)').astype(int)
    df = pd.get_dummies(df, columns=['Week of Month'], prefix='Week', dtype=float)
    
    df = pd.get_dummies(df, columns=['Location', 'Platform'], dtype=float)
    df = df.drop(columns=['Location_Canada', 'Platform_iHerb'], errors='ignore')
    
    # Leaked contemporaneous calculations
    df['Discount_amount'] = df['Price'] * df['Discount']
    df['Return_rate'] = df['Units Returned'] / df['Units Sold'].replace(0, 1)
    df['Effective_Units_Sold'] = df['Units Sold'] - df['Units Returned']
    df['Revenue_per_Unit'] = df['Revenue'] / df['Units Sold'].replace(0, 1)
    df['Units_Sold_Last_Week'] = df['Units Sold'].shift(1)
    df['Rolling_Units'] = df['Units Sold'].rolling(window=3).mean()
    df = df.dropna()
    
    df_training = df.drop(columns=['Date', 'Product Name', 'Category'], errors='ignore')
    for col in ['Units Sold', 'Price', 'Revenue', 'Discount']:
        for i in range(1, 4):
            df_training[f'{col}_lag_{i}'] = df_training[col].shift(i)
            
    df_training = df_training.dropna().reset_index(drop=True)
    target_col = 'Units Sold'
    feature_cols = [c for c in df_training.columns if c != target_col]
    
    return df_training, feature_cols, target_col
