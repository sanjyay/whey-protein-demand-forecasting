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
      'audit',
      'features',
      'model',
      'validation',
      'forecasts',
      'regions',
      'findings',
      'limitations'
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Bottom threshold: activate 'limitations' when user reaches near page bottom
      if (windowHeight + scrollY >= documentHeight - 120) {
        setActiveSection('limitations');
        return;
      }

      // 140px offset accounts for fixed navbar (64px) + margin
      const scrollPosition = scrollY + 140;
      let currentSection = sections[0];

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + scrollY;
          if (scrollPosition >= top) {
            currentSection = sectionId;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load to sync initial scroll position or hash
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-slate-950">
      <Navbar activeSection={activeSection} onSelectSection={setActiveSection} />
      
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
