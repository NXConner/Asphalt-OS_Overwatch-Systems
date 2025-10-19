
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Play, Pause, RotateCcw } from 'lucide-react';

interface AnimationSettings {
  globalSpeed: number;
  enableTransitions: boolean;
  enableHoverEffects: boolean;
  enablePageTransitions: boolean;
  enableLoadingAnimations: boolean;
  reducedMotion: boolean;
}

const DEFAULT_SETTINGS: AnimationSettings = {
  globalSpeed: 1,
  enableTransitions: true,
  enableHoverEffects: true,
  enablePageTransitions: true,
  enableLoadingAnimations: true,
  reducedMotion: false
};

export function AnimationControls() {
  const [settings, setSettings] = useState<AnimationSettings>(DEFAULT_SETTINGS);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('animationSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Apply settings to CSS variables
    const root = document.documentElement;
    
    root.style.setProperty('--animation-speed', settings.globalSpeed.toString());
    root.style.setProperty('--transition-duration', `${0.3 / settings.globalSpeed}s`);
    
    // Apply motion preferences
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-scale', '0');
      root.style.setProperty('--transition-enabled', '0');
    } else {
      root.style.setProperty('--animation-scale', '1');
      root.style.setProperty('--transition-enabled', '1');
    }

    // Save to localStorage
    localStorage.setItem('animationSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AnimationSettings>(
    key: K,
    value: AnimationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const getSpeedLabel = (speed: number) => {
    if (speed <= 0.5) return 'Very Slow';
    if (speed <= 0.75) return 'Slow';
    if (speed <= 1) return 'Normal';
    if (speed <= 1.5) return 'Fast';
    return 'Very Fast';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Animation Controls</h2>
        <p className="text-muted-foreground">
          Customize animation speeds and transition effects
        </p>
      </div>

      {/* Global Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Global Animation Speed</h3>
            <p className="text-sm text-muted-foreground">
              Adjust all animations at once
            </p>
          </div>
          <Badge variant="outline" className="text-base">
            {getSpeedLabel(settings.globalSpeed)}
          </Badge>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Speed Multiplier: {settings.globalSpeed}x</Label>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Slider
              value={[settings.globalSpeed]}
              onValueChange={([value]) => updateSetting('globalSpeed', value)}
              min={0.25}
              max={2}
              step={0.25}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.25x (Slowest)</span>
              <span>1x (Normal)</span>
              <span>2x (Fastest)</span>
            </div>
          </div>

          {/* Demo Animation */}
          <div className="border rounded-lg p-8 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden relative">
            <div
              className="absolute top-4 left-4 w-16 h-16 bg-primary rounded-full"
              style={{
                animation: isPlaying
                  ? `bounce ${1 / settings.globalSpeed}s infinite`
                  : 'none'
              }}
            />
            <div
              className="absolute bottom-4 right-4 w-16 h-16 bg-secondary rounded-full"
              style={{
                animation: isPlaying
                  ? `spin ${2 / settings.globalSpeed}s linear infinite`
                  : 'none'
              }}
            />
            <p className="text-center text-sm text-muted-foreground">
              Animation Preview
            </p>
          </div>
        </div>
      </Card>

      {/* Feature Toggles */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Animation Features</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="transitions" className="font-medium">
                Page Transitions
              </Label>
              <p className="text-sm text-muted-foreground">
                Smooth transitions between pages
              </p>
            </div>
            <Switch
              id="transitions"
              checked={settings.enablePageTransitions}
              onCheckedChange={(checked) => updateSetting('enablePageTransitions', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="hover" className="font-medium">
                Hover Effects
              </Label>
              <p className="text-sm text-muted-foreground">
                Interactive hover animations
              </p>
            </div>
            <Switch
              id="hover"
              checked={settings.enableHoverEffects}
              onCheckedChange={(checked) => updateSetting('enableHoverEffects', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="loading" className="font-medium">
                Loading Animations
              </Label>
              <p className="text-sm text-muted-foreground">
                Spinners and skeleton loaders
              </p>
            </div>
            <Switch
              id="loading"
              checked={settings.enableLoadingAnimations}
              onCheckedChange={(checked) => updateSetting('enableLoadingAnimations', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="transitions-general" className="font-medium">
                General Transitions
              </Label>
              <p className="text-sm text-muted-foreground">
                Color and layout transitions
              </p>
            </div>
            <Switch
              id="transitions-general"
              checked={settings.enableTransitions}
              onCheckedChange={(checked) => updateSetting('enableTransitions', checked)}
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reduced-motion" className="font-medium">
                  Reduced Motion
                </Label>
                <p className="text-sm text-muted-foreground">
                  Minimize all animations (accessibility)
                </p>
              </div>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Presets */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Speed Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant={settings.globalSpeed === 0.5 ? 'default' : 'outline'}
            onClick={() => updateSetting('globalSpeed', 0.5)}
            className="w-full"
          >
            Slow
            <br />
            <span className="text-xs opacity-70">0.5x</span>
          </Button>
          <Button
            variant={settings.globalSpeed === 1 ? 'default' : 'outline'}
            onClick={() => updateSetting('globalSpeed', 1)}
            className="w-full"
          >
            Normal
            <br />
            <span className="text-xs opacity-70">1x</span>
          </Button>
          <Button
            variant={settings.globalSpeed === 1.5 ? 'default' : 'outline'}
            onClick={() => updateSetting('globalSpeed', 1.5)}
            className="w-full"
          >
            Fast
            <br />
            <span className="text-xs opacity-70">1.5x</span>
          </Button>
          <Button
            variant={settings.globalSpeed === 2 ? 'default' : 'outline'}
            onClick={() => updateSetting('globalSpeed', 2)}
            className="w-full"
          >
            Very Fast
            <br />
            <span className="text-xs opacity-70">2x</span>
          </Button>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={resetToDefaults} className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      {/* Info */}
      <Card className="p-4 bg-accent/50">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Performance Tips
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Faster animations (1.5x-2x) feel more responsive</li>
          <li>• Slower animations (0.5x-0.75x) emphasize transitions</li>
          <li>• Enable "Reduced Motion" for better performance on older devices</li>
          <li>• Disable hover effects to reduce CPU usage</li>
        </ul>
      </Card>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
