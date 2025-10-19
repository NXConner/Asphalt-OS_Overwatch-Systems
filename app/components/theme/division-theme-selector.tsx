
'use client';

import React, { useState, useEffect } from 'react';
import { 
  DIVISION_THEMES, 
  DivisionTheme, 
  applyTheme, 
  getStoredTheme 
} from '@/lib/division-themes';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Palette, Check } from 'lucide-react';

export function DivisionThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<DivisionTheme>('black-gold');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved theme on mount
    const savedTheme = getStoredTheme();
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const handleThemeChange = (theme: DivisionTheme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    setIsOpen(false);
    
    // Trigger a subtle animation
    document.body.style.transition = 'background-color 0.5s ease';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 relative group"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Themes</span>
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-20 rounded transition-opacity"
            style={{ 
              background: DIVISION_THEMES[currentTheme].gradient 
            }}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Palette className="h-6 w-6" />
            Division Themes
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Choose your command center aesthetic
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {Object.entries(DIVISION_THEMES).map(([key, theme]) => {
            const isActive = currentTheme === key;
            return (
              <button
                key={key}
                onClick={() => handleThemeChange(key as DivisionTheme)}
                className={`
                  relative p-4 rounded-lg border-2 text-left transition-all
                  hover:scale-105 hover:shadow-lg
                  ${isActive 
                    ? 'border-primary shadow-lg' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                {/* Theme Preview */}
                <div 
                  className="h-24 rounded-md mb-3 relative overflow-hidden"
                  style={{ background: theme.gradient }}
                >
                  {/* Corner brackets (Division aesthetic) */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/80" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white/80" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white/80" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/80" />
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Check className="h-12 w-12 text-white drop-shadow-lg" />
                    </div>
                  )}
                </div>
                
                {/* Theme Info */}
                <div>
                  <h3 className="font-bold text-lg mb-1">{theme.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {theme.description}
                  </p>
                </div>
                
                {/* Color swatches */}
                <div className="flex gap-2 mt-3">
                  <div 
                    className="w-8 h-8 rounded border-2 border-white/20"
                    style={{ backgroundColor: theme.primary }}
                    title="Primary"
                  />
                  <div 
                    className="w-8 h-8 rounded border-2 border-white/20"
                    style={{ backgroundColor: theme.secondary }}
                    title="Secondary"
                  />
                  <div 
                    className="w-8 h-8 rounded border-2 border-white/20"
                    style={{ backgroundColor: theme.accent }}
                    title="Accent"
                  />
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Current Theme:</strong> {DIVISION_THEMES[currentTheme].name}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Your theme preference is automatically saved and will persist across sessions.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
