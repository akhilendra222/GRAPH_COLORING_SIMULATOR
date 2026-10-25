import React, { useState, useEffect } from 'react';
import { Graph, BenchmarkResult } from '../graph/graphTypes.ts';
import { runAllAlgorithmsBenchmark } from '../algorithms/benchmark.ts';
import { BarChart3, Play, Clock, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';

interface PerformanceComparisonProps {
  graph: Graph;
}

export const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({ graph }) => {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runBenchmark = () => {
    setIsRunning(true);
    // Use requestAnimationFrame to yield to browser so UI updates
    requestAnimationFrame(() => {
      const benchmarkData = runAllAlgorithmsBenchmark(graph);
      setResults(benchmarkData);
      setIsRunning(false);
    });
  };

  useEffect(() => {
    // Run initial benchmark whenever graph changes
    if (graph.vertices.length > 0) {
      runBenchmark();
    } else {
      setResults([]);
    }
  }, [graph.vertices.length, graph.edges.length]);

  const maxColors = results.length > 0 ? Math.max(...results.map((r) => r.colorsUsed), 1) : 1;
  const maxTime = results.length > 0 ? Math.max(...results.map((r) => r.executionTimeMs), 0.05) : 1;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Algorithm Performance Comparison</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical runtime and color efficiency benchmark evaluated on current graph (|V| = {graph.vertices.length}, |E| = {graph.edges.length}).
          </p>
        </div>

        <button
          onClick={runBenchmark}
          disabled={isRunning || graph.vertices.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold rounded-lg shadow transition-colors text-xs self-start sm:self-auto"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isRunning ? 'Benchmarking...' : 'Re-run Benchmark'}</span>
        </button>
      </div>

      {graph.vertices.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-lg border border-slate-800">
          <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-xs">Graph canvas is empty. Add vertices or load a sample graph to run benchmarks.</p>
        </div>
      ) : (
        <>
          {/* Comparative Bar Chart Visualization */}
          <div className="space-y-4 p-5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Colors Used Comparison (Lower is Better)
            </span>

            <div className="space-y-3">
              {results.map((res) => {
                const colorWidthPct = Math.round((res.colorsUsed / maxColors) * 100);

                return (
                  <div key={res.algorithmId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{res.algorithmName}</span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-cyan-400 font-bold">{res.colorsUsed} colors</span>
                        <span className="text-slate-500 text-[11px]">({res.executionTimeMs.toFixed(3)} ms)</span>
                      </div>
                    </div>

                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          res.isExact
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                            : 'bg-gradient-to-r from-cyan-500 to-sky-400'
                        }`}
                        style={{ width: `${Math.max(8, colorWidthPct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results Summary Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono">
                  <th className="py-3 px-4 font-semibold">Algorithm</th>
                  <th className="py-3 px-4 font-semibold text-center">Colors Used</th>
                  <th className="py-3 px-4 font-semibold text-center">Proper Coloring?</th>
                  <th className="py-3 px-4 font-semibold text-right">Execution Time</th>
                  <th className="py-3 px-4 font-semibold text-right">Operations / Steps</th>
                  <th className="py-3 px-4 font-semibold text-center">Exact χ(G) Guarantee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {results.map((res) => (
                  <tr key={res.algorithmId} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">
                      <div className="flex items-center gap-2">
                        {res.isExact && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                        <span>{res.algorithmName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{res.notes}</span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-bold text-sm text-cyan-300">
                      {res.colorsUsed > 0 ? res.colorsUsed : '—'}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {res.isValid ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          {res.statusText}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-300">
                      {res.executionTimeMs < 0.01
                        ? '< 0.01 ms'
                        : `${res.executionTimeMs.toFixed(3)} ms`}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {res.stepCount}
                    </td>

                    <td className="py-3 px-4 text-center font-medium">
                      {res.isExact ? (
                        <span className="text-purple-300 font-semibold">Provably Exact</span>
                      ) : (
                        <span className="text-slate-500">Heuristic / Fixed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Academic Measurement Disclaimer */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Scientific Measurement Note for DAA Viva:</span>
            </div>
            <p>
              Runtimes are sampled via the high-resolution browser performance clock (<code className="text-cyan-300 font-mono">performance.now()</code>)
              strictly around algorithmic computation, ignoring DOM rendering and animations. Timings on small graphs (3–8 vertices)
              are very brief (&lt;1 ms) and subject to system noise; they validate algorithmic correctness rather than asymptotic Big-O growth.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
