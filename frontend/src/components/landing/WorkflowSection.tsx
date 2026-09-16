import React from 'react';
import { FileText, Layers, Clock, Briefcase } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  return (
    <section id="workflow-section" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-rose-400 block mb-2">
            The Fundamental Problem
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Legalese creates friction at exactly the wrong moment.
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            When you receive an apartment lease, employment offer, or consulting agreement, signing blindly is risky — but legal fees are expensive and time is limited.
          </p>
        </div>

        {/* 4 User Pain Point Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-rose-400 font-mono text-xs font-semibold">01 / Confusion</span>
            <p className="font-semibold text-white text-sm">"I don't understand this clause."</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Archaic phrasing hides critical implications about liability, warranties, and arbitration.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-rose-400 font-mono text-xs font-semibold">02 / Hidden Burdens</span>
            <p className="font-semibold text-white text-sm">"What am I actually agreeing to?"</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unilateral obligations and indemnity clauses shift third-party damages onto your shoulders.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-rose-400 font-mono text-xs font-semibold">03 / Missed Deadlines</span>
            <p className="font-semibold text-white text-sm">"Is there a deadline I need to know about?"</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Conditional triggers (e.g. 5 days to contest fees or auto-renewal windows) pass unnoticed.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-rose-400 font-mono text-xs font-semibold">04 / Costly Consults</span>
            <p className="font-semibold text-white text-sm">"What should I ask my lawyer?"</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arriving unprepared burns billable hours ($350–$800/hr) on basic factual orientation.
            </p>
          </div>
        </div>

        {/* Transition: LexLens Turns the Document into a Map */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-blue-900/40 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 block mb-1">
              The LexLens Solution
            </span>
            <h3 className="text-lg sm:text-2xl font-bold text-white">
              LexLens turns the document into a map.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-center text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center">
              <FileText className="w-5 h-5 text-blue-400 mb-1" aria-hidden="true" />
              <span className="font-semibold text-slate-200">1. Document</span>
              <span className="text-[10px] text-slate-400">PDF, DOCX, TXT</span>
            </div>
            <div className="hidden md:flex items-center justify-center text-slate-600">→</div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center">
              <Layers className="w-5 h-5 text-emerald-400 mb-1" aria-hidden="true" />
              <span className="font-semibold text-slate-200">2. Clauses</span>
              <span className="text-[10px] text-slate-400">12+ categories</span>
            </div>
            <div className="hidden md:flex items-center justify-center text-slate-600">→</div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center">
              <Clock className="w-5 h-5 text-purple-400 mb-1" aria-hidden="true" />
              <span className="font-semibold text-slate-200">3. Obligations</span>
              <span className="text-[10px] text-slate-400">Duties & deadlines</span>
            </div>
            <div className="hidden md:flex items-center justify-center text-slate-600">→</div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center">
              <Briefcase className="w-5 h-5 text-amber-400 mb-1" aria-hidden="true" />
              <span className="font-semibold text-slate-200">4. Lawyer Dossier</span>
              <span className="text-[10px] text-slate-400">Tactical preparation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
