import React, { Suspense } from 'react';
import { Navbar } from './components/common/Navbar';
import { LegalDisclaimerModal } from './components/common/LegalDisclaimerModal';
import { LandingPage } from './components/landing/LandingPage';
import { WorkspaceLayout } from './components/workspace/WorkspaceLayout';
import { AccessibleAnnouncement } from './components/common/AccessibleAnnouncement';
import { LiveCaptionOverlay } from './components/common/LiveCaptionOverlay';
import { useWorkspaceState } from './hooks/useWorkspaceState';
import { useDocumentWorkflow } from './hooks/useDocumentWorkflow';

const DocumentComparisonView = React.lazy(() =>
  import('./components/workspace/DocumentComparisonView').then((m) => ({ default: m.DocumentComparisonView }))
);
const LegalNavigatorView = React.lazy(() =>
  import('./components/workspace/LegalNavigatorView').then((m) => ({ default: m.LegalNavigatorView }))
);
const JurySandbox = React.lazy(() =>
  import('./components/workspace/JurySandbox').then((m) => ({ default: m.JurySandbox }))
);

export const App: React.FC = () => {
  const ws = useWorkspaceState();
  const docFlow = useDocumentWorkflow(
    ws.country,
    ws.state,
    ws.setActiveTab,
    ws.showAnnouncement
  );

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans transition-transform"
      style={{ fontSize: `calc(1rem * var(--app-font-scale, 100) / 100)` }}
    >
      {/* WCAG 2.1 AAA Skip to Main Content Anchor Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-yellow-400 focus:text-black focus:font-bold focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-black rounded"
      >
        Skip to main content
      </a>

      {/* WCAG AAA Contrast Overlay / Announcement */}
      {ws.announcement && (
        <AccessibleAnnouncement
          message={ws.announcement.message}
          onDismiss={ws.clearAnnouncement}
          fontScale={ws.fontScale}
          onScaleChange={ws.cycleFontScale}
        />
      )}

      {/* Deaf / Hard-of-Hearing Real-Time Closed Caption Overlay */}
      <LiveCaptionOverlay
        captionText={ws.latestCaptionText}
        isEnabled={ws.liveCaptionsEnabled}
        onToggle={() => ws.setLiveCaptionsEnabled(!ws.liveCaptionsEnabled)}
      />

      {/* Top Header & Navigation */}
      <Navbar
        activeTab={ws.activeTab}
        setActiveTab={ws.setActiveTab}
        country={ws.country}
        setCountry={ws.setCountry}
        state={ws.state}
        setState={ws.setState}
        onOpenUpload={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.pdf,.docx,.txt,.csv,.sql';
          input.onchange = (e) => docFlow.handleFileUpload(e as any);
          input.click();
        }}
        highContrast={ws.highContrast}
        fontSize={ws.fontSize}
        plainLanguageMode={ws.plainLanguageMode}
        liveCaptionsEnabled={ws.liveCaptionsEnabled}
        onToggleContrast={() => ws.setHighContrast(!ws.highContrast)}
        onChangeFontSize={ws.setFontSize}
        onTogglePlainLanguage={() => ws.setPlainLanguageMode(!ws.plainLanguageMode)}
        onToggleLiveCaptions={() => ws.setLiveCaptionsEnabled(!ws.liveCaptionsEnabled)}
        hasActiveDocument={!!docFlow.activeAnalysis}
      />

      {/* Main Viewport */}
      <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col min-h-0 focus:outline-none">
        {ws.activeTab === 'workspace' && !docFlow.activeAnalysis && (
          <LandingPage
            onStartAnalysis={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf,.docx,.txt';
              input.onchange = (e) => docFlow.handleFileUpload(e as any);
              input.click();
            }}
            onSelectBenchmark={docFlow.handleLoadBenchmark}
            onOpenDisclaimer={() => ws.setIsDisclaimerOpen(true)}
            onNavigateToTab={ws.setActiveTab}
          />
        )}

        {ws.activeTab === 'workspace' && docFlow.activeAnalysis && (
          <WorkspaceLayout
            analysis={docFlow.activeAnalysis}
            document={docFlow.activeDocument}
            checklist={docFlow.activeChecklist}
            lawyerBrief={docFlow.activeBrief}
            onAskCopilot={docFlow.handleAskCopilot}
            onToggleChecklistItem={docFlow.handleToggleChecklist}
            onAddCustomChecklistItem={docFlow.handleAddCustomChecklist}
            onUpdateBriefNotes={docFlow.handleUpdateBriefNotes}
            onUploadNewFile={docFlow.handleFileUpload}
            plainLanguageMode={ws.plainLanguageMode}
          />
        )}

        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center p-12 text-slate-400 font-mono text-xs">
              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mr-3" />
              Loading modular component...
            </div>
          }
        >
          {ws.activeTab === 'compare' && (
            <div className="flex-1 p-4">
              <DocumentComparisonView
                comparison={docFlow.activeComparison}
                onRunDemoCompare={docFlow.handleRunDemoCompare}
                isLoading={docFlow.isComparing}
              />
            </div>
          )}

          {ws.activeTab === 'navigate' && (
            <div className="flex-1 p-4">
              <LegalNavigatorView
                document={docFlow.activeDocument}
                country={ws.country}
                state={ws.state}
                onNavigateToTab={ws.setActiveTab}
              />
            </div>
          )}

          {ws.activeTab === 'sandbox' && (
            <div className="flex-1 p-4">
              <JurySandbox onLoadBenchmarkIntoWorkspace={docFlow.handleLoadBenchmark} />
            </div>
          )}
        </Suspense>
      </main>

      {/* Legal Safety Modal */}
      <LegalDisclaimerModal
        isOpen={ws.isDisclaimerOpen}
        onClose={() => ws.setIsDisclaimerOpen(false)}
      />
    </div>
  );
};

export default App;
