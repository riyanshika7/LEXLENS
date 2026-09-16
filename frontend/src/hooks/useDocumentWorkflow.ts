import { useState } from 'react';
import {
  ChecklistItem,
  ComparisonResult,
  DocumentAnalysisResponse,
  DocumentContent,
  GroundedAnswer,
  LawyerBrief,
} from '../types';
import { api } from '../services/api';

export function useDocumentWorkflow(
  country: string,
  state: string,
  onNavigateTab: (tab: 'workspace' | 'compare' | 'sandbox') => void,
  onNotify: (msg: string, type: 'info' | 'success' | 'alert') => void
) {
  const [activeAnalysis, setActiveAnalysis] = useState<DocumentAnalysisResponse | null>(null);
  const [activeDocument, setActiveDocument] = useState<DocumentContent | null>(null);
  const [activeChecklist, setActiveChecklist] = useState<ChecklistItem[]>([]);
  const [activeBrief, setActiveBrief] = useState<LawyerBrief | null>(null);
  const [activeComparison, setActiveComparison] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const analysisRes = await api.uploadDocument(file, country, state);
      setActiveAnalysis(analysisRes);

      const docContent = await api.getDocument(analysisRes.metadata.doc_id);
      setActiveDocument(docContent);

      const chk = await api.getChecklist(analysisRes.metadata.doc_id);
      setActiveChecklist(chk.items);

      const brief = await api.getLawyerBrief(analysisRes.metadata.doc_id);
      setActiveBrief(brief);

      onNavigateTab('workspace');
      onNotify(`Document '${file.name}' successfully parsed and analyzed.`, 'success');
    } catch (err: any) {
      onNotify(`Upload Error: ${err.message || 'Failed to parse document'}`, 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadBenchmark = async (benchmarkId: string) => {
    setIsLoading(true);
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

      onNavigateTab('workspace');
      onNotify(`Benchmark '${runRes.benchmark.title}' loaded into workspace.`, 'info');
    } catch (err: any) {
      onNotify(`Benchmark Error: ${err.message}`, 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskCopilot = async (question: string): Promise<GroundedAnswer> => {
    if (!activeAnalysis) throw new Error('No active document.');
    return api.askCopilot(activeAnalysis.metadata.doc_id, question, country, state);
  };

  const handleToggleChecklist = async (itemId: string, completed: boolean) => {
    await api.toggleChecklistItem(itemId, completed);
    setActiveChecklist((prev) =>
      prev.map((item) => (item.item_id === itemId ? { ...item, completed } : item))
    );
  };

  const handleAddCustomChecklist = async (text: string, priority: string) => {
    if (!activeAnalysis) return;
    const newItem = await api.addCustomChecklistItem(activeAnalysis.metadata.doc_id, text, priority);
    setActiveChecklist((prev) => [...prev, newItem]);
  };

  const handleUpdateBriefNotes = async (notes: string) => {
    if (!activeAnalysis) return;
    const updated = await api.updateBriefNotes(activeAnalysis.metadata.doc_id, notes);
    setActiveBrief(updated);
  };

  const handleRunDemoCompare = async () => {
    setIsComparing(true);
    try {
      const b1 = await api.runSandboxBenchmark('bench_lease');
      const b2 = await api.runSandboxBenchmark('bench_contractor');
      const compRes = await api.compareDocuments(b1.diagnostic.doc_id, b2.diagnostic.doc_id);
      setActiveComparison(compRes);
      onNotify('Version comparison completed with semantic diff.', 'success');
    } catch (err: any) {
      onNotify(`Comparison failed: ${err.message}`, 'alert');
    } finally {
      setIsComparing(false);
    }
  };

  return {
    activeAnalysis,
    activeDocument,
    activeChecklist,
    activeBrief,
    activeComparison,
    isComparing,
    isLoading,
    handleFileUpload,
    handleLoadBenchmark,
    handleAskCopilot,
    handleToggleChecklist,
    handleAddCustomChecklist,
    handleUpdateBriefNotes,
    handleRunDemoCompare,
  };
}
