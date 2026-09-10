import React from 'react';
import { Terminal, Layers, Code, Sparkles } from 'lucide-react';

export const TechStack: React.FC = () => {
  const dataScienceStack = [
    { name: 'Python 3.11', role: 'Runtime & Scientific Computing' },
    { name: 'TensorFlow 2.21', role: 'Deep Learning Backend' },
    { name: 'Keras 3.15', role: 'Sequential Model Architecture' },
    { name: 'Keras Tuner 1.4', role: 'Automated Hyperparameter Optimization' },
    { name: 'scikit-learn 1.9', role: 'Preprocessing, Baselines & Metrics' },
    { name: 'pandas 3.0', role: 'Time-Series Data Wrangling' },
    { name: 'NumPy 2.4', role: 'Vectorized Matrix Operations' },
    { name: 'Matplotlib & Seaborn', role: 'Publication-Grade Figures' },
  ];

  const webStack = [
    { name: 'React 18', role: 'Reactive UI Component Architecture' },
    { name: 'TypeScript 5.6', role: 'Strict Type-Safe Data Contracts' },
    { name: 'Vite 5.4', role: 'Zero-Overhead Static Asset Bundler' },
    { name: 'Tailwind CSS 3.4', role: 'Analytical Dashboard Styling' },
    { name: 'Lucide Icons', role: 'Minimalist Vector Iconography' },
    { name: 'GitHub Actions', role: 'Continuous Deployment to GitHub Pages' },
  ];

  return (
    <section className="py-20 border-b border-slate-850 relative bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-brand-400 font-semibold mb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span>Tools & Reproducibility</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Production Technology Stack
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Constructed with rigorous, production-grade tools across both the machine learning experimentation pipeline and the web presentation layer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Data Science Stack */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Machine Learning & Data Science Pipeline</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dataScienceStack.map((item, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                  <div className="font-mono text-xs font-bold text-white">{item.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Web Stack */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Portfolio Web & Visualization Engineering</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {webStack.map((item, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                  <div className="font-mono text-xs font-bold text-white">{item.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
