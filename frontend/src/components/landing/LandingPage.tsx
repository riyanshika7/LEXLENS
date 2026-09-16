import React, { useState } from 'react';
import {
  Upload,
  Shield,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Briefcase,
} from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onSelectBenchmark: (benchmarkId: string) => void;
  onOpenDisclaimer: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  onSelectBenchmark,
  onOpenDisclaimer,
}) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-medium mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Next-Generation Legal Document Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Legal documents shouldn’t require a law degree to understand.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
              AI-powered document intelligence that helps you understand important clauses, identify questions, and prepare for professional legal guidance.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={onStartAnalysis}
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Upload className="w-4 h-4" />
                <span>Analyze a Document</span>
              </button>

              <button
                onClick={() => setShowHowItWorks(!showHowItWorks)}
                className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>{showHowItWorks ? 'Hide Workflow' : 'See How It Works'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Benchmark Quick Start Pills */}
            <div className="pt-6 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-3 font-medium">
                Or test instantly with real benchmark contracts (zero upload required):
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => onSelectBenchmark('bench_lease')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileTextIcon />
                  <span>Commercial Lease Agreement</span>
                </button>
                <button
                  onClick={() => onSelectBenchmark('bench_contractor')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileTextIcon />
                  <span>Independent Contractor Agreement</span>
                </button>
                <button
                  onClick={() => onSelectBenchmark('bench_nda')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileTextIcon />
                  <span>Mutual NDA</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Document Preview Mockup */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-slate-300">Apex_Commercial_Lease_2025.txt</span>
              </div>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Validated & Indexed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Card 1: Document Extract */}
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-slate-300">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-1">
                  1. Document Text Anchor
                </span>
                <p className="line-clamp-4 leading-relaxed text-slate-400">
                  "SECTION 6. INDEMNIFICATION. Tenant agrees to defend, indemnify, and hold harmless Landlord against any and all claims, liabilities, damages, and attorneys' fees..."
                </p>
                <div className="mt-2 text-[10px] text-amber-400 font-sans font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Unilateral indemnity detected</span>
                </div>
              </div>

              {/* Card 2: Plain English */}
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                  2. Plain-Language Explanation
                </span>
                <p className="line-clamp-4 text-slate-300 leading-relaxed">
                  You are required to pay for the landlord's defense and lawyer fees if a lawsuit occurs on the property, even if you did not directly cause it.
                </p>
                <div className="mt-2 text-[10px] text-slate-400 font-medium">
                  Confidence: 96% • Ask a Lawyer
                </div>
              </div>

              {/* Card 3: Actionable Copilot */}
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block mb-1">
                  3. Actionable Checklist
                </span>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    <input type="checkbox" readOnly checked className="rounded text-blue-600" />
                    <span>Confirm notice deadline (10 days)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <input type="checkbox" readOnly className="rounded text-blue-600" />
                    <span>Ask lawyer for mutual indemnity clause</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Drawer */}
      {showHowItWorks && (
        <section className="py-14 bg-slate-900/50 border-b border-slate-800 animate-fade-in">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-center text-white mb-8">
              The Connected Legal Intelligence Journey
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="p-2.5 rounded-lg bg-blue-600/20 text-blue-400 w-fit mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white mb-1">1. Ingest & Validate</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload PDF, DOCX, or TXT. Automatic magic-byte validation protects against corrupted, encrypted, or zero-byte files.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-400 w-fit mb-3">
                  <FileSearch className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white mb-1">2. Understand & Map</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Extracts clauses into 12 legal categories, maps affirmative obligations, and flags high-attention provisions with plain translations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="p-2.5 rounded-lg bg-purple-600/20 text-purple-400 w-fit mb-3">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white mb-1">3. Grounded Q&A</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ask any question. Answers are strictly grounded in exact document citations with stated uncertainties and zero hallucinations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="p-2.5 rounded-lg bg-amber-600/20 text-amber-400 w-fit mb-3">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white mb-1">4. Lawyer Dossier</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generates an action checklist and structured consultation brief with tactical questions and documents to bring to your attorney.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Safety & Responsible AI Banner */}
      <section className="py-8 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Ethical Legal Tech:</strong> LexLens does not fabricate statutes or guarantee legal outcomes. All processing happens in-memory with strict privacy controls.
            </span>
          </div>
          <button
            onClick={onOpenDisclaimer}
            className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 shrink-0"
          >
            Review Safety Principles
          </button>
        </div>
      </section>
    </div>
  );
};

const FileTextIcon = () => (
  <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
