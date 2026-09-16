import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { LegalDisclaimerModal } from './components/common/LegalDisclaimerModal';
import { LandingPage } from './components/landing/LandingPage';
import { WorkspaceLayout } from './components/workspace/WorkspaceLayout';
import { DocumentComparisonView } from './components/workspace/DocumentComparisonView';
import { JurySandbox } from './components/workspace/JurySandbox';
import {
  ChecklistItem,
  ComparisonResult,
  DocumentAnalysisResponse,
  DocumentContent,
  GroundedAnswer,
  LawyerBrief,
} from './types';
import { api } from './services/api';

export const App: React.FC = () => {
  // Navigation & Jurisdiction
  const [activeTab, setActiveTab] = useState<'workspace' | 'compare' | 'sandbox'>('workspace');
  const [country, setCountry] = useState<string>('United States');
  const [state, setState] = useState<string>('New York');

  // Accessibility State
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [plainLanguageMode, setPlainLanguageMode] = useState<boolean>(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);

  // Active Document State
  const [activeAnalysis, setActiveAnalysis] = useState<DocumentAnalysisResponse | null>(null);
  const [activeDocument, setActiveDocument] = useState<DocumentContent | null>(null);
  const [activeChecklist, setActiveChecklist] = useState<ChecklistItem[]>([]);
  const [activeBrief, setActiveBrief] = useState<LawyerBrief | null>(null);

  // Comparison State
  const [activeComparison, setActiveComparison] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Sync Body Classes for Accessibility
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    document.body.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg');
    document.body.classList.add(`font-size-${fontSize}`);
  }, [highContrast, fontSize]);

  // Handle File Upload from User
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const analysisRes = await api.uploadDocument(file, country, state);
      setActiveAnalysis(analysisRes);

      const docContent = await api.getDocument(analysisRes.metadata.doc_id);
      setActiveDocument(docContent);

      const chk = await api.getChecklist(analysisRes.metadata.doc_id);
      setActiveChecklist(chk.items);

      const brief = await api.getLawyerBrief(analysisRes.metadata.doc_id);
      setActiveBrief(brief);

      setActiveTab('workspace');
    } catch (err: any) {
      alert(`Upload Error: ${err.message || 'Failed to upload document'}`);
    }
  };

  // Handle Benchmark Document Quick Load
  const handleLoadBenchmark = async (benchmarkId: string) => {
    try {
      const runRes = await api.runSandboxBenchmark(benchmarkId);
      const docId = runRes.diagnostic.doc_id;

      const analysisRes = await api.getAnalysis(docId);
      setActiveAnalysis(analysisRes);

      const docContent = await api.getDocument(docId);
      setActiveDocument(docContent);

      const chk = await api.getChecklist(docId);
      setActiveChecklist(chk.items);

      const brief = await api.getLawyerBrief(docId);
      setActiveBrief(brief);

      setActiveTab('workspace');
    } catch (err: any) {
      alert(`Benchmark Loading Error: ${err.message}`);
    }
  };

  // Handle Copilot Inquiry
  const handleAskCopilot = async (question: string): Promise<GroundedAnswer> => {
    if (!activeAnalysis) throw new Error('No active document.');
    return api.askCopilot(activeAnalysis.metadata.doc_id, question, country, state);
  };

  // Toggle Checklist item
  const handleToggleChecklist = async (itemId: string, completed: boolean) => {
    await api.toggleChecklistItem(itemId, completed);
    setActiveChecklist((prev) =>
      prev.map((item) => (item.item_id === itemId ? { ...item, completed } : item))
    );
  };

  // Add Custom Checklist item
  const handleAddCustomChecklist = async (text: string, priority: string) => {
    if (!activeAnalysis) return;
    const newItem = await api.addCustomChecklistItem(activeAnalysis.metadata.doc_id, text, priority);
    setActiveChecklist((prev) => [...prev, newItem]);
  };

  // Update Lawyer Brief Notes
  const handleUpdateBriefNotes = async (notes: string) => {
    if (!activeAnalysis) return;
    const updated = await api.updateBriefNotes(activeAnalysis.metadata.doc_id, notes);
    setActiveBrief(updated);
  };

  // Run Demo Comparison (Employment V1 vs V2)
  const handleRunDemoCompare = async () => {
    setIsComparing(true);
    try {
      const b1 = await api.runSandboxBenchmark('bench_employment_v1');
      const b2 = await api.runSandboxBenchmark('bench_employment_v2');

      const compRes = await api.compareDocuments(
        b1.diagnostic.doc_id,
        b2.diagnostic.doc_id
      );
      setActiveComparison(compRes);
    } catch (err: any) {
      alert(`Comparison failed: ${err.message}`);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Top Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        country={country}
        setCountry={setCountry}
        state={state}
        setState={setState}
        onOpenUpload={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.pdf,.docx,.txt';
          input.onchange = (e) => handleFileUpload(e as any);
          input.click();
        }}
        highContrast={highContrast}
        fontSize={fontSize}
        plainLanguageMode={plainLanguageMode}
        onToggleContrast={() => setHighContrast(!highContrast)}
        onChangeFontSize={setFontSize}
        onTogglePlainLanguage={() => setPlainLanguageMode(!plainLanguageMode)}
        hasActiveDocument={!!activeAnalysis}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* If no document loaded and in workspace tab, show cinematic landing */}
        {activeTab === 'workspace' && !activeAnalysis && (
          <LandingPage
            onStartAnalysis={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf,.docx,.txt';
              input.onchange = (e) => handleFileUpload(e as any);
              input.click();
            }}
            onSelectBenchmark={handleLoadBenchmark}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
            onNavigateToTab={setActiveTab}
          />
        )}

        {/* Workspace 3-Panel Cockpit */}
        {activeTab === 'workspace' && activeAnalysis && (
          <WorkspaceLayout
            analysis={activeAnalysis}
            document={activeDocument}
            checklist={activeChecklist}
            lawyerBrief={activeBrief}
            onAskCopilot={handleAskCopilot}
            onToggleChecklistItem={handleToggleChecklist}
            onAddCustomChecklistItem={handleAddCustomChecklist}
            onUpdateBriefNotes={handleUpdateBriefNotes}
            onUploadNewFile={handleFileUpload}
            plainLanguageMode={plainLanguageMode}
          />
        )}

        {/* Version Comparison Tab */}
        {activeTab === 'compare' && (
          <div className="flex-1 p-4">
            <DocumentComparisonView
              comparison={activeComparison}
              onRunDemoCompare={handleRunDemoCompare}
              isLoading={isComparing}
            />
          </div>
        )}

        {/* Jury Sandbox Tab */}
        {activeTab === 'sandbox' && (
          <div className="flex-1 p-4">
            <JurySandbox
              onLoadBenchmarkIntoWorkspace={handleLoadBenchmark}
            />
          </div>
        )}
      </main>

      {/* Legal Safety Modal */}
      <LegalDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
};

export default App;
