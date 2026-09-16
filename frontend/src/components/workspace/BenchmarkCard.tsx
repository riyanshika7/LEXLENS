import React from 'react';
import { BenchmarkDoc, DiagnosticReport } from '../../types';

interface BenchmarkCardGridProps {
  benchmarks: BenchmarkDoc[];
  selectedBenchmark: string;
  onSelect: (id: string) => void;
}

export const BenchmarkCardGrid: React.FC<BenchmarkCardGridProps> = ({
  benchmarks,
  selectedBenchmark,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {benchmarks.map((bench) => (
        <div
          key={bench.benchmark_id}
          onClick={() => onSelect(bench.benchmark_id)}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedBenchmark === bench.benchmark_id
              ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/40 shadow-lg'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
            {bench.category}
          </span>
          <h3 className="font-semibold text-white text-xs mb-1">{bench.title}</h3>
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {bench.description}
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span className="font-mono">{bench.filename}</span>
            <span className="text-amber-400 font-medium">Select</span>
          </div>
        </div>
      ))}
    </div>
  );
};

interface DiagnosticMetricsProps {
  diagnostic: DiagnosticReport;
}

export const DiagnosticMetrics: React.FC<DiagnosticMetricsProps> = ({ diagnostic }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
        <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Parse Latency</span>
        <span className="text-base font-mono font-bold text-emerald-400">{diagnostic.parse_time_ms} ms</span>
      </div>
      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
        <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Analysis Latency</span>
        <span className="text-base font-mono font-bold text-emerald-400">{diagnostic.analysis_time_ms} ms</span>
      </div>
      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
        <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">BM25 Retrieval p50</span>
        <span className="text-base font-mono font-bold text-blue-400">{diagnostic.retrieval_p50_ms} ms</span>
      </div>
      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
        <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Words</span>
        <span className="text-base font-mono font-bold text-white">{diagnostic.word_count.toLocaleString()}</span>
      </div>
      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
        <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Chunks</span>
        <span className="text-base font-mono font-bold text-white">{diagnostic.chunk_count}</span>
      </div>
      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
        <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Clauses</span>
        <span className="text-base font-mono font-bold text-amber-400">{diagnostic.clause_count}</span>
      </div>
    </div>
  );
};
