import React from 'react';

interface LandingFooterProps {
  onOpenDisclaimer: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onOpenDisclaimer }) => {
  return (
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
  );
};
