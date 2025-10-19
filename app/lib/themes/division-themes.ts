
/**
 * Tom Clancy's The Division Inspired Themes
 * Tactical HUD aesthetic with military-grade UI elements
 */

import { ThemePreset, ThemeColors } from '../theme-presets';

// Division Dark Orange - Iconic orange tactical HUD from The Division 1
export const divisionDarkOrange: ThemePreset = {
  id: 'division-dark-orange',
  name: 'Division: Dark Orange 🎯',
  description: 'Iconic tactical HUD with orange alerts - Inspired by The Division',
  colors: {
    primary: '#FF6B00', // Division orange
    secondary: '#1a1a1a', // Deep tactical black
    accent: '#FFA500', // Amber alert
    background: '#0d0d0d', // Almost black background
    foreground: '#e8e8e8', // Off-white text
    muted: '#2a2a2a', // Dark gray
    mutedForeground: '#9a9a9a',
    border: '#FF6B00', // Orange borders
    card: '#1a1a1a',
    cardForeground: '#e8e8e8',
  },
  category: 'PREMIUM',
  isPremium: true,
};

// Division SHD Tech - Blue tech interface from SHD watch
export const divisionSHDTech: ThemePreset = {
  id: 'division-shd-tech',
  name: 'Division: SHD Tech 🔷',
  description: 'Strategic Homeland Division tech interface - Holographic blue HUD',
  colors: {
    primary: '#00D4FF', // SHD cyan-blue
    secondary: '#0a0e1a', // Deep navy black
    accent: '#00A8E8', // Electric blue
    background: '#05080f', // Almost black with blue tint
    foreground: '#e0f2ff', // Light blue-white
    muted: '#1a2332', // Dark blue-gray
    mutedForeground: '#7da3c6',
    border: '#00D4FF', // Cyan borders
    card: '#0f1419',
    cardForeground: '#e0f2ff',
  },
  category: 'PREMIUM',
  isPremium: true,
};

// Division Winter Ops - Clean tactical white from Division 1 winter setting
export const divisionWinterOps: ThemePreset = {
  id: 'division-winter-ops',
  name: 'Division: Winter Ops ❄️',
  description: 'Clean tactical interface inspired by Division winter operations',
  colors: {
    primary: '#4A90E2', // Ice blue
    secondary: '#2C3E50', // Dark slate
    accent: '#FF6B00', // Division orange accent
    background: '#F5F7FA', // Clean light gray
    foreground: '#1a1a1a', // Dark text
    muted: '#E8ECEF', // Light muted gray
    mutedForeground: '#5a6c7d',
    border: '#CBD5E0', // Subtle borders
    card: '#FFFFFF',
    cardForeground: '#1a1a1a',
  },
  category: 'PREMIUM',
  isPremium: true,
};

// Division Rogue Agent - Red and black from rogue agents
export const divisionRogueAgent: ThemePreset = {
  id: 'division-rogue-agent',
  name: 'Division: Rogue Agent 💀',
  description: 'Dangerous rogue agent interface - Red alert tactical HUD',
  colors: {
    primary: '#E63946', // Rogue red
    secondary: '#0d0d0d', // Pure black
    accent: '#DC143C', // Crimson alert
    background: '#0a0a0a', // Almost black
    foreground: '#f0f0f0', // Off-white
    muted: '#1a1a1a', // Dark gray
    mutedForeground: '#8a8a8a',
    border: '#E63946', // Red borders
    card: '#0f0f0f',
    cardForeground: '#f0f0f0',
  },
  category: 'PREMIUM',
  isPremium: true,
};

// Division Last Man Battalion - Green tactical from LMB faction
export const divisionLastManBattalion: ThemePreset = {
  id: 'division-lmb',
  name: 'Division: Last Man Battalion 🎖️',
  description: 'Military tactical green from LMB faction',
  colors: {
    primary: '#4CAF50', // Military green
    secondary: '#1a1a1a', // Dark background
    accent: '#8BC34A', // Light green accent
    background: '#0d0f0d', // Dark with green tint
    foreground: '#e8f5e8', // Light green-white
    muted: '#1f2a1f', // Dark green-gray
    mutedForeground: '#8a9a8a',
    border: '#4CAF50', // Green borders
    card: '#151815',
    cardForeground: '#e8f5e8',
  },
  category: 'PREMIUM',
  isPremium: true,
};

// Division Gold Edition - Premium gold theme
export const divisionGoldEdition: ThemePreset = {
  id: 'division-gold-edition',
  name: 'Division: Gold Edition ⭐',
  description: 'Premium gold tactical interface for elite agents',
  colors: {
    primary: '#FFD700', // Pure gold
    secondary: '#1a1205', // Dark gold-black
    accent: '#FFA500', // Orange-gold
    background: '#0a0805', // Almost black with warm tint
    foreground: '#fff8dc', // Cornsilk
    muted: '#2a2205', // Dark warm gray
    mutedForeground: '#b8a878',
    border: '#FFD700', // Gold borders
    card: '#151205',
    cardForeground: '#fff8dc',
  },
  category: 'PREMIUM',
  isPremium: true,
};

// Export all Division themes
export const DIVISION_THEMES: ThemePreset[] = [
  divisionDarkOrange,
  divisionSHDTech,
  divisionWinterOps,
  divisionRogueAgent,
  divisionLastManBattalion,
  divisionGoldEdition,
];

// Helper to get Division theme by ID
export function getDivisionThemeById(id: string): ThemePreset | undefined {
  return DIVISION_THEMES.find(theme => theme.id === id);
}

// Check if a theme is a Division theme
export function isDivisionTheme(themeId: string): boolean {
  return DIVISION_THEMES.some(theme => theme.id === themeId);
}
