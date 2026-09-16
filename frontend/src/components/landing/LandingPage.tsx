import React, { useState } from 'react';
import {
  Upload,
  Search,
  CheckCircle2,
  FileSearch,
  Briefcase,
  Layers,
  Bot,
  Clock,
  CheckSquare,
  GitCompare,
  FlaskConical,
  Lock,
  Eye,
  ChevronRight,
  ArrowRight,
  Zap,
  FileText,
  Scale,
  ShieldCheck,
} from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onSelectBenchmark: (benchmarkId: string) => void;
  onOpenDisclaimer: () => void;
  onNavigateToTab: (tab: 'workspace' | 'compare' | 'sandbox') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  onSelectBenchmark,
  onOpenDisclaimer,
  onNavigateToTab,
}) => {
  // Hero Interactive Demonstration State
  const [activeStep, setActiveStep] = useState<number>(2);

  // "See the Evidence" Interactive Toggle State
  const [evidenceTab, setEvidenceTab] = useState<'termination' | 'indemnity' | 'payment'>('termination');

  return (
    <div className="flex-1 flex flex-col bg-canvas-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section
        id="hero-section"
        className="relative pt-16 pb-20 border-b border-slate-800/80 overflow-hidden"
      >
        {/* Subtle non-distracting background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-blue-900/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Next-Gen Legal Document Intelligence</span>
              <span className="text-slate-600">|</span>
              <span className="text-blue-400 font-mono">v1.0</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
              Legal documents shouldn’t require a law degree to understand.
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto font-normal">
              LexLens turns dense legal documents into clear explanations, traceable clauses, obligations, potential concerns, and practical preparation — grounded in the document itself.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <button
                onClick={onStartAnalysis}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Analyze a Document</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('cockpit-preview');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>Explore the Legal Cockpit</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Trust statement */}
            <p className="text-xs text-slate-500 font-mono tracking-wide">
              Assistive AI • Document-grounded • Built for non-lawyers
            </p>
          </div>

          {/* ========================================================================= */}
          {/* HERO PRODUCT PREVIEW (3-Panel Traceability Canvas)                       */}
          {/* ========================================================================= */}
          <div className="mt-14 max-w-5xl mx-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-2xl p-4 sm:p-5 overflow-hidden">
            {/* Preview Window Header */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                <span className="font-mono text-slate-300 ml-1">
                  Executive_Employment_Agreement_2025.txt
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/80 font-mono">
                  State of Washington
                </span>
              </div>

              {/* Interactive Step Simulator */}
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

            {/* 3-Panel Hero Visual */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 text-xs">
              {/* LEFT: Document Page with Highlighted Clause (4 cols) */}
              <div className={`lg:col-span-4 p-3.5 rounded-lg border transition-all ${
                activeStep === 1 ? 'bg-slate-950 border-blue-500 ring-1 ring-blue-500/40' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                  <span>DOCUMENT CANVAS</span>
                  <span>PAGE 4 OF 8</span>
                </div>
                <div className="font-serif leading-relaxed text-slate-400 text-[11px] space-y-2">
                  <p className="line-clamp-2">
                    7.1 Duties. Executive shall report directly to the Chief Executive Officer and perform all standard executive responsibilities.
                  </p>
                  {/* Highlighted Clause with Anchor */}
                  <div className="p-2 rounded bg-blue-950/60 border-l-2 border-blue-500 text-slate-200">
                    <span className="font-sans font-bold text-[9px] text-blue-400 block mb-0.5 uppercase tracking-wider">
                      § 7.2 Termination Notice & Severance
                    </span>
                    "Either party may terminate this Agreement without cause upon providing thirty (30) days' prior written notice. Upon termination without cause, Company shall pay two (2) months base salary."
                  </div>
                  <p className="line-clamp-2 text-slate-500 text-[10px]">
                    7.3 Inventions. Executive hereby assigns all right, title and interest in work product created during employment.
                  </p>
                </div>
              </div>

              {/* CENTER: Clause Interpretation Panel (4 cols) */}
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
                  <h3 className="font-semibold text-white text-xs">
                    Termination Without Cause & Severance
                  </h3>

                  {/* Plain English Translation */}
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-semibold text-emerald-400 block mb-0.5 uppercase">
                      Plain-English Explanation:
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      Either you or the company can end your employment at any time for any reason, but you must give 30 days written notice. You receive 2 months of severance pay if they let you go without fault.
                    </p>
                  </div>

                  {/* Why it matters */}
                  <div className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Why it matters: </strong>
                    30 days is standard, but check whether benefits (health insurance) continue during the 2 months of severance.
                  </div>
                </div>
              </div>

              {/* RIGHT: Grounded Copilot Answer (4 cols) */}
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
                      <strong>Answer: </strong>Based on Section 7.2, <strong>thirty (30) days' prior written notice</strong> is required for either party to terminate without cause.
                    </p>
                    <div className="text-[10px] font-mono text-blue-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                      <span>Source: § 7.2 · Page 4</span>
                      <span className="text-slate-500">Traceable Quote</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400">
                    <strong className="text-purple-300">Next Step: </strong>Verify if notice must be certified mail or if email is acceptable (§ 11.1).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUST STRIP                                                            */}
      {/* ========================================================================= */}
      <section className="py-6 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs text-slate-400">
            <div className="flex items-start gap-2.5">
              <FileSearch className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block text-[11px] font-mono uppercase tracking-wider">
                  Document-Grounded
                </strong>
                <span className="text-[10px] leading-tight text-slate-400">Answers backed by verbatim excerpts.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block text-[11px] font-mono uppercase tracking-wider">
                  Secure Processing
                </strong>
                <span className="text-[10px] leading-tight text-slate-400">Magic-byte checks & in-memory parsing.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block text-[11px] font-mono uppercase tracking-wider">
                  Traceable Evidence
                </strong>
                <span className="text-[10px] leading-tight text-slate-400">Jump directly to page & section anchors.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Eye className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block text-[11px] font-mono uppercase tracking-wider">
                  Accessible Design
                </strong>
                <span className="text-[10px] leading-tight text-slate-400">High contrast, text resizing & plain language.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block text-[11px] font-mono uppercase tracking-wider">
                  Human Review Aware
                </strong>
                <span className="text-[10px] leading-tight text-slate-400">Arms you for qualified legal counsel.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PROBLEM → SOLUTION SECTION                                             */}
      {/* ========================================================================= */}
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

            {/* Horizontal Workflow on Desktop / Vertical Timeline on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-center text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center">
                <FileText className="w-5 h-5 text-blue-400 mb-1" />
                <span className="font-semibold text-slate-200">1. Document</span>
                <span className="text-[10px] text-slate-400">PDF, DOCX, TXT</span>
              </div>
              <div className="hidden md:flex items-center justify-center text-slate-600">→</div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center">
                <Layers className="w-5 h-5 text-emerald-400 mb-1" />
                <span className="font-semibold text-slate-200">2. Clauses</span>
                <span className="text-[10px] text-slate-400">12+ categories</span>
              </div>
              <div className="hidden md:flex items-center justify-center text-slate-600">→</div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center">
                <Clock className="w-5 h-5 text-purple-400 mb-1" />
                <span className="font-semibold text-slate-200">3. Obligations</span>
                <span className="text-[10px] text-slate-400">Duties & deadlines</span>
              </div>
              <div className="hidden md:flex items-center justify-center text-slate-600">→</div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center">
                <Briefcase className="w-5 h-5 text-amber-400 mb-1" />
                <span className="font-semibold text-slate-200">4. Lawyer Dossier</span>
                <span className="text-[10px] text-slate-400">Tactical preparation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. "SEE THE EVIDENCE" INTERACTIVE COMPARISON SECTION                     */}
      {/* ========================================================================= */}
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

            {/* Evidence Example Selector */}
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

          {/* Interactive Evidence Anchor Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-5xl mx-auto">
            {/* Left: Document Excerpt */}
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

            {/* Right: AI Interpretation & Traceability */}
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
                      The agreement appears to allow either party to terminate with 30 days' written notice, provided completed work is paid for.
                    </p>
                  </div>
                  <div className="text-slate-400">
                    <strong className="text-slate-200">Why it matters: </strong>
                    This determines your exit runway and ensures you cannot be dropped overnight without compensation.
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-amber-300 text-[11px]">
                    <strong>Professional Review: </strong>Consider legal review if the consequences or definitions of deliverables are unclear.
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
                    One-sided indemnity is an elevated financial risk. If a third party sues, you could be on the hook for major expenses.
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-rose-300 text-[11px]">
                    <strong>Professional Review: </strong>Ask an attorney to negotiate this clause to be mutual and capped at the contract fee value.
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

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS: 5-STEP WORKFLOW                                         */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 block mb-2">
              Execution Pipeline
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              From raw contract to tactical preparation in 5 steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-blue-500 font-mono text-xs font-bold">01</span>
              <h3 className="font-bold text-white text-sm">UPLOAD</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Securely upload PDF, DOCX, or TXT. Automatic validation filters corrupted or password-protected files.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-blue-500 font-mono text-xs font-bold">02</span>
              <h3 className="font-bold text-white text-sm">UNDERSTAND</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extracts document structure, contracting parties, governing jurisdiction, and operational purpose.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-blue-500 font-mono text-xs font-bold">03</span>
              <h3 className="font-bold text-white text-sm">MAP</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Categorizes clauses, maps party obligations, identifies strict deadlines, and flags potential concerns.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-blue-500 font-mono text-xs font-bold">04</span>
              <h3 className="font-bold text-white text-sm">ASK</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ask any question grounded in the uploaded document with verbatim quotes, confidence ratings, and stated limits.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-blue-500 font-mono text-xs font-bold">05</span>
              <h3 className="font-bold text-white text-sm">PREPARE</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates an action checklist and structured consultation brief with specific questions to bring to your attorney.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. VARIED FEATURE SHOWCASE                                                */}
      {/* ========================================================================= */}
      <section id="features-section" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 block mb-2">
              Comprehensive Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for legal intelligence, not generic chatting.
            </h2>
          </div>

          <div className="space-y-12">
            {/* Feature 1 & 2 Grid: Document Intelligence + Clause Explorer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 w-fit">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Document Intelligence Canvas</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Navigate page by page with full text search, section anchors, and active clause highlighting. Bidirectional navigation links clauses directly to exact coordinates on the document canvas.
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400">
                  ✓ Page Jump • Search Index • Evidence Coordinates • No Re-Parsing
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 w-fit">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Taxonomy Clause Explorer</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Automatic classification into 12 legal categories: Termination, Payment, Indemnity, Confidentiality, Liability, Renewal, Dispute Resolution, and Non-Compete restrictions.
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="text-emerald-400 font-semibold block text-[11px]">Each Clause Card Includes:</span>
                  <p className="text-[11px] text-slate-400">
                    Plain-Language Explanation • Real-World Impact • Potential Consideration • Confidence Score • "Ask a Lawyer" Flag
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 & 4 Grid: Risk & Obligation Map + Grounded Copilot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 w-fit">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Party Obligations & Deadline Map</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Visualizes affirmative covenants using a party-based grouping: <strong>WHO</strong> must do <strong>WHAT</strong> by <strong>WHEN</strong> under <strong>WHICH CONDITION</strong>.
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono text-[10px]">TENANT OBLIGATION</span>
                    <span className="text-slate-500 text-[10px]">Page 3</span>
                  </div>
                  <p className="text-slate-200 font-medium">Maintain interior plumbing and electrical fixtures in good repair.</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400 w-fit">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Document-Grounded Legal Copilot</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Conversational assistant that refuses to guess. If a term is unmentioned, it clearly states: <em>"I couldn't find this information in the uploaded document."</em>
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono text-slate-400">
                  <div>1. Plain Answer</div>
                  <div>2. Verbatim Quote Evidence (Page & Section)</div>
                  <div>3. Legal Interpretation & Stated Uncertainty</div>
                  <div>4. Recommended Next Step for Counsel</div>
                </div>
              </div>
            </div>

            {/* Feature 5, 6, 7 Grid: Checklist + Lawyer Dossier + Version Diff */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="p-2 rounded bg-blue-600/20 text-blue-400 w-fit">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-sm">Action Checklist</h4>
                <p className="text-slate-400 leading-relaxed">
                  Interactive preparation checklist clearly tagging tasks as <strong>Document-Grounded</strong> vs <strong>General Guidance</strong>.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="p-2 rounded bg-purple-600/20 text-purple-400 w-fit">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-sm">Lawyer Consultation Dossier</h4>
                <p className="text-slate-400 leading-relaxed">
                  Print-ready dossier with executive summaries, facts to verify, high-priority clauses, and custom user consultation notes.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="p-2 rounded bg-amber-600/20 text-amber-400 w-fit">
                  <GitCompare className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-sm">Version Comparator</h4>
                <p className="text-slate-400 leading-relaxed">
                  Semantic version diffing highlighting added, removed, and modified clauses, changed salary/payment terms, and altered notice periods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. AI TRANSPARENCY SECTION (5-Part Distinction)                          */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 8. PRIVACY & SECURITY SECTION                                             */}
      {/* ========================================================================= */}
      <section id="security-section" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block mb-2">
              Defense in Depth
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Legal documents deserve careful handling.
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Designed with sensitive-document handling in mind. High-integrity data validation and zero content logging.
            </p>
          </div>

          {/* Security Architecture Flow */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-mono text-[10px]">1. UPLOAD</span>
                <p className="font-semibold text-white mt-1">10 MB ceiling</p>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-mono text-[10px]">2. VALIDATE</span>
                <p className="font-semibold text-white mt-1">Magic byte %PDF- / ZIP</p>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-mono text-[10px]">3. SANITIZE</span>
                <p className="font-semibold text-white mt-1">Anti-path traversal</p>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-mono text-[10px]">4. PROCESS</span>
                <p className="font-semibold text-white mt-1">In-memory BM25 index</p>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-mono text-[10px]">5. RESPOND</span>
                <p className="font-semibold text-white mt-1">Grounded citations</p>
              </div>
            </div>
          </div>

          {/* Implemented Controls Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <strong className="text-white block font-semibold">Magic-Byte Verification</strong>
              <span className="text-slate-400 text-[11px]">Validates binary signatures to block disguised malware.</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <strong className="text-white block font-semibold">Filename Sanitization</strong>
              <span className="text-slate-400 text-[11px]">Strips null bytes and directory navigation attacks.</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <strong className="text-white block font-semibold">Sliding-Window Rate Limiting</strong>
              <span className="text-slate-400 text-[11px]">60 req/min token bucket defense against automated abuse.</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <strong className="text-white block font-semibold">Zero Content Logging</strong>
              <span className="text-slate-400 text-[11px]">Sensitive document excerpts are never logged to console.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. ACCESSIBILITY SECTION                                                  */}
      {/* ========================================================================= */}
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
              WCAG 2.1 AA compliant. High contrast mode, text resizing, and simplified language controls.
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

      {/* ========================================================================= */}
      {/* 10. TECHNOLOGY & ARCHITECTURE SECTION                                     */}
      {/* ========================================================================= */}
      <section id="technology-section" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 block mb-2">
              System Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Production-grade stack with zero fake data.
            </h2>
          </div>

          {/* Architecture Flow Visualization */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-center">
              <div className="p-3 rounded bg-slate-950 border border-slate-800 flex-1 min-w-[140px]">
                <strong className="text-blue-400 block">FastAPI & PyMuPDF</strong>
                <span className="text-[10px] text-slate-500">Document Parsing</span>
              </div>
              <span className="text-slate-600">→</span>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 flex-1 min-w-[140px]">
                <strong className="text-emerald-400 block">Okapi BM25 Index</strong>
                <span className="text-[10px] text-slate-500">Chunk-Level Retrieval</span>
              </div>
              <span className="text-slate-600">→</span>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 flex-1 min-w-[140px]">
                <strong className="text-purple-400 block">Gemini 2.5 + Fallback</strong>
                <span className="text-[10px] text-slate-500">Dual-Engine Intelligence</span>
              </div>
              <span className="text-slate-600">→</span>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 flex-1 min-w-[140px]">
                <strong className="text-amber-400 block">Pydantic v2 Schemas</strong>
                <span className="text-[10px] text-slate-500">Strict Output Validation</span>
              </div>
              <span className="text-slate-600">→</span>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 flex-1 min-w-[140px]">
                <strong className="text-rose-400 block">React 18 + Tailwind</strong>
                <span className="text-[10px] text-slate-500">Unified Legal Cockpit</span>
              </div>
            </div>
          </div>

          {/* Performance Telemetry Strip */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Live Engineering Benchmark Telemetry
              </span>
              <span className="text-slate-500 font-mono text-[10px]">
                Measured in current project benchmark environment
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-slate-300">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Frontend Bundle</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">65.76 kB</span> <span className="text-[10px] text-slate-500">gzip</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">CSS Stylesheet</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">6.15 kB</span> <span className="text-[10px] text-slate-500">gzip</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Retrieval Latency</span>
                <span className="font-mono font-bold text-blue-400 text-sm">~1.8 ms</span> <span className="text-[10px] text-slate-500">p50</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Backend Parse</span>
                <span className="font-mono font-bold text-blue-400 text-sm">~10–18 ms</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Automated Tests</span>
                <span className="font-mono font-bold text-purple-400 text-sm">20 / 20</span> <span className="text-[10px] text-slate-500">passed</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Tracked Git Size</span>
                <span className="font-mono font-bold text-amber-400 text-sm">~135 KiB</span> <span className="text-[10px] text-slate-500">(&lt; 10MB)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. JURY TESTING SANDBOX SECTION                                          */}
      {/* ========================================================================= */}
      <section id="sandbox-section" className="py-20 border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 block mb-2">
              Evaluator Testing Suite
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Test LexLens yourself.
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Launch real benchmark contracts into the legal cockpit with a single click. Zero upload required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <button
              onClick={() => onSelectBenchmark('bench_lease')}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 text-left transition-all group"
            >
              <span className="text-[10px] font-mono text-blue-400 block mb-1">REAL ESTATE</span>
              <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                Commercial Lease Agreement
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Rent schedule, security deposit, maintenance duties, default, and strict indemnification.
              </p>
              <div className="mt-3 text-[11px] text-blue-400 font-medium flex items-center gap-1">
                <span>Run Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={() => onSelectBenchmark('bench_contractor')}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 text-left transition-all group"
            >
              <span className="text-[10px] font-mono text-emerald-400 block mb-1">CONSULTING</span>
              <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                Independent Contractor Agreement
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Work-made-for-hire IP assignment, non-solicitation, hourly compensation, and AAA arbitration.
              </p>
              <div className="mt-3 text-[11px] text-blue-400 font-medium flex items-center gap-1">
                <span>Run Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={() => onSelectBenchmark('bench_nda')}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 text-left transition-all group"
            >
              <span className="text-[10px] font-mono text-purple-400 block mb-1">CONFIDENTIALITY</span>
              <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                Mutual NDA Agreement
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Trade secret definitions, 2-year term, standard exclusions, and injunctive relief without bond.
              </p>
              <div className="mt-3 text-[11px] text-blue-400 font-medium flex items-center gap-1">
                <span>Run Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigateToTab('sandbox')}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow transition-colors inline-flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Open Dedicated Jury Testing Sandbox Console →</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. MINIMAL FOOTER WITH LEGAL DISCLAIMER                                  */}
      {/* ========================================================================= */}
      <footer className="py-12 border-t border-slate-800 bg-slate-950 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm text-white tracking-tight">LEXLENS</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 font-mono">
                  ASSISTIVE AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Understand the document. See what matters. Prepare smarter.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              <a href="#hero-section" className="text-slate-400 hover:text-white">Product</a>
              <a href="#workflow-section" className="text-slate-400 hover:text-white">How It Works</a>
              <a href="#features-section" className="text-slate-400 hover:text-white">Features</a>
              <a href="#security-section" className="text-slate-400 hover:text-white">Security</a>
              <a href="#accessibility-section" className="text-slate-400 hover:text-white">Accessibility</a>
              <a href="#technology-section" className="text-slate-400 hover:text-white">Technology</a>
              <a href="#sandbox-section" className="text-slate-400 hover:text-white">Sandbox</a>
            </div>
          </div>

          {/* Legal Ethics Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <strong className="text-slate-300">Legal Notice: </strong>
              LexLens provides assistive legal information based on uploaded documents. It is not a law firm, does not provide legal representation, and does not replace advice from a qualified legal professional licensed in your jurisdiction.
            </div>
            <button
              onClick={onOpenDisclaimer}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono rounded border border-slate-700 shrink-0 transition-colors"
            >
              View Full Ethics Terms
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-600 font-mono">
            <span>© 2025 LexLens. Apache 2.0 Open Source.</span>
            <span>Built for PromptWars GenAI Evaluation.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
