
'use client';

import React, { useState, useEffect } from 'react';
import { GameMode, getStoredGameMode, setGameMode, GAME_MODE_TERMINOLOGY } from '@/lib/gamification';
import { Button } from '@/components/ui/button';
import { Briefcase, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GameModeToggle() {
  const [mode, setMode] = useState<GameMode>('business');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const savedMode = getStoredGameMode();
    setMode(savedMode);
  }, []);

  const handleToggle = () => {
    setIsTransitioning(true);
    const newMode: GameMode = mode === 'business' ? 'warrior' : 'business';
    
    setTimeout(() => {
      setMode(newMode);
      setGameMode(newMode);
      setIsTransitioning(false);
    }, 300);
  };

  const isWarriorMode = mode === 'warrior';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className={`
        relative overflow-hidden transition-all duration-300 gap-2
        ${isWarriorMode 
          ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/50 hover:border-orange-500' 
          : 'border-border hover:border-primary/50'
        }
      `}
      disabled={isTransitioning}
    >
      <AnimatePresence mode="wait">
        {isWarriorMode ? (
          <motion.div
            key="warrior"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="flex items-center gap-2"
          >
            <Gamepad2 className="h-4 w-4" />
            <span className="hidden sm:inline font-bold">WARRIOR MODE</span>
          </motion.div>
        ) : (
          <motion.div
            key="business"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            className="flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Business Mode</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Epic glow effect for warrior mode */}
      {isWarriorMode && (
        <div className="absolute inset-0 opacity-30 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 blur-sm" />
        </div>
      )}
    </Button>
  );
}
