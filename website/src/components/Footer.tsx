import React from 'react';
import { Activity, Github, ExternalLink, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-slate-950 border-t border-slate-900 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-400 font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">Whey Protein Demand Forecasting</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Machine Learning Portfolio Project • Sanjyay</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <a
              href="https://github.com/sanjyay/whey-protein-demand-forecasting"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
            <a
              href="https://sanjyay.github.io/whey-protein-demand-forecasting/"
              className="hover:text-brand-400 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Site</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 text-center text-slate-400 text-[11px]">
          Designed and built for reproducible machine learning evaluation. Dataset source: Kaggle Supplement Sales Weekly Expanded benchmark.
        </div>
      </div>
    </footer>
  );
};
