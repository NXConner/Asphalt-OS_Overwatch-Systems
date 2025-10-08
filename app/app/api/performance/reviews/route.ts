
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET performance reviews
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const reviewType = searchParams.get('reviewType');

    const where: any = {};
    if (userId) where.userId = userId;
    if (reviewType) where.reviewType = reviewType;

    const reviews = await prisma.performanceReview.findMany({
      where,
      orderBy: {
        reviewDate: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews', details: error.message }, { status: 500 });
  }
}

// POST create performance review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const review = await prisma.performanceReview.create({
      data: {
        userId: body.userId,
        reviewerId: (session.user as any).id,
        reviewDate: new Date(body.reviewDate),
        reviewPeriodStart: new Date(body.reviewPeriodStart),
        reviewPeriodEnd: new Date(body.reviewPeriodEnd),
        reviewType: body.reviewType,
        
        // Marine Corps leadership traits
        justice: body.justice,
        judgment: body.judgment,
        dependability: body.dependability,
        initiative: body.initiative,
        decisiveness: body.decisiveness,
        tact: body.tact,
        integrity: body.integrity,
        endurance: body.endurance,
        bearing: body.bearing,
        unselfishness: body.unselfishness,
        courage: body.courage,
        knowledge: body.knowledge,
        loyalty: body.loyalty,
        enthusiasm: body.enthusiasm,
        
        overallRating: body.overallRating,
        competencies: body.competencies || null,
        goalsAchieved: body.goalsAchieved || null,
        newGoals: body.newGoals || null,
        strengths: body.strengths,
        areasForImprovement: body.areasForImprovement,
        reviewerComments: body.reviewerComments,
        employeeComments: body.employeeComments,
        actionItems: body.actionItems || null,
        status: body.status || 'DRAFT',
        salaryIncrease: body.salaryIncrease,
        promotionRecommended: body.promotionRecommended || false,
        pipRequired: body.pipRequired || false,
        pipCloudPath: body.pipCloudPath,
      },
    });

    return NextResponse.json(review);
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review', details: error.message }, { status: 500 });
  }
}
