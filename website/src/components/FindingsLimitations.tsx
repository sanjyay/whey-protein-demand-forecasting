import React from 'react';
import { Lightbulb, AlertOctagon, CheckCircle2, TrendingUp, Info } from 'lucide-react';

export const FindingsLimitations: React.FC = () => {
  const findings = [
    {
      type: 'Direct Analytical Finding',
      title: 'Target Leakage Remediation Restores True Error Profile',
      desc: 'The original exploratory study obtained near-zero training losses by inadvertently supplying contemporaneous revenue (Price × Units) and Effective Units (Units - Returns). Once purged, the genuine forecast error stabilized at 10.8 units MAE under walk-forward evaluation.',
      tag: 'Methodology'
    },
    {
      type: 'Possible Interpretation',
      title: 'Demand Variance Dominated by Unobserved Exogenous Factors',
      desc: 'Weekly Whey Protein sales fluctuate moderately (std ≈ 12 units) with low week-over-week autocorrelation. This suggests consumer replenishment is driven by factors external to the retail feed: digital ad spend, seasonal fitness surges (e.g. January resolutions), or competitor discounting.',
      tag: 'Commercial Hypothesis'
    },
    {
      type: 'Direct Analytical Finding',
      title: 'ANN Overcomes Naive Persistence by Learning Conditional Mean',
      desc: 'A naive persistence model (y_hat_t = y_{t-1}) produces high error (13.26 units MAE) due to weekly market/channel alternation. The regularized ANN and Ridge models correctly converge near the conditional expectation (~150 units), reducing prediction error by over 20%.',
      tag: 'Benchmarking'
    },
    {
      type: 'Direct Analytical Finding',
      title: 'Target Scaling is Crucial for ANN Convergence',
      desc: 'Training unscaled targets with low learning rates led to severe output bias and drifting predictions. Standardizing the target prior to loss calculation restored rapid, stable network optimization.',
      tag: 'Neural Optimization'
    }
  ];

  const limitations = [
    {
      title: 'Single-Product Cohort Scope',
      desc: 'The forecasting models in this project focus exclusively on Whey Protein (274 weekly observations). Cross-category elasticity and cannibalization against other supplements (e.g., Creatine, BCAA) were not modeled.'
    },
    {
      title: 'Alternating Multi-Market Record Structure',
      desc: 'In the Kaggle benchmark dataset, each week records one primary transaction row alternating between regions and platforms, rather than 9 parallel simultaneous time series for all region-platform pairs.'
    },
    {
      title: 'Unobserved Retail Drivers',
      desc: 'Crucial retail demand drivers are absent from the dataset: digital marketing expenditure, influencer campaigns, holiday retail events (Black Friday / Cyber Monday), and stockout/inventory constraints.'
    },
    {
      title: 'Weekly Granularity',
      desc: 'Weekly aggregation smooths intra-week day-of-week purchasing spikes and flash sales, which would require daily or hourly transaction logs to forecast.'
    }
  ];

  return (
    <>
      <section id="findings" className="py-20 border-b border-slate-850 relative scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-400 font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span>Synthesis & Insights</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Analytical Findings
              </h2>
            </div>
            <p className="mt-3 md:mt-0 text-sm text-slate-400 max-w-md">
              Distinguishing verified empirical forecasting results from commercial domain hypotheses.
            </p>
          </div>

          {/* Findings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {findings.map((f, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      f.type === 'Direct Analytical Finding' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {f.type}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{f.tag}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="limitations" className="py-20 border-b border-slate-850 relative bg-slate-950/40 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold mb-2">
                <AlertOctagon className="w-4 h-4" />
                <span>Honest Evaluation Constraints</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Project Limitations & Boundary Conditions
              </h2>
            </div>
            <p className="mt-3 md:mt-0 text-sm text-slate-400 max-w-md">
              Known real-world data constraints, unobserved variables, and operational boundaries of the models.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {limitations.map((lim, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-amber-500/30 transition-all">
                <div className="text-xs font-bold text-amber-300 font-mono mb-2">0{idx + 1}. {lim.title}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{lim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
