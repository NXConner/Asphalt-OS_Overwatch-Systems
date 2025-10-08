
/**
 * Theme Presets including Black Gold
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  card: string;
  cardForeground: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  category: 'STANDARD' | 'PREMIUM' | 'INDUSTRY';
  isPremium?: boolean;
  preview?: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'standard-blue',
    name: 'Standard Blue',
    description: 'Clean and professional default theme',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#3b82f6',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      border: '#e2e8f0',
      card: '#ffffff',
      cardForeground: '#0f172a',
    },
    category: 'STANDARD',
  },
  {
    id: 'black-gold',
    name: 'Black Gold ⭐',
    description: 'Premium asphalt industry theme with deep blacks and gold accents - Perfect for the Black Gold industry',
    colors: {
      primary: '#FFD700', // Gold
      secondary: '#1a1a1a', // Deep black
      accent: '#FFA500', // Orange-gold
      background: '#0a0a0a', // Almost black
      foreground: '#f5f5f5', // Off-white
      muted: '#2a2a2a', // Dark gray
      mutedForeground: '#a8a8a8',
      border: '#3a3a3a', // Border gray
      card: '#1a1a1a',
      cardForeground: '#f5f5f5',
    },
    category: 'PREMIUM',
    isPremium: true,
  },
  {
    id: 'asphalt-pro',
    name: 'Asphalt Pro',
    description: 'Professional theme inspired by fresh asphalt',
    colors: {
      primary: '#1e293b',
      secondary: '#475569',
      accent: '#f59e0b',
      background: '#f8fafc',
      foreground: '#0f172a',
      muted: '#e2e8f0',
      mutedForeground: '#64748b',
      border: '#cbd5e1',
      card: '#ffffff',
      cardForeground: '#0f172a',
    },
    category: 'INDUSTRY',
  },
  {
    id: 'safety-orange',
    name: 'Safety Orange',
    description: 'High-visibility theme for safety-focused operations',
    colors: {
      primary: '#ea580c',
      secondary: '#dc2626',
      accent: '#f59e0b',
      background: '#fffbeb',
      foreground: '#1c1917',
      muted: '#fef3c7',
      mutedForeground: '#78716c',
      border: '#fde68a',
      card: '#fffbeb',
      cardForeground: '#1c1917',
    },
    category: 'INDUSTRY',
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Cool and calming blue-based theme',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#f0f9ff',
      foreground: '#1e3a8a',
      muted: '#dbeafe',
      mutedForeground: '#64748b',
      border: '#bfdbfe',
      card: '#f0f9ff',
      cardForeground: '#1e3a8a',
    },
    category: 'STANDARD',
  },
  {
    id: 'slate-professional',
    name: 'Slate Professional',
    description: 'Modern professional theme with slate tones',
    colors: {
      primary: '#334155',
      secondary: '#64748b',
      accent: '#0ea5e9',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      border: '#e2e8f0',
      card: '#ffffff',
      cardForeground: '#0f172a',
    },
    category: 'STANDARD',
  },
];

export function getThemesByCategory(category: string): ThemePreset[] {
  return THEME_PRESETS.filter((theme) => theme.category === category);
}

export function getThemeById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((theme) => theme.id === id);
}

export function applyTheme(colors: ThemeColors) {
  const root = document.documentElement;

  // Convert hex to HSL for CSS variables
  Object.entries(colors).forEach(([key, value]) => {
    const hsl = hexToHSL(value);
    // Convert camelCase to kebab-case
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--${cssKey}`, hsl);
  });
}

function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
