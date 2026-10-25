import { Graph, StepSnapshot } from '../graph/graphTypes.ts';
import { buildAdjacencyList, findEdgeBetween } from '../graph/graphUtils.ts';
import { getColorById } from '../graph/palette.ts';
import { AlgorithmRunResult } from './greedyColoring.ts';

const MAX_SNAPSHOT_LIMIT = 2000;
const MAX_OPERATIONS_LIMIT = 40000;

export function runBacktrackingColoring(graph: Graph, k: number): AlgorithmRunResult {
  const startTime = performance.now();
  const snapshots: StepSnapshot[] = [];
  const colors: Record<string, number | null> = {};

  for (const v of graph.vertices) {
    colors[v.id] = null;
  }

  if (graph.vertices.length === 0) {
    const elapsed = performance.now() - startTime;
    return {
      snapshots: [
        {
          stepNumber: 1,
          title: 'Empty Graph',
          description: 'Empty graph has 0 vertices.',
          currentVertexId: null,
          inspectingNeighborId: null,
          candidateColor: null,
          status: 'complete',
          colors: {},
          conflictingEdgeIds: [],
          activeEdgeId: null,
          explanation: 'Trivially valid with 0 colors.',
        },
      ],
      finalColors: {},
      colorsUsed: 0,
      success: true,
      executionTimeMs: elapsed,
    };
  }

  const adj = buildAdjacencyList(graph);
  const vertices = graph.vertices;
  let stepCount = 0;
  let operationsCount = 0;
  let limitReached = false;

  snapshots.push({
    stepNumber: ++stepCount,
    title: `Initialize Backtracking (k = ${k})`,
    description: `Testing if graph can be properly colored with at most k = ${k} color(s).`,
    currentVertexId: null,
    inspectingNeighborId: null,
    candidateColor: null,
    status: 'inspecting',
    colors: { ...colors },
    conflictingEdgeIds: [],
    activeEdgeId: null,
    explanation: `Backtracking explores the state-space tree of depth |V| = ${vertices.length} with branching factor k = ${k}. Worst-case complexity is O(k^V · (V + E)).`,
    k,
  });

  function isSafe(vertexIndex: number, colorToTest: number): { safe: boolean; conflictingNeighborId: string | null; edgeId: string | null } {
    const currentV = vertices[vertexIndex];
    const neighbors = adj.get(currentV.id) || [];

    for (const neighborId of neighbors) {
      if (colors[neighborId] === colorToTest) {
        const edge = findEdgeBetween(graph, currentV.id, neighborId);
        return { safe: false, conflictingNeighborId: neighborId, edgeId: edge ? edge.id : null };
      }
    }
    return { safe: true, conflictingNeighborId: null, edgeId: null };
  }

  function solve(vertexIndex: number, depth: number): boolean {
    operationsCount++;
    if (operationsCount > MAX_OPERATIONS_LIMIT || stepCount > MAX_SNAPSHOT_LIMIT) {
      limitReached = true;
      return false;
    }

    // Base case: all vertices colored
    if (vertexIndex === vertices.length) {
      return true;
    }

    const currentVertex = vertices[vertexIndex];

    for (let c = 1; c <= k; c++) {
      if (limitReached) return false;

      const colorMeta = getColorById(c);
      const check = isSafe(vertexIndex, c);

      if (check.safe) {
        // Safe assignment
        colors[currentVertex.id] = c;

        if (stepCount < MAX_SNAPSHOT_LIMIT) {
          snapshots.push({
            stepNumber: ++stepCount,
            title: `Assign Color ${c} to ${currentVertex.label}`,
            description: `Color ${c} (${colorMeta?.name || ''}) has no conflicts with colored neighbors.`,
            currentVertexId: currentVertex.id,
            inspectingNeighborId: null,
            candidateColor: c,
            status: 'assigned',
            colors: { ...colors },
            conflictingEdgeIds: [],
            activeEdgeId: null,
            explanation: `Assigned Color ${c} to ${currentVertex.label}. Advancing search to vertex ${vertexIndex + 1 < vertices.length ? vertices[vertexIndex + 1].label : 'terminal base case'} (depth ${depth + 1}).`,
            callStackDepth: depth,
            k,
          });
        }

        // Recursive forward exploration
        if (solve(vertexIndex + 1, depth + 1)) {
          return true;
        }

        // Backtrack
        colors[currentVertex.id] = null;

        if (stepCount < MAX_SNAPSHOT_LIMIT) {
          snapshots.push({
            stepNumber: ++stepCount,
            title: `Backtrack from ${currentVertex.label}`,
            description: `Subtree below ${currentVertex.label} with Color ${c} could not find a complete valid solution.`,
            currentVertexId: currentVertex.id,
            inspectingNeighborId: null,
            candidateColor: c,
            status: 'backtracking',
            colors: { ...colors },
            conflictingEdgeIds: [],
            activeEdgeId: null,
            explanation: `Undoing assignment of Color ${c} on ${currentVertex.label}. Restoring vertex to uncolored state and testing next candidate color.`,
            callStackDepth: depth,
            k,
          });
        }
      } else {
        // Conflict
        const conflictVertex = graph.vertices.find((v) => v.id === check.conflictingNeighborId);
        if (stepCount < MAX_SNAPSHOT_LIMIT) {
          snapshots.push({
            stepNumber: ++stepCount,
            title: `Conflict on ${currentVertex.label} with Color ${c}`,
            description: `Neighbor ${conflictVertex?.label || check.conflictingNeighborId} already has Color ${c}.`,
            currentVertexId: currentVertex.id,
            inspectingNeighborId: check.conflictingNeighborId,
            candidateColor: c,
            status: 'conflict',
            colors: { ...colors },
            conflictingEdgeIds: check.edgeId ? [check.edgeId] : [],
            activeEdgeId: check.edgeId,
            explanation: `Cannot use Color ${c} on ${currentVertex.label} because edge connects it to ${conflictVertex?.label || 'neighbor'}, which shares Color ${c}.`,
            callStackDepth: depth,
            k,
          });
        }
      }
    }

    return false;
  }

  const foundSolution = solve(0, 1);
  const elapsed = performance.now() - startTime;

  if (limitReached) {
    snapshots.push({
      stepNumber: ++stepCount,
      title: 'Execution Limit Reached',
      description: `Search space exceeded safe browser limit (> ${MAX_OPERATIONS_LIMIT} operations).`,
      currentVertexId: null,
      inspectingNeighborId: null,
      candidateColor: null,
      status: 'failed',
      colors: { ...colors },
      conflictingEdgeIds: [],
      activeEdgeId: null,
      explanation: `To keep your browser responsive, the backtracking search paused after ${operationsCount} operations. Try decreasing graph size or checking a smaller subgraph.`,
      k,
    });
  } else if (foundSolution) {
    const distinctColors = new Set(Object.values(colors).filter((c): c is number => c != null && c > 0));
    snapshots.push({
      stepNumber: ++stepCount,
      title: `Valid Coloring Found with k = ${k}`,
      description: `Graph is ${k}-colorable! Valid proper assignment achieved using ${distinctColors.size} color(s).`,
      currentVertexId: null,
      inspectingNeighborId: null,
      candidateColor: null,
      status: 'complete',
      colors: { ...colors },
      conflictingEdgeIds: [],
      activeEdgeId: null,
      explanation: `Backtracking verified that a valid coloring exists using at most k = ${k} colors in ${elapsed.toFixed(2)}ms across ${operationsCount} search steps.`,
      k,
    });
  } else {
    snapshots.push({
      stepNumber: ++stepCount,
      title: `No Valid Coloring with k = ${k}`,
      description: `Exhaustive search proved graph cannot be colored using ${k} color(s).`,
      currentVertexId: null,
      inspectingNeighborId: null,
      candidateColor: null,
      status: 'failed',
      colors: { ...colors },
      conflictingEdgeIds: [],
      activeEdgeId: null,
      explanation: `All branches of the backtracking tree were exhausted with no valid configuration. The graph's chromatic number χ(G) is strictly greater than ${k}. Increase k to find a valid coloring.`,
      k,
    });
  }

  const distinctColors = new Set(Object.values(colors).filter((c): c is number => c != null && c > 0));

  return {
    snapshots,
    finalColors: colors,
    colorsUsed: foundSolution ? distinctColors.size : 0,
    success: foundSolution,
    executionTimeMs: elapsed,
  };
}
