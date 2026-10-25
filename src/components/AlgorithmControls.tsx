import React from 'react';
import { AlgorithmType, OrderingType } from '../graph/graphTypes.ts';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  FastForward,
  Settings2,
  Gauge,
} from 'lucide-react';

interface AlgorithmControlsProps {
  selectedAlgorithm: AlgorithmType;
  onSelectAlgorithm: (algo: AlgorithmType) => void;
  ordering: OrderingType;
  onChangeOrdering: (ord: OrderingType) => void;
  backtrackingK: number;
  onChangeBacktrackingK: (k: number) => void;
  isPlaying: boolean;
  onStartOrResume: () => void;
  onPause: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onReset: () => void;
  onRunToCompletion: () => void;
  speedMs: number;
  onChangeSpeed: (ms: number) => void;
  currentStepIndex: number;
  totalSteps: number;
}

export const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  selectedAlgorithm,
  onSelectAlgorithm,
  ordering,
  onChangeOrdering,
  backtrackingK,
  onChangeBacktrackingK,
  isPlaying,
  onStartOrResume,
  onPause,
  onPrevStep,
  onNextStep,
  onReset,
  onRunToCompletion,
  speedMs,
  onChangeSpeed,
  currentStepIndex,
  totalSteps,
}) => {
  const progressPercent = totalSteps > 1 ? Math.round((currentStepIndex / (totalSteps - 1)) * 100) : 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
      {/* Algorithm Selector Segmented Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Select Graph Coloring Algorithm
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800/80">
          <button
            onClick={() => onSelectAlgorithm('greedy')}
            className={`px-3 py-2 rounded-md text-xs font-medium transition-all text-center whitespace-nowrap shrink-0 ${
              selectedAlgorithm === 'greedy'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Greedy Coloring
          </button>

          <button
            onClick={() => onSelectAlgorithm('welsh-powell')}
            className={`px-3 py-2 rounded-md text-xs font-medium transition-all text-center whitespace-nowrap shrink-0 ${
              selectedAlgorithm === 'welsh-powell'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Welsh-Powell
          </button>

          <button
            onClick={() => onSelectAlgorithm('backtracking')}
            className={`px-3 py-2 rounded-md text-xs font-medium transition-all text-center whitespace-nowrap shrink-0 ${
              selectedAlgorithm === 'backtracking'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Backtracking (k)
          </button>

          <button
            onClick={() => onSelectAlgorithm('exact-chromatic')}
            className={`px-3 py-2 rounded-md text-xs font-medium transition-all text-center whitespace-nowrap shrink-0 ${
              selectedAlgorithm === 'exact-chromatic'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Exact χ(G) Search
          </button>
        </div>
      </div>

      {/* Algorithm Specific Parameters */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-slate-800/80 text-xs">
        {selectedAlgorithm === 'greedy' && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Vertex Ordering:</span>
            <select
              value={ordering}
              onChange={(e) => onChangeOrdering(e.target.value as OrderingType)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-md px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="degree-desc">Highest-Degree First (Heuristic)</option>
              <option value="natural">Natural Order (V1, V2, ...)</option>
              <option value="degree-asc">Lowest-Degree First</option>
            </select>
          </div>
        )}

        {selectedAlgorithm === 'welsh-powell' && (
          <div className="flex items-center gap-2 text-slate-400">
            <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sorts vertices by degree descending, then batches color assignments.</span>
          </div>
        )}

        {selectedAlgorithm === 'backtracking' && (
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">Max Colors Allowed (k):</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((kVal) => (
                <button
                  key={kVal}
                  onClick={() => onChangeBacktrackingK(kVal)}
                  className={`w-7 h-7 rounded text-xs font-mono font-semibold transition-colors ${
                    backtrackingK === kVal
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {kVal}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedAlgorithm === 'exact-chromatic' && (
          <div className="flex items-center gap-2 text-slate-400">
            <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Iterates k = 1, 2, ... testing k-colorability to find the global minimum χ(G).</span>
          </div>
        )}

        {/* Speed Slider */}
        <div className="flex items-center gap-2 ml-auto">
          <Gauge className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Speed:</span>
          <input
            type="range"
            min="50"
            max="1200"
            step="50"
            value={1250 - speedMs}
            onChange={(e) => onChangeSpeed(1250 - Number(e.target.value))}
            className="w-24 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="font-mono text-slate-400 w-12 text-right">
            {(1000 / speedMs).toFixed(1)}x
          </span>
        </div>
      </div>

      {/* Playback Controls & Progress Bar */}
      <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Playback Button Group */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onReset}
            title="Reset execution to beginning"
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onPrevStep}
            disabled={currentStepIndex <= 0 || totalSteps === 0}
            title="Previous Step"
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors disabled:opacity-40 disabled:hover:bg-slate-950"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {isPlaying ? (
            <button
              onClick={onPause}
              title="Pause playback"
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg shadow transition-colors text-xs"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onStartOrResume}
              title="Start or resume execution"
              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg shadow transition-colors text-xs"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{totalSteps === 0 ? 'Run Algorithm' : currentStepIndex >= totalSteps - 1 ? 'Replay' : 'Resume'}</span>
            </button>
          )}

          <button
            onClick={onNextStep}
            disabled={totalSteps > 0 && currentStepIndex >= totalSteps - 1}
            title="Next Step"
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors disabled:opacity-40 disabled:hover:bg-slate-950"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={onRunToCompletion}
            title="Run immediately to completion"
            className="flex items-center gap-1 px-3 py-2 text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors text-xs"
          >
            <FastForward className="w-4 h-4" />
            <span className="hidden sm:inline">Complete</span>
          </button>
        </div>

        {/* Step Progress & Counter */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex flex-col items-end">
            <span className="text-xs font-mono font-medium text-slate-300">
              {totalSteps > 0 ? (
                <>
                  Step <span className="text-cyan-400 font-bold">{currentStepIndex + 1}</span> of{' '}
                  <span className="text-slate-400">{totalSteps}</span>
                </>
              ) : (
                <span className="text-slate-500">Ready to execute</span>
              )}
            </span>
          </div>

          <div className="w-24 sm:w-32 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
