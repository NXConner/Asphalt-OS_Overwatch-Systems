
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useGlassEffects } from '@/hooks/use-glass-effects';
import { GlassEffectType, GLASS_EFFECT_PRESETS } from '@/lib/glass-effects';
import { Sparkles, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export function GlassEffectSettings() {
  const {
    topbarSettings,
    sidebarSettings,
    setTopbarSettings,
    setSidebarSettings,
    resetToDefaults,
  } = useGlassEffects();

  const handleTopbarTypeChange = (type: GlassEffectType) => {
    const preset = GLASS_EFFECT_PRESETS[type];
    setTopbarSettings({
      type,
      ...preset,
    });
    toast.success('Topbar glass effect updated');
  };

  const handleSidebarTypeChange = (type: GlassEffectType) => {
    const preset = GLASS_EFFECT_PRESETS[type];
    setSidebarSettings({
      type,
      ...preset,
    });
    toast.success('Sidebar glass effect updated');
  };

  const handleReset = () => {
    resetToDefaults();
    toast.success('Glass effects reset to defaults');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Glass Morphism Effects</h2>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      {/* Topbar Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Top Bar Glass Effects</CardTitle>
          <CardDescription>
            Configure translucent glass effects for the top navigation bar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="topbar-enabled">Enable Glass Effect</Label>
              <p className="text-sm text-muted-foreground">
                Turn on translucent glass morphism for the top bar
              </p>
            </div>
            <Switch
              id="topbar-enabled"
              checked={topbarSettings.enabled}
              onCheckedChange={(enabled) => setTopbarSettings({ enabled })}
            />
          </div>

          <Separator />

          {/* Glass Type */}
          <div className="space-y-2">
            <Label htmlFor="topbar-type">Glass Style</Label>
            <Select
              value={topbarSettings.type}
              onValueChange={(value) => handleTopbarTypeChange(value as GlassEffectType)}
              disabled={!topbarSettings.enabled}
            >
              <SelectTrigger id="topbar-type">
                <SelectValue placeholder="Select glass style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Solid)</SelectItem>
                <SelectItem value="clear">Clear Glass</SelectItem>
                <SelectItem value="frosty">Frosty ❄️</SelectItem>
                <SelectItem value="smokey">Smokey 🌫️</SelectItem>
                <SelectItem value="steamy">Steamy 💨</SelectItem>
                <SelectItem value="condensation">Condensation 💧</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose the visual style of the glass effect
            </p>
          </div>

          {/* Opacity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="topbar-opacity">Transparency</Label>
              <span className="text-sm text-muted-foreground">{topbarSettings.opacity}%</span>
            </div>
            <Slider
              id="topbar-opacity"
              value={[topbarSettings.opacity]}
              onValueChange={([opacity]) => setTopbarSettings({ opacity })}
              min={0}
              max={100}
              step={5}
              disabled={!topbarSettings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Adjust how transparent the background is (0% = fully transparent, 100% = solid)
            </p>
          </div>

          {/* Blur */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="topbar-blur">Blur Intensity</Label>
              <span className="text-sm text-muted-foreground">{topbarSettings.blur}px</span>
            </div>
            <Slider
              id="topbar-blur"
              value={[topbarSettings.blur]}
              onValueChange={([blur]) => setTopbarSettings({ blur })}
              min={0}
              max={20}
              step={1}
              disabled={!topbarSettings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Control the blur amount of elements behind the glass
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sidebar Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Sidebar Glass Effects</CardTitle>
          <CardDescription>
            Configure translucent glass effects for the sidebar navigation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sidebar-enabled">Enable Glass Effect</Label>
              <p className="text-sm text-muted-foreground">
                Turn on translucent glass morphism for the sidebar
              </p>
            </div>
            <Switch
              id="sidebar-enabled"
              checked={sidebarSettings.enabled}
              onCheckedChange={(enabled) => setSidebarSettings({ enabled })}
            />
          </div>

          <Separator />

          {/* Glass Type */}
          <div className="space-y-2">
            <Label htmlFor="sidebar-type">Glass Style</Label>
            <Select
              value={sidebarSettings.type}
              onValueChange={(value) => handleSidebarTypeChange(value as GlassEffectType)}
              disabled={!sidebarSettings.enabled}
            >
              <SelectTrigger id="sidebar-type">
                <SelectValue placeholder="Select glass style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Solid)</SelectItem>
                <SelectItem value="clear">Clear Glass</SelectItem>
                <SelectItem value="frosty">Frosty ❄️</SelectItem>
                <SelectItem value="smokey">Smokey 🌫️</SelectItem>
                <SelectItem value="steamy">Steamy 💨</SelectItem>
                <SelectItem value="condensation">Condensation 💧</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose the visual style of the glass effect
            </p>
          </div>

          {/* Opacity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sidebar-opacity">Transparency</Label>
              <span className="text-sm text-muted-foreground">{sidebarSettings.opacity}%</span>
            </div>
            <Slider
              id="sidebar-opacity"
              value={[sidebarSettings.opacity]}
              onValueChange={([opacity]) => setSidebarSettings({ opacity })}
              min={0}
              max={100}
              step={5}
              disabled={!sidebarSettings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Adjust how transparent the background is (0% = fully transparent, 100% = solid)
            </p>
          </div>

          {/* Blur */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sidebar-blur">Blur Intensity</Label>
              <span className="text-sm text-muted-foreground">{sidebarSettings.blur}px</span>
            </div>
            <Slider
              id="sidebar-blur"
              value={[sidebarSettings.blur]}
              onValueChange={([blur]) => setSidebarSettings({ blur })}
              min={0}
              max={20}
              step={1}
              disabled={!sidebarSettings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Control the blur amount of elements behind the glass
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Note */}
      <Card className="bg-primary/5">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Glass effects work best with a map or image background. 
            The effects will be more visible when you return to the dashboard where content 
            is displayed behind the topbar and sidebar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
