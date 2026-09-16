import React from 'react';
import { HeroSection } from './HeroSection';
import { TrustStrip } from './TrustStrip';
import { WorkflowSection } from './WorkflowSection';
import { EvidenceSection } from './EvidenceSection';
import { FeaturesSection } from './FeaturesSection';
import { AITransparencySection } from './AITransparencySection';
import { SecuritySection } from './SecuritySection';
import { AccessibilitySection } from './AccessibilitySection';
import { TechStackSection } from './TechStackSection';
import { BenchmarkTelemetrySection } from './BenchmarkTelemetrySection';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onSelectBenchmark: (benchmarkId: string) => void;
  onOpenDisclaimer: () => void;
  onNavigateToTab: (tab: 'workspace' | 'compare' | 'sandbox') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  onSelectBenchmark,
  onOpenDisclaimer,
  onNavigateToTab,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-canvas-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* 1. Hero Section & Interactive Cockpit Simulator */}
      <HeroSection onStartAnalysis={onStartAnalysis} />

      {/* 2. Trust Strip & Engineering Integrity */}
      <TrustStrip />

      {/* 3. Problem to Solution 4-Tier Workflow */}
      <WorkflowSection />

      {/* 4. See the Evidence Interactive Grounding Comparator */}
      <EvidenceSection />

      {/* 5. Comprehensive Feature Showcase */}
      <FeaturesSection />

      {/* 6. AI Transparency 5-Tier Responsible Architecture */}
      <AITransparencySection />

      {/* 7. Security, In-Memory Processing & Privacy */}
      <SecuritySection />

      {/* 8. WCAG AA/AAA Accessibility Demonstration */}
      <AccessibilitySection />

      {/* 9. Technology Architecture & Performance Telemetry */}
      <TechStackSection />

      {/* 10. Jury Testing Benchmark Catalog */}
      <BenchmarkTelemetrySection
        onSelectBenchmark={onSelectBenchmark}
        onNavigateToTab={onNavigateToTab}
      />

      {/* 11. Minimal Footer & Legal Disclaimer */}
      <LandingFooter onOpenDisclaimer={onOpenDisclaimer} />
    </div>
  );
};
