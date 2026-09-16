import React, { useState } from 'react';
import {
  GitCompare,
  PlusCircle,
  MinusCircle,
  Edit3,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ComparisonResult } from '../../types';

interface DocumentComparisonViewProps {
  comparison: ComparisonResult | null;
  onRunDemoCompare: () => Promise<void>;
  isLoading: boolean;
}

export const DocumentComparisonView: React.FC<DocumentComparisonViewProps> = ({
  comparison,
  onRunDemoCompare,
  isLoading,
}) => {
  const [filter, setFilter] = useState<'all' | 'added' | 'removed' | 'modified'>('all');

  const filteredClauses = comparison?.changed_clauses.filter((c) => {
    if (filter === 'added') return c.status === 'added';
    if (filter === 'removed') return c.status === 'removed';
    if (filter === 'modified') return c.status === 'modified';
    return true;
  }) || [];

  return (
    <div className="h-full flex flex-col bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-400" />
            <h1 className="text-sm sm:text-base font-bold text-white">
              Semantic Document Version Comparison
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compares operative obligations, liability shifts, and clause additions across contract versions
          </p>
        </div>

        <button
          onClick={onRunDemoCompare}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLoading ? 'Comparing...' : 'Run Benchmark Comparison (V1 vs V2)'}</span>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm">
        {!comparison ? (
          <div className="text-center py-16 space-y-4 max-w-md mx-auto">
            <div className="p-3 bg-blue-950/40 rounded-full w-fit mx-auto border border-blue-800/60 text-blue-400">
              <GitCompare className="w-8 h-8" />
            </div>
            <h2 className="text-sm font-semibold text-white">
              No Version Comparison Active
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare an original agreement with an updated redline proposal. Click the benchmark button above to test with an Executive Employment Agreement (Version 1 vs Version 2).
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Version Overview Pill Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 font-mono">
                    {comparison.doc1_name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="px-2 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                    {comparison.doc2_name}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                    +{comparison.total_added} Added
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                    -{comparison.total_removed} Removed
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
                    ~{comparison.total_modified} Modified
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {comparison.executive_summary}
              </p>
            </div>

            {/* Changed Terms Summary Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Changed Obligations */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="font-semibold text-blue-400 block text-[11px] uppercase tracking-wider">
                  Obligation Shifts
                </span>
                {comparison.changed_obligations.length === 0 ? (
                  <p className="text-slate-500 text-[11px]">No substantial duty changes.</p>
                ) : (
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {comparison.changed_obligations.map((ob, i) => (
                      <li key={i}>• {ob}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Changed Payment Terms */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="font-semibold text-emerald-400 block text-[11px] uppercase tracking-wider">
                  Payment / Financial Terms
                </span>
                {comparison.changed_payment_terms.length === 0 ? (
                  <p className="text-slate-500 text-[11px]">No compensation changes.</p>
                ) : (
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {comparison.changed_payment_terms.map((pt, i) => (
                      <li key={i}>• {pt}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Changed Dates / Deadlines */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="font-semibold text-purple-400 block text-[11px] uppercase tracking-wider">
                  Dates & Timelines
                </span>
                {comparison.changed_dates.length === 0 ? (
                  <p className="text-slate-500 text-[11px]">No notice/term timeline changes.</p>
                ) : (
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {comparison.changed_dates.map((dt, i) => (
                      <li key={i}>• {dt}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Filter Clauses:</span>
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  filter === 'all' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-800 text-slate-300'
                }`}
              >
                All Diffs ({comparison.changed_clauses.length})
              </button>
              <button
                onClick={() => setFilter('added')}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  filter === 'added' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Added ({comparison.total_added})
              </button>
              <button
                onClick={() => setFilter('removed')}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  filter === 'removed' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Removed ({comparison.total_removed})
              </button>
              <button
                onClick={() => setFilter('modified')}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  filter === 'modified' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Modified ({comparison.total_modified})
              </button>
            </div>

            {/* Clause Diffs List */}
            <div className="space-y-3">
              {filteredClauses.map((diff, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {diff.status === 'added' && (
                        <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {diff.status === 'removed' && (
                        <MinusCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      {diff.status === 'modified' && (
                        <Edit3 className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {diff.category}
                        </span>
                        <h3 className="text-xs sm:text-sm font-semibold text-white">
                          {diff.title}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        diff.status === 'added'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : diff.status === 'removed'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {diff.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {diff.semantic_change_summary}
                  </p>

                  {/* Side-by-Side Excerpt Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-serif">
                    {diff.old_text && (
                      <div className="p-2.5 rounded bg-rose-950/20 border border-rose-900/30 text-rose-200/90">
                        <span className="font-sans font-bold text-[10px] text-rose-400 uppercase block mb-1">
                          Version 1 (Original):
                        </span>
                        <p className="italic">"{diff.old_text}"</p>
                      </div>
                    )}
                    {diff.new_text && (
                      <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-900/30 text-emerald-200/90">
                        <span className="font-sans font-bold text-[10px] text-emerald-400 uppercase block mb-1">
                          Version 2 (Revised):
                        </span>
                        <p className="italic">"{diff.new_text}"</p>
                      </div>
                    )}
                  </div>

                  {diff.obligation_shift && (
                    <div className="text-[11px] text-purple-300 bg-purple-950/20 border border-purple-900/30 p-2 rounded">
                      <strong className="text-purple-200">Legal Shift: </strong>
                      {diff.obligation_shift}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
