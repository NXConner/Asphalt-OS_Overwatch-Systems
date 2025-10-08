
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  SERVICE_CATALOG, 
  getServicesByCategory,
  calculateServicePrice 
} from '@/lib/services-catalog';
import {
  Check,
  ArrowRight,
  DollarSign,
  Clock,
  Shield,
  Info,
  Calculator,
  Sparkles,
  Star,
} from 'lucide-react';
import { GlitchEffect } from '@/components/ui/glitch-effect';

export default function ServicesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<'STANDARD' | 'PREMIUM'>('STANDARD');

  const standardServices = getServicesByCategory('STANDARD');
  const premiumServices = getServicesByCategory('PREMIUM');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <GlitchEffect intensity="medium" autoGlitch autoGlitchInterval={8000}>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Service Catalog
                </h1>
              </GlitchEffect>
              <p className="text-muted-foreground mt-2">
                Professional asphalt paving and maintenance services
              </p>
            </div>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="standard" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="standard" onClick={() => setSelectedCategory('STANDARD')}>
              <Star className="h-4 w-4 mr-2" />
              Standard Services
            </TabsTrigger>
            <TabsTrigger value="premium" onClick={() => setSelectedCategory('PREMIUM')}>
              <Sparkles className="h-4 w-4 mr-2" />
              Premium Services
            </TabsTrigger>
          </TabsList>

          {/* Standard Services */}
          <TabsContent value="standard" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Standard Professional Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our standard services provide professional-grade asphalt maintenance and repair
                solutions with proven results and competitive pricing.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {standardServices.map((service) => (
                <Card key={service.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {service.category}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          ${service.pricing.basePrice.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          per {service.pricing.unit.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {service.detailedDescription}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        Includes:
                      </h4>
                      <ul className="space-y-1">
                        {service.includes.map((item, idx) => (
                          <li key={idx} className="text-xs flex items-start">
                            <Check className="h-3 w-3 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Duration</div>
                          <div className="text-muted-foreground">{service.estimatedDuration}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Warranty</div>
                          <div className="text-muted-foreground">{service.warranty}</div>
                        </div>
                      </div>
                    </div>

                    {service.pricing.minCharge && (
                      <div className="bg-muted p-2 rounded text-xs">
                        <DollarSign className="h-3 w-3 inline mr-1" />
                        Minimum charge: ${service.pricing.minCharge}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button className="w-full" variant="outline">
                      <Calculator className="h-4 w-4 mr-2" />
                      Get Estimate
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Premium Services */}
          <TabsContent value="premium" className="space-y-6">
            <div className="text-center mb-8">
              <GlitchEffect intensity="high" autoGlitch autoGlitchInterval={6000}>
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Premium Elite Services
                </h2>
              </GlitchEffect>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Cutting-edge technology and premium materials for superior results. Our premium
                services offer enhanced durability, aesthetics, and long-term value.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {premiumServices.map((service) => (
                <Card 
                  key={service.id} 
                  className="flex flex-col hover:shadow-2xl transition-all border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {service.category}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ${service.pricing.basePrice.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          per {service.pricing.unit.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {service.detailedDescription}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                        Premium Features:
                      </h4>
                      <ul className="space-y-1">
                        {service.includes.map((item, idx) => (
                          <li key={idx} className="text-xs flex items-start">
                            <Check className="h-3 w-3 mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <div>
                          <div className="font-medium">Duration</div>
                          <div className="text-muted-foreground">{service.estimatedDuration}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-600" />
                        <div>
                          <div className="font-medium">Warranty</div>
                          <div className="text-muted-foreground">{service.warranty}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-2 rounded text-xs border border-purple-200">
                      <Info className="h-3 w-3 inline mr-1 text-purple-600" />
                      <strong>Materials:</strong> {service.materials.join(', ')}
                    </div>

                    {service.pricing.minCharge && (
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-2 rounded text-xs">
                        <DollarSign className="h-3 w-3 inline mr-1" />
                        Minimum investment: ${service.pricing.minCharge}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Calculator className="h-4 w-4 mr-2" />
                      Get Premium Estimate
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Need a Custom Quote?</h3>
            <p className="mb-6 opacity-90">
              Contact us for a personalized estimate based on your specific project requirements.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="secondary" size="lg" onClick={() => router.push('/dashboard')}>
                <Calculator className="h-5 w-5 mr-2" />
                Create Estimate
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
