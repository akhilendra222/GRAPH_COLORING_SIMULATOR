import React from 'react';
import { COLOR_PALETTE } from '../graph/palette.ts';
import { Palette, Check } from 'lucide-react';

interface ColorLegendProps {
  colorDistribution: Record<number, number>;
  selectedColorId: number | null;
  onSelectColor: (colorId: number | null) => void;
  isColoringMode?: boolean;
}

export const ColorLegend: React.FC<ColorLegendProps> = ({
  colorDistribution,
  selectedColorId,
  onSelectColor,
  isColoringMode = false,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Color Palette & Legend
          </h3>
        </div>
        {isColoringMode && (
          <span className="text-[11px] text-cyan-400 font-medium">
            Click a color to paint vertices
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {COLOR_PALETTE.map((color) => {
          const count = colorDistribution[color.id] || 0;
          const isSelected = selectedColorId === color.id;

          return (
            <button
              key={color.id}
              onClick={() => onSelectColor(isSelected ? null : color.id)}
              className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all text-left ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400'
                  : count > 0
                  ? 'border-slate-700 bg-slate-950/70 hover:border-slate-600'
                  : 'border-slate-800/80 bg-slate-950/30 opacity-75 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              <div
                className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center shadow-inner relative"
                style={{ backgroundColor: color.hex, borderColor: color.borderHex }}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                <span className="text-[9px] font-mono font-bold text-white drop-shadow">
                  {color.id}
                </span>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-slate-200 truncate">
                  {color.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {count} {count === 1 ? 'vertex' : 'vertices'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
