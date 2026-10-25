import { useState, useEffect, useRef, useCallback } from 'react';
import { Graph, AlgorithmType, OrderingType, StepSnapshot } from '../graph/graphTypes.ts';
import { runGreedyColoring } from '../algorithms/greedyColoring.ts';
import { runWelshPowell } from '../algorithms/welshPowell.ts';
import { runBacktrackingColoring } from '../algorithms/backtracking.ts';
import { findExactChromaticNumber } from '../algorithms/chromaticNumber.ts';

export function useAlgorithmExecution(graph: Graph, onApplyFinalColors?: (colors: Record<string, number | null>) => void) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('greedy');
  const [ordering, setOrdering] = useState<OrderingType>('degree-desc');
  const [backtrackingK, setBacktrackingK] = useState<number>(3);

  const [snapshots, setSnapshots] = useState<StepSnapshot[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(600);
  const [hasExecuted, setHasExecuted] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Re-generate snapshots
  const generateSnapshots = useCallback(() => {
    let resultSnapshots: StepSnapshot[] = [];
    let finalColors: Record<string, number | null> = {};

    if (selectedAlgorithm === 'greedy') {
      const res = runGreedyColoring(graph, ordering);
      resultSnapshots = res.snapshots;
      finalColors = res.finalColors;
    } else if (selectedAlgorithm === 'welsh-powell') {
      const res = runWelshPowell(graph);
      resultSnapshots = res.snapshots;
      finalColors = res.finalColors;
    } else if (selectedAlgorithm === 'backtracking') {
      const res = runBacktrackingColoring(graph, backtrackingK);
      resultSnapshots = res.snapshots;
      finalColors = res.finalColors;
    } else if (selectedAlgorithm === 'exact-chromatic') {
      const res = findExactChromaticNumber(graph);
      resultSnapshots = res.snapshots;
      finalColors = res.finalColors;
    }

    setSnapshots(resultSnapshots);
    setCurrentStepIndex(0);
    setHasExecuted(true);
    return { snapshots: resultSnapshots, finalColors };
  }, [graph, selectedAlgorithm, ordering, backtrackingK]);

  // When graph vertices or edges structure change, invalidate current execution
  useEffect(() => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSnapshots([]);
    setCurrentStepIndex(0);
    setHasExecuted(false);
  }, [graph.vertices.length, graph.edges.length]);

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= snapshots.length - 1) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, snapshots.length, speedMs]);

  const startOrResume = useCallback(() => {
    if (!hasExecuted || snapshots.length === 0) {
      const { snapshots: newSnaps } = generateSnapshots();
      if (newSnaps.length > 0) {
        setIsPlaying(true);
      }
    } else if (currentStepIndex >= snapshots.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
    }
  }, [hasExecuted, snapshots.length, generateSnapshots, currentStepIndex]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const nextStep = useCallback(() => {
    setIsPlaying(false);
    if (!hasExecuted || snapshots.length === 0) {
      generateSnapshots();
      return;
    }
    setCurrentStepIndex((prev) => Math.min(snapshots.length - 1, prev + 1));
  }, [hasExecuted, snapshots.length, generateSnapshots]);

  const prevStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const runToCompletion = useCallback(() => {
    setIsPlaying(false);
    if (!hasExecuted || snapshots.length === 0) {
      const { snapshots: newSnaps, finalColors } = generateSnapshots();
      if (newSnaps.length > 0) {
        setCurrentStepIndex(newSnaps.length - 1);
        if (onApplyFinalColors) {
          onApplyFinalColors(finalColors);
        }
      }
    } else {
      const finalIndex = snapshots.length - 1;
      setCurrentStepIndex(finalIndex);
      if (onApplyFinalColors && snapshots[finalIndex]) {
        onApplyFinalColors(snapshots[finalIndex].colors);
      }
    }
  }, [hasExecuted, snapshots, generateSnapshots, onApplyFinalColors]);

  const jumpToStep = useCallback((index: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(Math.max(0, Math.min(snapshots.length - 1, index)));
  }, [snapshots.length]);

  const currentSnapshot: StepSnapshot | null =
    snapshots.length > 0 && snapshots[currentStepIndex] ? snapshots[currentStepIndex] : null;

  return {
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
    hasExecuted,
    startOrResume,
    pause,
    nextStep,
    prevStep,
    reset,
    runToCompletion,
    jumpToStep,
    generateSnapshots,
  };
}
