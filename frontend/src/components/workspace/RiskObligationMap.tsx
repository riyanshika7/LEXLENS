import React, { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  ClipboardList,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { DeadlineItem, ObligationItem, PotentialConcern } from '../../types';

interface RiskObligationMapProps {
  obligations: ObligationItem[];
  deadlines: DeadlineItem[];
  concerns: PotentialConcern[];
}

export const RiskObligationMap: React.FC<RiskObligationMapProps> = ({
  obligations,
  deadlines,
  concerns,
}) => {
  const [subTab, setSubTab] = useState<'concerns' | 'obligations' | 'deadlines'>('concerns');

  return (
    <div className="h-full flex flex-col bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Tab Switcher */}
      <div className="p-2 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-xs">
          <button
            onClick={() => setSubTab('concerns')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              subTab === 'concerns'
                ? 'bg-amber-600/20 text-amber-400 font-semibold border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Potential Concerns ({concerns.length})</span>
          </button>

          <button
            onClick={() => setSubTab('obligations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              subTab === 'obligations'
                ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Key Obligations ({obligations.length})</span>
          </button>

          <button
            onClick={() => setSubTab('deadlines')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              subTab === 'deadlines'
                ? 'bg-purple-600/20 text-purple-400 font-semibold border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Deadlines ({deadlines.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {/* Sub-tab 1: Potential Concerns */}
        {subTab === 'concerns' && (
          <div className="space-y-3">
            <p className="text-slate-400 text-[11px] mb-2">
              Clauses that contain unilateral burdens, ambiguities, or terms requiring professional legal review:
            </p>
            {concerns.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No high-attention concerns detected in this document.
              </div>
            ) : (
              concerns.map((concern) => (
                <div
                  key={concern.concern_id}
                  className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <AlertTriangle className={`w-3.5 h-3.5 ${
                        concern.severity === 'high' ? 'text-rose-400' : 'text-amber-400'
                      }`} />
                      {concern.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      concern.severity === 'high'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {concern.category}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {concern.description}
                  </p>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                    <span className="font-semibold text-purple-400 block mb-0.5 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      Advice for Lawyer Consultation:
                    </span>
                    <p className="text-slate-300">{concern.professional_review_advice}</p>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                    Source: Page {concern.page_number}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Sub-tab 2: Obligations */}
        {subTab === 'obligations' && (
          <div className="space-y-3">
            <p className="text-slate-400 text-[11px] mb-2">
              Affirmative and negative obligations binding the parties:
            </p>
            {obligations.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No explicit obligation clauses detected.
              </div>
            ) : (
              obligations.map((ob) => (
                <div
                  key={ob.obligation_id}
                  className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
                      Party: {ob.responsible_party}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Page {ob.page_number}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-200 text-xs mt-1">
                    {ob.action}
                  </h3>

                  <div className="text-[11px] text-slate-400 font-serif italic border-l-2 border-slate-700 pl-2 mt-1">
                    "{ob.excerpt}"
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Sub-tab 3: Deadlines */}
        {subTab === 'deadlines' && (
          <div className="space-y-3">
            <p className="text-slate-400 text-[11px] mb-2">
              Key calendar dates and triggering timelines:
            </p>
            {deadlines.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No explicit dates found in document text.
              </div>
            ) : (
              deadlines.map((dl) => (
                <div
                  key={dl.deadline_id}
                  className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      {dl.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {dl.date_or_trigger}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Consequence:</strong> {dl.consequence}
                  </p>

                  <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                    Page {dl.page_number} • {dl.source_clause_title}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
