export interface DatasetScope {
  total_raw_rows: number;
  total_whey_rows: number;
  date_range: string;
  unique_dates: number;
  regions_count: number;
  platforms_count: number;
  target_mean: number;
  target_std: number;
}

export interface LeakageAuditInfo {
  original_leaked_mae: number;
  original_leaked_r2: number;
  flaws_identified: string[];
}

export interface BenchmarkModel {
  Model: string;
  mae: number;
  rmse: number;
  r2: number;
  mape_pct: number;
  mean_residual: number;
  std_residual: number;
  max_error: number;
  directional_accuracy_pct: number;
  n_samples: number;
}

export interface Hyperparameters {
  units_input: number;
  num_layers: number;
  hidden_units: number[];
  activation: string;
  learning_rate: number;
  epochs: number;
}

export interface EpochResult {
  epochs: number;
  val_mae: number;
  units_input: number;
  num_layers: number;
  learning_rate: number;
  activation: string;
}

export interface RegionalMetric {
  region: string;
  observations: number;
  mean: number;
  std: number;
  min: number;
  max: number;
  median: number;
}

export interface PlatformMetric {
  platform: string;
  observations: number;
  mean: number;
  std: number;
  min: number;
  max: number;
  median: number;
}

export interface TimeSeriesPoint {
  step: number;
  date: string;
  actual: number;
  ann: number;
  naive: number;
  ridge: number;
  rolling_3: number;
  expanding_mean: number;
  residual_ann: number;
}

export interface SummaryMetrics {
  project_title: string;
  subtitle: string;
  dataset_scope: DatasetScope;
  leakage_audit: LeakageAuditInfo;
  benchmarks: BenchmarkModel[];
  best_hyperparameters: Hyperparameters;
  epoch_tuning_results: EpochResult[];
  regional_breakdown: RegionalMetric[];
  platform_breakdown: PlatformMetric[];
  walk_forward_series: TimeSeriesPoint[];
}
