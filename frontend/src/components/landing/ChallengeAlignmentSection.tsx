import React from 'react';
import { BookOpen, GitCompare, Compass, HelpCircle, CheckSquare, FileText, ArrowRight } from 'lucide-react';

interface ChallengeAlignmentSectionProps {
  onStartAnalysis: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const ChallengeAlignmentSection: React.FC<ChallengeAlignmentSectionProps> = ({
  onStartAnalysis,
  onNavigateToTab,
}) => {
  const ALIGNMENT_WORKFLOWS = [
    {
      intent: 'UNDERSTAND',
      title: 'Understand a Legal Document',
      description: 'Upload a contract, lease, or agreement to extract clear summaries, obligations, and plain-English translations.',
      icon: BookOpen,
      actionText: 'Understand a Document',
      tab: 'workspace',
      color: 'blue',
    },
    {
      intent: 'COMPARE',
      title: 'Compare Document Versions',
      description: 'Compare baseline and revised agreements to detect added, removed, and modified provisions with obligation shift details.',
      icon: GitCompare,
      actionText: 'Compare Documents',
      tab: 'compare',
      color: 'blue',
    },
    {
      intent: 'NAVIGATE',
      title: 'Navigate My Legal Situation',
      description: 'Explore contextual situational guidance, missing exhibit detection, and 3 informational paths based on your role.',
      icon: Compass,
      actionText: 'Navigate Situation',
      tab: 'navigate',
      color: 'emerald',
    },
    {
      intent: 'ASK QUESTIONS',
      title: 'Ask Grounded Legal Questions',
      description: 'Ask questions strictly grounded in the document text, receiving verbatim quotes, uncertainties, and verification steps.',
      icon: HelpCircle,
      actionText: 'Ask Copilot',
      tab: 'workspace',
      color: 'blue',
    },
    {
      intent: 'GENERATE CHECKLIST',
      title: 'Actionable Action Checklists',
      description: 'Organize document-derived tasks, general preparation guidance, and clarification questions with exact citations.',
      icon: CheckSquare,
      actionText: 'View Checklist',
      tab: 'workspace',
      color: 'emerald',
    },
    {
      intent: 'PREPARE FOR LAWYER',
      title: 'Prepare for Attorney Consultation',
      description: 'Generate a printable lawyer brief featuring facts to verify, high-priority clauses, and tactical questions for counsel.',
      icon: FileText,
      actionText: 'Prepare Brief',
      tab: 'workspace',
      color: 'blue',
    },
  ];

  return (
    <section id="how-lexlens-helps" className="py-16 bg-slate-950/80 border-b border-slate-800 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            DIRECT CHALLENGE ALIGNMENT
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
            How LexLens Delivers AI Legal Assistance &amp; Access
          </h2>
          <p className="text-sm text-slate-300">
            LexLens helps non-lawyers navigate legal information through 6 primary interactive workflows — grounded in document text without providing unauthorized legal advice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALIGNMENT_WORKFLOWS.map((wf, idx) => {
            const Icon = wf.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {wf.intent}
                    </span>
                    <div className={`p-2 rounded-lg bg-${wf.color}-500/10 text-${wf.color}-400`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-base">{wf.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{wf.description}</p>
                </div>

                <button
                  onClick={() => {
                    if (wf.tab === 'workspace') onStartAnalysis();
                    else onNavigateToTab(wf.tab);
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{wf.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
