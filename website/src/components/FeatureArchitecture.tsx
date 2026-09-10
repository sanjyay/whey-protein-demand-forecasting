import React from 'react';
import { Cpu, ArrowRight, Clock, Calendar, DollarSign, History, Layers } from 'lucide-react';

export const FeatureArchitecture: React.FC = () => {
  return (
    <section id="features" className="py-20 border-b border-slate-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-brand-400 font-semibold mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span>Information Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Leakage-Safe Feature Engineering Pipeline
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Every feature fed to the Neural Network respects the strict causal boundary:
            <strong className="text-slate-200"> only information that would have been known prior to the week's sales occurring is permitted.</strong>
          </p>
        </div>

        {/* Feature Pipeline Flow Visualizer */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-12 shadow-xl">
          <h3 className="text-sm font-mono uppercase text-slate-400 mb-6 flex items-center gap-2">
            <span>End-to-End Predictor Transformation Flow</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Column 1: Known in Advance */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 relative">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                <Calendar className="w-4 h-4" />
                <span>1. Known in Advance</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Operational parameters established prior to the weekly selling window:
              </p>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li className="bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">Planned Retail Price (Price)</li>
                <li className="bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">Promotional Discount % (Discount)</li>
                <li className="bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">Planned Promo Dollars (P × D)</li>
                <li className="bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">Week of Month (Week_1 .. Week_5)</li>
                <li className="bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">Market Region (USA, UK, Canada)</li>
                <li className="bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">E-Commerce Platform (Amazon, Walmart, iHerb)</li>
              </ul>
            </div>

            {/* Column 2: Historical Lags */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 relative">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-3">
                <History className="w-4 h-4" />
                <span>2. Historical Lags (t-1 .. t-3)</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Past observations from completed historical weeks:
              </p>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li className="bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">Units_Sold_lag_1, lag_2, lag_3</li>
                <li className="bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">Price_lag_1, lag_2, lag_3</li>
                <li className="bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">Discount_lag_1, lag_2, lag_3</li>
                <li className="bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">Revenue_lag_1, lag_2, lag_3</li>
                <li className="bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">Units_Returned_lag_1, lag_2, lag_3</li>
              </ul>
            </div>

            {/* Column 3: Shifted Rolling Windows */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 relative">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm mb-3">
                <Clock className="w-4 h-4" />
                <span>3. Shifted Rolling History</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Trend and volatility moving statistics strictly shifted by 1 period:
              </p>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li className="bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                  <div className="text-teal-400 font-bold">shift(1).rolling(3).mean()</div>
                  <div className="text-[10px] text-slate-400">Short-term baseline demand</div>
                </li>
                <li className="bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                  <div className="text-teal-400 font-bold">shift(1).rolling(3).std()</div>
                  <div className="text-[10px] text-slate-400">Short-term sales volatility</div>
                </li>
                <li className="bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                  <div className="text-teal-400 font-bold">shift(1).rolling(6).mean()</div>
                  <div className="text-[10px] text-slate-400">Medium-term demand trajectory</div>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Input Vector Dimension: <strong className="text-white font-mono">30 features</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
              <span>Target Vector: <strong className="text-white font-mono">Units Sold (week t)</strong></span>
            </div>
            <div className="text-slate-400 font-mono">StandardScaler fitted strictly on training slices</div>
          </div>
        </div>
      </div>
    </section>
  );
};
