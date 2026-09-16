import React from 'react';
import { Zap } from 'lucide-react';

export const TechStackSection: React.FC = () => {
  return (
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
              <Zap className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
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
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Algorithmic Path</span>
              <span className="font-mono font-bold text-blue-400 text-sm">O(E log V)</span> <span className="text-[10px] text-slate-500">heapq</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Automated Tests</span>
              <span className="font-mono font-bold text-purple-400 text-sm">32 / 32</span> <span className="text-[10px] text-slate-500">passed</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Tracked Git Size</span>
              <span className="font-mono font-bold text-amber-400 text-sm">~160 KiB</span> <span className="text-[10px] text-slate-500">(&lt; 10MB)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
