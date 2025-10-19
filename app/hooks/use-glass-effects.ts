
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GlassEffectSettings, DEFAULT_GLASS_SETTINGS } from '@/lib/glass-effects';
import { GLASS_DEFAULTS } from '@/lib/default-theme';

interface GlassEffectsStore {
  topbarSettings: GlassEffectSettings;
  sidebarSettings: GlassEffectSettings;
  bottomBarSettings: GlassEffectSettings;
  updateTopbarSettings: (settings: Partial<GlassEffectSettings>) => void;
  updateSidebarSettings: (settings: Partial<GlassEffectSettings>) => void;
  updateBottomBarSettings: (settings: Partial<GlassEffectSettings>) => void;
  setTopbarSettings: (settings: Partial<GlassEffectSettings>) => void;
  setSidebarSettings: (settings: Partial<GlassEffectSettings>) => void;
  resetToDefaults: () => void;
}

export const useGlassEffects = create<GlassEffectsStore>()(
  persist(
    (set) => ({
      topbarSettings: { ...GLASS_DEFAULTS.topbar },
      sidebarSettings: { ...GLASS_DEFAULTS.sidebar },
      bottomBarSettings: { ...GLASS_DEFAULTS.bottomBar },
      
      updateTopbarSettings: (settings) =>
        set((state) => ({
          topbarSettings: { ...state.topbarSettings, ...settings },
        })),
      
      updateSidebarSettings: (settings) =>
        set((state) => ({
          sidebarSettings: { ...state.sidebarSettings, ...settings },
        })),
      
      updateBottomBarSettings: (settings) =>
        set((state) => ({
          bottomBarSettings: { ...state.bottomBarSettings, ...settings },
        })),
      
      // Legacy support
      setTopbarSettings: (settings) =>
        set((state) => ({
          topbarSettings: { ...state.topbarSettings, ...settings },
        })),
      
      setSidebarSettings: (settings) =>
        set((state) => ({
          sidebarSettings: { ...state.sidebarSettings, ...settings },
        })),
      
      resetToDefaults: () =>
        set({
          topbarSettings: { ...GLASS_DEFAULTS.topbar },
          sidebarSettings: { ...GLASS_DEFAULTS.sidebar },
          bottomBarSettings: { ...GLASS_DEFAULTS.bottomBar },
        }),
    }),
    {
      name: 'glass-effects-storage',
    }
  )
);
