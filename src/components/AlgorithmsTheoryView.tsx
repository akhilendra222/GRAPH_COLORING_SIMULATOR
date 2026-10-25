import React from 'react';
import { Sparkles, Code2, GitFork, RotateCcw, CheckCircle2 } from 'lucide-react';

export const AlgorithmsTheoryView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Overview Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Graph Coloring Algorithms in DAA
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Theoretical foundations, pseudocode, and execution mechanics
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Graph coloring is an assignment of labels (traditionally called "colors") to elements of a graph subject to
          certain constraints. In its simplest and most common form, <strong>vertex coloring</strong> seeks to assign
          colors to the vertices of an undirected graph G = (V, E) such that no two adjacent vertices share the same
          color.
        </p>
      </div>

      {/* Algorithm 1: Greedy Coloring */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              Algorithm A
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">Sequential Greedy Coloring</h3>
          </div>
          <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-md font-mono text-xs">
            Time: O(V + E)
          </span>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            The greedy coloring algorithm considers vertices in a pre-determined order <code className="font-mono text-cyan-300">v₁, v₂, ..., vₙ</code>.
            For each vertex <code className="font-mono text-cyan-300">vᵢ</code>, it examines the colors already assigned to its adjacent neighbors
            and assigns to <code className="font-mono text-cyan-300">vᵢ</code> the smallest positive color integer not yet utilized by any colored neighbor.
          </p>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold font-mono">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pseudocode: GREEDY-COLOR(G, Order)</span>
            </div>
            <pre className="font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed">
{`1.  Initialize color[v] = null for all v in V
2.  color[Order[0]] = 1
3.  for i = 1 to |V| - 1 do:
4.      u = Order[i]
5.      forbidden = set()
6.      for each neighbor v in Adj[u] do:
7.          if color[v] != null then:
8.              forbidden.add(color[v])
9.      c = 1
10.     while c in forbidden do:
11.         c = c + 1
12.     color[u] = c
13. return color`}
            </pre>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/60 text-slate-400 text-xs">
            <strong className="text-white">Properties & Limitations:</strong>
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>Always runs in linear time <code className="text-cyan-300 font-mono">O(V + E)</code> when using an adjacency list.</li>
              <li>Always guarantees that no more than <code className="text-cyan-300 font-mono">Δ(G) + 1</code> colors will be used (where Δ is max degree).</li>
              <li>Highly sensitive to vertex ordering. An arbitrary order may use significantly more colors than χ(G).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Algorithm 2: Welsh-Powell */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              Algorithm B
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">Welsh-Powell Heuristic (1967)</h3>
          </div>
          <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-md font-mono text-xs">
            Time: O(V log V + V²)
          </span>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Introduced by D. J. A. Welsh and M. B. Powell, this heuristic orders vertices in non-increasing order of degree
            before coloring. Vertices with higher degrees have the most neighbor constraints, so assigning them early
            avoids forcing unnecessary colors later.
          </p>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold font-mono">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pseudocode: WELSH-POWELL(G)</span>
            </div>
            <pre className="font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed">
{`1.  Sort vertices in descending order of degree: deg(v₁) ≥ deg(v₂) ≥ ... ≥ deg(vₙ)
2.  c = 1
3.  while uncolored vertices remain do:
4.      Assign color c to first uncolored vertex v
5.      for each remaining uncolored vertex u in sorted order do:
6.          if u is not adjacent to ANY vertex already assigned color c then:
7.              Assign color c to u
8.      c = c + 1
9.  return colors`}
            </pre>
          </div>
        </div>
      </div>

      {/* Algorithm 3: Backtracking */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              Algorithm C
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">Backtracking k-Colorability</h3>
          </div>
          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md font-mono text-xs">
            Time: O(k^V · (V + E))
          </span>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Backtracking systematically constructs candidates for the solution using a depth-first traversal of a state-space
            tree. At each step, it attempts to assign color <code className="font-mono text-cyan-300">c ∈ {'{1, ..., k}'}</code> to vertex <code className="font-mono text-cyan-300">vᵢ</code>.
            If a conflict with an adjacent vertex arises, the bounding condition prunes that subtree immediately.
          </p>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold font-mono">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pseudocode: BACKTRACK-COLOR(vIndex, k)</span>
            </div>
            <pre className="font-mono text-xs text-amber-200 overflow-x-auto leading-relaxed">
{`1.  if vIndex == |V| then return true // Base case: all colored
2.  u = V[vIndex]
3.  for c = 1 to k do:
4.      if isSafe(u, c) then:
5.          color[u] = c
6.          if BACKTRACK-COLOR(vIndex + 1, k) == true then:
7.              return true
8.          color[u] = null // Backtrack
9.  return false // No color 1..k works`}
            </pre>
          </div>
        </div>
      </div>

      {/* Algorithm 4: Exact Chromatic Number */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              Algorithm D
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">Exact Chromatic Number χ(G)</h3>
          </div>
          <span className="px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-md font-mono text-xs">
            Provably Optimal
          </span>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            By definition, <code className="font-mono text-cyan-300">χ(G) = min {'{k ≥ 1 : G is k-colorable}'}</code>.
            The exact search algorithm invokes the backtracking k-colorability procedure starting at <code className="font-mono text-cyan-300">k = 1</code>,
            incrementing <code className="font-mono text-cyan-300">k</code> until the first affirmative solution is reached.
          </p>

          <p>
            Because <code className="font-mono text-cyan-300">k - 1</code> was conclusively proven uncolorable, the resulting value is guaranteed to be
            the minimum chromatic number of the graph.
          </p>
        </div>
      </div>
    </div>
  );
};
