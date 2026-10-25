import { Graph, ValidationResult } from './graphTypes.ts';

export function validateColoring(
  graph: Graph,
  overrideColors?: Record<string, number | null>
): ValidationResult {
  const verticesCount = graph.vertices.length;
  const edgesCount = graph.edges.length;

  if (verticesCount === 0) {
    return {
      isValid: true,
      isComplete: true,
      verticesCount: 0,
      coloredCount: 0,
      edgesCount: 0,
      edgesChecked: 0,
      conflictsCount: 0,
      conflictingEdgeIds: [],
      conflictingVertexIds: [],
      colorsUsed: 0,
      colorDistribution: {},
    };
  }

  // Get effective color for each vertex
  const colorMap = new Map<string, number | null>();
  let coloredCount = 0;
  const colorDistribution: Record<number, number> = {};

  for (const v of graph.vertices) {
    const c = overrideColors ? (overrideColors[v.id] ?? null) : (v.color ?? null);
    colorMap.set(v.id, c);
    if (c != null && c > 0) {
      coloredCount++;
      colorDistribution[c] = (colorDistribution[c] || 0) + 1;
    }
  }

  const conflictingEdgeIds: string[] = [];
  const conflictingVertexSet = new Set<string>();

  // Check every edge
  for (const edge of graph.edges) {
    const colorU = colorMap.get(edge.u);
    const colorV = colorMap.get(edge.v);

    // If both endpoints are colored and equal, it's a conflict
    if (colorU != null && colorV != null && colorU > 0 && colorU === colorV) {
      conflictingEdgeIds.push(edge.id);
      conflictingVertexSet.add(edge.u);
      conflictingVertexSet.add(edge.v);
    }
  }

  const conflictsCount = conflictingEdgeIds.length;
  const isComplete = coloredCount === verticesCount;
  const isValid = conflictsCount === 0;
  const colorsUsed = Object.keys(colorDistribution).length;

  return {
    isValid,
    isComplete,
    verticesCount,
    coloredCount,
    edgesCount,
    edgesChecked: edgesCount,
    conflictsCount,
    conflictingEdgeIds,
    conflictingVertexIds: Array.from(conflictingVertexSet),
    colorsUsed,
    colorDistribution,
  };
}
