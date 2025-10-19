
// Default Tactical Orange Theme with Transparency
export const TACTICAL_ORANGE_THEME = {
  name: 'Tactical Orange',
  primary: '#FF8C00', // Dark Orange
  secondary: '#FFA500', // Orange
  accent: '#FF6B35', // Coral Orange
  background: 'rgba(10, 10, 10, 0.85)', // Almost black with transparency
  foreground: '#FFFFFF',
  card: 'rgba(20, 20, 20, 0.75)', // Dark with transparency
  cardForeground: '#FFFFFF',
  popover: 'rgba(20, 20, 20, 0.9)',
  popoverForeground: '#FFFFFF',
  muted: 'rgba(40, 40, 40, 0.7)',
  mutedForeground: '#A0A0A0',
  border: 'rgba(255, 140, 0, 0.3)', // Orange border with transparency
  input: 'rgba(30, 30, 30, 0.8)',
  ring: '#FF8C00',
};

export const GLASS_DEFAULTS = {
  topbar: {
    enabled: true,
    type: 'frosty' as const,
    opacity: 85,
    blur: 12,
  },
  sidebar: {
    enabled: true,
    type: 'frosty' as const,
    opacity: 80,
    blur: 10,
  },
  bottomBar: {
    enabled: true,
    type: 'frosty' as const,
    opacity: 85,
    blur: 10,
  },
  cards: {
    enabled: true,
    type: 'clear' as const,
    opacity: 75,
    blur: 8,
  },
};
