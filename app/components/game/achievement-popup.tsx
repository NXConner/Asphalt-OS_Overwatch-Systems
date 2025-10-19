
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface AchievementPopupProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    xpReward: number;
    prestigeReward: number;
  };
  isVisible: boolean;
  onClose: () => void;
}

export function AchievementPopup({ achievement, isVisible, onClose }: AchievementPopupProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: -100, scale: 0.5, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -100, scale: 0.5, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 border-2 border-yellow-500 p-6 max-w-md backdrop-blur-xl">
              {/* Sparkle background effect */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 animate-pulse" />
              </div>

              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Content */}
              <div className="relative z-10 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex justify-center"
                >
                  <div className="text-6xl">{achievement.icon}</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-xl font-bold text-yellow-500 uppercase tracking-wider">
                      Achievement Unlocked!
                    </h3>
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </div>

                  <h2 className="text-2xl font-bold mb-2">{achievement.name}</h2>
                  <p className="text-muted-foreground mb-4">{achievement.description}</p>

                  <div className="flex items-center justify-center gap-4 text-sm font-semibold">
                    <div className="flex items-center gap-1">
                      <span className="text-blue-500">💎</span>
                      <span>{achievement.prestigeReward} PP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-green-500">⚡</span>
                      <span>{achievement.xpReward} XP</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button onClick={onClose} className="w-full">
                    Awesome!
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
