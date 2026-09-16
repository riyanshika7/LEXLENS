import React, { useState } from 'react';
import { GitCompare, ArrowRight, Sparkles } from 'lucide-react';
import { ComparisonResult } from '../../types';
import { ComparisonDiffViewer } from './ComparisonDiffViewer';

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
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-400" aria-hidden="true" />
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
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span>{isLoading ? 'Comparing...' : 'Run Benchmark Comparison (V1 vs V2)'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm">
        {!comparison ? (
          <div className="text-center py-16 space-y-4 max-w-md mx-auto">
            <div className="p-3 bg-blue-950/40 rounded-full w-fit mx-auto border border-blue-800/60 text-blue-400">
              <GitCompare className="w-8 h-8" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-semibold text-white">No Version Comparison Active</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare an original agreement with an updated redline proposal. Click the benchmark button above to test with an Executive Employment Agreement (Version 1 vs Version 2).
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 font-mono">{comparison.doc1_name}</span>
                  <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
                  <span className="px-2 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">{comparison.doc2_name}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">+{comparison.total_added} Added</span>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-semibold">-{comparison.total_removed} Removed</span>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-semibold">~{comparison.total_modified} Modified</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{comparison.executive_summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="font-semibold text-blue-400 block text-[11px] uppercase tracking-wider">Obligation Shifts</span>
                {comparison.changed_obligations.length === 0 ? (
                  <p className="text-slate-500 text-[11px]">No substantial duty changes.</p>
                ) : (
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {comparison.changed_obligations.map((ob, i) => <li key={i}>• {ob}</li>)}
                  </ul>
                )}
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="font-semibold text-emerald-400 block text-[11px] uppercase tracking-wider">Financial Terms</span>
                {comparison.changed_payment_terms.length === 0 ? (
                  <p className="text-slate-500 text-[11px]">No compensation changes.</p>
                ) : (
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {comparison.changed_payment_terms.map((pt, i) => <li key={i}>• {pt}</li>)}
                  </ul>
                )}
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="font-semibold text-purple-400 block text-[11px] uppercase tracking-wider">Dates & Timelines</span>
                {comparison.changed_dates.length === 0 ? (
                  <p className="text-slate-500 text-[11px]">No timeline changes.</p>
                ) : (
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {comparison.changed_dates.map((dt, i) => <li key={i}>• {dt}</li>)}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Filter:</span>
              {(['all', 'added', 'removed', 'modified'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-md text-xs capitalize transition-colors ${
                    filter === f ? 'bg-blue-600 text-white font-medium' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <ComparisonDiffViewer clauses={filteredClauses} />
          </div>
        )}
      </div>
    </div>
  );
};
