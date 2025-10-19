
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, Eye, Save, Palette } from 'lucide-react';

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
  };
  glass: {
    blur: number;
    opacity: number;
    tint: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: number;
  borderRadius: number;
}

const DEFAULT_THEME: ThemeConfig = {
  name: 'Custom Theme',
  colors: {
    primary: '#FF6B00',
    secondary: '#1E1E1E',
    accent: '#FFD700',
    background: '#0A0A0A',
    foreground: '#FFFFFF',
    muted: '#6B7280'
  },
  glass: {
    blur: 12,
    opacity: 0.15,
    tint: '#FF6B00'
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter'
  },
  spacing: 16,
  borderRadius: 8
};

export function ThemeBuilder() {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [preview, setPreview] = useState(false);

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const updateColors = (colorKey: keyof ThemeConfig['colors'], value: string) => {
    setTheme(prev => ({
      ...prev,
      colors: { ...prev.colors, [colorKey]: value }
    }));
  };

  const updateGlass = (glassKey: keyof ThemeConfig['glass'], value: any) => {
    setTheme(prev => ({
      ...prev,
      glass: { ...prev.glass, [glassKey]: value }
    }));
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `theme-${theme.name.toLowerCase().replace(/\s+/g, '-')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setTheme(imported);
        } catch (error) {
          console.error('Failed to import theme:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Visual Theme Builder</h2>
          <p className="text-muted-foreground">Create and customize your perfect theme</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreview(!preview)}>
            <Eye className="w-4 h-4 mr-2" />
            {preview ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={exportTheme}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <label htmlFor="import-theme">
            <Button variant="outline" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </span>
            </Button>
          </label>
          <input
            id="import-theme"
            type="file"
            accept=".json"
            className="hidden"
            onChange={importTheme}
          />
        </div>
      </div>

      {preview ? (
        <ThemePreview theme={theme} />
      ) : (
        <Card className="p-6">
          <Tabs defaultValue="colors">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="glass">Glass Effects</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-6 mt-6">
              <div>
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                  id="theme-name"
                  value={theme.name}
                  onChange={(e) => updateTheme({ name: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(theme.colors).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={`color-${key}`} className="capitalize">
                      {key}
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id={`color-${key}`}
                        type="color"
                        value={value}
                        onChange={(e) => updateColors(key as keyof ThemeConfig['colors'], e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={value}
                        onChange={(e) => updateColors(key as keyof ThemeConfig['colors'], e.target.value)}
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="glass" className="space-y-6 mt-6">
              <div>
                <Label>Blur Amount: {theme.glass.blur}px</Label>
                <Slider
                  value={[theme.glass.blur]}
                  onValueChange={([value]) => updateGlass('blur', value)}
                  min={0}
                  max={30}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Opacity: {Math.round(theme.glass.opacity * 100)}%</Label>
                <Slider
                  value={[theme.glass.opacity * 100]}
                  onValueChange={([value]) => updateGlass('opacity', value / 100)}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="glass-tint">Glass Tint</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="glass-tint"
                    type="color"
                    value={theme.glass.tint}
                    onChange={(e) => updateGlass('tint', e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={theme.glass.tint}
                    onChange={(e) => updateGlass('tint', e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="typography" className="space-y-6 mt-6">
              <div>
                <Label htmlFor="font-heading">Heading Font</Label>
                <select
                  id="font-heading"
                  value={theme.fonts.heading}
                  onChange={(e) => setTheme(prev => ({
                    ...prev,
                    fonts: { ...prev.fonts, heading: e.target.value }
                  }))}
                  className="w-full mt-2 px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>

              <div>
                <Label htmlFor="font-body">Body Font</Label>
                <select
                  id="font-body"
                  value={theme.fonts.body}
                  onChange={(e) => setTheme(prev => ({
                    ...prev,
                    fonts: { ...prev.fonts, body: e.target.value }
                  }))}
                  className="w-full mt-2 px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Source Sans Pro">Source Sans Pro</option>
                </select>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-6 mt-6">
              <div>
                <Label>Spacing Scale: {theme.spacing}px</Label>
                <Slider
                  value={[theme.spacing]}
                  onValueChange={([value]) => updateTheme({ spacing: value })}
                  min={8}
                  max={32}
                  step={2}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Border Radius: {theme.borderRadius}px</Label>
                <Slider
                  value={[theme.borderRadius]}
                  onValueChange={([value]) => updateTheme({ borderRadius: value })}
                  min={0}
                  max={24}
                  step={2}
                  className="mt-2"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline">
              <Palette className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Theme
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function ThemePreview({ theme }: { theme: ThemeConfig }) {
  return (
    <Card className="p-8" style={{ backgroundColor: theme.colors.background }}>
      <div className="space-y-6">
        <h2
          className="text-3xl font-bold"
          style={{
            color: theme.colors.foreground,
            fontFamily: theme.fonts.heading
          }}
        >
          Theme Preview
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {Object.entries(theme.colors).map(([key, value]) => (
            <div
              key={key}
              className="p-4 rounded-lg"
              style={{
                backgroundColor: value,
                borderRadius: `${theme.borderRadius}px`
              }}
            >
              <p className="text-sm font-medium capitalize mix-blend-difference text-white">
                {key}
              </p>
            </div>
          ))}
        </div>

        <div
          className="p-6 rounded-lg"
          style={{
            backdropFilter: `blur(${theme.glass.blur}px)`,
            backgroundColor: `${theme.glass.tint}${Math.round(
              theme.glass.opacity * 255
            ).toString(16)}`,
            borderRadius: `${theme.borderRadius}px`,
            fontFamily: theme.fonts.body
          }}
        >
          <h3
            className="text-xl font-bold mb-4"
            style={{
              color: theme.colors.foreground,
              fontFamily: theme.fonts.heading
            }}
          >
            Glass Effect Card
          </h3>
          <p style={{ color: theme.colors.foreground }}>
            This is how your glass effect will look with the current settings.
            The blur, opacity, and tint combine to create this visual effect.
          </p>
        </div>
      </div>
    </Card>
  );
}
