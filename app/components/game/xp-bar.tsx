
'use client';

import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { calculateXPProgress } from '@/lib/game/types';

export interface XPBarProps {
  currentXP: number;
  level: number;
  animated?: boolean;
}

export function XPBar({ currentXP, level, animated = true }: XPBarProps) {
  const { current, required, percentage } = calculateXPProgress(currentXP, level);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Level {level}</span>
        <span className="text-muted-foreground">
          {current} / {required} XP
        </span>
      </div>

      <div className="relative">
        <Progress value={percentage} className="h-3" />
        
        {animated && (
          <motion.div
            className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </div>

      <div className="text-xs text-center text-muted-foreground">
        {Math.round(percentage)}% to next level
      </div>
    </div>
  );
}
