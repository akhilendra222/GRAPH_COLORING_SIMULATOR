import React, { useState } from 'react';
import { CanvasInteractionMode } from './GraphCanvas.tsx';
import { SAMPLE_GRAPHS } from '../graph/sampleGraphs.ts';
import { Graph } from '../graph/graphTypes.ts';
import {
  MousePointer,
  PlusCircle,
  GitCommit,
  Trash2,
  Paintbrush,
  Undo2,
  Redo2,
  FolderOpen,
  FileCode,
  Eraser,
  RefreshCw,
} from 'lucide-react';

interface GraphEditorToolbarProps {
  interactionMode: CanvasInteractionMode;
  setInteractionMode: (mode: CanvasInteractionMode) => void;
  onLoadPredefinedGraph: (graph: Graph) => void;
  onOpenImportModal: () => void;
  onClearGraph: () => void;
  onClearColors: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const GraphEditorToolbar: React.FC<GraphEditorToolbarProps> = ({
  interactionMode,
  setInteractionMode,
  onLoadPredefinedGraph,
  onOpenImportModal,
  onClearGraph,
  onClearColors,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const [showPredefinedDropdown, setShowPredefinedDropdown] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
      {/* Interaction Mode Buttons */}
      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
        <button
          onClick={() => setInteractionMode('select')}
          title="Select & Drag vertices"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            interactionMode === 'select'
              ? 'bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span>Move / Select</span>
        </button>

        <button
          onClick={() => setInteractionMode('add-vertex')}
          title="Click canvas to add vertex"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            interactionMode === 'add-vertex'
              ? 'bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Vertex</span>
        </button>

        <button
          onClick={() => setInteractionMode('add-edge')}
          title="Click two vertices to connect with an edge"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            interactionMode === 'add-edge'
              ? 'bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <GitCommit className="w-3.5 h-3.5" />
          <span>Add Edge</span>
        </button>

        <button
          onClick={() => setInteractionMode('color')}
          title="Manual coloring mode: click vertex to assign color"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            interactionMode === 'color'
              ? 'bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Paintbrush className="w-3.5 h-3.5" />
          <span>Manual Color</span>
        </button>

        <button
          onClick={() => setInteractionMode('delete')}
          title="Click vertex or edge to delete"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            interactionMode === 'delete'
              ? 'bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>

      {/* Undo / Redo & Graph Management Actions */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1 border-r border-slate-800 pr-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Predefined Graphs Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPredefinedDropdown(!showPredefinedDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Sample Graph</span>
          </button>

          {showPredefinedDropdown && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowPredefinedDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-30 py-2 divide-y divide-slate-800 text-xs">
                <div className="px-3 py-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Standard DAA Benchmarks
                </div>
                <div className="py-1">
                  {SAMPLE_GRAPHS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onLoadPredefinedGraph(item.generate());
                        setShowPredefinedDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[170px]">
                          {item.description}
                        </span>
                      </div>
                      <span className="font-mono text-cyan-400 text-[11px] bg-slate-800 px-1.5 py-0.5 rounded">
                        χ={item.chromaticNumber}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Import Graph */}
        <button
          onClick={onOpenImportModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors whitespace-nowrap shrink-0"
        >
          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
          <span>Import Text</span>
        </button>

        {/* Clear Colors */}
        <button
          onClick={onClearColors}
          title="Reset all vertex colors"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-medium rounded-lg border border-transparent hover:border-slate-700 transition-colors whitespace-nowrap shrink-0"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Colors</span>
        </button>

        {/* Clear Graph */}
        <button
          onClick={onClearGraph}
          title="Clear all vertices and edges"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-medium rounded-lg border border-transparent hover:border-rose-500/20 transition-colors whitespace-nowrap shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Canvas</span>
        </button>
      </div>
    </div>
  );
};
