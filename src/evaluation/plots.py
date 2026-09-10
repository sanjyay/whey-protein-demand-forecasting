"""
High-resolution visualization generator for demand forecasting study.
Produces publication-grade plots saved directly to outputs/figures/.
"""

import os
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd

# Set global aesthetic style
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#cbd5e1'
plt.rcParams['axes.linewidth'] = 0.8
plt.rcParams['grid.color'] = '#f1f5f9'
plt.rcParams['grid.linestyle'] = '--'
plt.rcParams['grid.alpha'] = 0.7


def plot_walkforward_forecast(actuals, predictions, model_label, output_path):
    """Plot actual vs predicted time series across the walk-forward evaluation window."""
    plt.figure(figsize=(12, 6), dpi=300)
    steps = np.arange(len(actuals))
    
    plt.plot(steps, actuals, label='Actual Units Sold', color='#0f172a', linewidth=2.0, marker='o', markersize=4)
    plt.plot(steps, predictions, label=f'Forecast ({model_label})', color='#2563eb', linewidth=2.0, linestyle='--', marker='s', markersize=4)
    
    plt.fill_between(steps, actuals, predictions, color='#93c5fd', alpha=0.25, label='Absolute Forecast Error')
    
    plt.title('Walk-Forward Out-of-Sample Demand Forecast: Actual vs Predicted', fontsize=13, fontweight='bold', pad=12)
    plt.xlabel('Evaluation Week (Expanding Window Steps)', fontsize=11, labelpad=8)
    plt.ylabel('Weekly Units Sold', fontsize=11, labelpad=8)
    plt.legend(frameon=True, facecolor='white', framealpha=0.9, loc='upper right')
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()


def plot_residuals(actuals, predictions, output_path):
    """Plot residual time series and error distribution."""
    residuals = np.array(actuals) - np.array(predictions)
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5), dpi=300, gridspec_kw={'width_ratios': [2, 1]})
    
    ax1.plot(residuals, color='#dc2626', marker='o', markersize=4, linestyle='-', linewidth=1.2)
    ax1.axhline(0, color='#0f172a', linestyle='--', linewidth=1)
    ax1.fill_between(range(len(residuals)), residuals, 0, alpha=0.15, color='#ef4444')
    ax1.set_title('Forecast Residuals Over Time (Actual - Predicted)', fontsize=12, fontweight='bold')
    ax1.set_xlabel('Evaluation Week', fontsize=10)
    ax1.set_ylabel('Error (Units)', fontsize=10)
    ax1.grid(True)
    
    sns.histplot(residuals, kde=True, ax=ax2, color='#3b82f6', edgecolor='#1d4ed8')
    ax2.axvline(0, color='#0f172a', linestyle='--', linewidth=1)
    ax2.set_title('Residual Error Distribution', fontsize=12, fontweight='bold')
    ax2.set_xlabel('Error (Units)', fontsize=10)
    ax2.set_ylabel('Density', fontsize=10)
    ax2.grid(True)
    
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()


def plot_baseline_comparison(metrics_df, output_path):
    """Generate bar chart comparing MAE and RMSE across all benchmark models."""
    plt.figure(figsize=(10, 5.5), dpi=300)
    
    models = metrics_df['Model']
    x = np.arange(len(models))
    width = 0.35
    
    fig, ax = plt.subplots(figsize=(10, 5.5), dpi=300)
    rects1 = ax.bar(x - width/2, metrics_df['mae'], width, label='MAE (Units)', color='#3b82f6')
    rects2 = ax.bar(x + width/2, metrics_df['rmse'], width, label='RMSE (Units)', color='#93c5fd')
    
    ax.set_ylabel('Error Magnitude (Units Sold)', fontsize=11)
    ax.set_title('Forecasting Benchmark Comparison: Baseline Models vs ANN', fontsize=13, fontweight='bold', pad=12)
    ax.set_xticks(x)
    ax.set_xticklabels(models, rotation=15, ha='right', fontsize=10)
    ax.legend(frameon=True, facecolor='white')
    ax.grid(axis='y')
    
    # Label bars with values
    for rect in rects1:
        height = rect.get_height()
        ax.annotate(f'{height:.2f}', xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=8, fontweight='bold')
    for rect in rects2:
        height = rect.get_height()
        ax.annotate(f'{height:.2f}', xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=8)
        
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()


def plot_leakage_audit_comparison(leaked_mae, clean_mae, output_path):
    """Visualizes the effect of removing target leakage."""
    fig, ax = plt.subplots(figsize=(8, 5), dpi=300)
    bars = ax.bar(['Leaked Pipeline\n(Price*Units & Returns)', 'Valid Forecasting\n(Temporal Boundaries)'], 
                  [leaked_mae, clean_mae], color=['#ef4444', '#10b981'], width=0.45)
    
    ax.set_ylabel('Test Mean Absolute Error (MAE)', fontsize=11)
    ax.set_title('Impact of Target Leakage Audit on Model Performance', fontsize=13, fontweight='bold', pad=12)
    ax.grid(axis='y')
    
    for bar in bars:
        height = bar.get_height()
        ax.annotate(f'{height:.2f} units', xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 4), textcoords="offset points", ha='center', va='bottom', fontsize=11, fontweight='bold')
                    
    ax.set_ylim(0, max(clean_mae, leaked_mae) * 1.35)
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()


def plot_regional_analysis(df_whey, output_path):
    """Visualizes sales distribution and average sales by geographic market."""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5), dpi=300)
    
    # Boxplot of sales distribution
    sns.boxplot(x='Location', y='Units Sold', data=df_whey, palette=['#3b82f6', '#10b981', '#f59e0b'], ax=ax1, width=0.5)
    ax1.set_title('Regional Demand Distribution (Units Sold)', fontsize=12, fontweight='bold')
    ax1.set_xlabel('Market Region', fontsize=10)
    ax1.set_ylabel('Weekly Units Sold', fontsize=10)
    ax1.grid(True)
    
    # Regional Mean & Volume bar
    reg_summary = df_whey.groupby('Location')['Units Sold'].agg(['mean', 'count']).reset_index()
    sns.barplot(x='Location', y='mean', data=reg_summary, palette=['#3b82f6', '#10b981', '#f59e0b'], ax=ax2, width=0.45)
    ax2.set_title('Average Weekly Sales Volume by Region', fontsize=12, fontweight='bold')
    ax2.set_xlabel('Market Region', fontsize=10)
    ax2.set_ylabel('Average Units Sold', fontsize=10)
    ax2.grid(axis='y')
    
    for p in ax2.patches:
        ax2.annotate(f'{p.get_height():.1f}', (p.get_x() + p.get_width() / 2., p.get_height() - 15),
                     ha='center', va='center', fontsize=10, color='white', fontweight='bold')
                     
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()


def plot_platform_analysis(df_whey, output_path):
    """Visualizes sales across Amazon, Walmart, and iHerb."""
    fig, ax = plt.subplots(figsize=(9, 5), dpi=300)
    sns.boxplot(x='Platform', y='Units Sold', data=df_whey, palette=['#6366f1', '#ec4899', '#14b8a6'], ax=ax, width=0.45)
    ax.set_title('E-Commerce Platform Sales Distribution', fontsize=13, fontweight='bold', pad=12)
    ax.set_xlabel('Sales Channel', fontsize=11)
    ax.set_ylabel('Weekly Units Sold', fontsize=11)
    ax.grid(True)
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()


def plot_epoch_tuning_curve(results_df, output_path):
    """Plot validation MAE against training epochs."""
    plt.figure(figsize=(8, 5), dpi=300)
    plt.plot(results_df['epochs'], results_df['val_mae'], marker='o', color='#2563eb', linewidth=2, markersize=6)
    plt.title('Hyperparameter Tuning: Validation MAE vs Training Epochs', fontsize=13, fontweight='bold', pad=12)
    plt.xlabel('Training Epochs', fontsize=11)
    plt.ylabel('Validation MAE (Units)', fontsize=11)
    plt.grid(True)
    
    for _, row in results_df.iterrows():
        plt.annotate(f"{row['val_mae']:.2f}", (row['epochs'], row['val_mae']),
                     textcoords="offset points", xytext=(0, 8), ha='center', fontsize=9, fontweight='bold')
                     
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()
