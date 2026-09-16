import React, { useState } from 'react';
import {
  Layers,
  AlertOctagon,
  ExternalLink,
  Info,
} from 'lucide-react';
import { ClauseItem } from '../../types';

interface ClauseExplorerProps {
  clauses: ClauseItem[];
  selectedClauseId: string | null;
  onSelectClause: (clause: ClauseItem) => void;
  plainLanguageMode?: boolean;
}

export const ClauseExplorer: React.FC<ClauseExplorerProps> = ({
  clauses,
  selectedClauseId,
  onSelectClause,
  plainLanguageMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(clauses.map((c) => c.category)))];

  const filteredClauses = selectedCategory === 'All'
    ? clauses
    : clauses.filter((c) => c.category === selectedCategory);

  return (
    <div className="h-full flex flex-col bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Explorer Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs sm:text-sm font-semibold text-white">
            Clause Intelligence ({clauses.length})
          </h2>
        </div>
        <span className="text-[11px] text-slate-400">Click a clause to view document anchor</span>
      </div>

      {/* Category Pills */}
      <div className="p-2 border-b border-slate-800/80 bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Clauses List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredClauses.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No clauses found in this category.
          </div>
        ) : (
          filteredClauses.map((clause) => {
            const isSelected = selectedClauseId === clause.clause_id;

            return (
              <div
                key={clause.clause_id}
                onClick={() => onSelectClause(clause)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/40 shadow-lg'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Header: Title & Badges */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-0.5">
                      {clause.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      {clause.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {clause.ask_a_lawyer && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-950/60 text-rose-300 border border-rose-800/60">
                        <AlertOctagon className="w-3 h-3 text-rose-400" />
                        Ask a Lawyer
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {Math.round(clause.confidence * 100)}% Match
                    </span>
                  </div>
                </div>

                {/* Plain-Language Explanation */}
                <div className={`p-2.5 rounded-md border mb-2.5 text-xs text-slate-200 ${
                  plainLanguageMode
                    ? 'bg-emerald-950/30 border-emerald-700/80 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/90 border-slate-800/80'
                }`}>
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase block mb-1">
                    Plain-Language Explanation:
                  </span>
                  <p className="leading-relaxed font-medium">
                    {clause.plain_language_explanation}
                  </p>
                </div>

                {/* Why It Matters */}
                <div className="mb-2 text-xs text-slate-300">
                  <span className="font-semibold text-slate-200 block mb-0.5 flex items-center gap-1">
                    <Info className="w-3 h-3 text-blue-400" />
                    Why it matters:
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {clause.why_it_matters}
                  </p>
                </div>

                {/* Consideration Note */}
                <div className="mb-2 text-[11px] text-amber-300/90 bg-amber-950/20 border border-amber-900/40 rounded p-2">
                  <span className="font-semibold text-amber-300 block mb-0.5">
                    Potential Consideration:
                  </span>
                  <p className="leading-relaxed">
                    {clause.potential_consideration}
                  </p>
                </div>

                {/* Document Reference Anchor */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>
                    Page {clause.page_number} • {clause.section_title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectClause(clause);
                    }}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>Jump to Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
