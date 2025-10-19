
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export interface LevelUpAnimationProps {
  isVisible: boolean;
  newLevel: number;
  rewards: {
    skillPoints: number;
    prestigePoints: number;
    unlocks: string[];
  };
  onClose: () => void;
}

export function LevelUpAnimation({ isVisible, newLevel, rewards, onClose }: LevelUpAnimationProps) {
  useEffect(() => {
    if (isVisible) {
      // Trigger confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: 180 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500/30 via-orange-500/30 to-red-500/30 border-4 border-yellow-500 p-8 max-w-lg backdrop-blur-xl">
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400"
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ opacity: 0.1 }}
              />

              {/* Content */}
              <div className="relative z-10 text-center space-y-6">
                {/* Trophy animation */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <Trophy className="h-20 w-20 text-yellow-500" />
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <Trophy className="h-20 w-20 text-yellow-500" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Level up text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-4xl font-bold text-yellow-500 uppercase tracking-wider mb-2">
                    Level Up!
                  </h2>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-8 w-8 fill-yellow-500 text-yellow-500" />
                    <motion.span
                      className="text-6xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    >
                      {newLevel}
                    </motion.span>
                    <Star className="h-8 w-8 fill-yellow-500 text-yellow-500" />
                  </div>
                </motion.div>

                {/* Rewards */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold">Rewards Earned:</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-center gap-2 p-3 bg-blue-500/20 rounded-lg border border-blue-500/50">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold text-blue-500">
                          +{rewards.skillPoints}
                        </div>
                        <div className="text-xs text-muted-foreground">Skill Points</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 p-3 bg-purple-500/20 rounded-lg border border-purple-500/50">
                      <Trophy className="h-5 w-5 text-purple-500" />
                      <div>
                        <div className="text-2xl font-bold text-purple-500">
                          +{rewards.prestigePoints}
                        </div>
                        <div className="text-xs text-muted-foreground">Prestige</div>
                      </div>
                    </div>
                  </div>

                  {rewards.unlocks.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">New Unlocks:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {rewards.unlocks.map((unlock, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            {unlock}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>

                {/* Close button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Button onClick={onClose} className="w-full" size="lg">
                    Continue
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
