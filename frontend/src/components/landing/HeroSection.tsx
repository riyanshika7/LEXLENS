import React, { useState } from 'react';
import { Upload, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onStartAnalysis: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartAnalysis }) => {
  const [activeStep, setActiveStep] = useState<number>(2);

  return (
    <section id="hero-section" className="relative pt-16 pb-20 border-b border-slate-800/80 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-blue-900/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI LEGAL INFORMATION &amp; DOCUMENT ASSISTANCE</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-mono">FOR NON-LAWYERS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
            Understand the document. Explore your options. Prepare your next step.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto font-normal">
            LexLens helps non-lawyers understand legal information, navigate important provisions, compare document versions, ask document-grounded questions, and prepare for qualified legal consultations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button
              onClick={onStartAnalysis}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Understand a Document</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('how-lexlens-helps');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span>Explore Legal Assistance</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <p className="text-xs text-slate-400 font-mono tracking-wide">
            Built for Tenants &bull; Employees &bull; Contractors &bull; Small Business Owners
          </p>
        </div>

        {/* 3-Panel Traceability Canvas */}
        <div id="cockpit-preview" className="mt-14 max-w-5xl mx-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-2xl p-4 sm:p-5 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
              <span className="font-mono text-slate-300 ml-1">Executive_Employment_Agreement_2025.txt</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/80 font-mono">
                State of Washington
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-500 mr-1 hidden sm:inline">Traceability Pipeline:</span>
              <button
                onClick={() => setActiveStep(1)}
                className={`px-2 py-0.5 rounded ${activeStep === 1 ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                1. Excerpt
              </button>
              <span className="text-slate-600">→</span>
              <button
                onClick={() => setActiveStep(2)}
                className={`px-2 py-0.5 rounded ${activeStep === 2 ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                2. Clause
              </button>
              <span className="text-slate-600">→</span>
              <button
                onClick={() => setActiveStep(3)}
                className={`px-2 py-0.5 rounded ${activeStep === 3 ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                3. Copilot Answer
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 text-xs">
            <div className={`lg:col-span-4 p-3.5 rounded-lg border transition-all ${
              activeStep === 1 ? 'bg-slate-950 border-blue-500 ring-1 ring-blue-500/40' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                <span>DOCUMENT CANVAS</span>
                <span>PAGE 4 OF 8</span>
              </div>
              <div className="font-serif leading-relaxed text-slate-400 text-[11px] space-y-2">
                <p className="line-clamp-2">
                  7.1 Duties. Executive shall report directly to the Chief Executive Officer and perform standard responsibilities.
                </p>
                <div className="p-2 rounded bg-blue-950/60 border-l-2 border-blue-500 text-slate-200">
                  <span className="font-sans font-bold text-[9px] text-blue-400 block mb-0.5 uppercase tracking-wider">
                    § 7.2 Termination Notice & Severance
                  </span>
                  "Either party may terminate this Agreement without cause upon providing thirty (30) days' prior written notice. Upon termination without cause, Company shall pay two (2) months base salary."
                </div>
                <p className="line-clamp-2 text-slate-500 text-[10px]">
                  7.3 Inventions. Executive hereby assigns all right, title and interest in work product.
                </p>
              </div>
            </div>

            <div className={`lg:col-span-4 p-3.5 rounded-lg border transition-all ${
              activeStep === 2 ? 'bg-slate-950 border-blue-500 ring-1 ring-blue-500/40' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px]">
                <span className="text-blue-400 font-bold uppercase tracking-wider">CLAUSE INTELLIGENCE</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80 font-semibold text-[9px]">
                  Ask a Lawyer
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-white text-xs">Termination Without Cause & Severance</h3>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-semibold text-emerald-400 block mb-0.5 uppercase">
                    Plain-English Explanation:
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Either you or the company can end employment with 30 days written notice. You receive 2 months of severance pay if discharged without fault.
                  </p>
                </div>
                <div className="text-[11px] text-slate-400">
                  <strong className="text-slate-300">Why it matters: </strong>
                  Verify whether health insurance benefits continue during the 2 months of severance.
                </div>
              </div>
            </div>

            <div className={`lg:col-span-4 p-3.5 rounded-lg border transition-all ${
              activeStep === 3 ? 'bg-slate-950 border-blue-500 ring-1 ring-blue-500/40' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px]">
                <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Grounded Copilot
                </span>
                <span className="text-slate-500 font-mono">98% Confidence</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded bg-blue-950/40 border border-blue-900/50 text-blue-200 text-[11px]">
                  <strong>Q: </strong>"How much notice is required to end this contract?"
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-200 space-y-1">
                  <p className="leading-relaxed">
                    <strong>Answer: </strong>Based on Section 7.2, <strong>thirty (30) days' prior written notice</strong> is required for either party.
                  </p>
                  <div className="text-[10px] font-mono text-blue-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                    <span>Source: § 7.2 · Page 4</span>
                    <span className="text-slate-500">Traceable Quote</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400">
                  <strong className="text-purple-300">Next Step: </strong>Verify if notice must be certified mail (§ 11.1).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
