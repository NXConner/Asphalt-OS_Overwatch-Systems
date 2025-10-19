
'use client';

import React from 'react';
import { calculateXPProgress, getRankTitle } from '@/lib/gamification';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface XPProgressBarProps {
  totalXP: number;
  showDetails?: boolean;
  className?: string;
}

export function XPProgressBar({ totalXP, showDetails = true, className = '' }: XPProgressBarProps) {
  const { level, currentXP, xpForNextLevel, progress } = calculateXPProgress(totalXP);
  const rankTitle = getRankTitle(level);

  return (
    <div className={`space-y-2 ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="font-bold">Level {level}</span>
            <span className="text-muted-foreground">• {rankTitle}</span>
          </div>
          <div className="text-muted-foreground">
            {currentXP.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
          </div>
        </div>
      )}
      
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10" />
        
        {/* Progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
        </motion.div>
        
        {/* Glow effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-y-0 left-0 blur-sm"
          style={{ width: `${progress}%` }}
        >
          <div className="h-full bg-primary/50" />
        </motion.div>
      </div>
      
      {showDetails && (
        <div className="text-xs text-muted-foreground text-right">
          {progress.toFixed(1)}% to Level {level + 1}
        </div>
      )}
    </div>
  );
}

// Custom shine animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shine {
    animation: shine 2s infinite;
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
