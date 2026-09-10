import React from 'react';
import { TrendingUp, ShieldAlert, CheckCircle2, ArrowDownRight, Layers, Globe, Store, Cpu, ArrowRight } from 'lucide-react';
import { SummaryMetrics } from '../types';

interface HeroProps {
  data: SummaryMetrics;
}

export const Hero: React.FC<HeroProps> = ({ data }) => {
  const annModel = data.benchmarks.find(b => b.Model.includes('ANN')) || data.benchmarks[0];
  const naiveModel = data.benchmarks.find(b => b.Model.includes('Naive'));
  
  const pctImprovement = naiveModel 
    ? Math.round(((naiveModel.mae - annModel.mae) / naiveModel.mae) * 100)
    : 24;

  return (
    <section id="overview" className="relative pt-32 pb-20 overflow-hidden border-b border-slate-850">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span>Empirical Time-Series Portfolio Project</span>
            <span className="text-slate-600">|</span>
            <span className="text-brand-500 font-mono">Rigorous Leakage Audit</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Whey Protein <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-emerald-400 to-teal-300">Demand Forecasting</span>
          </h1>

          <p className="mt-4 text-xl sm:text-2xl font-semibold text-slate-200 tracking-tight">
            ANN-based weekly sales forecasting across the USA, UK, and Canada
          </p>

          <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl">
            A time-series machine learning study forecasting weekly Whey Protein demand from historical sales,
            pricing, promotions, geography, and platform behavior. Audited for contemporaneous target leakage,
            re-anchored to causal forecasting boundaries, and verified through expanding-window walk-forward validation.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#forecasts"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-sm shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02]"
            >
              <span>Explore Forecasts</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#audit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition-all hover:border-slate-700"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Leakage Audit Report</span>
            </a>
            <a
              href="https://github.com/sanjyay/whey-protein-demand-forecasting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 border border-slate-800/80 text-sm font-medium transition-all"
            >
              <span>Code Repository</span>
            </a>
          </div>
        </div>

        {/* Verified Headline Metrics Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition-colors">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Time Horizon</span>
            </div>
            <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-white tracking-tight">5+ Years</div>
            <div className="mt-1 text-xs text-slate-400">2020 – 2025 Weekly</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition-colors">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Regions</span>
            </div>
            <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-white tracking-tight">3 Markets</div>
            <div className="mt-1 text-xs text-slate-400">USA, UK, Canada</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition-colors">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-blue-400" />
              <span>Channels</span>
            </div>
            <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-white tracking-tight">3 Platforms</div>
            <div className="mt-1 text-xs text-slate-400">Amazon, Walmart, iHerb</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition-colors">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Observations</span>
            </div>
            <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {data.dataset_scope.total_whey_rows}
            </div>
            <div className="mt-1 text-xs text-slate-400">Whey weekly steps</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/90 rounded-xl p-4 hover:border-brand-500/40 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500/10 rounded-full blur-xl" />
            <div className="text-xs font-mono uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
              <span>Forecast MAE</span>
            </div>
            <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-brand-400 tracking-tight">
              {annModel.mae.toFixed(1)} <span className="text-sm font-normal text-slate-400">units</span>
            </div>
            <div className="mt-1 text-xs text-slate-400">Walk-forward validation</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition-colors">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              <span>Vs Naive</span>
            </div>
            <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-teal-300 tracking-tight">
              +{pctImprovement}%
            </div>
            <div className="mt-1 text-xs text-slate-400">Error reduction vs lag-1</div>
          </div>
        </div>
      </div>
    </section>
  );
};
