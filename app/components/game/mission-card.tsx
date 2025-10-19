
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export interface MissionCardProps {
  mission: {
    id: string;
    title: string;
    type: string;
    location: string;
    difficulty: number; // 1-5 stars
    estimatedTime: string;
    reward: number;
    xpReward: number;
    prestigeReward: number;
    assignedWarriors: number;
    status: 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
  };
  gameMode?: boolean;
}

export function MissionCard({ mission, gameMode = false }: MissionCardProps) {
  const difficultyStars = Array.from({ length: 5 }, (_, i) => i < mission.difficulty);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className={`relative overflow-hidden ${
        gameMode ? 'border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-yellow-500/10' : ''
      }`}>
        {/* Status indicator */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          mission.status === 'COMPLETED' ? 'bg-green-500' :
          mission.status === 'IN_PROGRESS' ? 'bg-blue-500' :
          'bg-gray-300'
        }`} />

        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="flex items-center gap-2">
                {gameMode ? '🎯' : '📋'} 
                {gameMode ? `MISSION #${mission.id}` : mission.title}
              </CardTitle>
              <CardDescription>
                {gameMode ? mission.title : mission.type}
              </CardDescription>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-0.5">
                {difficultyStars.map((filled, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      filled ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <Badge variant={mission.status === 'COMPLETED' ? 'default' : 'secondary'}>
                {mission.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mission Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{mission.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{mission.estimatedTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="font-semibold">${mission.reward.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{mission.assignedWarriors} {gameMode ? 'Warriors' : 'Workers'}</span>
            </div>
          </div>

          {/* Game Mode Rewards */}
          {gameMode && (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4 text-sm font-semibold">
                <div className="flex items-center gap-1">
                  <span className="text-blue-500">⚡</span>
                  <span>{mission.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-purple-500">💎</span>
                  <span>{mission.prestigeReward} PP</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {mission.status === 'AVAILABLE' && (
              <Button className="flex-1" size="sm">
                {gameMode ? '⚔️ Deploy' : '▶️ Start Job'}
              </Button>
            )}
            {mission.status === 'IN_PROGRESS' && (
              <Button className="flex-1" variant="outline" size="sm">
                {gameMode ? '📊 Battle Status' : '👁️ View Details'}
              </Button>
            )}
            {mission.status === 'COMPLETED' && (
              <Button className="flex-1" variant="secondary" size="sm">
                {gameMode ? '🏆 Victory Report' : '✅ View Report'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
