import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Play,
  AlertTriangle,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { BenchmarkDoc, SandboxRunResponse } from '../../types';
import { api } from '../../services/api';

interface JurySandboxProps {
  onLoadBenchmarkIntoWorkspace: (benchmarkId: string) => Promise<void>;
}

export const JurySandbox: React.FC<JurySandboxProps> = ({
  onLoadBenchmarkIntoWorkspace,
}) => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkDoc[]>([]);
  const [selectedBenchmark, setSelectedBenchmark] = useState<string>('bench_lease');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sandboxResult, setSandboxResult] = useState<SandboxRunResponse | null>(null);
  const [customFileError, setCustomFileError] = useState<{
    whatFailed: string;
    whyItFailed: string;
    howToFix: string;
  } | null>(null);

  useEffect(() => {
    api.getSandboxBenchmarks().then(setBenchmarks).catch(console.error);
  }, []);

  const handleRunBenchmark = async () => {
    setIsRunning(true);
    setCustomFileError(null);
    try {
      const res = await api.runSandboxBenchmark(selectedBenchmark);
      setSandboxResult(res);
    } catch (err: any) {
      setCustomFileError({
        whatFailed: 'Benchmark pipeline diagnostic failed',
        whyItFailed: err.message || 'Server error occurred during execution',
        howToFix: 'Ensure server is healthy and benchmark files exist in backend/sample_data.',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCustomUploadTest = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsRunning(true);
    setCustomFileError(null);
    try {
      await api.uploadDocument(file, 'United States', 'New York');
      // If success, trigger benchmark run on this file or notify
      alert(`Custom file '${file.name}' passed security validation, parsing, and analysis!`);
    } catch (err: any) {
      // Graceful error display without crashing
      setCustomFileError({
        whatFailed: `Validation or parsing for '${file.name}'`,
        whyItFailed: err.message || 'File violates security, size, or encoding constraints',
        howToFix: 'Check that the document is not password-protected, corrupted, 0-bytes, or an image-only scan without an embedded OCR text layer.',
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Jury Testing & Evaluator Sandbox
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                PROMPTWARS BENCHMARK
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              One-click pipeline execution with real-time latency diagnostics, integrity checks, and error boundaries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5">
            <span>Test Custom File</span>
            <input
              type="file"
              onChange={handleCustomUploadTest}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />
          </label>

          <button
            onClick={handleRunBenchmark}
            disabled={isRunning}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Running Diagnostic...' : 'Execute Diagnostic'}</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm">
        {/* Error Boundary Display if File Fails */}
        {customFileError && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 space-y-2 text-rose-200 animate-fade-in">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Graceful Failure Diagnostic (No Application Crash)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-2.5 rounded bg-rose-950/80 border border-rose-900/60">
                <span className="font-semibold block text-rose-300 mb-0.5">What Failed:</span>
                <p className="text-rose-200/90">{customFileError.whatFailed}</p>
              </div>
              <div className="p-2.5 rounded bg-rose-950/80 border border-rose-900/60">
                <span className="font-semibold block text-rose-300 mb-0.5">Why It Failed:</span>
                <p className="text-rose-200/90">{customFileError.whyItFailed}</p>
              </div>
              <div className="p-2.5 rounded bg-rose-950/80 border border-rose-900/60">
                <span className="font-semibold block text-rose-300 mb-0.5">How To Fix It:</span>
                <p className="text-rose-200/90">{customFileError.howToFix}</p>
              </div>
            </div>
          </div>
        )}

        {/* Benchmark Document Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Select Pre-Configured Benchmark Document:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {benchmarks.map((bench) => (
              <div
                key={bench.benchmark_id}
                onClick={() => setSelectedBenchmark(bench.benchmark_id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedBenchmark === bench.benchmark_id
                    ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/40 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  {bench.category}
                </span>
                <h3 className="font-semibold text-white text-xs mb-1">
                  {bench.title}
                </h3>
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
        </div>

        {/* Diagnostic Results Report */}
        {sandboxResult && (
          <div className="space-y-6 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Diagnostic Metrics & Telemetry: {sandboxResult.benchmark.title}
              </h2>
              <button
                onClick={() => onLoadBenchmarkIntoWorkspace(sandboxResult.benchmark.benchmark_id)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors"
              >
                Open in Full Cockpit Workspace →
              </button>
            </div>

            {/* Performance KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  Parse Latency
                </span>
                <span className="text-base font-mono font-bold text-emerald-400">
                  {sandboxResult.diagnostic.parse_time_ms} ms
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  Analysis Latency
                </span>
                <span className="text-base font-mono font-bold text-emerald-400">
                  {sandboxResult.diagnostic.analysis_time_ms} ms
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  BM25 Retrieval p50
                </span>
                <span className="text-base font-mono font-bold text-blue-400">
                  {sandboxResult.diagnostic.retrieval_p50_ms} ms
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  Extracted Words
                </span>
                <span className="text-base font-mono font-bold text-white">
                  {sandboxResult.diagnostic.word_count.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  Indexed Chunks
                </span>
                <span className="text-base font-mono font-bold text-white">
                  {sandboxResult.diagnostic.chunk_count}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  Classified Clauses
                </span>
                <span className="text-base font-mono font-bold text-amber-400">
                  {sandboxResult.diagnostic.clause_count}
                </span>
              </div>
            </div>

            {/* Grounded Sample Answers Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Automated Grounded Q&A Verification ({sandboxResult.sample_answers.length} Inquiries Tested)
              </h3>
              <div className="space-y-3">
                {sandboxResult.sample_answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                        "{ans.question}"
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {ans.latency_ms} ms • {Math.round(ans.confidence * 100)}% Confidence
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {ans.answer}
                    </p>

                    <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400 font-serif italic">
                      "{ans.citations[0]}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
