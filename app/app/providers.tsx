

'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { applyTheme, getThemeById } from '@/lib/theme-presets';
import { applyTheme as applyDivisionTheme, getStoredTheme } from '@/lib/division-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  // Apply saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme');
    
    if (savedTheme && savedTheme !== 'custom') {
      const theme = getThemeById(savedTheme);
      if (theme) {
        applyTheme(theme.colors);
      }
    } else if (savedTheme === 'custom') {
      const savedColors = localStorage.getItem('customThemeColors');
      if (savedColors) {
        try {
          applyTheme(JSON.parse(savedColors));
        } catch (e) {
          console.error('Failed to parse custom theme colors:', e);
        }
      }
    } else {
      // Apply Black Gold theme by default if no theme is saved
      const blackGoldTheme = getThemeById('black-gold');
      if (blackGoldTheme) {
        applyTheme(blackGoldTheme.colors);
        localStorage.setItem('appTheme', 'black-gold');
      }
    }

    // Also initialize Division theme
    const divisionTheme = getStoredTheme();
    applyDivisionTheme(divisionTheme);
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange={false}
      >
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton 
          expand={false}
          theme="dark"
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
