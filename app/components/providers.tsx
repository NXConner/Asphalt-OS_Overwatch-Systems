
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { ReactNode, useEffect, useState } from 'react';
import { applyTheme, getThemeById } from '@/lib/theme-presets';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply Black Gold theme as default on mount
  useEffect(() => {
    if (mounted) {
      // Check if user has a saved theme preference
      const savedTheme = localStorage.getItem('selected-theme');
      
      if (!savedTheme) {
        // Apply Black Gold theme as default
        const blackGoldTheme = getThemeById('black-gold');
        if (blackGoldTheme) {
          applyTheme(blackGoldTheme.colors);
          localStorage.setItem('selected-theme', 'black-gold');
        }
      } else {
        // Apply saved theme
        const theme = getThemeById(savedTheme);
        if (theme) {
          applyTheme(theme.colors);
        }
      }
    }
  }, [mounted]);

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {mounted ? children : <div className="min-h-screen bg-background">{children}</div>}
      </ThemeProvider>
    </SessionProvider>
  );
}
