import React, { useState } from 'react';
import { Globe, Store, ArrowUpRight, TrendingUp, DollarSign } from 'lucide-react';
import { SummaryMetrics } from '../types';

interface RegionalPlatformProps {
  data: SummaryMetrics;
}

export const RegionalPlatformAnalysis: React.FC<RegionalPlatformProps> = ({ data }) => {
  const regions = data.regional_breakdown;
  const platforms = data.platform_breakdown;

  const [activeTab, setActiveTab] = useState<'regions' | 'platforms'>('regions');

  return (
    <section id="regions" className="py-20 border-b border-slate-850 relative bg-slate-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Multi-Market & Channel Dynamics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Regional & Platform Sales Distribution
            </h2>
          </div>

          {/* Tab Switcher */}
          <div className="mt-4 md:mt-0 flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('regions')}
              className={`px-4 py-2 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'regions' ? 'bg-slate-800 text-brand-400 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Geographic Markets (3)</span>
            </button>
            <button
              onClick={() => setActiveTab('platforms')}
              className={`px-4 py-2 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'platforms' ? 'bg-slate-800 text-blue-400 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Sales Platforms (3)</span>
            </button>
          </div>
        </div>

        {activeTab === 'regions' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regions.map((reg) => (
              <div key={reg.region} className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 font-mono text-xs">
                      {reg.region}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {reg.region === 'USA' ? 'United States' : reg.region === 'UK' ? 'United Kingdom' : 'Canada'}
                      </h3>
                      <span className="text-xs text-slate-400">{reg.observations} weekly records</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded">
                    Avg: {reg.mean}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Demand Volatility (Std Dev):</span>
                    <span className="font-mono text-white font-semibold">± {reg.std} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Median Weekly Sales:</span>
                    <span className="font-mono text-white font-semibold">{reg.median} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Range (Min – Max):</span>
                    <span className="font-mono text-white font-semibold">{reg.min} – {reg.max} units</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {reg.region === 'USA' && 'Highest average weekly demand (152.4 units) with peak sales volume reaching 187 units during promotional weeks.'}
                    {reg.region === 'UK' && 'Stable demand profile (151.6 units) with low cross-period dispersion (std: 11.6 units).'}
                    {reg.region === 'Canada' && 'Largest cohort representation (100 weeks) with a slightly lower baseline demand (148.2 units).'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platforms.map((plat) => (
              <div key={plat.platform} className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 font-mono text-xs">
                      {plat.platform[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{plat.platform}</h3>
                      <span className="text-xs text-slate-400">{plat.observations} weekly records</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded">
                    Avg: {plat.mean}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sales Volatility (Std Dev):</span>
                    <span className="font-mono text-white font-semibold">± {plat.std} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Median Volume:</span>
                    <span className="font-mono text-white font-semibold">{plat.median} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Range (Min – Max):</span>
                    <span className="font-mono text-white font-semibold">{plat.min} – {plat.max} units</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {plat.platform === 'Amazon' && 'Direct e-commerce velocity with highest single-week peak demand (187 units).'}
                    {plat.platform === 'Walmart' && 'Highest variance (std: 12.8 units) reflecting periodic deep promotional spikes.'}
                    {plat.platform === 'iHerb' && 'Consistent consumer replenishment behavior with tightest dispersion (std: 11.2 units).'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
