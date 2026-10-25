import React, { useState, useRef, useCallback } from 'react';
import { Graph, Vertex, Edge } from '../graph/graphTypes.ts';
import { getColorById, getColorHex, getBorderHex } from '../graph/palette.ts';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';

export type CanvasInteractionMode = 'select' | 'add-vertex' | 'add-edge' | 'delete' | 'color';

interface GraphCanvasProps {
  graph: Graph;
  interactionMode: CanvasInteractionMode;
  selectedColorId: number | null;
  currentVertexId: string | null;
  inspectingNeighborId: string | null;
  candidateColor: number | null;
  activeEdgeId: string | null;
  conflictingEdgeIds: string[];
  conflictingVertexIds: string[];
  stepColors?: Record<string, number | null>;
  onAddVertex: (x: number, y: number) => void;
  onAddEdge: (u: string, v: string) => void;
  onDeleteVertex: (vertexId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onUpdateVertexPosition: (vertexId: string, x: number, y: number) => void;
  onSetVertexColor: (vertexId: string, colorId: number | null) => void;
  onSelectVertex?: (vertex: Vertex | null) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graph,
  interactionMode,
  selectedColorId,
  currentVertexId,
  inspectingNeighborId,
  candidateColor,
  activeEdgeId,
  conflictingEdgeIds,
  conflictingVertexIds,
  stepColors,
  onAddVertex,
  onAddEdge,
  onDeleteVertex,
  onDeleteEdge,
  onUpdateVertexPosition,
  onSetVertexColor,
  onSelectVertex,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Edge creation state
  const [edgeSourceVertexId, setEdgeSourceVertexId] = useState<string | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);

  // Selected vertex state
  const [selectedVertexId, setSelectedVertexId] = useState<string | null>(null);

  // Dragging state
  const draggingVertexId = useRef<string | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Convert client coordinate to SVG viewBox coordinate
  const getSVGCoordinates = useCallback((e: React.PointerEvent | React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 720 / rect.width;
    const scaleY = 480 / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const handlePointerDownCanvas = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.target !== svgRef.current && (e.target as Element).tagName !== 'rect') {
      return;
    }

    const { x, y } = getSVGCoordinates(e);

    if (interactionMode === 'add-vertex') {
      onAddVertex(x, y);
    } else if (interactionMode === 'add-edge') {
      // Cancel pending edge creation if clicking background
      setEdgeSourceVertexId(null);
      setPointerPos(null);
    } else if (interactionMode === 'select') {
      setSelectedVertexId(null);
      if (onSelectVertex) onSelectVertex(null);
    }
  };

  const handlePointerDownVertex = (e: React.PointerEvent, vertex: Vertex) => {
    e.stopPropagation();

    if (interactionMode === 'delete') {
      onDeleteVertex(vertex.id);
      return;
    }

    if (interactionMode === 'color') {
      onSetVertexColor(vertex.id, selectedColorId);
      return;
    }

    if (interactionMode === 'add-edge') {
      if (!edgeSourceVertexId) {
        setEdgeSourceVertexId(vertex.id);
      } else if (edgeSourceVertexId === vertex.id) {
        // Cancel if clicking self
        setEdgeSourceVertexId(null);
      } else {
        onAddEdge(edgeSourceVertexId, vertex.id);
        setEdgeSourceVertexId(null);
        setPointerPos(null);
      }
      return;
    }

    // Select or drag mode
    setSelectedVertexId(vertex.id);
    if (onSelectVertex) onSelectVertex(vertex);

    const { x, y } = getSVGCoordinates(e);
    draggingVertexId.current = vertex.id;
    dragOffset.current = {
      x: vertex.x - x,
      y: vertex.y - y,
    };

    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const { x, y } = getSVGCoordinates(e);

    if (interactionMode === 'add-edge' && edgeSourceVertexId) {
      setPointerPos({ x, y });
    }

    if (draggingVertexId.current) {
      const newX = Math.max(35, Math.min(685, x + dragOffset.current.x));
      const newY = Math.max(35, Math.min(445, y + dragOffset.current.y));
      onUpdateVertexPosition(draggingVertexId.current, newX, newY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingVertexId.current) {
      draggingVertexId.current = null;
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
  };

  const handleEdgeClick = (e: React.MouseEvent, edge: Edge) => {
    e.stopPropagation();
    if (interactionMode === 'delete') {
      onDeleteEdge(edge.id);
    }
  };

  const sourceVertexForEdge = edgeSourceVertexId
    ? graph.vertices.find((v) => v.id === edgeSourceVertexId)
    : null;

  return (
    <div className="relative w-full h-[480px] bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden select-none shadow-inner flex flex-col justify-center items-center">
      <svg
        ref={svgRef}
        viewBox="0 0 720 480"
        className="w-full h-full cursor-crosshair touch-none"
        onPointerDown={handlePointerDownCanvas}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id="grid-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="1" fill="rgba(100, 116, 139, 0.3)" />
          </pattern>

          {/* Glow Filters */}
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Grid */}
        <rect width="720" height="480" fill="url(#grid-pattern)" />

        {/* Render Graph Edges */}
        <g className="edges-layer">
          {graph.edges.map((edge) => {
            const uVertex = graph.vertices.find((v) => v.id === edge.u);
            const vVertex = graph.vertices.find((v) => v.id === edge.v);
            if (!uVertex || !vVertex) return null;

            const isConflicting = conflictingEdgeIds.includes(edge.id);
            const isActive = activeEdgeId === edge.id;

            let strokeColor = '#334155'; // default slate-700
            let strokeWidth = 2.5;
            let strokeDasharray: string | undefined;

            if (isConflicting) {
              strokeColor = '#f43f5e'; // rose-500
              strokeWidth = 3.5;
              strokeDasharray = '6,4';
            } else if (isActive) {
              strokeColor = '#38bdf8'; // sky-400
              strokeWidth = 4;
            }

            return (
              <g key={edge.id} className="group">
                {/* Thick transparent hit-box line for easy clicking */}
                <line
                  x1={uVertex.x}
                  y1={uVertex.y}
                  x2={vVertex.x}
                  y2={vVertex.y}
                  stroke="transparent"
                  strokeWidth="16"
                  className={interactionMode === 'delete' ? 'cursor-pointer' : ''}
                  onClick={(e) => handleEdgeClick(e, edge)}
                />
                {/* Visual Line */}
                <line
                  x1={uVertex.x}
                  y1={uVertex.y}
                  x2={vVertex.x}
                  y2={vVertex.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                  className="transition-colors duration-200"
                  filter={isConflicting ? 'url(#glow-red)' : isActive ? 'url(#glow-cyan)' : undefined}
                />
                {/* Conflict Alert Icon at Midpoint */}
                {isConflicting && (
                  <circle
                    cx={(uVertex.x + vVertex.x) / 2}
                    cy={(uVertex.y + vVertex.y) / 2}
                    r="8"
                    fill="#f43f5e"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )}
              </g>
            );
          })}

          {/* Pending Edge Preview Line */}
          {interactionMode === 'add-edge' && sourceVertexForEdge && pointerPos && (
            <line
              x1={sourceVertexForEdge.x}
              y1={sourceVertexForEdge.y}
              x2={pointerPos.x}
              y2={pointerPos.y}
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="5,4"
              className="pointer-events-none"
            />
          )}
        </g>

        {/* Render Graph Vertices */}
        <g className="vertices-layer">
          {graph.vertices.map((vertex) => {
            const effectiveColorId = stepColors ? stepColors[vertex.id] : vertex.color;
            const hasColor = effectiveColorId != null && effectiveColorId > 0;
            const colorOption = getColorById(effectiveColorId);

            const isCurrent = currentVertexId === vertex.id;
            const isInspectingNeighbor = inspectingNeighborId === vertex.id;
            const isConflicting = conflictingVertexIds.includes(vertex.id);
            const isSelected = selectedVertexId === vertex.id;
            const isEdgeSource = edgeSourceVertexId === vertex.id;

            // Fill color
            let fillHex = '#1e293b'; // slate-800
            let strokeHex = '#475569'; // slate-600
            let strokeWidth = 2.5;

            if (hasColor && colorOption) {
              fillHex = colorOption.hex;
              strokeHex = colorOption.borderHex;
              strokeWidth = 3;
            }

            // Candidate preview if this is current vertex
            if (isCurrent && candidateColor && !hasColor) {
              const candMeta = getColorById(candidateColor);
              if (candMeta) {
                strokeHex = candMeta.borderHex;
              }
            }

            return (
              <g
                key={vertex.id}
                transform={`translate(${vertex.x}, ${vertex.y})`}
                onPointerDown={(e) => handlePointerDownVertex(e, vertex)}
                className="cursor-pointer select-none group"
              >
                {/* Outer Focus / State Halo Rings */}
                {isCurrent && (
                  <circle
                    r="32"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="4,3"
                    className="animate-spin"
                    style={{ animationDuration: '6s' }}
                  />
                )}

                {isInspectingNeighbor && (
                  <circle
                    r="30"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="3"
                    filter="url(#glow-cyan)"
                  />
                )}

                {isConflicting && (
                  <circle
                    r="31"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3.5"
                    filter="url(#glow-red)"
                  />
                )}

                {(isSelected || isEdgeSource) && (
                  <circle
                    r="29"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                  />
                )}

                {/* Base Vertex Circle */}
                <circle
                  r="23"
                  fill={fillHex}
                  stroke={strokeHex}
                  strokeWidth={strokeWidth}
                  className="transition-all duration-200 shadow-md group-hover:scale-105"
                />

                {/* Vertex Label */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="13"
                  fontWeight="700"
                  fill="#ffffff"
                  className="pointer-events-none font-mono"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                  {vertex.label}
                </text>

                {/* Color Identifier Badge (Dual coding for accessibility) */}
                {hasColor && effectiveColorId && (
                  <g transform="translate(14, -14)">
                    <circle r="9" fill="#0f172a" stroke="#ffffff" strokeWidth="1.2" />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="9"
                      fontWeight="800"
                      fill="#38bdf8"
                      className="font-mono"
                    >
                      C{effectiveColorId}
                    </text>
                  </g>
                )}

                {/* Conflict Badge */}
                {isConflicting && (
                  <g transform="translate(-14, -14)">
                    <circle r="9" fill="#e11d48" stroke="#ffffff" strokeWidth="1.2" />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="10"
                      fontWeight="800"
                      fill="#ffffff"
                    >
                      !
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Helper Banner for Interactive Modes */}
      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 pointer-events-none flex items-center gap-2">
        {interactionMode === 'add-vertex' && (
          <span className="flex items-center gap-1 text-cyan-400">
            <Plus className="w-3.5 h-3.5" />
            Click anywhere on canvas to place a new vertex
          </span>
        )}
        {interactionMode === 'add-edge' && (
          <span>
            {edgeSourceVertexId ? (
              <span className="text-cyan-400">Select second vertex to complete edge (or click canvas to cancel)</span>
            ) : (
              <span>Click first vertex to begin connecting edge</span>
            )}
          </span>
        )}
        {interactionMode === 'delete' && (
          <span className="flex items-center gap-1 text-rose-400">
            <Trash2 className="w-3.5 h-3.5" />
            Click any vertex or edge to delete it
          </span>
        )}
        {interactionMode === 'color' && (
          <span>
            {selectedColorId ? (
              <span className="flex items-center gap-1.5">
                Applying
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: getColorHex(selectedColorId) }}
                />
                <span className="font-semibold text-white">{getColorById(selectedColorId)?.name}:</span>
                Click a vertex to assign
              </span>
            ) : (
              <span>Select a color from the palette below, then click a vertex</span>
            )}
          </span>
        )}
        {interactionMode === 'select' && (
          <span className="text-slate-400">
            Drag vertices to reposition · Select vertices or edges to inspect
          </span>
        )}
      </div>

      {/* Empty State Overlay */}
      {graph.vertices.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-500">
          <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
          <p className="text-sm font-medium">Canvas is empty</p>
          <p className="text-xs text-slate-600 mt-1">
            Click "Add Vertex", load a Predefined Graph, or Import an Edge List.
          </p>
        </div>
      )}
    </div>
  );
};
