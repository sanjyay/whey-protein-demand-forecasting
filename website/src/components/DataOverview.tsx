import React from 'react';
import { Database, Calendar, Tag, Layers, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { SummaryMetrics } from '../types';

interface DataOverviewProps {
  data: SummaryMetrics;
}

export const DataOverview: React.FC<DataOverviewProps> = ({ data }) => {
  const scope = data.dataset_scope;

  const schemaColumns = [
    { name: 'Date', type: 'DateTime (YYYY-MM-DD)', role: 'Temporal Index', status: 'valid', desc: 'Weekly observation timestamp (every Monday). Used strictly for chronological ordering.' },
    { name: 'Product Name', type: 'Categorical (String)', role: 'Cohort Filter', status: 'valid', desc: '16 supplement products in raw dataset. Filtered strictly to Whey Protein cohort (274 records).' },
    { name: 'Units Sold', type: 'Integer', role: 'Target Variable (yt)', status: 'target', desc: 'Total units sold during sales week t. The core prediction target of the machine learning pipeline.' },
    { name: 'Price', type: 'Float ($ USD)', role: 'Advance Feature / Lag', status: 'valid', desc: 'Planned catalog list price for week t, plus historical price lags (t-1, t-2, t-3).' },
    { name: 'Discount', type: 'Float (0.00 – 0.25)', role: 'Advance Feature / Lag', status: 'valid', desc: 'Scheduled promotional discount percentage for week t, plus historical discount lags.' },
    { name: 'Revenue', type: 'Float ($ USD)', role: 'Leaked at t / Valid at t-k', status: 'leaked', desc: 'Contemporaneous revenue = Price * Units Sold. Directly leaks the target if included at week t. Only valid as historical lag (t-1, t-2, t-3).' },
    { name: 'Units Returned', type: 'Integer', role: 'Leaked at t / Valid at t-k', status: 'leaked', desc: 'Concurrent product return count during week t. Excluded at t; included strictly as lagged indicator.' },
    { name: 'Location', type: 'Categorical (3 markets)', role: 'Advance One-Hot', status: 'valid', desc: 'Geographic market: USA, UK, Canada. One-hot encoded with Canada as reference level.' },
    { name: 'Platform', type: 'Categorical (3 channels)', role: 'Advance One-Hot', status: 'valid', desc: 'E-commerce platform: Amazon, Walmart, iHerb. One-hot encoded with iHerb as reference level.' },
    { name: 'Week of Month', type: 'Integer (1 – 5)', role: 'Advance Calendar', status: 'valid', desc: 'Extracted week of month ((day - 1) // 7 + 1) one-hot encoded into Week_1 through Week_5.' },
  ];

  return (
    <section id="data" className="py-20 border-b border-slate-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-brand-400 font-semibold mb-2 flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>Dataset Scope & Provenance</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Retail Supplement Sales Data
            </h2>
          </div>
          <p className="mt-3 md:mt-0 text-sm text-slate-400 max-w-md">
            Source: Kaggle Supplement Sales Weekly Expanded benchmark spanning 2020 to 2025 across international e-commerce channels.
          </p>
        </div>

        {/* Scope Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between text-slate-400 mb-4">
              <span className="text-xs font-mono uppercase">Original Benchmark</span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{scope.total_raw_rows.toLocaleString()}</div>
            <p className="mt-2 text-xs text-slate-400">
              Total transaction rows spanning 16 supplement categories (Protein, Vitamins, Omegas, Minerals).
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-xl" />
            <div className="flex items-center justify-between text-slate-400 mb-4">
              <span className="text-xs font-mono uppercase text-brand-400">Whey Protein Cohort</span>
              <Tag className="w-4 h-4 text-brand-400" />
            </div>
            <div className="text-3xl font-extrabold text-brand-400">{scope.total_whey_rows}</div>
            <p className="mt-2 text-xs text-slate-400">
              Weekly observations isolated for Whey Protein demand modeling, spanning 274 consecutive weeks.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between text-slate-400 mb-4">
              <span className="text-xs font-mono uppercase">Target Distribution</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {scope.target_mean} <span className="text-sm font-normal text-slate-400">± {scope.target_std} units</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Weekly demand oscillates between 122 and 187 units with moderate variance around the regional baseline.
            </p>
          </div>
        </div>

        {/* Schema Audit Table */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Variable Schema & Temporal Forecasting Classification</h3>
              <p className="text-xs text-slate-400 mt-1">Every column audited for causal time-series validity before model training.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Valid Advance / Historical
              </span>
              <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <AlertTriangle className="w-3 h-3" /> Leaked Contemporaneous
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-xs uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Column</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Role in Pipeline</th>
                  <th className="py-3 px-4 font-semibold">Forecasting Status</th>
                  <th className="py-3 px-4 font-semibold">Audit Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {schemaColumns.map((col, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white flex items-center gap-2">
                      {col.name}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-xs">{col.type}</td>
                    <td className="py-3 px-4 text-slate-300 font-medium">{col.role}</td>
                    <td className="py-3 px-4">
                      {col.status === 'valid' && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Valid Predictor
                        </span>
                      )}
                      {col.status === 'target' && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
                          Target (yt)
                        </span>
                      )}
                      {col.status === 'leaked' && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Leakage at t
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400 max-w-md">{col.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
