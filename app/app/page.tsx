'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, Map, Users, BarChart3, Calendar, Shield } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [mounted, status, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <MapPin className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Asphalt OS</h1>
          <p className="text-xl text-gray-600 mb-8">Overwatch Systems - Advanced Business Management</p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-12">
            <Link href="/auth/signin">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
                data-testid="sign-in-button"
                id="sign-in-button"
                name="sign-in"
                aria-label="Sign in to your account"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6"
                data-testid="sign-up-button"
                id="sign-up-button"
                name="sign-up"
                aria-label="Create a new account"
              >
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Demo Info */}
          <Card className="max-w-md mx-auto bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center text-sm">
                <p className="font-medium text-blue-900 mb-3">Demo Accounts Available</p>
                <div className="space-y-2 text-blue-700">
                  <p><strong>Owner:</strong> n8ter8@gmail.com / Starkiller1138!</p>
                  <p><strong>Alt Owner:</strong> owner@asphaltpaving.com / owner123</p>
                  <p><strong>Employee:</strong> employee1@asphaltpaving.com / employee123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Map className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>GPS Tracking</CardTitle>
              <CardDescription>
                Real-time employee location tracking with Google Maps integration
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Employee Management</CardTitle>
              <CardDescription>
                Comprehensive HR tools, payroll, and performance tracking
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Advanced Reporting</CardTitle>
              <CardDescription>
                Detailed analytics and insights for business intelligence
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Job Scheduling</CardTitle>
              <CardDescription>
                Efficient project and resource planning with calendar views
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MapPin className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Fleet Management</CardTitle>
              <CardDescription>
                Vehicle tracking, maintenance logs, and fuel records
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Enterprise-grade security with role-based access control
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}