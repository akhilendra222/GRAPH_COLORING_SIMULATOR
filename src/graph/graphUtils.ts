import { Graph, Vertex, Edge, OrderingType } from './graphTypes.ts';

export function getEdgeKey(u: string, v: string): string {
  return u < v ? `${u}__${v}` : `${v}__${u}`;
}

export function buildAdjacencyList(graph: Graph): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const vertex of graph.vertices) {
    adj.set(vertex.id, []);
  }

  for (const edge of graph.edges) {
    const uList = adj.get(edge.u);
    const vList = adj.get(edge.v);

    if (uList && !uList.includes(edge.v)) {
      uList.push(edge.v);
    }
    if (vList && !vList.includes(edge.u)) {
      vList.push(edge.u);
    }
  }

  return adj;
}

export function getVertexDegree(graph: Graph, vertexId: string): number {
  let degree = 0;
  for (const edge of graph.edges) {
    if (edge.u === vertexId || edge.v === vertexId) {
      degree++;
    }
  }
  return degree;
}

export function hasEdge(graph: Graph, u: string, v: string): boolean {
  return graph.edges.some(
    (e) => (e.u === u && e.v === v) || (e.u === v && e.v === u)
  );
}

export function findEdgeBetween(graph: Graph, u: string, v: string): Edge | undefined {
  return graph.edges.find(
    (e) => (e.u === u && e.v === v) || (e.u === v && e.v === u)
  );
}

export function sortVertices(
  vertices: Vertex[],
  graph: Graph,
  ordering: OrderingType
): Vertex[] {
  const list = [...vertices];

  if (ordering === 'natural') {
    return list.sort((a, b) => {
      // Natural sort handling numeric parts (e.g. V1, V2, V10)
      const numA = parseInt(a.label.replace(/\D/g, '') || a.id.replace(/\D/g, '') || '0', 10);
      const numB = parseInt(b.label.replace(/\D/g, '') || b.id.replace(/\D/g, '') || '0', 10);
      if (numA !== numB) return numA - numB;
      return a.label.localeCompare(b.label);
    });
  }

  if (ordering === 'degree-desc') {
    return list.sort((a, b) => {
      const degA = getVertexDegree(graph, a.id);
      const degB = getVertexDegree(graph, b.id);
      if (degB !== degA) return degB - degA;
      // Secondary tie-breaker by natural label
      return a.label.localeCompare(b.label);
    });
  }

  if (ordering === 'degree-asc') {
    return list.sort((a, b) => {
      const degA = getVertexDegree(graph, a.id);
      const degB = getVertexDegree(graph, b.id);
      if (degA !== degB) return degA - degB;
      return a.label.localeCompare(b.label);
    });
  }

  return list;
}

export interface ParseResult {
  success: boolean;
  graph?: Graph;
  error?: string;
  warning?: string;
}

/**
 * Robust parser for text edge-list representation
 * Handles:
 * V = {1, 2, 3, 4}
 * E = {(1,2), (1,3), (2,3), (2,4), (3,4)}
 * Also tolerates V = {V1, V2...} and loose formats.
 */
export function parseEdgeListInput(input: string, canvasWidth = 700, canvasHeight = 450): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { success: false, error: 'Input cannot be empty. Please provide vertex and edge definitions.' };
  }

  // Look for V = {...} or V:{...} or vertices section
  const vMatch = trimmed.match(/V\s*[:=]\s*\{([^}]*)\}/i);
  const eMatch = trimmed.match(/E\s*[:=]\s*\{([^}]*)\}/i);

  if (!vMatch) {
    return {
      success: false,
      error: 'Missing vertex set V. Expected format: V = {1, 2, 3, 4}',
    };
  }

  const vRaw = vMatch[1].trim();
  const rawVertexTokens = vRaw
    .split(/[,;\s]+/)
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);

  if (rawVertexTokens.length === 0) {
    return {
      success: false,
      error: 'Vertex set V is empty. Please define at least one vertex, e.g. V = {1, 2, 3}',
    };
  }

  // Check for duplicate vertices in input
  const seenV = new Set<string>();
  const vertexLabels: string[] = [];
  for (const token of rawVertexTokens) {
    const formatted = token.startsWith('V') || token.startsWith('v') ? token.toUpperCase() : `V${token}`;
    if (seenV.has(formatted)) {
      return {
        success: false,
        error: `Duplicate vertex detected: '${token}'. Each vertex in set V must be unique.`,
      };
    }
    seenV.add(formatted);
    vertexLabels.push(formatted);
  }

  // Parse Edges
  const edgeTuples: [string, string][] = [];
  if (eMatch && eMatch[1].trim()) {
    const eRaw = eMatch[1].trim();
    // Match pairs like (1, 2), (V1, V2), (1,2)
    const tupleRegex = /\(\s*([a-zA-Z0-9_-]+)\s*,\s*([a-zA-Z0-9_-]+)\s*\)/g;
    let match: RegExpExecArray | null;
    let matchCount = 0;

    while ((match = tupleRegex.exec(eRaw)) !== null) {
      matchCount++;
      const uToken = match[1].trim();
      const vToken = match[2].trim();
      const uFmt = uToken.startsWith('V') || uToken.startsWith('v') ? uToken.toUpperCase() : `V${uToken}`;
      const vFmt = vToken.startsWith('V') || vToken.startsWith('v') ? vToken.toUpperCase() : `V${vToken}`;

      if (uFmt === vFmt) {
        return {
          success: false,
          error: `Self-loop detected on vertex (${uToken}, ${vToken}). The simulator is restricted to simple graphs without self-loops.`,
        };
      }

      if (!seenV.has(uFmt)) {
        return {
          success: false,
          error: `Edge (${uToken}, ${vToken}) references undefined vertex '${uToken}'. Vertex must be declared in set V.`,
        };
      }
      if (!seenV.has(vFmt)) {
        return {
          success: false,
          error: `Edge (${uToken}, ${vToken}) references undefined vertex '${vToken}'. Vertex must be declared in set V.`,
        };
      }

      edgeTuples.push([uFmt, vFmt]);
    }

    // Check if eRaw had content that was not matched
    const strippedRaw = eRaw.replace(/\(\s*[a-zA-Z0-9_-]+\s*,\s*[a-zA-Z0-9_-]+\s*\)/g, '').replace(/[,;\s]/g, '');
    if (strippedRaw.length > 0 && matchCount === 0) {
      return {
        success: false,
        error: `Malformed edge format in E = {${eRaw}}. Expected tuples like (1, 2), (2, 3).`,
      };
    }
  }

  // Build vertices with circular layout
  const n = vertexLabels.length;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const radius = Math.min(centerX, centerY) - 70;

  const vertices: Vertex[] = vertexLabels.map((lbl, idx) => {
    const angle = (2 * Math.PI * idx) / n - Math.PI / 2;
    return {
      id: lbl.toLowerCase(),
      label: lbl,
      x: Math.round(centerX + radius * Math.cos(angle)),
      y: Math.round(centerY + radius * Math.sin(angle)),
      color: null,
    };
  });

  // Build edges, deduplicating undirected edges
  const seenEdges = new Set<string>();
  const edges: Edge[] = [];
  let duplicateCount = 0;

  for (const [uLbl, vLbl] of edgeTuples) {
    const uId = uLbl.toLowerCase();
    const vId = vLbl.toLowerCase();
    const key = getEdgeKey(uId, vId);

    if (seenEdges.has(key)) {
      duplicateCount++;
      continue;
    }
    seenEdges.add(key);
    edges.push({
      id: `e_${key}`,
      u: uId,
      v: vId,
    });
  }

  let warning: string | undefined;
  if (duplicateCount > 0) {
    warning = `Note: ${duplicateCount} duplicate edge(s) were automatically merged into single undirected edges.`;
  }

  return {
    success: true,
    graph: { vertices, edges },
    warning,
  };
}
