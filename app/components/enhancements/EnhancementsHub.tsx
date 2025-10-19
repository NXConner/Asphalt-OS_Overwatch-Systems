
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Palette, 
  Brain, 
  Mic, 
  WifiOff, 
  Paintbrush,
  Zap,
  TrendingUp
} from 'lucide-react';

// Import all enhancement components
import { GlassPresets } from './GlassPresets';
import { ThemeBuilder } from './ThemeBuilder';
import { AITraining } from './AITraining';
import { VoiceChat } from './VoiceChat';
import { OfflineSurfaceDetection } from './OfflineSurfaceDetection';
import { CustomGlassTints } from './CustomGlassTints';
import { AnimationControls } from './AnimationControls';
import { AdvancedAIFeatures } from './AdvancedAIFeatures';

export function EnhancementsHub() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Future Enhancements</h1>
        <p className="text-muted-foreground">
          Explore advanced features and customization options
        </p>
      </div>

      <Tabs defaultValue="glass-presets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto">
          <TabsTrigger value="glass-presets" className="flex-col gap-1 py-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs">Presets</span>
          </TabsTrigger>
          <TabsTrigger value="theme-builder" className="flex-col gap-1 py-2">
            <Palette className="w-4 h-4" />
            <span className="text-xs">Themes</span>
          </TabsTrigger>
          <TabsTrigger value="glass-tints" className="flex-col gap-1 py-2">
            <Paintbrush className="w-4 h-4" />
            <span className="text-xs">Tints</span>
          </TabsTrigger>
          <TabsTrigger value="animations" className="flex-col gap-1 py-2">
            <Zap className="w-4 h-4" />
            <span className="text-xs">Animations</span>
          </TabsTrigger>
          <TabsTrigger value="ai-training" className="flex-col gap-1 py-2">
            <Brain className="w-4 h-4" />
            <span className="text-xs">AI Training</span>
          </TabsTrigger>
          <TabsTrigger value="voice-chat" className="flex-col gap-1 py-2">
            <Mic className="w-4 h-4" />
            <span className="text-xs">Voice Chat</span>
          </TabsTrigger>
          <TabsTrigger value="offline-detection" className="flex-col gap-1 py-2">
            <WifiOff className="w-4 h-4" />
            <span className="text-xs">Offline AI</span>
          </TabsTrigger>
          <TabsTrigger value="advanced-ai" className="flex-col gap-1 py-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Advanced AI</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="glass-presets">
          <GlassPresets
            onApplyPreset={(preset) => {
              // Apply preset logic here
              console.log('Applying preset:', preset);
            }}
          />
        </TabsContent>

        <TabsContent value="theme-builder">
          <ThemeBuilder />
        </TabsContent>

        <TabsContent value="glass-tints">
          <CustomGlassTints />
        </TabsContent>

        <TabsContent value="animations">
          <AnimationControls />
        </TabsContent>

        <TabsContent value="ai-training">
          <AITraining />
        </TabsContent>

        <TabsContent value="voice-chat">
          <VoiceChat />
        </TabsContent>

        <TabsContent value="offline-detection">
          <OfflineSurfaceDetection />
        </TabsContent>

        <TabsContent value="advanced-ai">
          <AdvancedAIFeatures />
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">About These Enhancements</h3>
            <p className="text-sm text-muted-foreground mb-3">
              These are optional advanced features that weren't part of the original requirements
              but can significantly enhance your experience with Asphalt OS.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Experimental</Badge>
              <Badge variant="outline">Performance Optimized</Badge>
              <Badge variant="outline">Fully Optional</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
