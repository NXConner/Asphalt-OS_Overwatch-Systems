import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      address?: string;
      bio?: string;
      createdAt?: Date;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    bio?: string;
    createdAt?: Date;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    bio?: string;
    createdAt?: Date;
  }
}

// Business types
export type JobStatus = 'POSSIBLE' | 'COMPLETED' | 'LOST' | 'IN_PROGRESS';
export type JobType = 'SEALCOATING' | 'CRACK_REPAIR' | 'ASPHALT_PATCHING' | 'LINE_STRIPING' | 'COMBINATION';
export type UserRole = 'ADMIN' | 'OWNER' | 'EMPLOYEE';

export interface Job {
  id: string;
  title: string;
  address: string;
  latitude?: number;
  longitude?: number;
  status: JobStatus;
  type: JobType;
  description?: string;
  notes?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  squareFootage?: number;
  linearFootage?: number;
  numberOfStalls?: number;
  hasOilSpots: boolean;
  crackSeverity?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  estimatedCost?: number;
  actualCost?: number;
  invoicedAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Material {
  id: string;
  name: string;
  supplier: string;
  unit: string;
  costPerUnit: number;
  description?: string;
  category?: string;
}

export interface Timesheet {
  id: string;
  userId: string;
  clockIn: Date;
  clockOut?: Date;
  clockInLatitude?: number;
  clockInLongitude?: number;
  clockOutLatitude?: number;
  clockOutLongitude?: number;
  isValidLocation: boolean;
  totalHours?: number;
  regularHours?: number;
  overtimeHours?: number;
  hourlyRate: number;
  regularPay?: number;
  overtimePay?: number;
  totalPay?: number;
  jobId?: string;
  notes?: string;
}

export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  status: JobStatus;
  type: JobType;
  address: string;
  description?: string;
  estimatedCost?: number;
}

export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}