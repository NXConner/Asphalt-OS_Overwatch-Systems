
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET all training courses
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (category) where.category = category;
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const courses = await prisma.trainingCourse.findMany({
      where,
      include: {
        _count: {
          select: {
            assignments: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });

    return NextResponse.json(courses);
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses', details: error.message }, { status: 500 });
  }
}

// POST create new training course
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const course = await prisma.trainingCourse.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        duration: body.duration,
        format: body.format,
        isRequired: body.isRequired || false,
        jobRoles: body.jobRoles || [],
        prerequisiteCourses: body.prerequisiteCourses || [],
        materials: body.materials || null,
        hasAssessment: body.hasAssessment || false,
        passingScore: body.passingScore,
        isActive: body.isActive !== undefined ? body.isActive : true,
        instructor: body.instructor,
        cost: body.cost,
      },
    });

    return NextResponse.json(course);
  } catch (error: any) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course', details: error.message }, { status: 500 });
  }
}
