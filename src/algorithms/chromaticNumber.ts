import { Graph, StepSnapshot } from '../graph/graphTypes.ts';
import { runBacktrackingColoring } from './backtracking.ts';
import { AlgorithmRunResult } from './greedyColoring.ts';

export interface ExactChromaticResult extends AlgorithmRunResult {
  exactChromaticNumber: number;
  isProvenExact: boolean;
  kEvaluations: { k: number; success: boolean; timeMs: number }[];
}

export function findExactChromaticNumber(graph: Graph): ExactChromaticResult {
  const startTime = performance.now();
  const vCount = graph.vertices.length;
  const eCount = graph.edges.length;

  // Edge case 1: Empty graph
  if (vCount === 0) {
    const elapsed = performance.now() - startTime;
    return {
      snapshots: [
        {
          stepNumber: 1,
          title: 'Empty Graph: χ(G) = 0',
          description: 'The graph has no vertices.',
          currentVertexId: null,
          inspectingNeighborId: null,
          candidateColor: null,
          status: 'complete',
          colors: {},
          conflictingEdgeIds: [],
          activeEdgeId: null,
          explanation: 'By standard mathematical convention in graph theory, the chromatic number of an empty graph is χ(∅) = 0.',
        },
      ],
      finalColors: {},
      colorsUsed: 0,
      success: true,
      executionTimeMs: elapsed,
      exactChromaticNumber: 0,
      isProvenExact: true,
      kEvaluations: [],
    };
  }

  // Edge case 2: Edgeless graph (|V| >= 1, |E| = 0)
  if (eCount === 0) {
    const elapsed = performance.now() - startTime;
    const colors: Record<string, number | null> = {};
    for (const v of graph.vertices) {
      colors[v.id] = 1;
    }
    return {
      snapshots: [
        {
          stepNumber: 1,
          title: 'Edgeless Graph: χ(G) = 1',
          description: `Graph has ${vCount} independent vertices and 0 edges.`,
          currentVertexId: null,
          inspectingNeighborId: null,
          candidateColor: 1,
          status: 'complete',
          colors,
          conflictingEdgeIds: [],
          activeEdgeId: null,
          explanation: `Since no two vertices are adjacent, all ${vCount} vertices can safely share Color 1. Hence, the exact chromatic number is χ(G) = 1.`,
        },
      ],
      finalColors: colors,
      colorsUsed: 1,
      success: true,
      executionTimeMs: elapsed,
      exactChromaticNumber: 1,
      isProvenExact: true,
      kEvaluations: [{ k: 1, success: true, timeMs: elapsed }],
    };
  }

  const snapshots: StepSnapshot[] = [];
  let stepCounter = 0;
  const kEvaluations: { k: number; success: boolean; timeMs: number }[] = [];

  snapshots.push({
    stepNumber: ++stepCounter,
    title: 'Begin Exact Chromatic Number Search',
    description: `Testing increasing values of k = 1, 2, ..., ${vCount} using backtracking k-colorability.`,
    currentVertexId: null,
    inspectingNeighborId: null,
    candidateColor: null,
    status: 'inspecting',
    colors: {},
    conflictingEdgeIds: [],
    activeEdgeId: null,
    explanation: `Definition: Chromatic number χ(G) is the minimum positive integer k such that G is k-colorable. We start at k=1 and test sequentially until the first valid coloring is found.`,
  });

  let winningColors: Record<string, number | null> = {};
  let chromaticNumber = -1;
  let isProven = false;

  for (let k = 1; k <= vCount; k++) {
    const kStart = performance.now();
    const result = runBacktrackingColoring(graph, k);
    const kTime = performance.now() - kStart;

    kEvaluations.push({
      k,
      success: result.success,
      timeMs: kTime,
    });

    // Append representative snapshots from the k test
    if (result.success) {
      winningColors = result.finalColors;
      chromaticNumber = k;
      isProven = true;

      // Include final successful snapshots
      snapshots.push({
        stepNumber: ++stepCounter,
        title: `Tested k = ${k}: Success!`,
        description: `Graph is ${k}-colorable. Since k = 1..${k - 1} failed, χ(G) = ${k}.`,
        currentVertexId: null,
        inspectingNeighborId: null,
        candidateColor: k,
        status: 'complete',
        colors: { ...winningColors },
        conflictingEdgeIds: [],
        activeEdgeId: null,
        explanation: `Exact chromatic number proven: χ(G) = ${k}. Minimum colors required is ${k}. No valid coloring exists for any k < ${k}.`,
        k,
      });
      break;
    } else {
      snapshots.push({
        stepNumber: ++stepCounter,
        title: `Tested k = ${k}: Failed`,
        description: `Graph is not ${k}-colorable. Backtracking proved no valid assignment exists with ${k} color(s).`,
        currentVertexId: null,
        inspectingNeighborId: null,
        candidateColor: k,
        status: 'failed',
        colors: { ...result.finalColors },
        conflictingEdgeIds: [],
        activeEdgeId: null,
        explanation: `k = ${k} is insufficient. Trying k = ${k + 1}...`,
        k,
      });
    }

    // Safety timeout check: if elapsed > 3000ms
    if (performance.now() - startTime > 3000) {
      break;
    }
  }

  const elapsed = performance.now() - startTime;

  if (!isProven) {
    snapshots.push({
      stepNumber: ++stepCounter,
      title: 'Exact Search Interrupted',
      description: 'Search exceeded execution limit before completing exhaustive verification.',
      currentVertexId: null,
      inspectingNeighborId: null,
      candidateColor: null,
      status: 'failed',
      colors: {},
      conflictingEdgeIds: [],
      activeEdgeId: null,
      explanation: 'Search was interrupted to maintain browser responsiveness. In general, computing χ(G) is NP-hard.',
    });
  }

  return {
    snapshots,
    finalColors: winningColors,
    colorsUsed: isProven ? chromaticNumber : 0,
    success: isProven,
    executionTimeMs: elapsed,
    exactChromaticNumber: chromaticNumber,
    isProvenExact: isProven,
    kEvaluations,
  };
}
