import React, { useState, useMemo } from 'react';
import { useGraph } from './hooks/useGraph.ts';
import { useAlgorithmExecution } from './hooks/useAlgorithmExecution.ts';
import { validateColoring } from './graph/validation.ts';
import { SAMPLE_GRAPHS } from './graph/sampleGraphs.ts';

// Components
import { AppHeader, ActiveTab } from './components/AppHeader.tsx';
import { GraphCanvas, CanvasInteractionMode } from './components/GraphCanvas.tsx';
import { GraphEditorToolbar } from './components/GraphEditorToolbar.tsx';
import { AlgorithmControls } from './components/AlgorithmControls.tsx';
import { ExecutionLog } from './components/ExecutionLog.tsx';
import { ColorLegend } from './components/ColorLegend.tsx';
import { StatisticsPanel } from './components/StatisticsPanel.tsx';
import { ComplexityTable } from './components/ComplexityTable.tsx';
import { PerformanceComparison } from './components/PerformanceComparison.tsx';
import { LearningPanel } from './components/LearningPanel.tsx';
import { AboutProject } from './components/AboutProject.tsx';
import { AlgorithmsTheoryView } from './components/AlgorithmsTheoryView.tsx';
import { ImportGraphModal } from './components/ImportGraphModal.tsx';
import { ConfirmationModal } from './components/ConfirmationModal.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [interactionMode, setInteractionMode] = useState<CanvasInteractionMode>('select');
  const [selectedColorId, setSelectedColorId] = useState<number | null>(1);

  // Modals state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Graph state hook
  const {
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
    canUndo,
    canRedo,
  } = useGraph(SAMPLE_GRAPHS[0].generate()); // Default K3 Triangle

  // Callback to sync final colors from algorithm to the graph state
  const handleApplyFinalColors = (finalColors: Record<string, number | null>) => {
    for (const [vId, c] of Object.entries(finalColors)) {
      setVertexColor(vId, c);
    }
  };

  // Algorithm Execution state hook
  const {
    selectedAlgorithm,
    setSelectedAlgorithm,
    ordering,
    setOrdering,
    backtrackingK,
    setBacktrackingK,
    snapshots,
    currentStepIndex,
    currentSnapshot,
    isPlaying,
    speedMs,
    setSpeedMs,
    startOrResume,
    pause,
    nextStep,
    prevStep,
    reset,
    runToCompletion,
    jumpToStep,
  } = useAlgorithmExecution(graph, handleApplyFinalColors);

  // Compute live validation results
  const validation = useMemo(() => {
    // If an algorithm snapshot is active, validate based on that snapshot's colors
    if (currentSnapshot && currentSnapshot.colors) {
      return validateColoring(graph, currentSnapshot.colors);
    }
    return validateColoring(graph);
  }, [graph, currentSnapshot]);

  // Handle Edge addition with validation feedback
  const handleAddEdge = (u: string, v: string) => {
    const res = addEdge(u, v);
    if (!res.success && res.message) {
      // Alert user gracefully
      console.warn(res.message);
    }
  };

  const handleQuickReset = () => {
    loadGraph(SAMPLE_GRAPHS[0].generate());
    reset();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Header Navigation */}
      <AppHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onQuickReset={handleQuickReset}
      />

      {/* 2. Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: Simulator View */}
        {activeTab === 'simulator' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Workspace Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Interactive Graph Simulator & Visualizer
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Construct custom graphs or load benchmarks, step through graph coloring algorithms, and inspect state transitions.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  |V| = {graph.vertices.length}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  |E| = {graph.edges.length}
                </span>
              </div>
            </div>

            {/* Canvas Editor Toolbar */}
            <GraphEditorToolbar
              interactionMode={interactionMode}
              setInteractionMode={setInteractionMode}
              onLoadPredefinedGraph={(newG) => {
                loadGraph(newG);
                reset();
              }}
              onOpenImportModal={() => setIsImportModalOpen(true)}
              onClearGraph={() => setIsClearConfirmOpen(true)}
              onClearColors={clearColors}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
            />

            {/* Split Workspace: Stage (Left) & Algorithm Execution Log (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Graph SVG Canvas & Legend (7 cols on desktop) */}
              <div className="lg:col-span-7 space-y-4">
                <GraphCanvas
                  graph={graph}
                  interactionMode={interactionMode}
                  selectedColorId={selectedColorId}
                  currentVertexId={currentSnapshot?.currentVertexId ?? null}
                  inspectingNeighborId={currentSnapshot?.inspectingNeighborId ?? null}
                  candidateColor={currentSnapshot?.candidateColor ?? null}
                  activeEdgeId={currentSnapshot?.activeEdgeId ?? null}
                  conflictingEdgeIds={
                    currentSnapshot
                      ? currentSnapshot.conflictingEdgeIds
                      : validation.conflictingEdgeIds
                  }
                  conflictingVertexIds={validation.conflictingVertexIds}
                  stepColors={currentSnapshot?.colors}
                  onAddVertex={addVertex}
                  onAddEdge={handleAddEdge}
                  onDeleteVertex={deleteVertex}
                  onDeleteEdge={deleteEdge}
                  onUpdateVertexPosition={updateVertexPosition}
                  onSetVertexColor={setVertexColor}
                />

                {/* Color Legend & Manual Coloring Palette */}
                <ColorLegend
                  colorDistribution={validation.colorDistribution}
                  selectedColorId={selectedColorId}
                  onSelectColor={setSelectedColorId}
                  isColoringMode={interactionMode === 'color'}
                />
              </div>

              {/* Right Column: Execution Controls, Step Trace & Live Statistics (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Algorithm Step Controls */}
                <AlgorithmControls
                  selectedAlgorithm={selectedAlgorithm}
                  onSelectAlgorithm={(algo) => {
                    setSelectedAlgorithm(algo);
                    reset();
                  }}
                  ordering={ordering}
                  onChangeOrdering={(ord) => {
                    setOrdering(ord);
                    reset();
                  }}
                  backtrackingK={backtrackingK}
                  onChangeBacktrackingK={(k) => {
                    setBacktrackingK(k);
                    reset();
                  }}
                  isPlaying={isPlaying}
                  onStartOrResume={startOrResume}
                  onPause={pause}
                  onPrevStep={prevStep}
                  onNextStep={nextStep}
                  onReset={reset}
                  onRunToCompletion={runToCompletion}
                  speedMs={speedMs}
                  onChangeSpeed={setSpeedMs}
                  currentStepIndex={currentStepIndex}
                  totalSteps={snapshots.length}
                />

                {/* Step-by-Step Execution Log */}
                <ExecutionLog
                  snapshots={snapshots}
                  currentStepIndex={currentStepIndex}
                  onJumpToStep={jumpToStep}
                />

                {/* Validation & Statistics Panel */}
                <StatisticsPanel validation={validation} graph={graph} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Algorithms Theory & Pseudocode */}
        {activeTab === 'algorithms' && <AlgorithmsTheoryView />}

        {/* TAB 3: Complexity Analysis & Benchmarks */}
        {activeTab === 'complexity' && (
          <div className="space-y-8 animate-fadeIn">
            <ComplexityTable />
            <PerformanceComparison graph={graph} />
          </div>
        )}

        {/* TAB 4: Learning Challenges Mode */}
        {activeTab === 'learning' && (
          <div className="space-y-6 animate-fadeIn">
            <LearningPanel
              graph={graph}
              validation={validation}
              selectedColorId={selectedColorId}
              onSelectColor={setSelectedColorId}
              onLoadGraph={loadGraph}
              onClearColors={clearColors}
              onSetInteractionMode={(mode) => setInteractionMode(mode)}
            />

            {/* Sandbox Canvas for the Challenge */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Challenge Canvas Sandbox
                </span>
                <span className="text-xs text-cyan-400 font-mono">
                  Mode: Click any vertex to color
                </span>
              </div>

              <GraphCanvas
                graph={graph}
                interactionMode="color"
                selectedColorId={selectedColorId}
                currentVertexId={null}
                inspectingNeighborId={null}
                candidateColor={null}
                activeEdgeId={null}
                conflictingEdgeIds={validation.conflictingEdgeIds}
                conflictingVertexIds={validation.conflictingVertexIds}
                onAddVertex={addVertex}
                onAddEdge={handleAddEdge}
                onDeleteVertex={deleteVertex}
                onDeleteEdge={deleteEdge}
                onUpdateVertexPosition={updateVertexPosition}
                onSetVertexColor={setVertexColor}
              />

              <StatisticsPanel validation={validation} graph={graph} />
            </div>
          </div>
        )}

        {/* TAB 5: About Project & Viva Guide */}
        {activeTab === 'about' && <AboutProject />}
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Graph Coloring Simulator · Design and Analysis of Algorithms</span>
          <span>Client-Side Algorithmic Execution Engine</span>
        </div>
      </footer>

      {/* 4. Modals */}
      <ImportGraphModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportGraph={(newG) => {
          loadGraph(newG);
          reset();
        }}
      />

      <ConfirmationModal
        isOpen={isClearConfirmOpen}
        title="Clear Graph Canvas?"
        message="Are you sure you want to remove all vertices and edges from the canvas? This action will reset the current graph."
        confirmLabel="Yes, Clear Graph"
        onConfirm={() => {
          clearGraph();
          setIsClearConfirmOpen(false);
        }}
        onCancel={() => setIsClearConfirmOpen(false)}
      />
    </div>
  );
}
