import React from 'react';
import { ChevronRight, FlaskConical } from 'lucide-react';

interface BenchmarkTelemetrySectionProps {
  onSelectBenchmark: (benchmarkId: string) => void;
  onNavigateToTab: (tab: 'workspace' | 'compare' | 'sandbox') => void;
}

export const BenchmarkTelemetrySection: React.FC<BenchmarkTelemetrySectionProps> = ({
  onSelectBenchmark,
  onNavigateToTab,
}) => {
  return (
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
            <FlaskConical className="w-4 h-4" aria-hidden="true" />
            <span>Open Dedicated Jury Testing Sandbox Console →</span>
          </button>
        </div>
      </div>
    </section>
  );
};
