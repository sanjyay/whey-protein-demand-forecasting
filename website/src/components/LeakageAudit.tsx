import React from 'react';
import { ShieldCheck, AlertCircle, ArrowRight, CheckCircle, XCircle, FileCode, Sparkles } from 'lucide-react';
import { SummaryMetrics } from '../types';

interface LeakageAuditProps {
  data: SummaryMetrics;
}

export const LeakageAudit: React.FC<LeakageAuditProps> = ({ data }) => {
  const audit = data.leakage_audit;

  const leakageCases = [
    {
      title: 'Contemporaneous Revenue',
      formula: 'Revenue = Price × Units Sold',
      problem: 'Both Price and Revenue were supplied at time t. Knowing both allows exact mathematical division (Units = Revenue / Price), completely bypassing demand forecasting.',
      fix: 'Excluded from time t feature matrix. Historical revenue from previous weeks (t-1, t-2, t-3) is safely preserved as lagged demand signals.',
      impact: 'R² = 1.0000 under Ordinary Least Squares'
    },
    {
      title: 'Effective Units Sold',
      formula: 'Effective Units = Units Sold - Units Returned',
      problem: 'With weekly returns averaging only 1.49 units, this feature is an almost identical clone of the target (r = +0.9950 correlation with Units Sold).',
      fix: 'Strictly eliminated from predictors. Historical return counts are preserved only with t-1, t-2, t-3 lags.',
      impact: 'Correlation with target: +0.9950'
    },
    {
      title: 'Unshifted Rolling Averages',
      formula: 'Rolling_Units = Units Sold.rolling(window=3).mean()',
      problem: 'Standard pandas rolling window without .shift(1) includes the current observation yt: (yt + yt-1 + yt-2) / 3, leaking target information directly into the feature.',
      fix: 'Enforced shift(1) prior to rolling aggregation: Units Sold.shift(1).rolling(3).mean(), guaranteeing strictly historical lookback.',
      impact: 'Correlation with target: +0.5739'
    },
    {
      title: 'Derived Concurrent Ratios',
      formula: 'Return Rate & Revenue per Unit',
      problem: 'Return Rate (Returns / Units) and Revenue per Unit (Revenue / Units) both embed current Units Sold in the denominator, leaking ground truth.',
      fix: 'Purged from input vectors. Only forward-known planned promotions and genuine historical sales indicators retained.',
      impact: 'Mathematical inverse target leakage'
    }
  ];

  return (
    <section id="audit" className="py-20 border-b border-slate-850 relative bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Methodological Refinement</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Building a Valid Forecast: Target Leakage Audit
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            The original study exploratory notebook (<code className="text-slate-300 font-mono text-xs bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">ts.ipynb</code>)
            demonstrated creative feature engineering but inadvertently introduced contemporaneous sales features. 
            Auditing and correcting these temporal violations elevates the work from an ungrounded regression exercise into a production-grade machine learning forecasting pipeline.
          </p>
        </div>

        {/* The Mathematical Proof of Leakage Banner */}
        <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Empirical Leakage Verification</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Proof of Trivialized Learning Under OLS
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                When the original notebook's feature matrix was fitted with a basic Ordinary Least Squares (OLS) linear model,
                it achieved an error of exactly <span className="font-mono text-white font-bold">MAE = 0.0000</span> and <span className="font-mono text-white font-bold">R² = 1.0000</span>.
                This proved that the model was not learning future demand dynamics, but merely solving an algebraic identity from contemporaneous inputs.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-slate-950/80 border border-rose-900/40 rounded-xl p-4 text-center">
                <div className="text-xs text-rose-400 font-mono uppercase">Leaked OLS R²</div>
                <div className="text-3xl font-extrabold text-rose-400 font-mono mt-1">1.0000</div>
                <div className="text-xs text-slate-400 mt-1">Perfect fit via identity</div>
              </div>
              <div className="bg-slate-950/80 border border-emerald-900/40 rounded-xl p-4 text-center">
                <div className="text-xs text-emerald-400 font-mono uppercase">Leaked OLS MAE</div>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">0.0000</div>
                <div className="text-xs text-slate-400 mt-1">Zero prediction residual</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Leakage Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leakageCases.map((item, idx) => (
            <div key={idx} className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-brand-400 font-mono text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    {item.title}
                  </h4>
                  <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.impact}
                  </span>
                </div>

                <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-brand-300 border border-slate-800/80 mb-4">
                  <code>{item.formula}</code>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-start gap-2 text-rose-300/90">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong className="text-rose-200">The Flaw:</strong> {item.problem}</span>
                  </div>
                  <div className="flex items-start gap-2 text-emerald-300/90">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-emerald-200">The Correction:</strong> {item.fix}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
