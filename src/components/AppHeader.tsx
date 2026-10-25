import React from 'react';
import { Network, Sparkles, BookOpen, BarChart3, Info } from 'lucide-react';

export type ActiveTab = 'simulator' | 'algorithms' | 'complexity' | 'learning' | 'about';

interface AppHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onQuickReset?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ activeTab, onTabChange, onQuickReset }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
                Graph Coloring Simulator
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline whitespace-nowrap">
                DAA Interactive Algorithm Laboratory
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium overflow-x-auto py-1">
            <button
              onClick={() => onTabChange('simulator')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Simulator</span>
            </button>

            <button
              onClick={() => onTabChange('algorithms')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'algorithms'
                  ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Algorithms</span>
            </button>

            <button
              onClick={() => onTabChange('complexity')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'complexity'
                  ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Complexity & Benchmarks</span>
            </button>

            <button
              onClick={() => onTabChange('learning')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'learning'
                  ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Challenges</span>
            </button>

            <button
              onClick={() => onTabChange('about')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'about'
                  ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About Project</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {onQuickReset && (
              <button
                onClick={onQuickReset}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700/60 transition-colors whitespace-nowrap shrink-0"
              >
                Reset Demo
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
