import React, { useState } from 'react';
import {
  Briefcase,
  Printer,
  FileCheck,
  HelpCircle,
  FolderArchive,
  AlertCircle,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { LawyerBrief } from '../../types';

interface LawyerPrepBriefProps {
  brief: LawyerBrief | null;
  onUpdateNotes: (notes: string) => Promise<void>;
}

export const LawyerPrepBrief: React.FC<LawyerPrepBriefProps> = ({
  brief,
  onUpdateNotes,
}) => {
  const [notes, setNotes] = useState(brief?.user_notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!brief) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-slate-500 border border-slate-800 rounded-xl bg-slate-900/40">
        <Briefcase className="w-10 h-10 mb-2 text-slate-600 animate-pulse" />
        <p className="text-xs">No preparation brief generated yet. Analyze a document first.</p>
      </div>
    );
  }

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      await onUpdateNotes(notes);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header with Print Button */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-600/20 text-blue-400">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-semibold text-white">
              Lawyer Consultation Brief
            </h2>
            <p className="text-[10px] text-slate-400">
              Professional dossier to maximize the efficiency of your legal consult
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium shadow transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Printable Brief Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm text-slate-200">
        {/* Document Header Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 printable-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                Target Agreement
              </span>
              <h1 className="text-base sm:text-lg font-bold text-white">
                {brief.document_title}
              </h1>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400 block text-[11px]">Jurisdiction:</span>
              <span className="font-semibold text-slate-200">{brief.jurisdiction}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            <div>
              <span className="text-slate-400">Detected Type: </span>
              <span className="text-white font-medium">{brief.doc_type}</span>
            </div>
            <div>
              <span className="text-slate-400">Named Parties: </span>
              <span className="text-white font-medium">{brief.parties.join(' • ')}</span>
            </div>
          </div>
        </div>

        {/* 1. Executive Purpose Summary */}
        <section className="space-y-2 printable-card">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            Executive Purpose & Overview
          </h2>
          <p className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            {brief.executive_summary}
          </p>
        </section>

        {/* 2. Questions to Ask the Lawyer */}
        <section className="space-y-2 printable-card">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            Strategic Questions for Your Attorney
          </h2>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
            {brief.questions_for_lawyer.map((q, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <span className="w-5 h-5 rounded-full bg-blue-900/60 border border-blue-700 text-blue-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-slate-200 font-medium leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. High-Priority Clauses to Discuss */}
        <section className="space-y-2 printable-card">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Clauses Warrants Legal Discussion ({brief.high_priority_clauses.length})
          </h2>
          <div className="space-y-2">
            {brief.high_priority_clauses.map((clause) => (
              <div
                key={clause.clause_id}
                className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 text-xs">
                    {clause.title} ({clause.category})
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Page {clause.page_number}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-serif italic border-l-2 border-slate-700 pl-2">
                  "{clause.excerpt}"
                </p>
                <p className="text-[11px] text-amber-300">
                  <strong>Why review with counsel:</strong> {clause.potential_consideration}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Documents to Bring */}
        <section className="space-y-2 printable-card">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FolderArchive className="w-4 h-4 text-purple-400" />
            Documents to Bring to Consultation
          </h2>
          <ul className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
            {brief.documents_to_bring.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="text-purple-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. User Custom Notes */}
        <section className="space-y-2 no-print">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Personal Consultation Notes
            </h2>
            {savedSuccess && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Notes Saved
              </span>
            )}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write down specific background facts, verbal promises made by the counterparty, or questions you want to remember during your meeting..."
            rows={4}
            className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSaveNotes}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Notes'}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
