import React from 'react';

export const AITransparencySection: React.FC = () => {
  return (
    <section className="py-20 border-b border-slate-800/80 bg-slate-900/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 block mb-2">
            Responsible AI Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed to show what the AI knows — and what it doesn’t.
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every insight is categorized into five distinct tiers of confidence and authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-[10px] block w-fit">
              TIER 1
            </span>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              FACT FROM DOCUMENT
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Verbatim excerpts, stated dates, and directly agreed monetary sums.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-bold text-[10px] block w-fit">
              TIER 2
            </span>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              AI INTERPRETATION
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Plain-language explanations translating legal terms of art into conversational English.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold text-[10px] block w-fit">
              TIER 3
            </span>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              POSSIBLE CONCERN
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Flags provisions that are unilateral, ambiguous, or frequently litigated.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800 font-bold text-[10px] block w-fit">
              TIER 4
            </span>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              USER ACTION
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Practical checklist steps: verifying names, setting calendar reminders, gathering schedules.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold text-[10px] block w-fit">
              TIER 5
            </span>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              LEGAL REVIEW
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Specific, targeted questions recommended for a licensed attorney in your jurisdiction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
