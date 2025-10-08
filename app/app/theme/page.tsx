
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GlitchEffect } from '@/components/ui/glitch-effect';
import {
  THEME_PRESETS,
  getThemesByCategory,
  getThemeById,
  applyTheme,
  ThemeColors,
} from '@/lib/theme-presets';
import {
  Palette,
  Star,
  Sparkles,
  Check,
  RotateCcw,
  Save,
  Eye,
  Wand2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ThemePage() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<string>('standard-blue');
  const [customColors, setCustomColors] = useState<ThemeColors>({
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#3b82f6',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    card: '#ffffff',
    cardForeground: '#0f172a',
  });
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const standardThemes = getThemesByCategory('STANDARD');
  const premiumThemes = getThemesByCategory('PREMIUM');

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme) {
      const theme = getThemeById(savedTheme);
      if (theme) {
        setSelectedTheme(savedTheme);
        applyTheme(theme.colors);
      }
    }
  }, []);

  const handleThemeSelect = (themeId: string) => {
    const theme = getThemeById(themeId);
    if (!theme) return;

    setSelectedTheme(themeId);
    setIsCustomMode(false);
    
    if (previewMode) {
      applyTheme(theme.colors);
    }
  };

  const handleCustomColorChange = (key: keyof ThemeColors, value: string) => {
    const newColors = { ...customColors, [key]: value };
    setCustomColors(newColors);
    
    if (previewMode) {
      applyTheme(newColors);
    }
  };

  const handleApplyTheme = () => {
    if (isCustomMode) {
      applyTheme(customColors);
      localStorage.setItem('customThemeColors', JSON.stringify(customColors));
      localStorage.setItem('appTheme', 'custom');
    } else {
      const theme = getThemeById(selectedTheme);
      if (theme) {
        applyTheme(theme.colors);
        localStorage.setItem('appTheme', selectedTheme);
      }
    }
    toast.success('Theme applied successfully!');
  };

  const handleResetToDefault = () => {
    const defaultTheme = getThemeById('standard-blue');
    if (defaultTheme) {
      setSelectedTheme('standard-blue');
      setIsCustomMode(false);
      applyTheme(defaultTheme.colors);
      localStorage.setItem('appTheme', 'standard-blue');
      toast.success('Reset to default theme');
    }
  };

  const togglePreview = () => {
    const newPreviewMode = !previewMode;
    setPreviewMode(newPreviewMode);
    
    if (newPreviewMode) {
      if (isCustomMode) {
        applyTheme(customColors);
      } else {
        const theme = getThemeById(selectedTheme);
        if (theme) applyTheme(theme.colors);
      }
    } else {
      // Reset to saved theme
      const savedTheme = localStorage.getItem('appTheme');
      if (savedTheme && savedTheme !== 'custom') {
        const theme = getThemeById(savedTheme);
        if (theme) applyTheme(theme.colors);
      } else if (savedTheme === 'custom') {
        const savedColors = localStorage.getItem('customThemeColors');
        if (savedColors) {
          applyTheme(JSON.parse(savedColors));
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <GlitchEffect intensity="high" autoGlitch autoGlitchInterval={7000}>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Theme Customizer
                </h1>
              </GlitchEffect>
              <p className="text-muted-foreground mt-2">
                Personalize your application appearance
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.push('/theme/advanced')} variant="default">
                <Sparkles className="h-4 w-4 mr-2" />
                Advanced Effects
              </Button>
              <Button onClick={togglePreview} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Exit Preview' : 'Preview'}
              </Button>
              <Button onClick={() => router.push('/dashboard')} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Theme Selection Sidebar */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="standard" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="standard" onClick={() => setIsCustomMode(false)}>
                  <Star className="h-4 w-4 mr-2" />
                  Standard
                </TabsTrigger>
                <TabsTrigger value="premium" onClick={() => setIsCustomMode(false)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Premium
                </TabsTrigger>
                <TabsTrigger value="custom" onClick={() => setIsCustomMode(true)}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Custom
                </TabsTrigger>
              </TabsList>

              {/* Standard Themes */}
              <TabsContent value="standard" className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Standard Themes</h2>
                  <p className="text-muted-foreground">
                    Professional color schemes for everyday use
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {standardThemes.map((theme) => (
                    <Card
                      key={theme.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedTheme === theme.id && !isCustomMode
                          ? 'ring-2 ring-blue-600'
                          : ''
                      }`}
                      onClick={() => handleThemeSelect(theme.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-lg">{theme.name}</CardTitle>
                          {selectedTheme === theme.id && !isCustomMode && (
                            <Check className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <CardDescription>{theme.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div
                          className="h-24 rounded-lg mb-4"
                          style={{ background: theme.preview }}
                        />
                        <div className="grid grid-cols-5 gap-1">
                          {Object.values(theme.colors).slice(0, 5).map((color, idx) => (
                            <div
                              key={idx}
                              className="h-8 rounded"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Premium Themes */}
              <TabsContent value="premium" className="space-y-6">
                <div className="text-center mb-6">
                  <GlitchEffect intensity="high" autoGlitch autoGlitchInterval={5000}>
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Premium Themes
                    </h2>
                  </GlitchEffect>
                  <p className="text-muted-foreground">
                    Exclusive color schemes with stunning gradients
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {premiumThemes.map((theme) => (
                    <Card
                      key={theme.id}
                      className={`cursor-pointer transition-all hover:shadow-2xl border-2 ${
                        selectedTheme === theme.id && !isCustomMode
                          ? 'ring-2 ring-purple-600 border-purple-300'
                          : 'border-purple-100'
                      }`}
                      onClick={() => handleThemeSelect(theme.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-600" />
                            <CardTitle className="text-lg">{theme.name}</CardTitle>
                          </div>
                          {selectedTheme === theme.id && !isCustomMode && (
                            <Check className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                        <CardDescription>{theme.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div
                          className="h-24 rounded-lg mb-4 shadow-lg"
                          style={{ background: theme.preview }}
                        />
                        <div className="grid grid-cols-5 gap-1">
                          {Object.values(theme.colors).slice(0, 5).map((color, idx) => (
                            <div
                              key={idx}
                              className="h-8 rounded shadow"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Custom Theme Editor */}
              <TabsContent value="custom" className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Create Your Own Theme</h2>
                  <p className="text-muted-foreground">
                    Customize every color to match your brand
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5" />
                      Color Palette Editor
                    </CardTitle>
                    <CardDescription>
                      Click on any color to customize it
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {Object.entries(customColors).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <Label htmlFor={key} className="capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id={key}
                              type="color"
                              value={value}
                              onChange={(e) =>
                                handleCustomColorChange(key as keyof ThemeColors, e.target.value)
                              }
                              className="h-10 w-20 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                handleCustomColorChange(key as keyof ThemeColors, e.target.value)
                              }
                              className="flex-1 font-mono text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-3">Color Preview</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {Object.entries(customColors).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div
                              className="h-16 rounded-lg shadow mb-1"
                              style={{ backgroundColor: value }}
                            />
                            <p className="text-xs text-muted-foreground truncate">{key}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Action Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleApplyTheme} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Apply Theme
                </Button>
                <Button onClick={handleResetToDefault} variant="outline" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
                <Separator />
                <div className="text-xs text-muted-foreground">
                  {previewMode ? (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Eye className="h-3 w-3" />
                      Preview mode active
                    </div>
                  ) : (
                    'Enable preview to see changes in real-time'
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Current Theme</CardTitle>
              </CardHeader>
              <CardContent>
                {isCustomMode ? (
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Wand2 className="h-3 w-3 mr-1" />
                    Custom Theme
                  </Badge>
                ) : (
                  <div>
                    <Badge className={
                      getThemeById(selectedTheme)?.category === 'PREMIUM'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                        : 'bg-blue-600'
                    }>
                      {getThemeById(selectedTheme)?.category === 'PREMIUM' && (
                        <Sparkles className="h-3 w-3 mr-1" />
                      )}
                      {getThemeById(selectedTheme)?.name}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>• Use preview mode to see changes before applying</p>
                <p>• Premium themes offer rich gradients and colors</p>
                <p>• Custom themes are saved to your browser</p>
                <p>• Reset anytime to return to default</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
