import React from 'react';
import { ShieldAlert, X, Scale, FileCheck, HelpCircle } from 'lucide-react';

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalDisclaimerModal: React.FC<LegalDisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-200">
        <button
          onClick={onClose}
          aria-label="Close legal disclaimer dialog"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 text-blue-400">
          <Scale className="w-7 h-7" />
          <h2 id="disclaimer-title" className="text-xl font-semibold text-white">
            Legal Safety & Operational Disclaimer
          </h2>
        </div>

        <div className="space-y-4 text-sm text-slate-300 leading-relaxed max-h-[70vh] overflow-y-auto pr-2">
          <div className="bg-blue-950/40 border border-blue-800/60 rounded-lg p-4 flex gap-3">
            <ShieldAlert className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-200 mb-1">
                Not Legal Advice • No Attorney-Client Relationship
              </h3>
              <p className="text-xs text-blue-300/90 leading-relaxed">
                LexLens is an assistive Generative AI platform designed solely to help non-lawyers read, navigate, and prepare for conversations with qualified attorneys. LexLens does not provide legal representation, legal opinions, or case prognosis.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              How LexLens Categorizes Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
                <span className="font-semibold text-emerald-400 block mb-0.5">FACT FROM DOCUMENT</span>
                Verbatim excerpts and directly stated provisions with source citations.
              </div>
              <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
                <span className="font-semibold text-blue-400 block mb-0.5">AI INTERPRETATION</span>
                Plain-language translations explaining standard legal terminology.
              </div>
              <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
                <span className="font-semibold text-amber-400 block mb-0.5">POSSIBLE CONCERN</span>
                Provisions that are unilateral, ambiguous, or frequently contested.
              </div>
              <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
                <span className="font-semibold text-purple-400 block mb-0.5">LAWYER CONSULTATION</span>
                Specific questions to bring to a licensed attorney in your jurisdiction.
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Jurisdiction Limitations
            </h4>
            <p className="text-xs text-slate-300">
              Contract law is governed by specific state, provincial, and national statutory frameworks. While LexLens prompts you to declare your jurisdiction, statutory defaults, consumer protection statutes, and tenant rights vary. Never rely on AI as a substitute for counsel licensed in your jurisdiction.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
