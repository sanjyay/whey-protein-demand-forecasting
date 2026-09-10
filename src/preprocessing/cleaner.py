"""
Data ingestion and preprocessing module for Supplement Sales forecasting.
Loads raw weekly transaction data, performs validation, and extracts the Whey Protein cohort.
"""

import os
import pandas as pd
import numpy as np


def load_raw_data(filepath: str) -> pd.DataFrame:
    """Load the raw weekly supplement sales dataset."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset file not found at: {filepath}")
    
    df = pd.read_csv(filepath)
    df['Date'] = pd.to_datetime(df['Date'])
    return df


def extract_whey_protein(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extract Whey Protein sales observations and verify temporal ordering.
    Each week represents one observation across alternating market locations and platforms.
    """
    whey = df[df['Product Name'] == 'Whey Protein'].copy()
    whey = whey.sort_values('Date').reset_index(drop=True)
    return whey


def get_data_summary(df: pd.DataFrame) -> dict:
    """Compute structural metrics and summary statistics for raw and subset data."""
    return {
        'total_rows': int(len(df)),
        'total_columns': int(df.shape[1]),
        'date_min': df['Date'].min().strftime('%Y-%m-%d'),
        'date_max': df['Date'].max().strftime('%Y-%m-%d'),
        'unique_products': int(df['Product Name'].nunique()),
        'unique_dates': int(df['Date'].nunique()),
        'regions': list(df['Location'].unique()),
        'platforms': list(df['Platform'].unique()),
    }
