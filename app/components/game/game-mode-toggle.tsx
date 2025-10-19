
'use client';

import { useState, useEffect } from 'react';
import { Gamepad2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function GameModeToggle() {
  const [isGameMode, setIsGameMode] = useState(false);
  const [userLevel, setUserLevel] = useState(1);

  useEffect(() => {
    // Load game mode preference from localStorage
    const savedMode = localStorage.getItem('gameMode');
    if (savedMode) {
      setIsGameMode(savedMode === 'true');
    }

    // Load user level (you'll fetch this from your API later)
    const savedLevel = localStorage.getItem('userLevel');
    if (savedLevel) {
      setUserLevel(parseInt(savedLevel, 10));
    }
  }, []);

  const toggleMode = () => {
    const newMode = !isGameMode;
    setIsGameMode(newMode);
    localStorage.setItem('gameMode', String(newMode));
    
    // Trigger page refresh to apply mode changes
    window.location.reload();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleMode}
      className="relative overflow-hidden group"
    >
      <motion.div
        initial={false}
        animate={{
          scale: isGameMode ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2"
      >
        {isGameMode ? (
          <>
            <Gamepad2 className="h-4 w-4" />
            <span className="hidden sm:inline">Warrior Mode</span>
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full">
              LV.{userLevel}
            </span>
          </>
        ) : (
          <>
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Business Mode</span>
          </>
        )}
      </motion.div>
      
      {isGameMode && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </Button>
  );
}
