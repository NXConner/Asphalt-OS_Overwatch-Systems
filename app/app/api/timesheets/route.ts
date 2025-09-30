
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// Business address for geofencing (Stuart, VA)
const BUSINESS_LAT = 36.6484;
const BUSINESS_LNG = -80.2737;
const GEOFENCE_RADIUS = 0.5; // miles

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isValidLocation(lat: number, lng: number): boolean {
  const distance = calculateDistance(lat, lng, BUSINESS_LAT, BUSINESS_LNG);
  return distance <= GEOFENCE_RADIUS;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, latitude, longitude, jobId, notes } = await request.json();

    // Get user's hourly rate
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isLocationValid = isValidLocation(latitude, longitude);

    if (action === 'clock_in') {
      // Check if user is already clocked in
      const activeTimesheet = await prisma.timesheet.findFirst({
        where: {
          userId: session.user.id,
          clockOut: null
        }
      });

      if (activeTimesheet) {
        return NextResponse.json(
          { error: 'Already clocked in' },
          { status: 400 }
        );
      }

      // Create new timesheet
      const timesheet = await prisma.timesheet.create({
        data: {
          userId: session.user.id,
          clockIn: new Date(),
          clockInLatitude: latitude,
          clockInLongitude: longitude,
          isValidLocation: isLocationValid,
          hourlyRate: user.hourlyRate,
          jobId: jobId || null,
          notes: notes || null
        }
      });

      return NextResponse.json({
        timesheet,
        locationValid: isLocationValid,
        distanceFromBusiness: calculateDistance(latitude, longitude, BUSINESS_LAT, BUSINESS_LNG).toFixed(2)
      }, { status: 201 });
    }

    if (action === 'clock_out') {
      // Find active timesheet
      const activeTimesheet = await prisma.timesheet.findFirst({
        where: {
          userId: session.user.id,
          clockOut: null
        }
      });

      if (!activeTimesheet) {
        return NextResponse.json(
          { error: 'Not clocked in' },
          { status: 400 }
        );
      }

      const clockOutTime = new Date();
      const totalHours = (clockOutTime.getTime() - activeTimesheet.clockIn.getTime()) / (1000 * 60 * 60);
      const regularHours = Math.min(totalHours, 8);
      const overtimeHours = Math.max(0, totalHours - 8);
      
      const regularPay = regularHours * user.hourlyRate;
      const overtimePay = overtimeHours * user.hourlyRate * 1.5;
      const totalPay = regularPay + overtimePay;

      // Update timesheet
      const updatedTimesheet = await prisma.timesheet.update({
        where: { id: activeTimesheet.id },
        data: {
          clockOut: clockOutTime,
          clockOutLatitude: latitude,
          clockOutLongitude: longitude,
          totalHours,
          regularHours,
          overtimeHours,
          regularPay,
          overtimePay,
          totalPay,
          notes: notes || activeTimesheet.notes
        }
      });

      return NextResponse.json({
        timesheet: updatedTimesheet,
        locationValid: isLocationValid,
        distanceFromBusiness: calculateDistance(latitude, longitude, BUSINESS_LAT, BUSINESS_LNG).toFixed(2)
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error with timesheet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For employees, show only their timesheets
    // For admin/owner, show all timesheets
    const whereClause = session.user.role === 'EMPLOYEE' 
      ? { userId: session.user.id }
      : {};

    const timesheets = await prisma.timesheet.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        clockIn: 'desc'
      },
      take: 50 // Limit to recent 50 entries
    });

    return NextResponse.json(timesheets);
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


