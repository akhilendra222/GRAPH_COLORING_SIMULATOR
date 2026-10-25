import { ColorOption } from './graphTypes.ts';

export const COLOR_PALETTE: ColorOption[] = [
  {
    id: 1,
    name: 'Sky Azure',
    hex: '#0284c7', // Sky-600
    textColor: '#ffffff',
    borderHex: '#38bdf8',
  },
  {
    id: 2,
    name: 'Coral Crimson',
    hex: '#e11d48', // Rose-600
    textColor: '#ffffff',
    borderHex: '#fb7185',
  },
  {
    id: 3,
    name: 'Emerald Jade',
    hex: '#059669', // Emerald-600
    textColor: '#ffffff',
    borderHex: '#34d399',
  },
  {
    id: 4,
    name: 'Vibrant Amber',
    hex: '#d97706', // Amber-600
    textColor: '#ffffff',
    borderHex: '#fbbf24',
  },
  {
    id: 5,
    name: 'Royal Violet',
    hex: '#7c3aed', // Violet-600
    textColor: '#ffffff',
    borderHex: '#a78bfa',
  },
  {
    id: 6,
    name: 'Teal Cyan',
    hex: '#0891b2', // Cyan-600
    textColor: '#ffffff',
    borderHex: '#22d3ee',
  },
  {
    id: 7,
    name: 'Hot Magenta',
    hex: '#c026d3', // Fuchsia-600
    textColor: '#ffffff',
    borderHex: '#e879f9',
  },
  {
    id: 8,
    name: 'Bright Lime',
    hex: '#65a30d', // Lime-600
    textColor: '#ffffff',
    borderHex: '#a3e635',
  },
  {
    id: 9,
    name: 'Electric Indigo',
    hex: '#4f46e5', // Indigo-600
    textColor: '#ffffff',
    borderHex: '#818cf8',
  },
  {
    id: 10,
    name: 'Sunset Orange',
    hex: '#ea580c', // Orange-600
    textColor: '#ffffff',
    borderHex: '#fb923c',
  },
  {
    id: 11,
    name: 'Deep Pine',
    hex: '#0d9488', // Teal-600
    textColor: '#ffffff',
    borderHex: '#2dd4bf',
  },
  {
    id: 12,
    name: 'Golden Sun',
    hex: '#ca8a04', // Yellow-600
    textColor: '#ffffff',
    borderHex: '#facc15',
  },
];

export function getColorById(colorId: number | null | undefined): ColorOption | null {
  if (colorId == null || colorId <= 0) return null;
  const index = (colorId - 1) % COLOR_PALETTE.length;
  const base = COLOR_PALETTE[index];
  if (colorId > COLOR_PALETTE.length) {
    // Generate a deterministic derivative if more than 12 colors are used
    return {
      id: colorId,
      name: `Color ${colorId}`,
      hex: base.hex,
      textColor: base.textColor,
      borderHex: base.borderHex,
    };
  }
  return base;
}

export function getColorHex(colorId: number | null | undefined, fallback = '#1e293b'): string {
  const opt = getColorById(colorId);
  return opt ? opt.hex : fallback;
}

export function getBorderHex(colorId: number | null | undefined, fallback = '#475569'): string {
  const opt = getColorById(colorId);
  return opt ? opt.borderHex : fallback;
}
