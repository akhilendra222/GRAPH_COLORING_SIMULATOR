import React, { useState } from 'react';
import { parseEdgeListInput } from '../graph/graphUtils.ts';
import { Graph } from '../graph/graphTypes.ts';
import { X, FileCode, Check, AlertCircle, Copy } from 'lucide-react';

interface ImportGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportGraph: (graph: Graph) => void;
}

const DEFAULT_SAMPLE_TEXT = `V = {1, 2, 3, 4, 5}
E = {(1,2), (1,3), (2,3), (2,4), (3,4), (4,5)}`;

export const ImportGraphModal: React.FC<ImportGraphModalProps> = ({
  isOpen,
  onClose,
  onImportGraph,
}) => {
  const [inputText, setInputText] = useState(DEFAULT_SAMPLE_TEXT);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleValidateAndImport = () => {
    setErrorMessage(null);
    setWarningMessage(null);

    const result = parseEdgeListInput(inputText);
    if (!result.success || !result.graph) {
      setErrorMessage(result.error || 'Failed to parse graph input.');
      return;
    }

    if (result.warning) {
      setWarningMessage(result.warning);
    }

    onImportGraph(result.graph);
    onClose();
  };

  const handlePreset = (preset: string) => {
    setInputText(preset);
    setErrorMessage(null);
    setWarningMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Import Graph via Edge List</h3>
              <p className="text-[11px] text-slate-400">Standard DAA formal mathematical representation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-xs text-slate-300 space-y-1">
            <p>
              Enter the vertex set <code className="text-cyan-300 font-mono">V</code> and edge set{' '}
              <code className="text-cyan-300 font-mono">E</code> using standard mathematical set notation:
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Quick templates:</span>
            <button
              onClick={() => handlePreset(`V = {1, 2, 3, 4}\nE = {(1,2), (1,3), (1,4), (2,3), (2,4), (3,4)}`)}
              className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[11px] text-slate-300"
            >
              K4 Complete
            </button>
            <button
              onClick={() => handlePreset(`V = {1, 2, 3, 4, 5}\nE = {(1,2), (2,3), (3,4), (4,5), (5,1)}`)}
              className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[11px] text-slate-300"
            >
              C5 Cycle
            </button>
            <button
              onClick={() => handlePreset(`V = {1, 2, 3, 4, 5, 6}\nE = {(1,2), (1,3), (1,4), (1,5), (1,6)}`)}
              className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[11px] text-slate-300"
            >
              Star S6
            </button>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setErrorMessage(null);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none shadow-inner"
              placeholder={`V = {1, 2, 3, 4}\nE = {(1,2), (2,3), (3,4)}`}
            />
          </div>

          {/* Error / Warning Alert */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {warningMessage && (
            <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{warningMessage}</span>
            </div>
          )}

          {/* Rules & Guidance */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Input Validation Rules:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Vertex IDs can be integers (1, 2, 3) or strings (A, B, C or V1, V2).</li>
              <li>Edges are undirected pairs <code className="font-mono text-slate-300">(u, v)</code>.</li>
              <li>Self-loops <code className="font-mono text-rose-400">(u, u)</code> are strictly rejected.</li>
              <li>All edge endpoints must exist in vertex set V.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleValidateAndImport}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Validate & Import Graph</span>
          </button>
        </div>
      </div>
    </div>
  );
};
