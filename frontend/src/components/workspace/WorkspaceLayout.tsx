import React, { useState } from 'react';
import {
  FileText,
  Upload,
} from 'lucide-react';
import {
  ClauseItem,
  DocumentAnalysisResponse,
  DocumentContent,
  GroundedAnswer,
  LawyerBrief,
  ChecklistItem,
} from '../../types';
import { DocumentViewer } from './DocumentViewer';
import { ClauseExplorer } from './ClauseExplorer';
import { RiskObligationMap } from './RiskObligationMap';
import { CopilotChat } from './CopilotChat';
import { ActionChecklist } from './ActionChecklist';
import { LawyerPrepBrief } from './LawyerPrepBrief';

interface WorkspaceLayoutProps {
  analysis: DocumentAnalysisResponse | null;
  document: DocumentContent | null;
  checklist: ChecklistItem[];
  lawyerBrief: LawyerBrief | null;
  onAskCopilot: (question: string) => Promise<GroundedAnswer>;
  onToggleChecklistItem: (itemId: string, completed: boolean) => void;
  onAddCustomChecklistItem: (text: string, priority: string) => void;
  onUpdateBriefNotes: (notes: string) => Promise<void>;
  onUploadNewFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  plainLanguageMode: boolean;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  analysis,
  document,
  checklist,
  lawyerBrief,
  onAskCopilot,
  onToggleChecklistItem,
  onAddCustomChecklistItem,
  onUpdateBriefNotes,
  onUploadNewFile,
  plainLanguageMode,
}) => {
  const [centerTab, setCenterTab] = useState<'clauses' | 'risk_map' | 'checklist' | 'brief'>('clauses');
  const [selectedClause, setSelectedClause] = useState<ClauseItem | null>(null);

  if (!analysis || !document) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto space-y-4">
        <div className="p-4 rounded-full bg-blue-950/60 border border-blue-800/80 text-blue-400">
          <Upload className="w-10 h-10 animate-bounce" />
        </div>
        <h2 className="text-xl font-bold text-white">Upload Your Legal Document</h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Upload any lease, NDA, employment agreement, contractor contract, or terms sheet. Supported formats: PDF, DOCX, TXT (up to 10MB).
        </p>

        <label className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2">
          <Upload className="w-4 h-4" />
          <span>Select Document to Analyze</span>
          <input
            type="file"
            onChange={onUploadNewFile}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />
        </label>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-3 sm:p-4 space-y-3">
      {/* Top Document Intelligence Banner */}
      <div className="p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-md" title={analysis.metadata.filename}>
                {analysis.metadata.filename}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
                {analysis.summary.doc_type}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
              <span>Parties: <strong className="text-slate-200">{analysis.summary.parties.join(', ')}</strong></span>
              <span>•</span>
              <span>Pages: <strong className="text-slate-200">{analysis.metadata.page_count}</strong></span>
              <span>•</span>
              <span>Jurisdiction: <strong className="text-slate-200">{analysis.metadata.jurisdiction_country}, {analysis.metadata.jurisdiction_state}</strong></span>
            </div>
          </div>
        </div>

        {/* Upload Another File Button */}
        <label className="cursor-pointer shrink-0 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Another</span>
          <input
            type="file"
            onChange={onUploadNewFile}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />
        </label>
      </div>

      {/* Main 3-Panel Professional Cockpit Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        {/* LEFT PANEL: Document Viewer (4 cols) */}
        <section className="lg:col-span-4 h-[600px] lg:h-auto min-h-0" aria-label="Document Viewer">
          <DocumentViewer
            document={document}
            selectedClauseExcerpt={selectedClause?.excerpt}
          />
        </section>

        {/* CENTER PANEL: Clause Explorer & Navigation (4 cols) */}
        <section className="lg:col-span-4 h-[600px] lg:h-auto min-h-0 flex flex-col space-y-2" aria-label="Clause Context">
          {/* Navigation Sub-Tabs */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs shrink-0">
            <button
              onClick={() => setCenterTab('clauses')}
              className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition-colors ${
                centerTab === 'clauses'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Clauses ({analysis.clauses.length})
            </button>
            <button
              onClick={() => setCenterTab('risk_map')}
              className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition-colors ${
                centerTab === 'risk_map'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Risks & Duties
            </button>
            <button
              onClick={() => setCenterTab('checklist')}
              className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition-colors ${
                centerTab === 'checklist'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Checklist ({checklist.length})
            </button>
            <button
              onClick={() => setCenterTab('brief')}
              className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition-colors ${
                centerTab === 'brief'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lawyer Dossier
            </button>
          </div>

          <div className="flex-1 min-h-0">
            {centerTab === 'clauses' && (
              <ClauseExplorer
                clauses={analysis.clauses}
                selectedClauseId={selectedClause?.clause_id || null}
                onSelectClause={setSelectedClause}
                plainLanguageMode={plainLanguageMode}
              />
            )}
            {centerTab === 'risk_map' && (
              <RiskObligationMap
                obligations={analysis.obligations}
                deadlines={analysis.deadlines}
                concerns={analysis.concerns}
              />
            )}
            {centerTab === 'checklist' && (
              <ActionChecklist
                items={checklist}
                onToggleItem={onToggleChecklistItem}
                onAddCustomItem={onAddCustomChecklistItem}
              />
            )}
            {centerTab === 'brief' && (
              <LawyerPrepBrief
                brief={lawyerBrief}
                onUpdateNotes={onUpdateBriefNotes}
              />
            )}
          </div>
        </section>

        {/* RIGHT PANEL: AI Legal Copilot (4 cols) */}
        <section className="lg:col-span-4 h-[600px] lg:h-auto min-h-0" aria-label="Legal Copilot Chat">
          <CopilotChat
            onAsk={(q) => onAskCopilot(q)}
          />
        </section>
      </div>
    </div>
  );
};
