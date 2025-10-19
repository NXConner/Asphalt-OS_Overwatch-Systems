
/**
 * EXAMPLE: Optimized Jobs API with Caching and Pagination
 * This demonstrates how to use the performance optimization utilities
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { cache, cacheKeys, CACHE_TTL, withCache } from '@/lib/cache';
import { 
  getPaginationArgs, 
  createPaginatedResult, 
  getDateRangeFilter,
  getSearchFilter,
  selectFields,
  optimizedIncludes 
} from '@/lib/query-optimizer';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    // Generate cache key based on query parameters
    const cacheKey = `jobs:list:${page}:${limit}:${status}:${search}:${startDate}:${endDate}`;

    // Try to get from cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json({
        ...cachedData,
        cached: true,
      });
    }

    // Build query filters
    const where: any = {};

    if (status) {
      where.status = status;
    }

    // Add search filter
    if (search) {
      Object.assign(where, getSearchFilter(search, ['title', 'address', 'description']));
    }

    // Add date range filter
    if (startDate || endDate) {
      Object.assign(where, getDateRangeFilter({ startDate, endDate }, 'scheduledDate'));
    }

    // Get pagination args
    const { skip, take } = getPaginationArgs({ page, limit });

    // Fetch data with optimized query
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take,
        include: {
          creator: {
            select: selectFields.user,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.job.count({ where }),
    ]);

    // Create paginated result
    const result = createPaginatedResult(jobs, total, page, limit);

    // Cache the result
    cache.set(cacheKey, result, CACHE_TTL.MEDIUM);

    return NextResponse.json({
      ...result,
      cached: false,
    });
  } catch (error) {
    console.error('Optimized Jobs API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Create job
    const job = await prisma.job.create({
      data: {
        ...data,
        createdBy: session.user.id,
      },
      include: {
        creator: {
          select: selectFields.user,
        },
      },
    });

    // Invalidate cache for jobs list
    cache.invalidate('jobs:list:.*');
    cache.delete(cacheKeys.jobs.all());

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Create Job Error:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
