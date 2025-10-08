
// Theme Presets - Industry Standard and Premium Themes

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
  category: 'STANDARD' | 'PREMIUM';
  colors: ThemeColors;
  preview: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  // STANDARD THEMES
  {
    id: 'standard-blue',
    name: 'Professional Blue',
    description: 'Clean, professional blue theme perfect for corporate environments',
    category: 'STANDARD',
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
    preview: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
  },
  {
    id: 'standard-gray',
    name: 'Modern Slate',
    description: 'Sophisticated gray theme with modern aesthetics',
    category: 'STANDARD',
    colors: {
      primary: '#475569',
      secondary: '#94a3b8',
      accent: '#64748b',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f8fafc',
      mutedForeground: '#64748b',
      border: '#e2e8f0',
      card: '#ffffff',
      cardForeground: '#0f172a',
    },
    preview: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
  },
  {
    id: 'standard-green',
    name: 'Fresh Green',
    description: 'Vibrant green theme representing growth and sustainability',
    category: 'STANDARD',
    colors: {
      primary: '#16a34a',
      secondary: '#84cc16',
      accent: '#22c55e',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f0fdf4',
      mutedForeground: '#64748b',
      border: '#dcfce7',
      card: '#ffffff',
      cardForeground: '#0f172a',
    },
    preview: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
  },

  // PREMIUM THEMES
  {
    id: 'premium-sunset',
    name: 'Sunset Blaze',
    description: 'Warm sunset colors with vibrant orange and red tones',
    category: 'PREMIUM',
    colors: {
      primary: '#ea580c',
      secondary: '#f59e0b',
      accent: '#fb923c',
      background: '#fefce8',
      foreground: '#292524',
      muted: '#fef3c7',
      mutedForeground: '#78716c',
      border: '#fed7aa',
      card: '#fffbeb',
      cardForeground: '#292524',
    },
    preview: 'linear-gradient(135deg, #ea580c 0%, #fb923c 50%, #f59e0b 100%)',
  },
  {
    id: 'premium-ocean',
    name: 'Deep Ocean',
    description: 'Rich ocean blues with teal accents for a calming effect',
    category: 'PREMIUM',
    colors: {
      primary: '#0891b2',
      secondary: '#06b6d4',
      accent: '#14b8a6',
      background: '#ecfeff',
      foreground: '#164e63',
      muted: '#cffafe',
      mutedForeground: '#0e7490',
      border: '#a5f3fc',
      card: '#f0fdfa',
      cardForeground: '#164e63',
    },
    preview: 'linear-gradient(135deg, #0891b2 0%, #14b8a6 100%)',
  },
  {
    id: 'premium-royal',
    name: 'Royal Purple',
    description: 'Luxurious purple theme with gold accents',
    category: 'PREMIUM',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#c084fc',
      background: '#faf5ff',
      foreground: '#3b0764',
      muted: '#f3e8ff',
      mutedForeground: '#6b21a8',
      border: '#e9d5ff',
      card: '#faf5ff',
      cardForeground: '#3b0764',
    },
    preview: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
  },
  {
    id: 'premium-forest',
    name: 'Forest Night',
    description: 'Deep forest greens with natural earth tones',
    category: 'PREMIUM',
    colors: {
      primary: '#15803d',
      secondary: '#16a34a',
      accent: '#84cc16',
      background: '#f7fee7',
      foreground: '#14532d',
      muted: '#ecfccb',
      mutedForeground: '#365314',
      border: '#d9f99d',
      card: '#f7fee7',
      cardForeground: '#14532d',
    },
    preview: 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #84cc16 100%)',
  },
  {
    id: 'premium-midnight',
    name: 'Midnight Sky',
    description: 'Dark sophisticated theme with bright accents',
    category: 'PREMIUM',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#f8fafc',
      foreground: '#0f172a',
      muted: '#e0e7ff',
      mutedForeground: '#475569',
      border: '#c7d2fe',
      card: '#eff6ff',
      cardForeground: '#0f172a',
    },
    preview: 'linear-gradient(135deg, #1e1b4b 0%, #1e40af 50%, #3b82f6 100%)',
  },
  {
    id: 'premium-crimson',
    name: 'Crimson Elite',
    description: 'Bold red theme with powerful presence',
    category: 'PREMIUM',
    colors: {
      primary: '#dc2626',
      secondary: '#ef4444',
      accent: '#f87171',
      background: '#fef2f2',
      foreground: '#7f1d1d',
      muted: '#fee2e2',
      mutedForeground: '#991b1b',
      border: '#fecaca',
      card: '#fef2f2',
      cardForeground: '#7f1d1d',
    },
    preview: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
  },
];

export const getThemesByCategory = (category: 'STANDARD' | 'PREMIUM') => {
  return THEME_PRESETS.filter(theme => theme.category === category);
};

export const getThemeById = (id: string) => {
  return THEME_PRESETS.find(theme => theme.id === id);
};

export const applyTheme = (colors: ThemeColors) => {
  const root = document.documentElement;
  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--secondary', colors.secondary);
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--background', colors.background);
  root.style.setProperty('--foreground', colors.foreground);
  root.style.setProperty('--muted', colors.muted);
  root.style.setProperty('--muted-foreground', colors.mutedForeground);
  root.style.setProperty('--border', colors.border);
  root.style.setProperty('--card', colors.card);
  root.style.setProperty('--card-foreground', colors.cardForeground);
};
