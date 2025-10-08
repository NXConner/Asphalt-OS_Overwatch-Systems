
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
  BACKGROUND_EFFECTS,
  COLOR_PRESETS,
  applySidebarStyle,
  applyTopBarStyle,
  getSidebarStyle,
  getTopBarStyle,
  getEffectById,
  SidebarStyle,
  TopBarStyle,
} from '@/lib/advanced-theme-effects';
import {
  Palette,
  Sparkles,
  Check,
  RotateCcw,
  Save,
  Eye,
  Menu,
  Zap,
  Droplets,
  Wind,
  Cloud,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdvancedThemePage() {
  const router = useRouter();
  const [sidebarStyle, setSidebarStyle] = useState<SidebarStyle>(getSidebarStyle());
  const [topBarStyle, setTopBarStyle] = useState<TopBarStyle>(getTopBarStyle());
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    // Load saved styles
    setSidebarStyle(getSidebarStyle());
    setTopBarStyle(getTopBarStyle());
  }, []);

  const handleSidebarEffectChange = (effectId: string) => {
    const effect = getEffectById(effectId);
    if (!effect) return;

    const newStyle: SidebarStyle = {
      ...sidebarStyle,
      effect: effectId,
      background: effect.cssClass,
      blur: effectId.includes('blur') || effectId.includes('glass') || 
            effectId.includes('smoke') || effectId.includes('steam') ||
            effectId.includes('fog') || effectId.includes('condensation'),
    };

    setSidebarStyle(newStyle);
    
    if (previewMode) {
      applySidebarStyle(newStyle);
    }
  };

  const handleTopBarEffectChange = (effectId: string) => {
    const effect = getEffectById(effectId);
    if (!effect) return;

    const newStyle: TopBarStyle = {
      ...topBarStyle,
      effect: effectId,
      background: effect.cssClass,
      blur: effectId.includes('blur') || effectId.includes('glass') || 
            effectId.includes('smoke') || effectId.includes('steam') ||
            effectId.includes('fog') || effectId.includes('condensation'),
    };

    setTopBarStyle(newStyle);
    
    if (previewMode) {
      applyTopBarStyle(newStyle);
    }
  };

  const handleOpacityChange = (target: 'sidebar' | 'topbar', value: number[]) => {
    const opacity = value[0];
    
    if (target === 'sidebar') {
      const newStyle = { ...sidebarStyle, opacity };
      setSidebarStyle(newStyle);
      if (previewMode) {
        applySidebarStyle(newStyle);
      }
    } else {
      const newStyle = { ...topBarStyle, opacity };
      setTopBarStyle(newStyle);
      if (previewMode) {
        applyTopBarStyle(newStyle);
      }
    }
  };

  const handleApplyStyles = () => {
    applySidebarStyle(sidebarStyle);
    applyTopBarStyle(topBarStyle);
    toast.success('Advanced theme applied successfully!', {
      description: 'Your sidebar and top bar styles have been updated.',
    });
  };

  const handleReset = () => {
    const defaultSidebar: SidebarStyle = {
      background: 'bg-white',
      blur: false,
      opacity: 100,
      effect: 'solid-light',
      textColor: 'text-gray-900',
    };
    
    const defaultTopBar: TopBarStyle = {
      background: 'bg-white',
      blur: false,
      opacity: 100,
      effect: 'solid-light',
      textColor: 'text-gray-900',
    };

    setSidebarStyle(defaultSidebar);
    setTopBarStyle(defaultTopBar);
    applySidebarStyle(defaultSidebar);
    applyTopBarStyle(defaultTopBar);
    
    toast.info('Theme reset to defaults');
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
    if (!previewMode) {
      applySidebarStyle(sidebarStyle);
      applyTopBarStyle(topBarStyle);
      toast.success('Preview mode enabled');
    } else {
      toast.info('Preview mode disabled');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/theme')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-purple-600" />
                Advanced Theme Customization
              </h1>
              <p className="text-muted-foreground mt-1">
                Create stunning glass, blur, and visual effects for your interface
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={previewMode ? "default" : "outline"}
              onClick={togglePreview}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Preview Active' : 'Enable Preview'}
            </Button>
            <Button onClick={handleApplyStyles}>
              <Save className="h-4 w-4 mr-2" />
              Save & Apply
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sidebar Customization */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Menu className="h-5 w-5 text-blue-600" />
                Sidebar Effects
              </CardTitle>
              <CardDescription>
                Customize the appearance of your sidebar with advanced visual effects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Effect Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Background Effect</Label>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-1 gap-2">
                    {BACKGROUND_EFFECTS.map((effect) => (
                      <Card
                        key={effect.id}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          sidebarStyle.effect === effect.id && "ring-2 ring-blue-600"
                        )}
                        onClick={() => handleSidebarEffectChange(effect.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{effect.name}</h4>
                                {sidebarStyle.effect === effect.id && (
                                  <Check className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {effect.description}
                              </p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {effect.preview}
                              </Badge>
                            </div>
                            {/* Visual Preview */}
                            <div 
                              className={cn(
                                "w-16 h-16 rounded-lg border-2 border-gray-300",
                                effect.cssClass
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Separator />

              {/* Opacity Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Opacity</Label>
                  <span className="text-sm font-medium">{sidebarStyle.opacity}%</span>
                </div>
                <Slider
                  value={[sidebarStyle.opacity]}
                  onValueChange={(value) => handleOpacityChange('sidebar', value)}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Blur Indicator */}
              {sidebarStyle.blur && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-900">
                    Blur effect enabled
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Bar Customization */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-600" />
                Top Bar Effects
              </CardTitle>
              <CardDescription>
                Customize the appearance of your top navigation bar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Effect Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Background Effect</Label>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-1 gap-2">
                    {BACKGROUND_EFFECTS.map((effect) => (
                      <Card
                        key={effect.id}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          topBarStyle.effect === effect.id && "ring-2 ring-purple-600"
                        )}
                        onClick={() => handleTopBarEffectChange(effect.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{effect.name}</h4>
                                {topBarStyle.effect === effect.id && (
                                  <Check className="h-4 w-4 text-purple-600" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {effect.description}
                              </p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {effect.preview}
                              </Badge>
                            </div>
                            {/* Visual Preview */}
                            <div 
                              className={cn(
                                "w-16 h-16 rounded-lg border-2 border-gray-300",
                                effect.cssClass
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Separator />

              {/* Opacity Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Opacity</Label>
                  <span className="text-sm font-medium">{topBarStyle.opacity}%</span>
                </div>
                <Slider
                  value={[topBarStyle.opacity]}
                  onValueChange={(value) => handleOpacityChange('topbar', value)}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Blur Indicator */}
              {topBarStyle.blur && (
                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-purple-900">
                    Blur effect enabled
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Effect Categories Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-600" />
              Effect Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Cloud className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Glass & Blur</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Frosted glass and blur effects
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Wind className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium">Atmospheric</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Smoke, fog, and steam effects
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Droplets className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <h4 className="font-medium">Condensation</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Water and moisture effects
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Palette className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Gradients</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Colorful gradient overlays
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Pro Tips</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Glass and blur effects work best with colorful backgrounds or images</li>
                  <li>• Lower opacity creates more transparency - perfect for seeing content behind</li>
                  <li>• Atmospheric effects (smoke, fog) add depth and sophistication</li>
                  <li>• Gradients can match your brand colors and create unique looks</li>
                  <li>• Use preview mode to test effects before applying them</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
