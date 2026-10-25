import React from 'react';
import { BookOpen, Cpu, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

export const ComplexityTable: React.FC = () => {
  const complexityData = [
    {
      algorithm: 'Greedy Coloring',
      purpose: 'Fast approximation coloring for general graphs',
      expectedResult: 'Valid proper coloring (upper bounded by Δ(G) + 1)',
      timeComplexity: 'O(V + E)',
      timeNotes: 'With adjacency list and boolean forbidden color array for fixed ordering',
      spaceComplexity: 'O(V + E)',
      spaceNotes: 'O(V + E) graph + O(V) auxiliary color arrays',
      guaranteesMin: false,
      guaranteeText: 'No (Heuristic, ordering dependent)',
      classBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      algorithm: 'Welsh-Powell Heuristic',
      purpose: 'Heuristic coloring prioritizing high-degree vertices',
      expectedResult: 'Valid proper coloring, often closer to χ(G)',
      timeComplexity: 'O(V log V + V²)',
      timeNotes: 'O(V log V) comparison sort + O(V²) non-adjacency batch scans',
      spaceComplexity: 'O(V + E)',
      spaceNotes: 'O(V + E) graph + O(V) color & degree arrays',
      guaranteesMin: false,
      guaranteeText: 'No (Heuristic, though often near-optimal)',
      classBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      algorithm: 'Backtracking k-Colorability',
      purpose: 'Decision problem: is graph G colorable with at most k colors?',
      expectedResult: 'Boolean answer + valid k-coloring if feasible',
      timeComplexity: 'O(k^V · (V + E))',
      timeNotes: 'Exponential worst-case search tree of depth V with branching factor k',
      spaceComplexity: 'O(V + E)',
      spaceNotes: 'O(V + E) graph + O(V) recursive call stack',
      guaranteesMin: false,
      guaranteeText: 'No (Tests single fixed k feasibility)',
      classBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      algorithm: 'Exact Chromatic Number χ(G)',
      purpose: 'Optimization problem: find the minimum k such that G is k-colorable',
      expectedResult: 'Exact chromatic number χ(G) with certified proof',
      timeComplexity: 'O(∑ k^V · (V + E))',
      timeNotes: 'Iterative exponential searches for k = 1, 2, ..., χ(G)',
      spaceComplexity: 'O(V + E)',
      spaceNotes: 'O(V + E) graph storage + O(V) recursion depth',
      guaranteesMin: true,
      guaranteeText: 'Yes (Provably exact minimum colors)',
      classBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Theoretical Primer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Design and Analysis of Algorithms (DAA) Theoretical Complexity
          </h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
          In computational complexity theory, determining whether an arbitrary graph is 3-colorable is one of
          Richard Karp’s classic 21 <strong>NP-complete</strong> decision problems. Consequently, finding the exact
          chromatic number <code className="text-cyan-300 font-mono">χ(G)</code> is <strong>NP-hard</strong>. For practical
          applications with hundreds or thousands of nodes, polynomial-time heuristics like Greedy and Welsh-Powell are
          standard, while backtracking provides exact solutions for academic and moderate instances.
        </p>

        {/* Math Invariant Callout */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
              Fundamental Coloring Condition
            </span>
            <code className="text-base text-cyan-300 font-mono font-semibold">
              ∀ (u, v) ∈ E : color(u) ≠ color(v)
            </code>
          </div>

          <div className="text-xs text-slate-400 max-w-md">
            <strong>Brooks’ Theorem Bound:</strong> For any connected simple graph G that is neither a complete graph nor an
            odd cycle, <code className="text-amber-300 font-mono">χ(G) ≤ Δ(G)</code>, where Δ(G) is the maximum vertex degree.
          </div>
        </div>
      </div>

      {/* Complexity Comparison Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Algorithm Complexity Matrix</h3>
          </div>
          <span className="text-xs text-slate-400">
            |V| = Vertices, |E| = Edges, k = Max Colors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono">
                <th className="py-3.5 px-4 font-semibold">Algorithm</th>
                <th className="py-3.5 px-4 font-semibold">Purpose & Strategy</th>
                <th className="py-3.5 px-4 font-semibold">Time Complexity</th>
                <th className="py-3.5 px-4 font-semibold">Space Complexity</th>
                <th className="py-3.5 px-4 font-semibold text-center">Exact Minimum χ(G)?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {complexityData.map((row) => (
                <tr key={row.algorithm} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4 font-medium text-white whitespace-nowrap">
                    <span className="font-bold text-sm block">{row.algorithm}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{row.expectedResult}</span>
                  </td>

                  <td className="py-4 px-4 text-slate-300 max-w-xs">
                    {row.purpose}
                  </td>

                  <td className="py-4 px-4 font-mono text-cyan-300 whitespace-nowrap">
                    <span className="font-bold text-sm block">{row.timeComplexity}</span>
                    <span className="text-[10px] text-slate-400 font-sans mt-0.5 block">
                      {row.timeNotes}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-slate-300 whitespace-nowrap">
                    <span className="font-bold text-sm block">{row.spaceComplexity}</span>
                    <span className="text-[10px] text-slate-400 font-sans mt-0.5 block">
                      {row.spaceNotes}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center gap-1">
                      {row.guaranteesMin ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          Guaranteed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400">
                          <XCircle className="w-4 h-4 text-amber-500" />
                          Approximation
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500">{row.guaranteeText}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-World Engineering Applications */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Real-World Applications of Graph Coloring
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-300 text-sm">1. Timetable & Exam Scheduling</h4>
            <p className="text-slate-300 leading-relaxed">
              Vertices represent courses or exam subjects. An edge connects two courses if at least one student is enrolled
              in both. A proper coloring assigns conflict-free time slots (colors) minimizing the total examination period.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-300 text-sm">2. Register Allocation in Compilers</h4>
            <p className="text-slate-300 leading-relaxed">
              Compilers (like GCC and LLVM) build an interference graph where variables are vertices and edges connect
              variables live at the same time. Colors represent physical CPU registers. If χ(G) &gt; available registers,
              variables are spilled to RAM.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-300 text-sm">3. Wireless Frequency Assignment</h4>
            <p className="text-slate-300 leading-relaxed">
              Cell towers or radio transmitters are vertices. Edges represent physical proximity where simultaneous
              transmission on the same frequency causes interference. Colors represent non-overlapping frequency bands.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-300 text-sm">4. Map & Cartographic Coloring</h4>
            <p className="text-slate-300 leading-relaxed">
              By the celebrated Four Color Theorem (proven in 1976 by Appel and Haken), every planar map can be properly
              colored using at most 4 colors so that bordering regions have different colors.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-300 text-sm">5. Pattern Matching & Sudoku</h4>
            <p className="text-slate-300 leading-relaxed">
              A standard 9x9 Sudoku puzzle is isomorphic to a 9-coloring problem on an 81-vertex graph with 810 edges
              enforcing row, column, and 3x3 block disjointness constraints.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-300 text-sm">6. High-Performance Task Scheduling</h4>
            <p className="text-slate-300 leading-relaxed">
              Tasks in distributed cloud computing that require mutually exclusive access to shared hardware resources (GPU,
              network bandwidth) are assigned disjoint execution windows using vertex coloring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
