import React from 'react';
import { FileSearch, Lock, CheckCircle2, Eye, Scale } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section className="py-6 border-b border-slate-800/80 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs text-slate-400">
          <div className="flex items-start gap-2.5">
            <FileSearch className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong className="text-slate-200 block text-[11px] font-mono uppercase tracking-wider">
                Document-Grounded
              </strong>
              <span className="text-[10px] leading-tight text-slate-400">Answers backed by verbatim excerpts.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong className="text-slate-200 block text-[11px] font-mono uppercase tracking-wider">
                Secure Processing
              </strong>
              <span className="text-[10px] leading-tight text-slate-400">Magic-byte checks & in-memory parsing.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong className="text-slate-200 block text-[11px] font-mono uppercase tracking-wider">
                Traceable Evidence
              </strong>
              <span className="text-[10px] leading-tight text-slate-400">Jump directly to page & section anchors.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Eye className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong className="text-slate-200 block text-[11px] font-mono uppercase tracking-wider">
                Accessible Design
              </strong>
              <span className="text-[10px] leading-tight text-slate-400">High contrast, text resizing & plain language.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Scale className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
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
  );
};
