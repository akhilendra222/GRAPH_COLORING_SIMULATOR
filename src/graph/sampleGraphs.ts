import { Graph, Vertex, Edge } from './graphTypes.ts';

function createCircleVertices(count: number, prefix = 'V', centerX = 360, centerY = 240, radius = 150): Vertex[] {
  const vertices: Vertex[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    vertices.push({
      id: `v${i + 1}`,
      label: `${prefix}${i + 1}`,
      x: Math.round(centerX + radius * Math.cos(angle)),
      y: Math.round(centerY + radius * Math.sin(angle)),
      color: null,
    });
  }
  return vertices;
}

export interface SampleGraphDefinition {
  id: string;
  name: string;
  category: string;
  chromaticNumber: number;
  description: string;
  generate: () => Graph;
}

export const SAMPLE_GRAPHS: SampleGraphDefinition[] = [
  {
    id: 'k3',
    name: 'Triangle Graph (K3)',
    category: 'Complete / Cycle',
    chromaticNumber: 3,
    description: 'A 3-vertex complete graph. Every vertex connects to every other vertex, requiring exactly 3 colors.',
    generate: () => {
      const vertices = createCircleVertices(3, 'V', 360, 240, 140);
      const edges: Edge[] = [
        { id: 'e_v1_v2', u: 'v1', v: 'v2' },
        { id: 'e_v2_v3', u: 'v2', v: 'v3' },
        { id: 'e_v1_v3', u: 'v1', v: 'v3' },
      ];
      return { vertices, edges };
    },
  },
  {
    id: 'c4',
    name: 'Square Cycle (C4)',
    category: 'Cycles',
    chromaticNumber: 2,
    description: 'An even cycle with 4 vertices. Even cycles are bipartite and require only 2 colors.',
    generate: () => {
      const vertices = createCircleVertices(4, 'V', 360, 240, 140);
      const edges: Edge[] = [
        { id: 'e_v1_v2', u: 'v1', v: 'v2' },
        { id: 'e_v2_v3', u: 'v2', v: 'v3' },
        { id: 'e_v3_v4', u: 'v3', v: 'v4' },
        { id: 'e_v4_v1', u: 'v4', v: 'v1' },
      ];
      return { vertices, edges };
    },
  },
  {
    id: 'c5',
    name: 'Five-Cycle Graph (C5)',
    category: 'Cycles',
    chromaticNumber: 3,
    description: 'An odd cycle with 5 vertices. Any odd cycle cannot be 2-colored, requiring at least 3 colors.',
    generate: () => {
      const vertices = createCircleVertices(5, 'V', 360, 240, 145);
      const edges: Edge[] = [
        { id: 'e_v1_v2', u: 'v1', v: 'v2' },
        { id: 'e_v2_v3', u: 'v2', v: 'v3' },
        { id: 'e_v3_v4', u: 'v3', v: 'v4' },
        { id: 'e_v4_v5', u: 'v4', v: 'v5' },
        { id: 'e_v5_v1', u: 'v5', v: 'v1' },
      ];
      return { vertices, edges };
    },
  },
  {
    id: 'k4',
    name: 'Complete Graph K4',
    category: 'Complete',
    chromaticNumber: 4,
    description: 'Every pair of distinct vertices is connected by an edge. For any complete graph Kn, χ(Kn) = n = 4.',
    generate: () => {
      const vertices = createCircleVertices(4, 'V', 360, 240, 140);
      const edges: Edge[] = [
        { id: 'e_v1_v2', u: 'v1', v: 'v2' },
        { id: 'e_v1_v3', u: 'v1', v: 'v3' },
        { id: 'e_v1_v4', u: 'v1', v: 'v4' },
        { id: 'e_v2_v3', u: 'v2', v: 'v3' },
        { id: 'e_v2_v4', u: 'v2', v: 'v4' },
        { id: 'e_v3_v4', u: 'v3', v: 'v4' },
      ];
      return { vertices, edges };
    },
  },
  {
    id: 'k5',
    name: 'Complete Graph K5',
    category: 'Complete',
    chromaticNumber: 5,
    description: 'A 5-vertex complete graph. Non-planar by Kuratowski’s theorem. Requires exactly 5 distinct colors.',
    generate: () => {
      const vertices = createCircleVertices(5, 'V', 360, 240, 150);
      const edges: Edge[] = [];
      for (let i = 0; i < 5; i++) {
        for (let j = i + 1; j < 5; j++) {
          edges.push({
            id: `e_${vertices[i].id}_${vertices[j].id}`,
            u: vertices[i].id,
            v: vertices[j].id,
          });
        }
      }
      return { vertices, edges };
    },
  },
  {
    id: 'k3_3',
    name: 'Bipartite Graph K3,3',
    category: 'Bipartite',
    chromaticNumber: 2,
    description: 'Complete bipartite graph with two partitions of 3 vertices each. Bipartite graphs are always 2-colorable.',
    generate: () => {
      const leftColX = 220;
      const rightColX = 500;
      const yCoords = [120, 240, 360];

      const vertices: Vertex[] = [
        { id: 'v1', label: 'L1', x: leftColX, y: yCoords[0], color: null },
        { id: 'v2', label: 'L2', x: leftColX, y: yCoords[1], color: null },
        { id: 'v3', label: 'L3', x: leftColX, y: yCoords[2], color: null },
        { id: 'v4', label: 'R1', x: rightColX, y: yCoords[0], color: null },
        { id: 'v5', label: 'R2', x: rightColX, y: yCoords[1], color: null },
        { id: 'v6', label: 'R3', x: rightColX, y: yCoords[2], color: null },
      ];

      const edges: Edge[] = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 3; j < 6; j++) {
          edges.push({
            id: `e_${vertices[i].id}_${vertices[j].id}`,
            u: vertices[i].id,
            v: vertices[j].id,
          });
        }
      }

      return { vertices, edges };
    },
  },
  {
    id: 'path',
    name: 'Simple Path Graph (P6)',
    category: 'Trees & Paths',
    chromaticNumber: 2,
    description: 'A linear chain of 6 vertices. All paths and acyclic graphs (trees) have chromatic number 2.',
    generate: () => {
      const vertices: Vertex[] = [
        { id: 'v1', label: 'V1', x: 140, y: 240, color: null },
        { id: 'v2', label: 'V2', x: 230, y: 160, color: null },
        { id: 'v3', label: 'V3', x: 320, y: 280, color: null },
        { id: 'v4', label: 'V4', x: 410, y: 160, color: null },
        { id: 'v5', label: 'V5', x: 500, y: 280, color: null },
        { id: 'v6', label: 'V6', x: 590, y: 240, color: null },
      ];

      const edges: Edge[] = [
        { id: 'e_v1_v2', u: 'v1', v: 'v2' },
        { id: 'e_v2_v3', u: 'v2', v: 'v3' },
        { id: 'e_v3_v4', u: 'v3', v: 'v4' },
        { id: 'e_v4_v5', u: 'v4', v: 'v5' },
        { id: 'e_v5_v6', u: 'v5', v: 'v6' },
      ];

      return { vertices, edges };
    },
  },
  {
    id: 'star',
    name: 'Star Graph (S6)',
    category: 'Trees & Paths',
    chromaticNumber: 2,
    description: 'One central hub vertex connected to 5 outer leaf vertices. Requires only 2 colors regardless of leaf count.',
    generate: () => {
      const center: Vertex = { id: 'v1', label: 'Center', x: 360, y: 240, color: null };
      const outerCount = 5;
      const radius = 140;
      const outerVertices: Vertex[] = [];
      const edges: Edge[] = [];

      for (let i = 0; i < outerCount; i++) {
        const angle = (2 * Math.PI * i) / outerCount - Math.PI / 2;
        const id = `v${i + 2}`;
        outerVertices.push({
          id,
          label: `Leaf ${i + 1}`,
          x: Math.round(360 + radius * Math.cos(angle)),
          y: Math.round(240 + radius * Math.sin(angle)),
          color: null,
        });
        edges.push({
          id: `e_v1_${id}`,
          u: 'v1',
          v: id,
        });
      }

      return {
        vertices: [center, ...outerVertices],
        edges,
      };
    },
  },
  {
    id: 'disconnected',
    name: 'Disconnected Graph (K3 + C4 + Iso)',
    category: 'Special',
    chromaticNumber: 3,
    description: 'Composed of three disconnected components: a triangle (K3), a square cycle (C4), and an isolated vertex.',
    generate: () => {
      const vertices: Vertex[] = [
        // Component 1: Triangle
        { id: 'v1', label: 'T1', x: 160, y: 150, color: null },
        { id: 'v2', label: 'T2', x: 260, y: 150, color: null },
        { id: 'v3', label: 'T3', x: 210, y: 230, color: null },
        // Component 2: C4
        { id: 'v4', label: 'C1', x: 420, y: 160, color: null },
        { id: 'v5', label: 'C2', x: 540, y: 160, color: null },
        { id: 'v6', label: 'C3', x: 540, y: 280, color: null },
        { id: 'v7', label: 'C4', x: 420, y: 280, color: null },
        // Component 3: Isolated vertex
        { id: 'v8', label: 'Iso', x: 210, y: 350, color: null },
      ];

      const edges: Edge[] = [
        { id: 'e_v1_v2', u: 'v1', v: 'v2' },
        { id: 'e_v2_v3', u: 'v2', v: 'v3' },
        { id: 'e_v3_v1', u: 'v3', v: 'v1' },
        { id: 'e_v4_v5', u: 'v4', v: 'v5' },
        { id: 'e_v5_v6', u: 'v5', v: 'v6' },
        { id: 'e_v6_v7', u: 'v6', v: 'v7' },
        { id: 'e_v7_v4', u: 'v7', v: 'v4' },
      ];

      return { vertices, edges };
    },
  },
];
