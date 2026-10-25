import React, { useState } from 'react';
import { Graph, Challenge, Vertex, ValidationResult } from '../graph/graphTypes.ts';
import { SAMPLE_GRAPHS } from '../graph/sampleGraphs.ts';
import { COLOR_PALETTE, getColorById } from '../graph/palette.ts';
import { buildAdjacencyList } from '../graph/graphUtils.ts';
import {
  Trophy,
  Lightbulb,
  CheckCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const CHALLENGES: Challenge[] = [
  {
    id: 'triangle',
    title: 'Challenge 1: The Triangle (K3)',
    graphType: 'k3',
    targetMaxColors: 3,
    description: 'Color the 3-vertex complete graph K3 using at most 3 colors without any adjacent conflicts.',
    learningObjective: 'Observe why any odd cycle or complete graph requires at least 3 colors. Each vertex is mutual neighbor to the other two.',
  },
  {
    id: 'square',
    title: 'Challenge 2: Square Cycle (C4)',
    graphType: 'c4',
    targetMaxColors: 2,
    description: 'Color the 4-vertex square cycle C4 using exactly 2 colors.',
    learningObjective: 'Understand that any even-length cycle is bipartite, meaning its vertices can be partitioned into 2 independent sets with χ(C4) = 2.',
  },
  {
    id: 'k4',
    title: 'Challenge 3: Complete Graph K4',
    graphType: 'k4',
    targetMaxColors: 4,
    description: 'Properly color the 4-vertex complete graph K4 using no more than 4 colors.',
    learningObjective: 'Understand that every vertex in Kn has degree n-1 and is connected to all other vertices, mandating χ(Kn) = n.',
  },
  {
    id: 'k3_3',
    title: 'Challenge 4: Utility Bipartite Graph K3,3',
    graphType: 'k3_3',
    targetMaxColors: 2,
    description: 'Color the complete bipartite graph K3,3 using only 2 colors.',
    learningObjective: 'Recognize bipartite partitions: all left partition vertices can share Color 1, and all right partition vertices can share Color 2.',
  },
];

interface LearningPanelProps {
  graph: Graph;
  validation: ValidationResult;
  selectedColorId: number | null;
  onSelectColor: (cId: number | null) => void;
  onLoadGraph: (g: Graph) => void;
  onClearColors: () => void;
  onSetInteractionMode: (mode: 'color' | 'select') => void;
}

export const LearningPanel: React.FC<LearningPanelProps> = ({
  graph,
  validation,
  selectedColorId,
  onSelectColor,
  onLoadGraph,
  onClearColors,
  onSetInteractionMode,
}) => {
  const [activeChallengeId, setActiveChallengeId] = useState<string>('triangle');
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  const activeChallenge = CHALLENGES.find((c) => c.id === activeChallengeId) || CHALLENGES[0];

  const handleSelectChallenge = (challenge: Challenge) => {
    setActiveChallengeId(challenge.id);
    setHintMessage(null);
    const sample = SAMPLE_GRAPHS.find((s) => s.id === challenge.graphType);
    if (sample) {
      onLoadGraph(sample.generate());
      onSetInteractionMode('color');
    }
  };

  // Provide an intelligent hint for any uncolored or conflicting vertex
  const handleGetHint = () => {
    const adj = buildAdjacencyList(graph);
    // Find first uncolored or conflicting vertex
    const targetVertex =
      graph.vertices.find((v) => v.color == null || v.color <= 0) ||
      graph.vertices.find((v) => validation.conflictingVertexIds.includes(v.id)) ||
      graph.vertices[0];

    if (!targetVertex) {
      setHintMessage('All vertices are colored with zero conflicts! Challenge complete.');
      return;
    }

    const neighbors = adj.get(targetVertex.id) || [];
    const forbidden = new Set<number>();
    for (const nId of neighbors) {
      const nV = graph.vertices.find((v) => v.id === nId);
      if (nV && nV.color != null && nV.color > 0) {
        forbidden.add(nV.color);
      }
    }

    let candidate = 1;
    while (forbidden.has(candidate)) {
      candidate++;
    }

    const colorMeta = getColorById(candidate);
    setHintMessage(
      `Hint for ${targetVertex.label}: Neighbors use {${
        Array.from(forbidden)
          .map((c) => `C${c}`)
          .join(', ') || 'none'
      }}. Color ${candidate} (${colorMeta?.name}) is safe and valid!`
    );
  };

  const isChallengeSuccess =
    validation.isValid &&
    validation.isComplete &&
    validation.verticesCount > 0 &&
    validation.colorsUsed <= activeChallenge.targetMaxColors;

  return (
    <div className="space-y-6">
      {/* Guided Challenge Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Interactive Guided Challenges</h3>
        </div>

        <p className="text-xs text-slate-300">
          Select a graph challenge, pick colors from the palette below, and click vertices on the canvas to assign them.
          Try to achieve a valid proper coloring using the optimal minimum colors!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CHALLENGES.map((ch) => {
            const isSelected = ch.id === activeChallengeId;
            return (
              <button
                key={ch.id}
                onClick={() => handleSelectChallenge(ch)}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-sm'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white truncate">{ch.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                    ≤ {ch.targetMaxColors} colors
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{ch.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Challenge Workbench & Manual Palette */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider block">
              Active Objective
            </span>
            <h4 className="text-lg font-bold text-white mt-0.5">{activeChallenge.title}</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{activeChallenge.learningObjective}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleGetHint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Get Hint</span>
            </button>

            <button
              onClick={onClearColors}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Coloring</span>
            </button>
          </div>
        </div>

        {/* Hint Callout */}
        {hintMessage && (
          <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg flex items-center gap-2.5 text-xs text-amber-200">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{hintMessage}</span>
          </div>
        )}

        {/* Success Completion Banner */}
        {isChallengeSuccess && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h5 className="font-bold text-sm text-emerald-300">Challenge Mastered!</h5>
                <p className="text-xs text-slate-300 mt-0.5">
                  You successfully colored the graph with {validation.colorsUsed} color(s), which satisfies the
                  chromatic lower bound without any edge conflicts!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Manual Color Palette Toolbar */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Select Active Color from Palette:
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {COLOR_PALETTE.slice(0, 8).map((c) => {
              const isSelected = selectedColorId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectColor(isSelected ? null : c.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/60 ring-2 ring-cyan-400 text-white'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block shadow"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>
                    C{c.id} ({c.name})
                  </span>
                </button>
              );
            })}
          </div>
          <span className="text-[11px] text-slate-500 block pt-1">
            After choosing a color, switch to the Canvas and click any node to paint it.
          </span>
        </div>
      </div>
    </div>
  );
};
