
// Division-Inspired Theme System
// 6 Unique Themes: 5 Division Themes + High Contrast

export type DivisionTheme = 
  | 'tactical-orange'
  | 'dark-watch'
  | 'shd-agent'
  | 'rogue-protocol'
  | 'endgame'
  | 'high-contrast'
  | 'black-gold'; // Existing favorite

export interface ThemeColors {
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  card: string;
  glow: string;
  gradient: string;
}

export const DIVISION_THEMES: Record<DivisionTheme, ThemeColors> = {
  'tactical-orange': {
    name: 'Tactical Orange',
    description: 'Primary Division theme - Strategic operations aesthetic',
    primary: '#FF6D10',
    secondary: '#D7873D',
    accent: '#FF9F40',
    background: '#0A0A0A',
    foreground: '#E5E5E5',
    muted: '#1A1A1A',
    border: '#2A2A2A',
    card: '#151515',
    glow: 'rgba(255, 109, 16, 0.3)',
    gradient: 'linear-gradient(135deg, #FF6D10 0%, #D38338 100%)',
  },
  'dark-watch': {
    name: 'Dark Watch',
    description: 'Night operations variant - Stealth and precision',
    primary: '#1E3A5F',
    secondary: '#2E5F8F',
    accent: '#4A90E2',
    background: '#050810',
    foreground: '#C5D5E8',
    muted: '#0F1824',
    border: '#1A2B3F',
    card: '#0D1520',
    glow: 'rgba(74, 144, 226, 0.3)',
    gradient: 'linear-gradient(135deg, #1E3A5F 0%, #4A90E2 100%)',
  },
  'shd-agent': {
    name: 'SHD Agent',
    description: 'Strategic Homeland Division - Tech and authority',
    primary: '#00D4FF',
    secondary: '#00A8CC',
    accent: '#00FFFF',
    background: '#0A1419',
    foreground: '#E0F4FF',
    muted: '#142028',
    border: '#1F3540',
    card: '#101C23',
    glow: 'rgba(0, 212, 255, 0.3)',
    gradient: 'linear-gradient(135deg, #00D4FF 0%, #00FFFF 100%)',
  },
  'rogue-protocol': {
    name: 'Rogue Protocol',
    description: 'Rogue agent theme - Danger and intensity',
    primary: '#DC143C',
    secondary: '#8B0000',
    accent: '#FF4444',
    background: '#0D0000',
    foreground: '#FFDDDD',
    muted: '#1A0505',
    border: '#330000',
    card: '#150000',
    glow: 'rgba(220, 20, 60, 0.3)',
    gradient: 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
  },
  'endgame': {
    name: 'Endgame',
    description: 'Elite endgame content - Gold and prestige',
    primary: '#FFD700',
    secondary: '#DAA520',
    accent: '#FFF44F',
    background: '#0F0F05',
    foreground: '#FFFACD',
    muted: '#1C1C0A',
    border: '#2D2D15',
    card: '#16160A',
    glow: 'rgba(255, 215, 0, 0.3)',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
  },
  'high-contrast': {
    name: 'High Contrast',
    description: 'Accessibility-focused theme - Maximum readability',
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    accent: '#FFFF00',
    background: '#000000',
    foreground: '#FFFFFF',
    muted: '#222222',
    border: '#444444',
    card: '#111111',
    glow: 'rgba(255, 255, 255, 0.3)',
    gradient: 'linear-gradient(135deg, #FFFFFF 0%, #CCCCCC 100%)',
  },
  'black-gold': {
    name: 'Black Gold',
    description: 'Premium luxury theme - Elegance and sophistication',
    primary: '#D4AF37',
    secondary: '#997000',
    accent: '#FFD700',
    background: '#000000',
    foreground: '#F5F5DC',
    muted: '#1A1A1A',
    border: '#2A2414',
    card: '#0D0D0D',
    glow: 'rgba(212, 175, 55, 0.3)',
    gradient: 'linear-gradient(135deg, #D4AF37 0%, #997000 100%)',
  },
};

export function applyTheme(theme: DivisionTheme) {
  const colors = DIVISION_THEMES[theme];
  const root = document.documentElement;

  // Convert hex to HSL for CSS variables
  const hexToHSL = (hex: string) => {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Find min and max values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  // Apply theme colors
  root.style.setProperty('--primary', hexToHSL(colors.primary));
  root.style.setProperty('--secondary', hexToHSL(colors.secondary));
  root.style.setProperty('--accent', hexToHSL(colors.accent));
  root.style.setProperty('--background', hexToHSL(colors.background));
  root.style.setProperty('--foreground', hexToHSL(colors.foreground));
  root.style.setProperty('--muted', hexToHSL(colors.muted));
  root.style.setProperty('--border', hexToHSL(colors.border));
  root.style.setProperty('--card', hexToHSL(colors.card));
  
  // Custom properties for effects
  root.style.setProperty('--theme-glow', colors.glow);
  root.style.setProperty('--theme-gradient', colors.gradient);
  root.style.setProperty('--theme-primary-hex', colors.primary);

  // Store in localStorage
  localStorage.setItem('division-theme', theme);
}

export function getStoredTheme(): DivisionTheme {
  if (typeof window === 'undefined') return 'black-gold';
  return (localStorage.getItem('division-theme') as DivisionTheme) || 'black-gold';
}

// Theme-specific effects
export const THEME_EFFECTS = {
  scanlines: true,
  glitch: true,
  holographic: true,
  particles: false, // Performance option
  bloom: true,
};

// HUD overlay styles
export const HUD_STYLES = {
  cornerBrackets: true,
  dataStream: true,
  statusIndicators: true,
  minimapBorder: true,
};
