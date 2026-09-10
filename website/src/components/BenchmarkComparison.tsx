import React from 'react';
import { BarChart3, Award, TrendingDown, CheckCircle, HelpCircle } from 'lucide-react';
import { SummaryMetrics, BenchmarkModel } from '../types';

interface BenchmarkComparisonProps {
  data: SummaryMetrics;
}

export const BenchmarkComparison: React.FC<BenchmarkComparisonProps> = ({ data }) => {
  const benchmarks = data.benchmarks;
  const bestModel = benchmarks[0];
  const naiveModel = benchmarks.find(b => b.Model.includes('Naive')) || benchmarks[benchmarks.length - 1];

  const maxMae = Math.max(...benchmarks.map(b => b.mae)) * 1.1;

  return (
    <section id="validation" className="py-20 border-b border-slate-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-brand-400 font-semibold mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Comparative Evaluation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Baseline vs. Neural Network Benchmarks
            </h2>
          </div>
          <p className="mt-3 md:mt-0 text-sm text-slate-400 max-w-md">
            Rigorous comparison of walk-forward out-of-sample forecasting performance against simple and statistical baselines.
          </p>
        </div>

        {/* Bar Comparison Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-12 shadow-xl">
          <h3 className="text-sm font-mono uppercase text-slate-400 mb-6">
            Walk-Forward Mean Absolute Error (MAE in Units Sold — Lower is Better)
          </h3>

          <div className="space-y-4">
            {benchmarks.map((model) => {
              const widthPct = (model.mae / maxMae) * 100;
              const isBest = model.Model === bestModel.Model;
              const isAnn = model.Model.includes('ANN');

              return (
                <div key={model.Model} className="space-y-1.5">
                  <div className="flex justify-between text-xs sm:text-sm font-medium">
                    <span className={`flex items-center gap-2 ${isBest ? 'text-brand-400 font-bold' : isAnn ? 'text-emerald-300 font-bold' : 'text-slate-300'}`}>
                      {model.Model}
                      {isBest && <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">Lowest Error</span>}
                    </span>
                    <span className="font-mono text-white">
                      <strong>{model.mae.toFixed(2)}</strong> units <span className="text-slate-500">| RMSE: {model.rmse.toFixed(2)}</span>
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-7 rounded-lg overflow-hidden p-1 border border-slate-800/80 flex items-center">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className={`h-full rounded-md transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-mono font-bold ${
                        isBest
                          ? 'bg-gradient-to-r from-emerald-600 to-brand-500 text-slate-950'
                          : isAnn
                          ? 'bg-gradient-to-r from-teal-600 to-emerald-500 text-slate-950'
                          : model.Model.includes('Naive')
                          ? 'bg-gradient-to-r from-amber-700 to-amber-500 text-slate-950'
                          : 'bg-gradient-to-r from-blue-700 to-blue-500 text-slate-950'
                      }`}
                    >
                      {model.mae.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-xl mb-12">
          <div className="p-4 sm:p-6 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Out-of-Sample Performance Metric Scorecard</h3>
            <p className="text-xs text-slate-400 mt-1">Evaluated across all 54 sequential walk-forward periods.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-xs uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Model</th>
                  <th className="py-3 px-4 font-semibold text-right">MAE</th>
                  <th className="py-3 px-4 font-semibold text-right">RMSE</th>
                  <th className="py-3 px-4 font-semibold text-right">R²</th>
                  <th className="py-3 px-4 font-semibold text-right">MAPE (%)</th>
                  <th className="py-3 px-4 font-semibold text-right">Directional Acc (%)</th>
                  <th className="py-3 px-4 font-semibold text-center">Sample Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {benchmarks.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2">
                      {row.Model.includes('ANN') && <Award className="w-4 h-4 text-brand-400" />}
                      {row.Model}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-brand-400">{row.mae.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">{row.rmse.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">{row.r2.toFixed(3)}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">{row.mape_pct.toFixed(1)}%</td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">{row.directional_accuracy_pct.toFixed(1)}%</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">{row.n_samples}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Phase 8 Honest Insight Callout */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 relative">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-2">
                Phase 8 Audit Insight: Does the Neural Network Beat Simple Baselines?
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                Weekly Whey Protein demand in this retail dataset fluctuates moderately (standard deviation of ~12 units)
                around a stable central tendency (~150 units). Consequently:
              </p>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                <li>
                  <strong>Naive Persistence (Lag-1) Fails:</strong> Simply assuming next week's sales equals last week's sales yields an error of <strong>{naiveModel.mae.toFixed(2)} units</strong> because consecutive observations alternate across geographic regions (USA vs UK vs Canada) and platforms (Walmart vs Amazon vs iHerb).
                </li>
                <li>
                  <strong>Statistical Baseline Parity:</strong> The expanding historical mean and Ridge regression achieve <strong>~{bestModel.mae.toFixed(2)} units MAE</strong>. The ANN effectively learns to predict near the conditional mean, avoiding catastrophic lag overreaction.
                </li>
                <li>
                  <strong>Honest ML Conclusion:</strong> Neural complexity alone cannot overcome lack of explanatory variance in weakly autocorrelated commercial series without external demand drivers (marketing spend, holiday promotions, stockouts).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
