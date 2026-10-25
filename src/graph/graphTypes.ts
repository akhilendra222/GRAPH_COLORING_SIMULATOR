export interface Vertex {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: number | null;
}

export interface Edge {
  id: string;
  u: string;
  v: string;
}

export interface Graph {
  vertices: Vertex[];
  edges: Edge[];
}

export interface ColorOption {
  id: number;
  name: string;
  hex: string;
  textColor: string;
  borderHex: string;
}

export type AlgorithmType = 'greedy' | 'welsh-powell' | 'backtracking' | 'exact-chromatic';

export type OrderingType = 'natural' | 'degree-desc' | 'degree-asc';

export type StepStatus =
  | 'inspecting'
  | 'valid'
  | 'conflict'
  | 'assigned'
  | 'backtracking'
  | 'complete'
  | 'failed';

export interface StepSnapshot {
  stepNumber: number;
  title: string;
  description: string;
  currentVertexId: string | null;
  inspectingNeighborId: string | null;
  candidateColor: number | null;
  status: StepStatus;
  // Snapshot of vertex colors at this step
  colors: Record<string, number | null>;
  // Conflicting edges or pairs (edge IDs)
  conflictingEdgeIds: string[];
  // Active edge being tested (between current vertex and neighbor)
  activeEdgeId: string | null;
  explanation: string;
  callStackDepth?: number;
  k?: number;
}

export interface ValidationResult {
  isValid: boolean;
  isComplete: boolean;
  verticesCount: number;
  coloredCount: number;
  edgesCount: number;
  edgesChecked: number;
  conflictsCount: number;
  conflictingEdgeIds: string[];
  conflictingVertexIds: string[];
  colorsUsed: number;
  colorDistribution: Record<number, number>;
}

export interface BenchmarkResult {
  algorithmId: string;
  algorithmName: string;
  colorsUsed: number;
  isValid: boolean;
  executionTimeMs: number;
  stepCount: number;
  isExact: boolean;
  statusText: string;
  notes: string;
}

export interface Challenge {
  id: string;
  title: string;
  graphType: string;
  targetMaxColors: number;
  description: string;
  learningObjective: string;
}
