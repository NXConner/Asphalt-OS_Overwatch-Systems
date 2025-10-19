
'use client';

import React, { useEffect, useState } from 'react';
import { Achievement } from '@/lib/gamification';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AchievementPopupProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  if (!achievement) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'uncommon': return 'text-green-400 border-green-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'rgba(156, 163, 175, 0.3)';
      case 'uncommon': return 'rgba(74, 222, 128, 0.3)';
      case 'rare': return 'rgba(96, 165, 250, 0.3)';
      case 'epic': return 'rgba(192, 132, 252, 0.3)';
      case 'legendary': return 'rgba(250, 204, 21, 0.3)';
      default: return 'rgba(156, 163, 175, 0.3)';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Achievement Card */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div
              className={`relative bg-gradient-to-br from-background via-background to-muted border-4 ${getRarityColor(achievement.rarity)} rounded-xl shadow-2xl overflow-hidden`}
            >
              {/* Glow Effect */}
              <div
                className="absolute inset-0 opacity-20 animate-pulse"
                style={{
                  background: `radial-gradient(circle at center, ${getRarityGlow(achievement.rarity)}, transparent)`,
                }}
              />

              {/* Content */}
              <div className="relative p-6 space-y-4">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Achievement Unlocked Header */}
                <div className="text-center space-y-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                    className="flex justify-center"
                  >
                    <Trophy className={`h-16 w-16 ${getRarityColor(achievement.rarity).split(' ')[0]}`} />
                  </motion.div>
                  <h2 className="text-2xl font-bold uppercase tracking-wider">
                    Achievement Unlocked!
                  </h2>
                </div>

                {/* Achievement Details */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl">{achievement.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>

                {/* Rarity Badge */}
                <div className="flex justify-center">
                  <div
                    className={`px-3 py-1 rounded-full border-2 ${getRarityColor(achievement.rarity)} bg-background/50 uppercase text-xs font-bold tracking-wider`}
                  >
                    {achievement.rarity}
                  </div>
                </div>

                {/* Rewards */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="text-center space-y-1">
                    <Zap className="h-5 w-5 mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground">XP Reward</p>
                    <p className="text-lg font-bold">+{achievement.xpReward}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <Trophy className="h-5 w-5 mx-auto text-yellow-500" />
                    <p className="text-xs text-muted-foreground">Prestige Points</p>
                    <p className="text-lg font-bold">+{achievement.ppReward}</p>
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  onClick={handleClose}
                  className="w-full"
                  size="lg"
                >
                  Awesome!
                </Button>
              </div>

              {/* Particle Effects */}
              {achievement.rarity === 'legendary' && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1, y: 0, x: 0 }}
                      animate={{
                        opacity: 0,
                        y: -100 + Math.random() * 200,
                        x: -100 + Math.random() * 200,
                      }}
                      transition={{
                        duration: 2,
                        delay: Math.random() * 0.5,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 2,
                      }}
                      className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-yellow-400"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Achievement Queue Manager Hook
export function useAchievementQueue() {
  const [queue, setQueue] = useState<Achievement[]>([]);
  const [current, setCurrent] = useState<Achievement | null>(null);

  const addAchievement = (achievement: Achievement) => {
    setQueue((prev) => [...prev, achievement]);
  };

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((prev) => prev.slice(1));
    }
  }, [current, queue]);

  const clearCurrent = () => {
    setCurrent(null);
  };

  return {
    current,
    addAchievement,
    clearCurrent,
  };
}
