import React, { useState } from 'react';
import { TrendingUp, BarChart2, Eye, Info, Check } from 'lucide-react';
import { SummaryMetrics, TimeSeriesPoint } from '../types';

interface WalkForwardProps {
  data: SummaryMetrics;
}

export const WalkForwardValidation: React.FC<WalkForwardProps> = ({ data }) => {
  const series: TimeSeriesPoint[] = data.walk_forward_series;
  
  // Model toggle state
  const [showAnn, setShowAnn] = useState(true);
  const [showRidge, setShowRidge] = useState(true);
  const [showNaive, setShowNaive] = useState(false);
  const [showRolling, setShowRolling] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 800;
  const height = 320;
  const padding = { top: 20, right: 30, bottom: 40, left: 45 };

  const actuals = series.map(d => d.actual);
  const minVal = Math.min(...actuals, ...series.map(d => d.ann)) - 5;
  const maxVal = Math.max(...actuals, ...series.map(d => d.ann)) + 5;

  const getX = (idx: number) => padding.left + (idx / (series.length - 1)) * (width - padding.left - padding.right);
  const getY = (val: number) => height - padding.bottom - ((val - minVal) / (maxVal - minVal)) * (height - padding.top - padding.bottom);

  // Path generators
  const actualPath = series.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.actual)}`).join(' ');
  const annPath = series.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.ann)}`).join(' ');
  const ridgePath = series.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.ridge)}`).join(' ');
  const naivePath = series.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.naive)}`).join(' ');
  const rollingPath = series.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.rolling_3)}`).join(' ');

  const activePoint = hoverIndex !== null ? series[hoverIndex] : series[series.length - 1];

  return (
    <section id="forecasts" className="py-20 border-b border-slate-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-brand-400 font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Out-of-Sample Evaluation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Expanding-Window Walk-Forward Validation
            </h2>
          </div>
          <p className="mt-3 lg:mt-0 text-sm text-slate-400 max-w-md">
            54 sequential out-of-sample weekly forecasts. Scalers and neural weights are strictly refitted at each time step using historical observations only.
          </p>
        </div>

        {/* Model Toggles & Live Inspect Header */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono mr-2">Toggle Series:</span>
              
              <button
                onClick={() => setShowAnn(!showAnn)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  showAnn ? 'bg-brand-500/20 text-brand-400 border-brand-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-brand-400" />
                <span>ANN Forecast</span>
              </button>

              <button
                onClick={() => setShowRidge(!showRidge)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  showRidge ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span>Ridge Regression</span>
              </button>

              <button
                onClick={() => setShowRolling(!showRolling)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  showRolling ? 'bg-teal-500/20 text-teal-400 border-teal-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                <span>Rolling 3-Wk</span>
              </button>

              <button
                onClick={() => setShowNaive(!showNaive)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  showNaive ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Naive (Lag 1)</span>
              </button>
            </div>

            {/* Live Inspection pill */}
            {activePoint && (
              <div className="flex items-center gap-3 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">{activePoint.date} (Wk {activePoint.step})</span>
                <span className="text-slate-600">|</span>
                <span className="text-white">Actual: <strong>{activePoint.actual}</strong></span>
                <span className="text-slate-600">|</span>
                <span className="text-brand-400">ANN: <strong>{activePoint.ann}</strong></span>
                <span className="text-slate-600">|</span>
                <span className={activePoint.residual_ann >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  Err: {activePoint.residual_ann > 0 ? `+${activePoint.residual_ann}` : activePoint.residual_ann}
                </span>
              </div>
            )}
          </div>

          {/* Main Time-Series SVG Chart */}
          <div className="mt-6 relative">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-72 sm:h-80 select-none overflow-visible"
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* Grid Lines */}
              {[130, 140, 150, 160, 170, 180].map(val => (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={getY(val)}
                    x2={width - padding.right}
                    y2={getY(val)}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 10}
                    y={getY(val) + 3}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-slate-400"
                  >
                    {val}
                  </text>
                </g>
              ))}

              {/* Benchmark Paths */}
              {showNaive && (
                <path d={naivePath} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
              )}
              {showRolling && (
                <path d={rollingPath} fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.8" />
              )}
              {showRidge && (
                <path d={ridgePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.85" />
              )}

              {/* Ground Truth Actual Path */}
              <path d={actualPath} fill="none" stroke="#f8fafc" strokeWidth="2.5" />

              {/* ANN Forecast Path */}
              {showAnn && (
                <path d={annPath} fill="none" stroke="#22c55e" strokeWidth="2.5" />
              )}

              {/* Data points for Actual */}
              {series.map((d, i) => (
                <circle
                  key={`act-${i}`}
                  cx={getX(i)}
                  cy={getY(d.actual)}
                  r={hoverIndex === i ? 5 : 2.5}
                  className={`transition-all ${hoverIndex === i ? 'fill-white stroke-slate-950 stroke-2' : 'fill-slate-300'}`}
                />
              ))}

              {/* Data points for ANN */}
              {showAnn && series.map((d, i) => (
                <circle
                  key={`ann-${i}`}
                  cx={getX(i)}
                  cy={getY(d.ann)}
                  r={hoverIndex === i ? 5 : 2.5}
                  className={`transition-all ${hoverIndex === i ? 'fill-brand-400 stroke-slate-950 stroke-2' : 'fill-brand-500'}`}
                />
              ))}

              {/* Vertical Guide Line on Hover */}
              {hoverIndex !== null && (
                <line
                  x1={getX(hoverIndex)}
                  y1={padding.top}
                  x2={getX(hoverIndex)}
                  y2={height - padding.bottom}
                  stroke="#64748b"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}

              {/* Invisible interactive hover rects */}
              {series.map((_, i) => (
                <rect
                  key={`hover-${i}`}
                  x={getX(i) - (width - padding.left - padding.right) / series.length / 2}
                  y={padding.top}
                  width={(width - padding.left - padding.right) / series.length}
                  height={height - padding.top - padding.bottom}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => setHoverIndex(i)}
                />
              ))}

              {/* X-axis time ticks */}
              {series.filter((_, idx) => idx % 9 === 0 || idx === series.length - 1).map((d, idx) => (
                <text
                  key={idx}
                  x={getX(series.indexOf(d))}
                  y={height - 15}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-slate-400"
                >
                  {d.date.slice(5)}
                </text>
              ))}
            </svg>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-white" /> Actual Sales</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-brand-500" /> ANN Forecast</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500" /> Ridge L2</span>
            </div>
            <span className="font-mono">Hover over the curve to inspect individual weekly forecast deviations</span>
          </div>
        </div>
      </div>
    </section>
  );
};
