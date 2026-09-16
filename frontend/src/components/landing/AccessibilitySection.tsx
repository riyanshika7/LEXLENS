import React from 'react';

export const AccessibilitySection: React.FC = () => {
  return (
    <section id="accessibility-section" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-blue-400 block mb-2">
            Inclusive Legal Access
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Legal clarity should be accessible to more people.
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            WCAG 2.1 AA/AAA compliant. High contrast mode, text scaling up to 200%, and simplified language controls.
          </p>
        </div>

        {/* Before & After Visual Demonstration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/40 space-y-2">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block font-mono">
              BEFORE: ARCHAIC LEGALESE
            </span>
            <p className="font-serif italic text-slate-400 leading-relaxed">
              "The Tenant shall defend, indemnify, and hold harmless the Landlord, its successors and assigns, from and against any and all liabilities, losses, damages, penalties, and costs, including attorneys' fees, whether direct or consequential..."
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">
              AFTER: PLAIN ENGLISH (LEXLENS)
            </span>
            <p className="text-slate-200 font-medium leading-relaxed">
              "You are responsible for paying the landlord's lawyer fees and damages if someone gets hurt or sues over something that happens on the rented property."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
