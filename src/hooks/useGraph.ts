import { useState, useCallback, useRef } from 'react';
import { Graph, Vertex, Edge } from '../graph/graphTypes.ts';
import { SAMPLE_GRAPHS } from '../graph/sampleGraphs.ts';
import { getEdgeKey } from '../graph/graphUtils.ts';

const MAX_HISTORY = 30;

export function useGraph(initialGraph?: Graph) {
  const [graph, setGraphState] = useState<Graph>(() => {
    if (initialGraph) return initialGraph;
    // Default to Triangle Graph (K3) on initial load
    return SAMPLE_GRAPHS[0].generate();
  });

  const historyRef = useRef<Graph[]>([]);
  const futureRef = useRef<Graph[]>([]);

  const pushHistory = useCallback((current: Graph) => {
    historyRef.current = [...historyRef.current.slice(-MAX_HISTORY + 1), current];
    futureRef.current = []; // Clear redo stack on new action
  }, []);

  const updateGraph = useCallback(
    (updater: (prev: Graph) => Graph, recordHistory = true) => {
      setGraphState((prev) => {
        const next = updater(prev);
        if (recordHistory) {
          pushHistory(prev);
        }
        return next;
      });
    },
    [pushHistory]
  );

  const addVertex = useCallback(
    (x: number, y: number) => {
      updateGraph((prev) => {
        // Find next numeric ID
        let maxNum = 0;
        for (const v of prev.vertices) {
          const num = parseInt(v.label.replace(/\D/g, '') || v.id.replace(/\D/g, '') || '0', 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
        const nextNum = maxNum + 1;
        const newVertex: Vertex = {
          id: `v${nextNum}`,
          label: `V${nextNum}`,
          x: Math.round(x),
          y: Math.round(y),
          color: null,
        };
        return {
          ...prev,
          vertices: [...prev.vertices, newVertex],
        };
      });
    },
    [updateGraph]
  );

  const addEdge = useCallback(
    (uId: string, vId: string): { success: boolean; message?: string } => {
      if (uId === vId) {
        return { success: false, message: 'Self-loops are not allowed in simple graphs.' };
      }

      const key = getEdgeKey(uId, vId);
      const exists = graph.edges.some((e) => getEdgeKey(e.u, e.v) === key);
      if (exists) {
        return { success: false, message: 'An edge between these two vertices already exists.' };
      }

      updateGraph((prev) => {
        const newEdge: Edge = {
          id: `e_${key}`,
          u: uId,
          v: vId,
        };
        return {
          ...prev,
          edges: [...prev.edges, newEdge],
        };
      });

      return { success: true };
    },
    [graph.edges, updateGraph]
  );

  const deleteVertex = useCallback(
    (vertexId: string) => {
      updateGraph((prev) => ({
        vertices: prev.vertices.filter((v) => v.id !== vertexId),
        edges: prev.edges.filter((e) => e.u !== vertexId && e.v !== vertexId),
      }));
    },
    [updateGraph]
  );

  const deleteEdge = useCallback(
    (edgeId: string) => {
      updateGraph((prev) => ({
        ...prev,
        edges: prev.edges.filter((e) => e.id !== edgeId),
      }));
    },
    [updateGraph]
  );

  const updateVertexPosition = useCallback(
    (vertexId: string, x: number, y: number) => {
      // Repositioning without pushing to undo history on every drag tick
      setGraphState((prev) => ({
        ...prev,
        vertices: prev.vertices.map((v) =>
          v.id === vertexId ? { ...v, x: Math.round(x), y: Math.round(y) } : v
        ),
      }));
    },
    []
  );

  const setVertexColor = useCallback(
    (vertexId: string, color: number | null) => {
      updateGraph((prev) => ({
        ...prev,
        vertices: prev.vertices.map((v) =>
          v.id === vertexId ? { ...v, color } : v
        ),
      }));
    },
    [updateGraph]
  );

  const clearColors = useCallback(() => {
    updateGraph((prev) => ({
      ...prev,
      vertices: prev.vertices.map((v) => ({ ...v, color: null })),
    }));
  }, [updateGraph]);

  const loadGraph = useCallback(
    (newGraph: Graph) => {
      pushHistory(graph);
      setGraphState(newGraph);
    },
    [graph, pushHistory]
  );

  const clearGraph = useCallback(() => {
    pushHistory(graph);
    setGraphState({ vertices: [], edges: [] });
  }, [graph, pushHistory]);

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const previous = historyRef.current.pop()!;
    futureRef.current.push(graph);
    setGraphState(previous);
  }, [graph]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current.pop()!;
    historyRef.current.push(graph);
    setGraphState(next);
  }, [graph]);

  return {
    graph,
    addVertex,
    addEdge,
    deleteVertex,
    deleteEdge,
    updateVertexPosition,
    setVertexColor,
    clearColors,
    loadGraph,
    clearGraph,
    undo,
    redo,
    canUndo: historyRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
  };
}
