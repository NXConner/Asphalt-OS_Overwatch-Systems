
/**
 * Gamification System Type Definitions
 */

// Game Mode
export type GameMode = 'BUSINESS' | 'WARRIOR';

// XP and Leveling
export interface GameProfile {
  id: string;
  userId: string;
  level: number;
  currentXP: number;
  totalXP: number;
  prestigePoints: number;
  skillPoints: number;
  reputation: number;
  reputationTier: ReputationTier;
  companyRank: CompanyRank;
  gameMode: boolean; // false = Business, true = Warrior
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export type ReputationTier = 
  | 'UNKNOWN'
  | 'LOCAL_CONTRACTOR'
  | 'RESPECTED_BUSINESS'
  | 'REGIONAL_LEADER'
  | 'STATE_CHAMPION'
  | 'NATIONAL_LEGEND';

export type CompanyRank =
  | 'NOVICE_CONTRACTOR'
  | 'APPRENTICE_PAVER'
  | 'JOURNEYMAN_CONTRACTOR'
  | 'MASTER_CRAFTSMAN'
  | 'ELITE_OPERATOR'
  | 'LEGENDARY_DYNASTY'
  | 'DYNASTY_MASTER';

// Achievements
export interface Achievement {
  id: string;
  category: AchievementCategory;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  prestigeReward: number;
  requirement: number;
  hidden?: boolean;
}

export type AchievementCategory =
  | 'CAREER'
  | 'FINANCIAL'
  | 'EMPLOYEE'
  | 'QUALITY'
  | 'SPEED'
  | 'SAFETY'
  | 'SPECIAL'
  | 'HIDDEN';

export interface UserAchievement {
  id: string;
  profileId: string;
  achievementId: string;
  progress: number;
  unlockedAt?: Date;
  isUnlocked: boolean;
}

// Employee Warrior Stats
export interface EmployeeWarriorStats {
  id: string;
  employeeId: string;
  level: number;
  currentXP: number;
  totalXP: number;
  class: WarriorClass;
  rank: WarriorRank;
  
  // RPG Stats
  strength: number;
  speed: number;
  skill: number;
  leadership: number;
  safety: number;
  endurance: number;
  
  // Morale
  happiness: number;
  loyalty: number;
  energy: number;
  stress: number;
  
  // Career stats
  missionsCompleted: number;
  perfectMissions: number;
  totalHoursWorked: number;
}

export type WarriorClass =
  | 'FOREMAN'
  | 'SPECIALIST'
  | 'OPERATOR'
  | 'LABORER'
  | 'SCOUT';

export type WarriorRank =
  | 'RECRUIT'
  | 'PRIVATE'
  | 'CORPORAL'
  | 'SERGEANT'
  | 'LIEUTENANT'
  | 'CAPTAIN'
  | 'MAJOR'
  | 'COLONEL'
  | 'GENERAL'
  | 'LEGEND';

// Mission System
export interface MissionTier {
  stars: number;
  name: string;
  difficulty: string;
  xpMultiplier: number;
  prestigeMultiplier: number;
}

export const MISSION_TIERS: Record<number, MissionTier> = {
  1: { stars: 1, name: 'Novice', difficulty: 'Easy', xpMultiplier: 1.0, prestigeMultiplier: 1.0 },
  2: { stars: 2, name: 'Apprentice', difficulty: 'Medium', xpMultiplier: 1.5, prestigeMultiplier: 1.3 },
  3: { stars: 3, name: 'Journeyman', difficulty: 'Hard', xpMultiplier: 2.0, prestigeMultiplier: 1.6 },
  4: { stars: 4, name: 'Master', difficulty: 'Very Hard', xpMultiplier: 3.0, prestigeMultiplier: 2.0 },
  5: { stars: 5, name: 'Legendary', difficulty: 'Extreme', xpMultiplier: 5.0, prestigeMultiplier: 3.0 },
};

// XP Sources
export interface XPGain {
  source: string;
  amount: number;
  reason: string;
  timestamp: Date;
}

// Level progression
export const LEVEL_XP_REQUIREMENTS: Record<string, number> = {
  '1-10': 100,
  '11-25': 250,
  '26-50': 500,
  '51-75': 1000,
  '76-100': 2500,
};

export function getXPRequiredForLevel(level: number): number {
  if (level <= 10) return 100;
  if (level <= 25) return 250;
  if (level <= 50) return 500;
  if (level <= 75) return 1000;
  return 2500;
}

export function calculateLevel(totalXP: number): number {
  let level = 1;
  let remainingXP = totalXP;

  while (remainingXP >= 0 && level < 100) {
    const requiredXP = getXPRequiredForLevel(level);
    if (remainingXP < requiredXP) break;
    remainingXP -= requiredXP;
    level++;
  }

  return level;
}

export function calculateXPProgress(currentXP: number, level: number): {
  current: number;
  required: number;
  percentage: number;
} {
  const required = getXPRequiredForLevel(level);
  const percentage = (currentXP / required) * 100;
  
  return {
    current: currentXP,
    required,
    percentage: Math.min(percentage, 100),
  };
}
