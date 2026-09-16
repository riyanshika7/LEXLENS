import React from 'react';
import { PlusCircle, MinusCircle, Edit3 } from 'lucide-react';
import { ClauseDiff } from '../../types';

interface ComparisonDiffViewerProps {
  clauses: ClauseDiff[];
}

export const ComparisonDiffViewer: React.FC<ComparisonDiffViewerProps> = ({ clauses }) => {
  if (clauses.length === 0) {
    return <p className="text-xs text-slate-500 py-4">No clauses match the selected filter.</p>;
  }

  return (
    <div className="space-y-3">
      {clauses.map((diff, index) => (
        <div key={index} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {diff.status === 'added' && <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
              {diff.status === 'removed' && <MinusCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {diff.status === 'modified' && <Edit3 className="w-4 h-4 text-amber-400 shrink-0" />}
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">{diff.category}</span>
                <h3 className="text-xs sm:text-sm font-semibold text-white">{diff.title}</h3>
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

          <p className="text-xs text-slate-300 leading-relaxed">{diff.semantic_change_summary}</p>

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
  );
};
