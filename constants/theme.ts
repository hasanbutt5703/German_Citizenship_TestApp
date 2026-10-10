// Shared app colors, gradients, and platform-specific font families.

import { Platform } from 'react-native';

export const COLORS = {
  bgMain: '#0F172A',
  bgCard: '#111827',
  textPrimary: '#FFFFFF',
  textSecondary: '#CBD5E1',
  border: '#1E293B',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  pink: '#EC4899',
  orange: '#F59E0B',
  green: '#10B981',
  red: '#EF4444',
  cyan: '#06B6D4',
};

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: '#0A7EA4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0A7EA4',
  },
  dark: {
    text: COLORS.textPrimary,
    background: COLORS.bgMain,
    tint: COLORS.cyan,
    icon: COLORS.textSecondary,
    tabIconDefault: COLORS.textSecondary,
    tabIconSelected: COLORS.cyan,
  },
} as const;

export const GRADIENTS = {
  title: [COLORS.blue, COLORS.purple, COLORS.pink, COLORS.orange] as const,
  cardA: [COLORS.blue, '#1E40AF'] as const,
  cardB: [COLORS.purple, COLORS.pink, COLORS.orange] as const,
  buttonA: [COLORS.blue, COLORS.cyan] as const,
  buttonB: [COLORS.pink, COLORS.orange] as const,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
