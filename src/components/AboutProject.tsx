import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  User,
  Building,
  Calendar,
  Save,
  CheckCircle,
  HelpCircle,
  Award,
  BookOpen,
} from 'lucide-react';

interface StudentProfile {
  studentName: string;
  rollNumber: string;
  department: string;
  collegeName: string;
  academicYear: string;
}

const STORAGE_KEY = 'daa_graph_coloring_student_profile';

export const AboutProject: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignored
    }
    return {
      studentName: 'Akhilendra Ghattamaneni',
      rollNumber: '21CS042',
      department: 'Department of Computer Science & Engineering',
      collegeName: 'National Institute of Technology',
      academicYear: '2025-2026',
    };
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch {
      // Ignored
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Project Overview Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Designing a Graph Coloring Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Design and Analysis of Algorithms (DAA) Capstone Project
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">
              Project Specification
            </span>
            <div className="space-y-1 text-slate-300">
              <p>
                <strong className="text-white">Course:</strong> Design & Analysis of Algorithms (DAA)
              </p>
              <p>
                <strong className="text-white">Project Type:</strong> Interactive Educational Simulation & Visualizer
              </p>
              <p>
                <strong className="text-white">Architecture:</strong> Client-Side React SPA, SVG Graph Canvas Engine
              </p>
              <p>
                <strong className="text-white">Core Algorithms:</strong> Greedy Coloring, Welsh-Powell Heuristic, Backtracking k-Colorability, Exact Chromatic Number Search
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">
              Academic Objective
            </span>
            <p className="text-slate-300 leading-relaxed">
              To provide computer science students with a rigorous, interactive tool for understanding graph coloring,
              adjacency list representations, state-space tree traversal in backtracking, heuristic decision strategies,
              and polynomial vs. NP-hard theoretical computational complexities.
            </p>
          </div>
        </div>

        {/* Editable Student Particulars */}
        <div className="p-5 bg-slate-950/80 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Student & Institutional Credentials</h3>
            </div>
            <span className="text-[11px] text-slate-500">Editable for faculty viva presentation</span>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Student Name</label>
              <input
                type="text"
                value={profile.studentName}
                onChange={(e) => setProfile({ ...profile, studentName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
                placeholder="Student Name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Roll Number / USN</label>
              <input
                type="text"
                value={profile.rollNumber}
                onChange={(e) => setProfile({ ...profile, rollNumber: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                placeholder="Roll No"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Academic Year</label>
              <input
                type="text"
                value={profile.academicYear}
                onChange={(e) => setProfile({ ...profile, academicYear: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="2025-2026"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-400 font-medium">Department</label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="Department"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">College / Institution</label>
              <input
                type="text"
                value={profile.collegeName}
                onChange={(e) => setProfile({ ...profile, collegeName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="College Name"
              />
            </div>

            <div className="sm:col-span-3 flex items-center justify-end gap-3 pt-2">
              {isSaved && (
                <span className="text-emerald-400 text-xs flex items-center gap-1 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Credentials saved to browser storage!
                </span>
              )}
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg shadow text-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Credentials</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* DAA Viva Voce Demonstration Guide */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">
            DAA Faculty Viva Voce & Demonstration Guide
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-cyan-300 text-sm">
              Q1: What is the formal definition of proper vertex coloring?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Given an undirected graph G = (V, E), a proper vertex coloring is a function c: V → {'{1, 2, ..., k}'} such
              that for every edge (u, v) ∈ E, c(u) ≠ c(v). The chromatic number χ(G) is the minimal k for which such a
              function exists.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-cyan-300 text-sm">
              Q2: Why is finding the chromatic number NP-hard while 2-colorability is in P?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Testing whether a graph is 2-colorable is equivalent to testing whether the graph is bipartite (contains no odd
              cycles), which can be solved in linear time O(V + E) using Breadth-First Search (BFS) or Depth-First Search
              (DFS). However, determining 3-colorability for general graphs is NP-complete (Karp, 1972). Thus, the general
              optimization problem of computing χ(G) is NP-hard.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-cyan-300 text-sm">
              Q3: Why doesn't greedy coloring always produce the minimum chromatic number?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Greedy coloring is purely sequential and makes irrevocable choices without looking ahead. If unfavorable vertex
              orderings are picked (such as in the Crown Graph or bipartite graphs colored in an interlaced order), greedy
              may require up to |V|/2 colors on a graph whose true chromatic number is only 2! Welsh-Powell mitigates this by
              sorting high-degree vertices first.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-cyan-300 text-sm">
              Q4: How does the backtracking algorithm prune the search space?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              When assigning color c to vertex V, the algorithm immediately inspects all already-colored neighbors. If an
              adjacency conflict occurs, that branch of the search tree is terminated immediately (bounding function). If all
              k colors fail on vertex V, the assignment is undone and the algorithm backtracks to the previous vertex.
            </p>
          </div>
        </div>

        {/* 5-Step Demo Script */}
        <div className="p-5 bg-gradient-to-br from-slate-950 to-indigo-950/30 rounded-xl border border-indigo-900/40 space-y-3 text-xs">
          <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider block">
            Recommended 5-Step Demonstration Script for Faculty
          </span>
          <ol className="list-decimal pl-5 space-y-2 text-slate-300 leading-relaxed">
            <li>
              <strong>Load K3 (Triangle):</strong> Show that it requires 3 colors. Run Greedy and Backtracking to demonstrate
              the execution log and step-by-step neighbor conflict checks.
            </li>
            <li>
              <strong>Load C4 vs C5:</strong> Contrast an even cycle (C4, bipartite, χ=2) with an odd cycle (C5, χ=3) to verify
              the odd-cycle chromatic boundary theorem.
            </li>
            <li>
              <strong>Demonstrate Welsh-Powell:</strong> Show how vertices are sorted by degree in descending order, and how
              colors are assigned in non-adjacent batches.
            </li>
            <li>
              <strong>Interactive Learning Mode:</strong> Solve a challenge manually to prove edge conflict detection and the
              instant validation engine.
            </li>
            <li>
              <strong>Performance Benchmark & Complexity Tab:</strong> Run the benchmark table comparing Greedy, Welsh-Powell,
              and Exact Search runtimes, and walk through the Big-O complexity matrix.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
