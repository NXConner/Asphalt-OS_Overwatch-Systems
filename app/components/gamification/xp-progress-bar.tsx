
'use client';

import React, { useEffect, useState } from 'react';
import { calculateXPProgress, getRankTitle } from '@/lib/gamification';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface XPProgressBarProps {
  userId?: string;
  compact?: boolean;
}

export function XPProgressBar({ userId, compact = false }: XPProgressBarProps) {
  const [stats, setStats] = useState({
    totalXP: 0,
    level: 1,
    currentXP: 0,
    xpForNextLevel: 100,
    progress: 0,
    rank: 'Apprentice Contractor',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      // TODO: Replace with actual API call when gamification API is implemented
      // For now, use localStorage as temporary storage
      const storedXP = parseInt(localStorage.getItem('user_total_xp') || '0');
      const progress = calculateXPProgress(storedXP);
      const rank = getRankTitle(progress.level);
      
      setStats({
        totalXP: storedXP,
        ...progress,
        rank,
      });
    } catch (error) {
      console.error('Error fetching XP stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 hover:border-primary/50 transition-all">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold">Lv.{stats.level}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold">{stats.rank}</span>
                <span className="text-xs text-muted-foreground">Level {stats.level}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>XP</span>
                  <span>{stats.currentXP} / {stats.xpForNextLevel}</span>
                </div>
                <Progress value={stats.progress} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.xpForNextLevel - stats.currentXP} XP until next level
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-2 p-4 rounded-lg bg-gradient-to-br from-background/80 to-muted/50 border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-bold">Level {stats.level}</h3>
            <p className="text-xs text-muted-foreground">{stats.rank}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-primary">
          <Zap className="h-3 w-3" />
          <span className="font-mono">{stats.totalXP.toLocaleString()} XP</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress to Level {stats.level + 1}</span>
          <span className="font-mono">{stats.currentXP} / {stats.xpForNextLevel}</span>
        </div>
        <Progress value={stats.progress} className="h-2" />
        <p className="text-xs text-muted-foreground text-right">
          {(stats.xpForNextLevel - stats.currentXP).toLocaleString()} XP remaining
        </p>
      </div>
    </motion.div>
  );
}
