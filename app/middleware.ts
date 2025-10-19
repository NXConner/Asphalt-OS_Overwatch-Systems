
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Protected routes
  const protectedPaths = [
    '/dashboard',
    '/jobs',
    '/employees',
    '/fleet',
    '/reports',
    '/settings',
    '/payroll',
    '/clients',
    '/estimates',
    '/invoices',
    '/equipment',
    '/training',
  ];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // If accessing a protected path without authentication
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Role-based access control
  if (token) {
    const userRole = token.role as string;
    const pathname = request.nextUrl.pathname;

    // Owner has full access - no restrictions
    if (userRole === 'OWNER') {
      return NextResponse.next();
    }

    // Admin restrictions (cannot access critical business settings)
    if (userRole === 'ADMIN') {
      const adminRestrictedPaths = [
        '/settings/business',
        '/settings/roles',
      ];
      
      if (adminRestrictedPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      return NextResponse.next();
    }

    // Employee restrictions (limited access)
    if (userRole === 'EMPLOYEE') {
      const employeeAllowedPaths = [
        '/dashboard',
        '/jobs',
        '/equipment',
        '/training',
        '/profile',
      ];
      
      const isAllowed = employeeAllowedPaths.some(path => pathname.startsWith(path));
      
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      return NextResponse.next();
    }

    // Client restrictions (very limited access)
    if (userRole === 'CLIENT') {
      const clientAllowedPaths = [
        '/dashboard',
        '/jobs',
        '/estimates',
        '/invoices',
        '/profile',
      ];
      
      const isAllowed = clientAllowedPaths.some(path => pathname.startsWith(path));
      
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
