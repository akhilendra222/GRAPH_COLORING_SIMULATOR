import { Graph, BenchmarkResult } from '../graph/graphTypes.ts';
import { runGreedyColoring } from './greedyColoring.ts';
import { runWelshPowell } from './welshPowell.ts';
import { runBacktrackingColoring } from './backtracking.ts';
import { findExactChromaticNumber } from './chromaticNumber.ts';
import { validateColoring } from '../graph/validation.ts';

export function runAllAlgorithmsBenchmark(graph: Graph): BenchmarkResult[] {
  const results: BenchmarkResult[] = [];

  // 1. Greedy (Natural Order)
  try {
    const greedyNat = runGreedyColoring(graph, 'natural');
    const valid = validateColoring(graph, greedyNat.finalColors);
    results.push({
      algorithmId: 'greedy-natural',
      algorithmName: 'Greedy (Natural Order)',
      colorsUsed: greedyNat.colorsUsed,
      isValid: valid.isValid && valid.isComplete,
      executionTimeMs: greedyNat.executionTimeMs,
      stepCount: greedyNat.snapshots.length,
      isExact: false,
      statusText: valid.isValid ? 'Valid Coloring' : 'Invalid Coloring',
      notes: 'Standard sequential greedy coloring using default index ordering.',
    });
  } catch {
    results.push({
      algorithmId: 'greedy-natural',
      algorithmName: 'Greedy (Natural Order)',
      colorsUsed: 0,
      isValid: false,
      executionTimeMs: 0,
      stepCount: 0,
      isExact: false,
      statusText: 'Error',
      notes: 'Failed to run greedy coloring.',
    });
  }

  // 2. Greedy (Highest Degree First)
  try {
    const greedyDeg = runGreedyColoring(graph, 'degree-desc');
    const valid = validateColoring(graph, greedyDeg.finalColors);
    results.push({
      algorithmId: 'greedy-degree',
      algorithmName: 'Greedy (Highest Degree First)',
      colorsUsed: greedyDeg.colorsUsed,
      isValid: valid.isValid && valid.isComplete,
      executionTimeMs: greedyDeg.executionTimeMs,
      stepCount: greedyDeg.snapshots.length,
      isExact: false,
      statusText: valid.isValid ? 'Valid Coloring' : 'Invalid Coloring',
      notes: 'Processes high-degree vertices first to reduce color fragmentation.',
    });
  } catch {
    results.push({
      algorithmId: 'greedy-degree',
      algorithmName: 'Greedy (Highest Degree First)',
      colorsUsed: 0,
      isValid: false,
      executionTimeMs: 0,
      stepCount: 0,
      isExact: false,
      statusText: 'Error',
      notes: 'Failed to run highest-degree greedy.',
    });
  }

  // 3. Welsh-Powell
  try {
    const wp = runWelshPowell(graph);
    const valid = validateColoring(graph, wp.finalColors);
    results.push({
      algorithmId: 'welsh-powell',
      algorithmName: 'Welsh-Powell Heuristic',
      colorsUsed: wp.colorsUsed,
      isValid: valid.isValid && valid.isComplete,
      executionTimeMs: wp.executionTimeMs,
      stepCount: wp.snapshots.length,
      isExact: false,
      statusText: valid.isValid ? 'Valid Coloring' : 'Invalid Coloring',
      notes: 'Degree-sorted batch assignment maximizing independent vertex sets per color.',
    });
  } catch {
    results.push({
      algorithmId: 'welsh-powell',
      algorithmName: 'Welsh-Powell Heuristic',
      colorsUsed: 0,
      isValid: false,
      executionTimeMs: 0,
      stepCount: 0,
      isExact: false,
      statusText: 'Error',
      notes: 'Failed to run Welsh-Powell.',
    });
  }

  // 4. Backtracking (k = greedy max or min(4, V))
  const defaultK = Math.max(1, Math.min(graph.vertices.length, 4));
  try {
    const bt = runBacktrackingColoring(graph, defaultK);
    const valid = validateColoring(graph, bt.finalColors);
    results.push({
      algorithmId: 'backtracking',
      algorithmName: `Backtracking (k = ${defaultK})`,
      colorsUsed: bt.colorsUsed,
      isValid: bt.success && valid.isValid && valid.isComplete,
      executionTimeMs: bt.executionTimeMs,
      stepCount: bt.snapshots.length,
      isExact: false,
      statusText: bt.success ? `Colorable with k=${defaultK}` : `Not ${defaultK}-colorable`,
      notes: `State-space tree exploration testing k = ${defaultK} feasibility.`,
    });
  } catch {
    results.push({
      algorithmId: 'backtracking',
      algorithmName: `Backtracking (k = ${defaultK})`,
      colorsUsed: 0,
      isValid: false,
      executionTimeMs: 0,
      stepCount: 0,
      isExact: false,
      statusText: 'Error',
      notes: 'Backtracking interrupted or failed.',
    });
  }

  // 5. Exact Chromatic Number
  try {
    const exact = findExactChromaticNumber(graph);
    results.push({
      algorithmId: 'exact-chromatic',
      algorithmName: 'Exact Chromatic Number χ(G)',
      colorsUsed: exact.exactChromaticNumber >= 0 ? exact.exactChromaticNumber : 0,
      isValid: exact.isProvenExact,
      executionTimeMs: exact.executionTimeMs,
      stepCount: exact.snapshots.length,
      isExact: exact.isProvenExact,
      statusText: exact.isProvenExact
        ? `Proven χ(G) = ${exact.exactChromaticNumber}`
        : 'Not completed within limit',
      notes: exact.isProvenExact
        ? 'Guaranteed minimum chromatic number verified by incremental k-colorability.'
        : 'Search timed out or aborted to preserve browser responsiveness.',
    });
  } catch {
    results.push({
      algorithmId: 'exact-chromatic',
      algorithmName: 'Exact Chromatic Number χ(G)',
      colorsUsed: 0,
      isValid: false,
      executionTimeMs: 0,
      stepCount: 0,
      isExact: false,
      statusText: 'Not completed',
      notes: 'Search exceeded limits.',
    });
  }

  return results;
}
