
/**
 * Glass Morphism Effects System
 * Provides different glass effect styles for UI components
 */

export type GlassEffectType = 'none' | 'frosty' | 'smokey' | 'steamy' | 'condensation' | 'clear';

export interface GlassEffectSettings {
  type: GlassEffectType;
  opacity: number; // 0-100
  blur: number; // 0-20
  enabled: boolean;
}

export const GLASS_EFFECT_PRESETS: Record<GlassEffectType, Omit<GlassEffectSettings, 'type' | 'enabled'>> = {
  none: {
    opacity: 100,
    blur: 0,
  },
  frosty: {
    opacity: 70,
    blur: 16,
  },
  smokey: {
    opacity: 50,
    blur: 12,
  },
  steamy: {
    opacity: 60,
    blur: 20,
  },
  condensation: {
    opacity: 75,
    blur: 8,
  },
  clear: {
    opacity: 90,
    blur: 4,
  },
};

export function getGlassEffectStyles(settings: GlassEffectSettings): React.CSSProperties {
  if (!settings.enabled || settings.type === 'none') {
    return {};
  }

  const preset = GLASS_EFFECT_PRESETS[settings.type];
  const opacity = settings.opacity / 100;
  const blur = settings.blur;

  const baseStyles: React.CSSProperties = {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
  };

  // Type-specific background effects
  switch (settings.type) {
    case 'frosty':
      return {
        ...baseStyles,
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, ${opacity * 0.2}), 
          rgba(255, 255, 255, ${opacity * 0.1})
        )`,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      };

    case 'smokey':
      return {
        ...baseStyles,
        background: `linear-gradient(135deg, 
          rgba(30, 30, 30, ${opacity * 0.7}), 
          rgba(50, 50, 50, ${opacity * 0.5})
        )`,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      };

    case 'steamy':
      return {
        ...baseStyles,
        background: `linear-gradient(135deg, 
          rgba(200, 200, 200, ${opacity * 0.3}), 
          rgba(180, 180, 180, ${opacity * 0.2})
        )`,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
      };

    case 'condensation':
      return {
        ...baseStyles,
        background: `radial-gradient(circle at 20% 50%, 
          rgba(255, 255, 255, ${opacity * 0.25}) 0%, 
          rgba(255, 255, 255, ${opacity * 0.1}) 50%, 
          rgba(255, 255, 255, ${opacity * 0.15}) 100%
        )`,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12), inset 0 0 20px rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      };

    case 'clear':
      return {
        ...baseStyles,
        background: `rgba(255, 255, 255, ${opacity * 0.1})`,
        boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      };

    default:
      return baseStyles;
  }
}

export function getGlassEffectClasses(settings: GlassEffectSettings): string {
  if (!settings.enabled || settings.type === 'none') {
    return '';
  }

  return 'glass-morphism';
}

// Default settings
export const DEFAULT_GLASS_SETTINGS: GlassEffectSettings = {
  type: 'frosty',
  opacity: 70,
  blur: 12,
  enabled: false,
};
