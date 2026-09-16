import React from 'react';

export const SecuritySection: React.FC = () => {
  return (
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
  );
};
