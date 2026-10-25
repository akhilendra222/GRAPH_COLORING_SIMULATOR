import React, { useState } from 'react';
import { ValidationResult, Graph } from '../graph/graphTypes.ts';
import { buildAdjacencyList } from '../graph/graphUtils.ts';
import { CheckCircle2, AlertTriangle, HelpCircle, Layers, ListFilter } from 'lucide-react';

interface StatisticsPanelProps {
  validation: ValidationResult;
  graph: Graph;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  validation,
  graph,
}) => {
  const [showAdjacencyList, setShowAdjacencyList] = useState(false);
  const adj = buildAdjacencyList(graph);

  // Status computation
  let statusBanner = {
    title: 'Proper Coloring Verified',
    subtitle: 'Zero conflicts found across all incident edges.',
    badge: 'Valid Proper Coloring',
    bg: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  };

  if (validation.conflictsCount > 0) {
    statusBanner = {
      title: 'Coloring Conflicts Detected',
      subtitle: `${validation.conflictsCount} edge(s) have identical colors at both endpoints!`,
      badge: 'Invalid Coloring',
      bg: 'bg-rose-950/40 border-rose-800/60 text-rose-300',
      icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
    };
  } else if (!validation.isComplete && validation.verticesCount > 0) {
    statusBanner = {
      title: 'Partial / Incomplete Coloring',
      subtitle: `${validation.verticesCount - validation.coloredCount} vertex(es) still uncolored.`,
      badge: 'In Progress',
      bg: 'bg-amber-950/40 border-amber-800/60 text-amber-300',
      icon: <HelpCircle className="w-5 h-5 text-amber-400" />,
    };
  } else if (validation.verticesCount === 0) {
    statusBanner = {
      title: 'Empty Graph',
      subtitle: 'Add vertices to begin coloring and analysis.',
      badge: 'Empty',
      bg: 'bg-slate-900 border-slate-800 text-slate-400',
      icon: <HelpCircle className="w-5 h-5 text-slate-400" />,
    };
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
      {/* Status Validation Banner */}
      <div className={`p-3.5 rounded-lg border flex items-center justify-between gap-3 ${statusBanner.bg}`}>
        <div className="flex items-center gap-3">
          {statusBanner.icon}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider">
                {statusBanner.badge}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{statusBanner.subtitle}</p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xl font-bold font-mono">
            k = {validation.colorsUsed}
          </span>
          <span className="text-[10px] block text-slate-400">colors used</span>
        </div>
      </div>

      {/* Numerical Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block">Vertices (|V|)</span>
          <span className="text-lg font-bold font-mono text-white">
            {validation.coloredCount} / {validation.verticesCount}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {validation.isComplete ? '100% colored' : 'Partially colored'}
          </span>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block">Edges (|E|)</span>
          <span className="text-lg font-bold font-mono text-white">
            {validation.edgesCount}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {validation.edgesChecked} checked
          </span>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block">Edge Conflicts</span>
          <span
            className={`text-lg font-bold font-mono ${
              validation.conflictsCount > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {validation.conflictsCount}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {validation.conflictsCount === 0 ? 'Optimal zero' : 'Constraint violation'}
          </span>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block">Colors Used (k)</span>
          <span className="text-lg font-bold font-mono text-cyan-400">
            {validation.colorsUsed}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Distinct hues
          </span>
        </div>
      </div>

      {/* Mathematical Invariant Note */}
      <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-300">
            <strong className="text-white">DAA Invariant:</strong>{' '}
            <code className="text-cyan-300 font-mono">∀ (u, v) ∈ E : color(u) ≠ color(v)</code>
          </span>
        </div>

        <button
          onClick={() => setShowAdjacencyList(!showAdjacencyList)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 shrink-0 ml-2"
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>{showAdjacencyList ? 'Hide Adjacency List' : 'View Adjacency List'}</span>
        </button>
      </div>

      {/* Adjacency List Drawer */}
      {showAdjacencyList && (
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-1.5 animate-fadeIn">
          <div className="text-slate-400 font-sans text-[11px] font-semibold uppercase tracking-wider mb-2">
            Adjacency List Representation (Adj[u])
          </div>
          {graph.vertices.length === 0 ? (
            <div className="text-slate-500">No vertices in graph.</div>
          ) : (
            graph.vertices.map((v) => {
              const neighbors = adj.get(v.id) || [];
              const neighborLabels = neighbors.map(
                (nid) => graph.vertices.find((u) => u.id === nid)?.label || nid
              );

              return (
                <div key={v.id} className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold w-12">{v.label}</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-slate-300">
                    [ {neighborLabels.length > 0 ? neighborLabels.join(', ') : '∅'} ]
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans ml-auto">
                    deg = {neighbors.length}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
