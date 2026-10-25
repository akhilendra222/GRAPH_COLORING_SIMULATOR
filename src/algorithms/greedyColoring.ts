import { Graph, OrderingType, StepSnapshot } from '../graph/graphTypes.ts';
import { buildAdjacencyList, sortVertices, findEdgeBetween } from '../graph/graphUtils.ts';
import { getColorById } from '../graph/palette.ts';

export interface AlgorithmRunResult {
  snapshots: StepSnapshot[];
  finalColors: Record<string, number | null>;
  colorsUsed: number;
  success: boolean;
  executionTimeMs: number;
}

export function runGreedyColoring(graph: Graph, ordering: OrderingType): AlgorithmRunResult {
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
          description: 'Graph has no vertices to color.',
          currentVertexId: null,
          inspectingNeighborId: null,
          candidateColor: null,
          status: 'complete',
          colors: {},
          conflictingEdgeIds: [],
          activeEdgeId: null,
          explanation: 'Empty graph has 0 vertices. Chromatic number is 0 by convention.',
        },
      ],
      finalColors: {},
      colorsUsed: 0,
      success: true,
      executionTimeMs: elapsed,
    };
  }

  const adj = buildAdjacencyList(graph);
  const orderedVertices = sortVertices(graph.vertices, graph, ordering);

  let stepCount = 0;

  // Initial Snapshot
  snapshots.push({
    stepNumber: ++stepCount,
    title: 'Initialize Greedy Coloring',
    description: `Ordered ${orderedVertices.length} vertices using '${ordering}' ordering rule.`,
    currentVertexId: null,
    inspectingNeighborId: null,
    candidateColor: null,
    status: 'inspecting',
    colors: { ...colors },
    conflictingEdgeIds: [],
    activeEdgeId: null,
    explanation: `Vertex processing sequence: [${orderedVertices.map((v) => v.label).join(' → ')}]. All vertices initially uncolored.`,
  });

  for (let i = 0; i < orderedVertices.length; i++) {
    const currentVertex = orderedVertices[i];
    const neighbors = adj.get(currentVertex.id) || [];

    // Step: Selecting Vertex
    snapshots.push({
      stepNumber: ++stepCount,
      title: `Select Vertex ${currentVertex.label}`,
      description: `Examining vertex ${currentVertex.label} (order index ${i + 1}/${orderedVertices.length}).`,
      currentVertexId: currentVertex.id,
      inspectingNeighborId: null,
      candidateColor: null,
      status: 'inspecting',
      colors: { ...colors },
      conflictingEdgeIds: [],
      activeEdgeId: null,
      explanation: `Inspecting ${currentVertex.label}. It has ${neighbors.length} neighbor(s) in the graph.`,
    });

    // Collect forbidden colors from colored neighbors
    const forbiddenColors = new Set<number>();
    for (const neighborId of neighbors) {
      const neighborColor = colors[neighborId];
      const neighborVertex = graph.vertices.find((v) => v.id === neighborId);
      const edge = findEdgeBetween(graph, currentVertex.id, neighborId);

      if (neighborColor != null && neighborColor > 0) {
        forbiddenColors.add(neighborColor);
        const colorMeta = getColorById(neighborColor);

        snapshots.push({
          stepNumber: ++stepCount,
          title: `Inspect Neighbor ${neighborVertex?.label || neighborId}`,
          description: `Neighbor ${neighborVertex?.label || neighborId} already has Color ${neighborColor} (${colorMeta?.name || ''}).`,
          currentVertexId: currentVertex.id,
          inspectingNeighborId: neighborId,
          candidateColor: neighborColor,
          status: 'conflict',
          colors: { ...colors },
          conflictingEdgeIds: edge ? [edge.id] : [],
          activeEdgeId: edge ? edge.id : null,
          explanation: `Neighbor ${neighborVertex?.label || neighborId} is colored with Color ${neighborColor}. Hence, Color ${neighborColor} is forbidden for ${currentVertex.label}.`,
        });
      }
    }

    // Find smallest available color >= 1
    let candidateColor = 1;
    while (forbiddenColors.has(candidateColor)) {
      candidateColor++;
    }

    // Assign color
    colors[currentVertex.id] = candidateColor;
    const assignedMeta = getColorById(candidateColor);

    snapshots.push({
      stepNumber: ++stepCount,
      title: `Assign Color ${candidateColor} to ${currentVertex.label}`,
      description: `Smallest available color not used by any neighbor is Color ${candidateColor} (${assignedMeta?.name || ''}).`,
      currentVertexId: currentVertex.id,
      inspectingNeighborId: null,
      candidateColor: candidateColor,
      status: 'assigned',
      colors: { ...colors },
      conflictingEdgeIds: [],
      activeEdgeId: null,
      explanation: `Successfully colored ${currentVertex.label} with Color ${candidateColor} (${assignedMeta?.name || ''}). Forbidden set was {${Array.from(forbiddenColors).join(', ') || 'none'}}.`,
    });
  }

  // Count distinct colors used
  const distinctColors = new Set(Object.values(colors).filter((c): c is number => c != null && c > 0));
  const elapsed = performance.now() - startTime;

  snapshots.push({
    stepNumber: ++stepCount,
    title: 'Greedy Coloring Complete',
    description: `All ${orderedVertices.length} vertices successfully colored using ${distinctColors.size} color(s).`,
    currentVertexId: null,
    inspectingNeighborId: null,
    candidateColor: null,
    status: 'complete',
    colors: { ...colors },
    conflictingEdgeIds: [],
    activeEdgeId: null,
    explanation: `Greedy coloring finished in ${elapsed.toFixed(2)}ms. Total colors used: ${distinctColors.size}. Note: Greedy coloring is heuristic; result may exceed chromatic number depending on vertex ordering.`,
  });

  return {
    snapshots,
    finalColors: colors,
    colorsUsed: distinctColors.size,
    success: true,
    executionTimeMs: elapsed,
  };
}
