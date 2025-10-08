
'use client';

import { Trophy, Star, Award, Medal, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AchievementBadgeProps {
  name: string;
  description: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  category: string;
  badgeColor?: string;
  earnedDate?: Date;
  size?: 'sm' | 'md' | 'lg';
}

export function AchievementBadge({
  name,
  description,
  rarity,
  category,
  badgeColor = '#FFD700',
  earnedDate,
  size = 'md',
}: AchievementBadgeProps) {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 24 : 32;

  const getRarityColor = () => {
    switch (rarity) {
      case 'COMMON':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'UNCOMMON':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'RARE':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'EPIC':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'LEGENDARY':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getIcon = () => {
    const props = { size: iconSize, style: { color: badgeColor } };
    switch (category) {
      case 'PRODUCTIVITY':
        return <Trophy {...props} />;
      case 'SAFETY':
        return <Shield {...props} />;
      case 'QUALITY':
        return <Star {...props} />;
      case 'MILESTONE':
        return <Award {...props} />;
      default:
        return <Medal {...props} />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer
              transition-all duration-200 hover:scale-105 hover:shadow-lg
              ${getRarityColor()}
            `}
          >
            {getIcon()}
            <span className="text-xs font-medium mt-2 text-center">{name}</span>
            {size !== 'sm' && (
              <Badge variant="outline" className="mt-1 text-xs">
                {rarity}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{category}</span>
              {earnedDate && (
                <span className="text-muted-foreground">
                  Earned: {new Date(earnedDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
