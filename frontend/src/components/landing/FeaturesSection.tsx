import React from 'react';
import { Search, Layers, Clock, Bot, CheckSquare, Briefcase, GitCompare } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features-section" className="py-20 border-b border-slate-800/80 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-purple-400 block mb-2">
            Comprehensive Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for legal intelligence, not generic chatting.
          </h2>
        </div>

        <div className="space-y-12">
          {/* Feature 1 & 2 Grid: Document Intelligence + Clause Explorer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 w-fit" aria-hidden="true">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Document Intelligence Canvas</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Navigate page by page with full text search, section anchors, and active clause highlighting. Bidirectional navigation links clauses directly to exact coordinates on the document canvas.
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400">
                ✓ Page Jump • Search Index • Evidence Coordinates • No Re-Parsing
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 w-fit" aria-hidden="true">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Taxonomy Clause Explorer</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automatic classification into 12 legal categories: Termination, Payment, Indemnity, Confidentiality, Liability, Renewal, Dispute Resolution, and Non-Compete restrictions.
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-emerald-400 font-semibold block text-[11px]">Each Clause Card Includes:</span>
                <p className="text-[11px] text-slate-400">
                  Plain-Language Explanation • Real-World Impact • Potential Consideration • Confidence Score • "Ask a Lawyer" Flag
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 & 4 Grid: Risk & Obligation Map + Grounded Copilot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 w-fit" aria-hidden="true">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Party Obligations & Deadline Map</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Visualizes affirmative covenants using a party-based grouping: <strong>WHO</strong> must do <strong>WHAT</strong> by <strong>WHEN</strong> under <strong>WHICH CONDITION</strong>.
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono text-[10px]">TENANT OBLIGATION</span>
                  <span className="text-slate-500 text-[10px]">Page 3</span>
                </div>
                <p className="text-slate-200 font-medium">Maintain interior plumbing and electrical fixtures in good repair.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400 w-fit" aria-hidden="true">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Document-Grounded Legal Copilot</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Conversational assistant that refuses to guess. If a term is unmentioned, it clearly states: <em>"I couldn't find this information in the uploaded document."</em>
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono text-slate-400">
                <div>1. Plain Answer</div>
                <div>2. Verbatim Quote Evidence (Page & Section)</div>
                <div>3. Legal Interpretation & Stated Uncertainty</div>
                <div>4. Recommended Next Step for Counsel</div>
              </div>
            </div>
          </div>

          {/* Feature 5, 6, 7 Grid: Checklist + Lawyer Dossier + Version Diff */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div className="p-2 rounded bg-blue-600/20 text-blue-400 w-fit" aria-hidden="true">
                <CheckSquare className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Action Checklist</h4>
              <p className="text-slate-400 leading-relaxed">
                Interactive preparation checklist clearly tagging tasks as <strong>Document-Grounded</strong> vs <strong>General Guidance</strong>.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div className="p-2 rounded bg-purple-600/20 text-purple-400 w-fit" aria-hidden="true">
                <Briefcase className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Lawyer Consultation Dossier</h4>
              <p className="text-slate-400 leading-relaxed">
                Print-ready dossier with executive summaries, facts to verify, high-priority clauses, and custom user consultation notes.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div className="p-2 rounded bg-amber-600/20 text-amber-400 w-fit" aria-hidden="true">
                <GitCompare className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Version Comparator</h4>
              <p className="text-slate-400 leading-relaxed">
                Semantic version diffing highlighting added, removed, and modified clauses, changed compensation, and altered notice periods.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
