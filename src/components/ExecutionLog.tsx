import React, { useEffect, useRef } from 'react';
import { StepSnapshot } from '../graph/graphTypes.ts';
import { Terminal, CheckCircle2, AlertTriangle, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';

interface ExecutionLogProps {
  snapshots: StepSnapshot[];
  currentStepIndex: number;
  onJumpToStep: (index: number) => void;
}

export const ExecutionLog: React.FC<ExecutionLogProps> = ({
  snapshots,
  currentStepIndex,
  onJumpToStep,
}) => {
  const activeStepRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeStepRef.current && containerRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentStepIndex]);

  const currentSnapshot = snapshots[currentStepIndex];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full max-h-[480px]">
      {/* Log Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">
            Algorithm Execution Trace
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          {snapshots.length > 0 ? `${snapshots.length} Recorded Steps` : 'No execution yet'}
        </span>
      </div>

      {/* Current Step Spotlight Card */}
      {currentSnapshot && (
        <div className="p-3.5 bg-slate-950/60 border-b border-slate-800/80">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              STEP {currentSnapshot.stepNumber}
            </span>
            <span className="text-xs font-semibold text-white truncate">
              {currentSnapshot.title}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {currentSnapshot.explanation}
          </p>
        </div>
      )}

      {/* Scrollable Step History */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40 text-xs"
      >
        {snapshots.length === 0 ? (
          <div className="py-12 px-4 text-center text-slate-500">
            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-medium text-xs">No algorithm steps recorded yet</p>
            <p className="text-[11px] text-slate-600 mt-1">
              Select an algorithm and click "Run Algorithm" or "Next Step" to generate the step-by-step trace.
            </p>
          </div>
        ) : (
          snapshots.map((snap, idx) => {
            const isActive = idx === currentStepIndex;

            let statusIcon = <ArrowRight className="w-3.5 h-3.5 text-slate-400" />;
            let statusBadge = (
              <span className="text-[10px] font-mono text-slate-400">INSPECT</span>
            );

            if (snap.status === 'assigned') {
              statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
              statusBadge = (
                <span className="text-[10px] font-mono text-emerald-400">ASSIGN</span>
              );
            } else if (snap.status === 'conflict') {
              statusIcon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
              statusBadge = (
                <span className="text-[10px] font-mono text-amber-400">CONFLICT</span>
              );
            } else if (snap.status === 'backtracking') {
              statusIcon = <CornerDownLeft className="w-3.5 h-3.5 text-rose-400" />;
              statusBadge = (
                <span className="text-[10px] font-mono text-rose-400">BACKTRACK</span>
              );
            } else if (snap.status === 'complete') {
              statusIcon = <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
              statusBadge = (
                <span className="text-[10px] font-mono text-cyan-400">DONE</span>
              );
            }

            return (
              <div
                key={snap.stepNumber}
                ref={isActive ? activeStepRef : null}
                onClick={() => onJumpToStep(idx)}
                className={`pt-1.5 pb-1.5 px-2.5 rounded-lg cursor-pointer transition-colors flex items-start gap-2.5 ${
                  isActive
                    ? 'bg-cyan-950/40 border border-cyan-800/60 shadow-sm'
                    : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="mt-0.5 shrink-0">{statusIcon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-mono text-[11px] font-semibold truncate ${
                        isActive ? 'text-cyan-300' : 'text-slate-300'
                      }`}
                    >
                      Step {snap.stepNumber}: {snap.title}
                    </span>
                    <span className="shrink-0">{statusBadge}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {snap.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
