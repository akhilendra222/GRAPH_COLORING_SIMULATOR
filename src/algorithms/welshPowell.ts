import { Graph, StepSnapshot } from '../graph/graphTypes.ts';
import { buildAdjacencyList, getVertexDegree, findEdgeBetween } from '../graph/graphUtils.ts';
import { getColorById } from '../graph/palette.ts';
import { AlgorithmRunResult } from './greedyColoring.ts';

export function runWelshPowell(graph: Graph): AlgorithmRunResult {
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
          description: 'No vertices to color.',
          currentVertexId: null,
          inspectingNeighborId: null,
          candidateColor: null,
          status: 'complete',
          colors: {},
          conflictingEdgeIds: [],
          activeEdgeId: null,
          explanation: 'Empty graph has 0 vertices. Chromatic number is 0.',
        },
      ],
      finalColors: {},
      colorsUsed: 0,
      success: true,
      executionTimeMs: elapsed,
    };
  }

  const adj = buildAdjacencyList(graph);
  let stepCount = 0;

  // Step 1: Sort vertices by degree descending
  const sortedVertices = [...graph.vertices].sort((a, b) => {
    const degA = getVertexDegree(graph, a.id);
    const degB = getVertexDegree(graph, b.id);
    if (degB !== degA) return degB - degA;
    return a.label.localeCompare(b.label);
  });

  const degreeInfo = sortedVertices
    .map((v) => `${v.label} (deg: ${getVertexDegree(graph, v.id)})`)
    .join(', ');

  snapshots.push({
    stepNumber: ++stepCount,
    title: 'Sort Vertices by Degree',
    description: `Welsh-Powell Step 1: Sort vertices in descending order of degrees.`,
    currentVertexId: null,
    inspectingNeighborId: null,
    candidateColor: null,
    status: 'inspecting',
    colors: { ...colors },
    conflictingEdgeIds: [],
    activeEdgeId: null,
    explanation: `Sorted sequence: [${degreeInfo}]. Vertices with higher degree have more constraints and are prioritized first.`,
  });

  let currentColor = 1;
  const uncoloredSet = new Set<string>(sortedVertices.map((v) => v.id));

  // Loop while there are uncolored vertices
  while (uncoloredSet.size > 0) {
    const colorMeta = getColorById(currentColor);
    const verticesWithCurrentColor: string[] = [];

    snapshots.push({
      stepNumber: ++stepCount,
      title: `Start Color Batch: Color ${currentColor}`,
      description: `Initiating assignment phase for Color ${currentColor} (${colorMeta?.name || ''}).`,
      currentVertexId: null,
      inspectingNeighborId: null,
      candidateColor: currentColor,
      status: 'inspecting',
      colors: { ...colors },
      conflictingEdgeIds: [],
      activeEdgeId: null,
      explanation: `Searching through sorted uncolored vertices to assign Color ${currentColor} to all pairwise non-adjacent vertices.`,
    });

    for (const vertex of sortedVertices) {
      if (!uncoloredSet.has(vertex.id)) {
        continue; // Already colored in a previous round
      }

      // Check if `vertex` is adjacent to any vertex already colored with `currentColor`
      const neighbors = adj.get(vertex.id) || [];
      let hasConflictWithCurrentGroup = false;
      let conflictingNeighborId: string | null = null;
      let conflictEdgeId: string | null = null;

      for (const groupVertexId of verticesWithCurrentColor) {
        if (neighbors.includes(groupVertexId)) {
          hasConflictWithCurrentGroup = true;
          conflictingNeighborId = groupVertexId;
          const edge = findEdgeBetween(graph, vertex.id, groupVertexId);
          if (edge) conflictEdgeId = edge.id;
          break;
        }
      }

      if (!hasConflictWithCurrentGroup) {
        // Can safely color with currentColor
        colors[vertex.id] = currentColor;
        uncoloredSet.delete(vertex.id);
        verticesWithCurrentColor.push(vertex.id);

        snapshots.push({
          stepNumber: ++stepCount,
          title: `Assign Color ${currentColor} to ${vertex.label}`,
          description: `${vertex.label} is non-adjacent to all current Color ${currentColor} vertices.`,
          currentVertexId: vertex.id,
          inspectingNeighborId: null,
          candidateColor: currentColor,
          status: 'assigned',
          colors: { ...colors },
          conflictingEdgeIds: [],
          activeEdgeId: null,
          explanation: `Assigned Color ${currentColor} to ${vertex.label}. Current group with Color ${currentColor}: [${verticesWithCurrentColor
            .map((id) => graph.vertices.find((v) => v.id === id)?.label || id)
            .join(', ')}].`,
        });
      } else {
        // Conflicted with a member of this color group
        const conflictingVertex = graph.vertices.find((v) => v.id === conflictingNeighborId);
        snapshots.push({
          stepNumber: ++stepCount,
          title: `Skip ${vertex.label} for Color ${currentColor}`,
          description: `${vertex.label} is adjacent to ${conflictingVertex?.label || conflictingNeighborId} (already Color ${currentColor}).`,
          currentVertexId: vertex.id,
          inspectingNeighborId: conflictingNeighborId,
          candidateColor: currentColor,
          status: 'conflict',
          colors: { ...colors },
          conflictingEdgeIds: conflictEdgeId ? [conflictEdgeId] : [],
          activeEdgeId: conflictEdgeId,
          explanation: `Cannot assign Color ${currentColor} to ${vertex.label} because it shares an edge with ${conflictingVertex?.label || conflictingNeighborId}. It will be considered in subsequent color passes.`,
        });
      }
    }

    currentColor++;
  }

  const distinctColors = new Set(Object.values(colors).filter((c): c is number => c != null && c > 0));
  const elapsed = performance.now() - startTime;

  snapshots.push({
    stepNumber: ++stepCount,
    title: 'Welsh-Powell Algorithm Complete',
    description: `All vertices colored using ${distinctColors.size} color(s).`,
    currentVertexId: null,
    inspectingNeighborId: null,
    candidateColor: null,
    status: 'complete',
    colors: { ...colors },
    conflictingEdgeIds: [],
    activeEdgeId: null,
    explanation: `Welsh-Powell completed in ${elapsed.toFixed(2)}ms using ${distinctColors.size} colors. Sorting by degree reduces the likelihood of introducing unnecessary colors early on.`,
  });

  return {
    snapshots,
    finalColors: colors,
    colorsUsed: distinctColors.size,
    success: true,
    executionTimeMs: elapsed,
  };
}
