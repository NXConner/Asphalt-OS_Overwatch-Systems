
// Gamification System
// XP, Levels, Achievements, and Game Mode Toggle

export interface UserGameStats {
  level: number;
  currentXP: number;
  totalXP: number;
  prestigePoints: number;
  rank: string;
  achievements: string[];
}

// Level progression formula
export function calculateLevelFromXP(totalXP: number): number {
  // Level formula: XP required increases with each tier
  let level = 1;
  let xpRequired = 0;
  
  while (xpRequired < totalXP) {
    if (level <= 10) xpRequired += 100;        // Apprentice: 100 XP/level
    else if (level <= 25) xpRequired += 250;   // Journeyman: 250 XP/level
    else if (level <= 50) xpRequired += 500;   // Master: 500 XP/level
    else if (level <= 75) xpRequired += 1000;  // Elite: 1000 XP/level
    else xpRequired += 2500;                   // Legendary: 2500 XP/level
    
    if (xpRequired <= totalXP) level++;
    else break;
  }
  
  return level;
}

export function calculateXPForNextLevel(currentLevel: number): number {
  if (currentLevel <= 10) return 100;
  if (currentLevel <= 25) return 250;
  if (currentLevel <= 50) return 500;
  if (currentLevel <= 75) return 1000;
  return 2500;
}

export function calculateXPProgress(totalXP: number): { 
  level: number; 
  currentXP: number; 
  xpForNextLevel: number; 
  progress: number;
} {
  const level = calculateLevelFromXP(totalXP);
  const xpForNextLevel = calculateXPForNextLevel(level);
  
  // Calculate XP in current level
  let xpUsed = 0;
  for (let i = 1; i < level; i++) {
    xpUsed += calculateXPForNextLevel(i);
  }
  
  const currentXP = totalXP - xpUsed;
  const progress = (currentXP / xpForNextLevel) * 100;
  
  return { level, currentXP, xpForNextLevel, progress };
}

// Rank titles by level
export function getRankTitle(level: number): string {
  if (level === 100) return 'Dynasty Master';
  if (level >= 76) return 'Legendary Contractor';
  if (level >= 51) return 'Elite Craftsman';
  if (level >= 26) return 'Master Paver';
  if (level >= 11) return 'Journeyman';
  return 'Apprentice Contractor';
}

// XP rewards for various actions
export const XP_REWARDS = {
  JOB_COMPLETE_BASE: 50,
  JOB_COMPLETE_SMALL: 50,
  JOB_COMPLETE_MEDIUM: 150,
  JOB_COMPLETE_LARGE: 300,
  JOB_COMPLETE_HUGE: 500,
  
  PERFECT_RATING: 100,      // 5-star job bonus
  ON_TIME: 50,              // Completed on schedule
  UNDER_BUDGET: 75,         // Came in under budget
  SAFETY_RECORD: 25,        // No incidents
  CLIENT_REFERRAL: 100,     // Client refers another
  REPEAT_CLIENT: 50,        // Return customer
  
  EMPLOYEE_TRAINED: 20,     // Train employee
  NEW_EMPLOYEE: 30,         // Hire employee
  EQUIPMENT_UPGRADE: 15,    // Buy new equipment
};

// Prestige Points (separate from XP, used for unlocks)
export const PP_REWARDS = {
  PERFECT_JOB: 100,
  CLIENT_REFERRAL: 50,
  EMPLOYEE_OF_MONTH: 75,
  SAFETY_MILESTONE: 25,
  INNOVATION: 150,
  COMMUNITY_SERVICE: 50,
  ENVIRONMENTAL: 75,
};

// Game Mode Toggle
export type GameMode = 'business' | 'warrior';

export interface GameModeConfig {
  mode: GameMode;
  terminology: Record<string, string>;
}

export const GAME_MODE_TERMINOLOGY = {
  business: {
    jobs: 'Jobs',
    job: 'Job',
    employees: 'Employees',
    employee: 'Employee',
    revenue: 'Revenue',
    expense: 'Expense',
    client: 'Client',
    vehicle: 'Vehicle',
    equipment: 'Equipment',
    schedule: 'Schedule',
    payroll: 'Payroll',
    estimate: 'Estimate',
    invoice: 'Invoice',
    dashboard: 'Dashboard',
    complete: 'Complete',
  },
  warrior: {
    jobs: 'Missions',
    job: 'Mission',
    employees: 'Warriors',
    employee: 'Warrior',
    revenue: 'Gold',
    expense: 'Resource Cost',
    client: 'Quest Giver',
    vehicle: 'Battle Cruiser',
    equipment: 'Arsenal',
    schedule: 'Battle Plan',
    payroll: 'Warrior Compensation',
    estimate: 'Mission Briefing',
    invoice: 'Victory Claim',
    dashboard: 'Command Center',
    complete: 'Victory',
  },
};

export function getTerminology(mode: GameMode, key: string): string {
  const terminology = GAME_MODE_TERMINOLOGY[mode] as Record<string, string>;
  return terminology[key] || key;
}

export function getStoredGameMode(): GameMode {
  if (typeof window === 'undefined') return 'business';
  return (localStorage.getItem('game-mode') as GameMode) || 'business';
}

export function setGameMode(mode: GameMode) {
  localStorage.setItem('game-mode', mode);
  
  // Dispatch event for other components to react
  window.dispatchEvent(new CustomEvent('gameModeChanged', { detail: mode }));
}

// Achievement definitions
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'career' | 'financial' | 'employee' | 'special' | 'hidden';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  ppReward: number;
  condition: (stats: any) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_job',
    name: 'Rookie Contractor',
    description: 'Complete your first mission',
    icon: '🎖️',
    category: 'career',
    rarity: 'common',
    xpReward: 50,
    ppReward: 25,
    condition: (stats) => stats.jobsCompleted >= 1,
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: 'Complete 100 missions',
    icon: '🏆',
    category: 'career',
    rarity: 'rare',
    xpReward: 1000,
    ppReward: 500,
    condition: (stats) => stats.jobsCompleted >= 100,
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Achieve 50 perfect (5-star) missions',
    icon: '⭐',
    category: 'career',
    rarity: 'epic',
    xpReward: 2000,
    ppReward: 1000,
    condition: (stats) => stats.perfectJobs >= 50,
  },
  {
    id: 'first_million',
    name: 'First Million',
    description: 'Earn $1,000,000 in total revenue',
    icon: '💰',
    category: 'financial',
    rarity: 'rare',
    xpReward: 1500,
    ppReward: 750,
    condition: (stats) => stats.totalRevenue >= 1000000,
  },
  {
    id: 'dream_team',
    name: 'Dream Team',
    description: 'Have 10 active employees',
    icon: '👥',
    category: 'employee',
    rarity: 'uncommon',
    xpReward: 500,
    ppReward: 250,
    condition: (stats) => stats.activeEmployees >= 10,
  },
  {
    id: 'safety_champion',
    name: 'Safety Champion',
    description: '365 days accident-free',
    icon: '🛡️',
    category: 'special',
    rarity: 'legendary',
    xpReward: 5000,
    ppReward: 2500,
    condition: (stats) => stats.daysAccidentFree >= 365,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 10 missions 50% faster than estimated',
    icon: '⚡',
    category: 'special',
    rarity: 'epic',
    xpReward: 1000,
    ppReward: 500,
    condition: (stats) => stats.speedBonusJobs >= 10,
  },
];

// Check if achievement is unlocked
export function checkAchievements(stats: any): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => achievement.condition(stats));
}
