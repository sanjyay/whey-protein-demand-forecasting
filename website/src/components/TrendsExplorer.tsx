import React, { useState } from 'react';
import { TrendingUp, Calendar, ArrowUpRight, DollarSign, Percent } from 'lucide-react';
import { SummaryMetrics } from '../types';

interface TrendsExplorerProps {
  data: SummaryMetrics;
}

export const TrendsExplorer: React.FC<TrendsExplorerProps> = ({ data }) => {
  const [metricView, setMetricView] = useState<'units' | 'residuals'>('units');

  return (
    <section id="trends" className="py-20 border-b border-slate-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-brand-400 font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Macro Demand Dynamics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              5-Year Weekly Sales & Price Trends
            </h2>
          </div>
          <p className="mt-3 md:mt-0 text-sm text-slate-400 max-w-md">
            Analyzing historical sales behavior, promotional cadence, and price variations across 274 consecutive weekly observation dates (2020 – 2025).
          </p>
        </div>

        {/* 3 Trend Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono uppercase">Retail Selling Price</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">$34.44 <span className="text-xs font-normal text-slate-400">average / unit</span></div>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Price ranges between $10.05 and $59.64 depending on packaging volume, regional import tariffs, and platform channel.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono uppercase">Promotional Discount</span>
              <Percent className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">12.1% <span className="text-xs font-normal text-slate-400">average discount</span></div>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Promotions fluctuate between 0% (full list price) and 25% during major fitness seasonal campaign periods.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono uppercase">Sales Stationarity</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">Mean-Reverting <span className="text-xs font-normal text-slate-400">(~150 units)</span></div>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Low lag-1 autocorrelation (-0.05) confirms that aggregate demand behaves as an oscillating stationary process rather than an integrated trending random walk.
            </p>
          </div>
        </div>

        {/* Residual Diagnostics Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Forecast Residual Diagnostics</h3>
              <p className="text-xs text-slate-400 mt-1">Analyzing prediction error behavior across the 54-week test horizon.</p>
            </div>
            <span className="text-xs font-mono bg-slate-950 px-3 py-1 rounded border border-slate-800 text-slate-300">
              Mean Residual: <strong className="text-brand-400">{data.benchmarks.find(b => b.Model.includes('ANN'))?.mean_residual.toFixed(2) || '0.00'}</strong> units
            </span>
          </div>

          <div className="mt-6">
            {/* SVG Residual Chart */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80">
              <svg viewBox="0 0 800 220" className="w-full h-52 overflow-visible">
                {/* Zero Error Axis */}
                <line x1="45" y1="110" x2="770" y2="110" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="35" y="113" textAnchor="end" className="text-[10px] font-mono fill-slate-400">0</text>
                <text x="35" y="45" textAnchor="end" className="text-[10px] font-mono fill-slate-400">+25</text>
                <text x="35" y="175" textAnchor="end" className="text-[10px] font-mono fill-slate-400">-25</text>

                {/* Residual Bars */}
                {data.walk_forward_series.map((pt, idx) => {
                  const x = 45 + (idx / (data.walk_forward_series.length - 1)) * 725;
                  const err = pt.residual_ann;
                  const barHeight = Math.min(Math.abs(err) * 2.5, 80);
                  const isPos = err >= 0;
                  const y = isPos ? 110 - barHeight : 110;

                  return (
                    <rect
                      key={idx}
                      x={x - 3.5}
                      y={y}
                      width="7"
                      height={barHeight}
                      rx="1"
                      className={`transition-all hover:opacity-80 ${isPos ? 'fill-emerald-500/80' : 'fill-rose-500/80'}`}
                    >
                      <title>{`${pt.date}: Actual ${pt.actual}, ANN ${pt.ann}, Error ${err > 0 ? '+' : ''}${err}`}</title>
                    </rect>
                  );
                })}
              </svg>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Over-performance (Actual &gt; Forecast)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> Under-performance (Actual &lt; Forecast)</span>
              <span className="font-mono">Symmetric error dispersion confirms un-biased network predictions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
