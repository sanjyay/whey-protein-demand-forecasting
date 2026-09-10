import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DataOverview } from './components/DataOverview';
import { TrendsExplorer } from './components/TrendsExplorer';
import { LeakageAudit } from './components/LeakageAudit';
import { FeatureArchitecture } from './components/FeatureArchitecture';
import { ModelTuning } from './components/ModelTuning';
import { WalkForwardValidation } from './components/WalkForwardValidation';
import { BenchmarkComparison } from './components/BenchmarkComparison';
import { RegionalPlatformAnalysis } from './components/RegionalPlatformAnalysis';
import { FindingsLimitations } from './components/FindingsLimitations';
import { TechStack } from './components/TechStack';
import { Footer } from './components/Footer';
import { metricsData } from './data/metrics';

export function App() {
  const [activeSection, setActiveSection] = useState<string>('overview');

  useEffect(() => {
    const sections = [
      'overview',
      'data',
      'trends',
      'features',
      'model',
      'validation',
      'forecasts',
      'regions',
      'findings',
      'limitations'
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-slate-950">
      <Navbar activeSection={activeSection} />
      
      <main className="flex-1">
        <Hero data={metricsData} />
        <DataOverview data={metricsData} />
        <TrendsExplorer data={metricsData} />
        <LeakageAudit data={metricsData} />
        <FeatureArchitecture />
        <ModelTuning data={metricsData} />
        <BenchmarkComparison data={metricsData} />
        <WalkForwardValidation data={metricsData} />
        <RegionalPlatformAnalysis data={metricsData} />
        <FindingsLimitations />
        <TechStack />
      </main>

      <Footer />
    </div>
  );
}

export default App;
