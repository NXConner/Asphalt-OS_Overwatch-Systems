"use client";

export type ThemePreset = {
  id: string;
  name: string;
  colors: Record<string, string>;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "black-gold",
    name: "Black Gold",
    colors: {
      "--background": "222.2 84% 4.9%",
      "--foreground": "210 40% 98%",
      "--primary": "46 95% 54%",
      "--primary-foreground": "222.2 47.4% 11.2%",
      "--accent": "217.2 32.6% 17.5%",
      "--accent-foreground": "210 40% 98%",
    },
  },
  {
    id: "neon-arcade",
    name: "Neon Arcade",
    colors: {
      "--background": "240 100% 6%",
      "--foreground": "0 0% 100%",
      "--primary": "296 78% 60%",
      "--primary-foreground": "0 0% 100%",
      "--accent": "40 98% 50%",
      "--accent-foreground": "0 0% 10%",
    },
  },
  {
    id: "heritage",
    name: "Church Heritage",
    colors: {
      "--background": "38 28% 95%",
      "--foreground": "222 30% 10%",
      "--primary": "28 80% 45%",
      "--primary-foreground": "0 0% 100%",
      "--accent": "210 20% 90%",
      "--accent-foreground": "222 30% 10%",
    },
  },
];

export function getThemeById(id: string) {
  return THEME_PRESETS.find((t) => t.id === id);
}

export function applyTheme(colors: Record<string, string>) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
