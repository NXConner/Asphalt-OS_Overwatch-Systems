
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGlassEffects } from '@/hooks/use-glass-effects';
import { Droplet, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlassControlsProps {
  onClose?: () => void;
}

export function GlassControls({ onClose }: GlassControlsProps) {
  const {
    topbarSettings,
    sidebarSettings,
    bottomBarSettings,
    updateTopbarSettings,
    updateSidebarSettings,
    updateBottomBarSettings,
  } = useGlassEffects();

  return (
    <div className="fixed top-20 right-4 z-[100] w-80 max-h-[calc(100vh-100px)] overflow-y-auto">
      <Card className="glass-morphism border-primary/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Glass Effects
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Top Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Top Bar</Label>
              <Switch
                checked={topbarSettings.enabled}
                onCheckedChange={(checked) =>
                  updateTopbarSettings({ enabled: checked })
                }
              />
            </div>
            {topbarSettings.enabled && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs">Effect Type</Label>
                  <Select
                    value={topbarSettings.type}
                    onValueChange={(value: any) =>
                      updateTopbarSettings({ type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frosty">Frosty</SelectItem>
                      <SelectItem value="smokey">Smokey</SelectItem>
                      <SelectItem value="steamy">Steamy</SelectItem>
                      <SelectItem value="condensation">Condensation</SelectItem>
                      <SelectItem value="clear">Clear</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Opacity: {topbarSettings.opacity}%</Label>
                  <Slider
                    value={[topbarSettings.opacity]}
                    onValueChange={([value]) =>
                      updateTopbarSettings({ opacity: value })
                    }
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Blur: {topbarSettings.blur}px</Label>
                  <Slider
                    value={[topbarSettings.blur]}
                    onValueChange={([value]) =>
                      updateTopbarSettings({ blur: value })
                    }
                    min={0}
                    max={20}
                    step={1}
                  />
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Sidebar</Label>
              <Switch
                checked={sidebarSettings.enabled}
                onCheckedChange={(checked) =>
                  updateSidebarSettings({ enabled: checked })
                }
              />
            </div>
            {sidebarSettings.enabled && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs">Effect Type</Label>
                  <Select
                    value={sidebarSettings.type}
                    onValueChange={(value: any) =>
                      updateSidebarSettings({ type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frosty">Frosty</SelectItem>
                      <SelectItem value="smokey">Smokey</SelectItem>
                      <SelectItem value="steamy">Steamy</SelectItem>
                      <SelectItem value="condensation">Condensation</SelectItem>
                      <SelectItem value="clear">Clear</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Opacity: {sidebarSettings.opacity}%</Label>
                  <Slider
                    value={[sidebarSettings.opacity]}
                    onValueChange={([value]) =>
                      updateSidebarSettings({ opacity: value })
                    }
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Blur: {sidebarSettings.blur}px</Label>
                  <Slider
                    value={[sidebarSettings.blur]}
                    onValueChange={([value]) =>
                      updateSidebarSettings({ blur: value })
                    }
                    min={0}
                    max={20}
                    step={1}
                  />
                </div>
              </>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Bottom Bar</Label>
              <Switch
                checked={bottomBarSettings.enabled}
                onCheckedChange={(checked) =>
                  updateBottomBarSettings({ enabled: checked })
                }
              />
            </div>
            {bottomBarSettings.enabled && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs">Effect Type</Label>
                  <Select
                    value={bottomBarSettings.type}
                    onValueChange={(value: any) =>
                      updateBottomBarSettings({ type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frosty">Frosty</SelectItem>
                      <SelectItem value="smokey">Smokey</SelectItem>
                      <SelectItem value="steamy">Steamy</SelectItem>
                      <SelectItem value="condensation">Condensation</SelectItem>
                      <SelectItem value="clear">Clear</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Opacity: {bottomBarSettings.opacity}%</Label>
                  <Slider
                    value={[bottomBarSettings.opacity]}
                    onValueChange={([value]) =>
                      updateBottomBarSettings({ opacity: value })
                    }
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Blur: {bottomBarSettings.blur}px</Label>
                  <Slider
                    value={[bottomBarSettings.blur]}
                    onValueChange={([value]) =>
                      updateBottomBarSettings({ blur: value })
                    }
                    min={0}
                    max={20}
                    step={1}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
