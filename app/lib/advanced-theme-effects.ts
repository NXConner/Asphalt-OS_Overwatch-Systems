
// Advanced Theme Effects and Customization

export interface ThemeEffect {
  id: string;
  name: string;
  description: string;
  cssClass: string;
  preview: string;
}

export interface SidebarStyle {
  background: string;
  blur: boolean;
  opacity: number;
  effect?: string;
  textColor?: string;
}

export interface TopBarStyle {
  background: string;
  blur: boolean;
  opacity: number;
  effect?: string;
  textColor?: string;
}

export const BACKGROUND_EFFECTS: ThemeEffect[] = [
  {
    id: 'transparent',
    name: 'Transparent',
    description: 'Fully transparent background',
    cssClass: 'bg-transparent',
    preview: 'rgba(255, 255, 255, 0)',
  },
  {
    id: 'glass',
    name: 'Glass',
    description: 'Frosted glass effect with blur',
    cssClass: 'backdrop-blur-xl bg-white/30',
    preview: 'rgba(255, 255, 255, 0.3) + blur',
  },
  {
    id: 'blur-light',
    name: 'Light Blur',
    description: 'Subtle blur with light background',
    cssClass: 'backdrop-blur-sm bg-white/50',
    preview: 'rgba(255, 255, 255, 0.5) + light blur',
  },
  {
    id: 'blur-heavy',
    name: 'Heavy Blur',
    description: 'Strong blur effect',
    cssClass: 'backdrop-blur-2xl bg-white/40',
    preview: 'rgba(255, 255, 255, 0.4) + heavy blur',
  },
  {
    id: 'smokey',
    name: 'Smokey',
    description: 'Smokey dark translucent effect',
    cssClass: 'backdrop-blur-md bg-gray-900/20 shadow-2xl',
    preview: 'rgba(17, 24, 39, 0.2) + smoke',
  },
  {
    id: 'condensation',
    name: 'Condensation',
    description: 'Water droplet condensation effect',
    cssClass: 'backdrop-blur-lg bg-blue-50/60 backdrop-saturate-150',
    preview: 'rgba(239, 246, 255, 0.6) + condensation',
  },
  {
    id: 'steamy',
    name: 'Steamy',
    description: 'Warm steamy glass effect',
    cssClass: 'backdrop-blur-xl bg-amber-50/40 backdrop-brightness-110',
    preview: 'rgba(255, 251, 235, 0.4) + steam',
  },
  {
    id: 'foggy',
    name: 'Foggy',
    description: 'Dense fog-like blur',
    cssClass: 'backdrop-blur-3xl bg-slate-100/30 backdrop-grayscale',
    preview: 'rgba(241, 245, 249, 0.3) + fog',
  },
  {
    id: 'gradient-blue',
    name: 'Blue Gradient',
    description: 'Blue to purple gradient',
    cssClass: 'bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md',
    preview: 'gradient(blue → purple → pink)',
  },
  {
    id: 'gradient-sunset',
    name: 'Sunset Gradient',
    description: 'Warm sunset colors',
    cssClass: 'bg-gradient-to-br from-orange-400/20 via-red-400/20 to-pink-400/20 backdrop-blur-md',
    preview: 'gradient(orange → red → pink)',
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean Gradient',
    description: 'Ocean blue gradient',
    cssClass: 'bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-indigo-600/20 backdrop-blur-md',
    preview: 'gradient(cyan → blue → indigo)',
  },
  {
    id: 'solid-dark',
    name: 'Solid Dark',
    description: 'Solid dark background',
    cssClass: 'bg-gray-900 text-white',
    preview: 'rgb(17, 24, 39)',
  },
  {
    id: 'solid-light',
    name: 'Solid Light',
    description: 'Solid white background',
    cssClass: 'bg-white',
    preview: 'rgb(255, 255, 255)',
  },
];

export const COLOR_PRESETS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Light Gray', value: '#f3f4f6' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Dark Gray', value: '#374151' },
  { name: 'Black', value: '#000000' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
];

export function applySidebarStyle(style: SidebarStyle) {
  localStorage.setItem('sidebarStyle', JSON.stringify(style));
  
  // Trigger a custom event for components to listen to
  window.dispatchEvent(new CustomEvent('sidebarStyleChange', { detail: style }));
}

export function applyTopBarStyle(style: TopBarStyle) {
  localStorage.setItem('topBarStyle', JSON.stringify(style));
  
  // Trigger a custom event for components to listen to
  window.dispatchEvent(new CustomEvent('topBarStyleChange', { detail: style }));
}

export function getSidebarStyle(): SidebarStyle {
  if (typeof window === 'undefined') return getDefaultSidebarStyle();
  
  const saved = localStorage.getItem('sidebarStyle');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return getDefaultSidebarStyle();
    }
  }
  return getDefaultSidebarStyle();
}

export function getTopBarStyle(): TopBarStyle {
  if (typeof window === 'undefined') return getDefaultTopBarStyle();
  
  const saved = localStorage.getItem('topBarStyle');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return getDefaultTopBarStyle();
    }
  }
  return getDefaultTopBarStyle();
}

function getDefaultSidebarStyle(): SidebarStyle {
  return {
    background: 'bg-white',
    blur: false,
    opacity: 100,
    effect: 'solid-light',
    textColor: 'text-gray-900',
  };
}

function getDefaultTopBarStyle(): TopBarStyle {
  return {
    background: 'bg-white',
    blur: false,
    opacity: 100,
    effect: 'solid-light',
    textColor: 'text-gray-900',
  };
}

export function getEffectById(id: string): ThemeEffect | undefined {
  return BACKGROUND_EFFECTS.find(effect => effect.id === id);
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
