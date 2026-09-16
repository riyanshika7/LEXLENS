import React, { useState } from 'react';

export const EvidenceSection: React.FC = () => {
  const [evidenceTab, setEvidenceTab] = useState<'termination' | 'indemnity' | 'payment'>('termination');

  return (
    <section id="evidence-section" className="py-20 border-b border-slate-800/80 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block mb-2">
            Uncompromising Grounding
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI shouldn't ask you to take its word for it.
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            LexLens connects explanations directly back to the document. Every insight references an exact page, section, and verbatim quote.
          </p>

          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setEvidenceTab('termination')}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                evidenceTab === 'termination' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Termination Provision
            </button>
            <button
              onClick={() => setEvidenceTab('indemnity')}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                evidenceTab === 'indemnity' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              One-Sided Indemnity
            </button>
            <button
              onClick={() => setEvidenceTab('payment')}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                evidenceTab === 'payment' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Late Rent Fee
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-5xl mx-auto">
          <div className="lg:col-span-6 p-5 rounded-xl bg-slate-900/90 border border-slate-800 font-serif leading-relaxed text-slate-300 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 font-sans text-xs text-slate-400">
              <span className="font-semibold text-white">DOCUMENT EXCERPT</span>
              <span className="font-mono">
                {evidenceTab === 'termination' && 'Section 8.1 · Page 5'}
                {evidenceTab === 'indemnity' && 'Section 6.2 · Page 3'}
                {evidenceTab === 'payment' && 'Section 3.2 · Page 2'}
              </span>
            </div>

            {evidenceTab === 'termination' && (
              <div className="p-3 rounded bg-blue-950/40 border-l-2 border-blue-500 text-slate-100">
                "Either party may terminate this agreement upon thirty (30) days' written notice to the other party, provided that all outstanding deliverables are compensated in full."
              </div>
            )}
            {evidenceTab === 'indemnity' && (
              <div className="p-3 rounded bg-amber-950/40 border-l-2 border-amber-500 text-slate-100">
                "Contractor shall indemnify, defend, and hold harmless Client against any and all claims, costs, damages, and legal fees arising out of the performance of services hereunder."
              </div>
            )}
            {evidenceTab === 'payment' && (
              <div className="p-3 rounded bg-rose-950/40 border-l-2 border-rose-500 text-slate-100">
                "If any installment of Base Rent is not received within five (5) business days of the due date, Tenant shall pay a late charge equal to five percent (5%) of the overdue amount."
              </div>
            )}
          </div>

          <div className="lg:col-span-6 p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-blue-400 font-mono text-[11px] uppercase tracking-wider">
                STRUCTURED AI INTERPRETATION
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium text-[10px]">
                High Confidence (98%)
              </span>
            </div>

            {evidenceTab === 'termination' && (
              <>
                <div>
                  <strong className="text-white block mb-0.5">Plain-English Translation:</strong>
                  <p className="text-slate-300 leading-relaxed">
                    The agreement allows either party to terminate with 30 days' written notice, provided completed work is paid for.
                  </p>
                </div>
                <div className="text-slate-400">
                  <strong className="text-slate-200">Why it matters: </strong>
                  Determines your exit runway and prevents abrupt termination without compensation.
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-amber-300 text-[11px]">
                  <strong>Professional Review: </strong>Consider legal review if definition of deliverables is disputed.
                </div>
              </>
            )}

            {evidenceTab === 'indemnity' && (
              <>
                <div>
                  <strong className="text-white block mb-0.5">Plain-English Translation:</strong>
                  <p className="text-slate-300 leading-relaxed">
                    You are required to pay for the client's lawyers and damages if a lawsuit arises related to your work. This is currently one-sided.
                  </p>
                </div>
                <div className="text-slate-400">
                  <strong className="text-slate-200">Why it matters: </strong>
                  One-sided indemnity is an elevated financial risk. If a third party sues, you could be on the hook for expenses.
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-rose-300 text-[11px]">
                  <strong>Professional Review: </strong>Ask an attorney to negotiate this clause to be mutual and capped.
                </div>
              </>
            )}

            {evidenceTab === 'payment' && (
              <>
                <div>
                  <strong className="text-white block mb-0.5">Plain-English Translation:</strong>
                  <p className="text-slate-300 leading-relaxed">
                    Rent has a 5-day grace period. Missing it results in a 5% penalty fee immediately.
                  </p>
                </div>
                <div className="text-slate-400">
                  <strong className="text-slate-200">Why it matters: </strong>
                  Late fees can compound and trigger lease default clauses if left unpaid for 10 days.
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-blue-300 text-[11px]">
                  <strong>Preparation Action: </strong>Set automated calendar reminders 7 days prior to rent due date.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
