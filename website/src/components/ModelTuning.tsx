import React, { useState } from 'react';
import { Cpu, Sliders, Layers, Zap, ArrowDown, Activity } from 'lucide-react';
import { SummaryMetrics } from '../types';

interface ModelTuningProps {
  data: SummaryMetrics;
}

export const ModelTuning: React.FC<ModelTuningProps> = ({ data }) => {
  const hp = data.best_hyperparameters;
  const epochResults = data.epoch_tuning_results;
  const [selectedEpoch, setSelectedEpoch] = useState<number>(epochResults[epochResults.length - 1]?.epochs || 50);

  // SVG dimensions for epoch curve
  const chartWidth = 500;
  const chartHeight = 200;
  const padding = 40;
  
  const minEpoch = Math.min(...epochResults.map(e => e.epochs));
  const maxEpoch = Math.max(...epochResults.map(e => e.epochs));
  const minMae = Math.min(...epochResults.map(e => e.val_mae)) * 0.95;
  const maxMae = Math.max(...epochResults.map(e => e.val_mae)) * 1.05;

  const getX = (ep: number) => padding + ((ep - minEpoch) / (maxEpoch - minEpoch)) * (chartWidth - padding * 2);
  const getY = (mae: number) => chartHeight - padding - ((mae - minMae) / (maxMae - minMae)) * (chartHeight - padding * 2);

  const points = epochResults.map(e => `${getX(e.epochs)},${getY(e.val_mae)}`).join(' ');

  return (
    <section id="model" className="py-20 border-b border-slate-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-brand-400 font-semibold mb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <span>Neural Architecture & Tuning</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Artificial Neural Network Modeling
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Revisiting the original Keras / TensorFlow Dense architecture using Keras Tuner RandomSearch. 
            Inputs and target variables are scaled to prevent gradient vanishing, allowing stable convergence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Architecture Visualizer */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-400" />
                <span>Selected Deep Architecture</span>
              </h3>

              <div className="space-y-4">
                {/* Input Layer */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-slate-400 uppercase">Input Layer</div>
                    <div className="text-base font-bold text-white mt-0.5">30 Feature Dimensions</div>
                  </div>
                  <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded border border-blue-500/20">
                    Dense (shape: 30)
                  </span>
                </div>

                <div className="flex justify-center text-slate-600">
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* Hidden Layer 1 */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-slate-400 uppercase">Hidden Layer 1</div>
                    <div className="text-base font-bold text-white mt-0.5">{hp.units_input} Neurons</div>
                  </div>
                  <span className="text-xs font-mono bg-brand-500/10 text-brand-400 px-2.5 py-1 rounded border border-brand-500/20">
                    Activation: {hp.activation}
                  </span>
                </div>

                <div className="flex justify-center text-slate-600">
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* Hidden Layer 2 (if present) */}
                {hp.hidden_units.length > 0 && (
                  <>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-mono text-slate-400 uppercase">Hidden Layer 2</div>
                        <div className="text-base font-bold text-white mt-0.5">{hp.hidden_units[0]} Neurons</div>
                      </div>
                      <span className="text-xs font-mono bg-brand-500/10 text-brand-400 px-2.5 py-1 rounded border border-brand-500/20">
                        Activation: {hp.activation}
                      </span>
                    </div>

                    <div className="flex justify-center text-slate-600">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  </>
                )}

                {/* Output Layer */}
                <div className="bg-slate-950 border border-emerald-900/40 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-emerald-400 uppercase">Output Layer</div>
                    <div className="text-base font-bold text-white mt-0.5">1 Forecast Unit</div>
                  </div>
                  <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/20">
                    Linear (Units Sold)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400">Optimizer</div>
                <div className="text-xs font-bold text-white mt-0.5">Adam</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400">Learning Rate</div>
                <div className="text-xs font-mono text-brand-400 mt-0.5">{hp.learning_rate.toFixed(5)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400">Loss Metric</div>
                <div className="text-xs font-bold text-white mt-0.5">MSE / MAE</div>
              </div>
            </div>
          </div>

          {/* Epoch Sensitivity & Tuner Curve */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span>Epoch Variation Sensitivity</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">Validation MAE</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Evaluating convergence across [10, 25, 50, 75, 100] epochs on the non-leaked dataset.
              </p>

              {/* Interactive SVG Chart */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 overflow-visible">
                  {/* Grid lines */}
                  <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#334155" />

                  {/* Area fill */}
                  <polygon
                    points={`${getX(minEpoch)},${chartHeight - padding} ${points} ${getX(maxEpoch)},${chartHeight - padding}`}
                    fill="url(#blueGrad)"
                    opacity="0.2"
                  />

                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Polyline */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    points={points}
                  />

                  {/* Interactive Points */}
                  {epochResults.map((item) => {
                    const cx = getX(item.epochs);
                    const cy = getY(item.val_mae);
                    const isSelected = selectedEpoch === item.epochs;

                    return (
                      <g key={item.epochs} className="cursor-pointer" onClick={() => setSelectedEpoch(item.epochs)}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isSelected ? 6 : 4}
                          className={`transition-all ${isSelected ? 'fill-brand-400 stroke-white stroke-2' : 'fill-blue-500'}`}
                        />
                        <text
                          x={cx}
                          y={cy - 10}
                          textAnchor="middle"
                          className="text-[10px] font-mono fill-slate-300 font-bold"
                        >
                          {item.val_mae.toFixed(1)}
                        </text>
                        <text
                          x={cx}
                          y={chartHeight - padding + 15}
                          textAnchor="middle"
                          className="text-[10px] font-mono fill-slate-400"
                        >
                          {item.epochs}ep
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Selected Epoch Details Table */}
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="pb-2 text-left">Epochs</th>
                      <th className="pb-2 text-center">Validation MAE</th>
                      <th className="pb-2 text-center">Units</th>
                      <th className="pb-2 text-right">Activation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {epochResults.map((res) => (
                      <tr
                        key={res.epochs}
                        onClick={() => setSelectedEpoch(res.epochs)}
                        className={`cursor-pointer transition-colors ${
                          selectedEpoch === res.epochs ? 'bg-slate-800/80 text-brand-400 font-bold' : 'text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <td className="py-2">{res.epochs} epochs</td>
                        <td className="py-2 text-center">{res.val_mae.toFixed(2)} units</td>
                        <td className="py-2 text-center">{res.units_input}</td>
                        <td className="py-2 text-right uppercase">{res.activation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
