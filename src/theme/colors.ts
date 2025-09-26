/**
 * Centralized theme colors for kode24-tui
 * 
 * This file defines all colors used throughout the application
 * to ensure consistency and easy theme management.
 */

export const colors = {
  // Primary colors
  primary: {
    blue: '#0066cc',
    darkBlue: '#004499',
    lightBlue: '#3399ff',
    cyan: '#00ffff',
  },

  // Status colors
  status: {
    success: '#00cc00',
    warning: '#ffcc00',
    error: '#cc0000',
    info: '#0099cc',
  },

  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#cccccc',
    muted: '#999999',
    inverse: '#000000',
    link: '#0099ff',
  },

  // Background colors
  background: {
    primary: '#000000',
    secondary: '#1a1a1a',
    accent: '#333333',
    highlight: '#0066cc',
    selected: '#004499',
    hover: '#2a2a2a',
  },

  // UI Component colors
  ui: {
    border: '#666666',
    separator: '#444444',
    shadow: '#111111',
    disabled: '#666666',
  },

  // Brand colors (kode24 specific)
  brand: {
    orange: '#ff6600',
    green: '#00cc66',
    purple: '#9966cc',
    yellow: '#ffcc00',
  },

  // Content type colors
  content: {
    article: '#ffffff',
    job: '#00cc66',
    event: '#ff6600',
    tag: '#9966cc',
    comment: '#00ccff',
  },

  // Semantic colors for different content
  semantic: {
    reactions: '#ff3366',
    comments: '#0099ff',
    views: '#00cc66',
    premium: '#ffcc00',
    focus: '#ff6600',
    basis: '#cccccc',
  },
} as const;

// Color aliases for commonly used combinations
export const themeColors = {
  // Header
  header: {
    background: colors.primary.blue,
    text: colors.text.primary,
    accent: colors.primary.cyan,
  },

  // Footer
  footer: {
    background: colors.ui.separator,
    text: colors.text.primary,
  },

  // Navigation
  navigation: {
    selected: colors.primary.blue,
    selectedText: colors.text.primary,
    normal: colors.text.secondary,
    background: colors.background.secondary,
  },

  // Articles
  article: {
    title: colors.text.primary,
    subtitle: colors.primary.cyan,
    author: colors.text.muted,
    date: colors.text.muted,
    reactions: colors.semantic.reactions,
    comments: colors.semantic.comments,
    views: colors.semantic.views,
  },

  // Jobs
  job: {
    title: colors.text.primary,
    company: colors.content.job,
    type: colors.brand.yellow,
    location: colors.primary.cyan,
    description: colors.text.muted,
    premium: colors.semantic.premium,
  },

  // Tags
  tag: {
    name: colors.primary.cyan,
    description: colors.text.muted,
    count: colors.brand.yellow,
    selected: colors.primary.blue,
  },

  // Status indicators
  loading: colors.primary.blue,
  error: colors.status.error,
  success: colors.status.success,
  warning: colors.status.warning,

  // Interactive elements
  button: {
    primary: colors.primary.blue,
    primaryText: colors.text.primary,
    secondary: colors.background.accent,
    secondaryText: colors.text.secondary,
  },
} as const;

// Helper functions for color management
export const colorUtils = {
  /**
   * Get a color value by path (e.g., 'primary.blue')
   */
  get: (path: string): string => {
    const keys = path.split('.');
    let value: any = colors;
    
    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        console.warn(`Color path '${path}' not found`);
        return colors.text.primary; // fallback
      }
    }
    
    return value;
  },

  /**
   * Check if a color exists
   */
  exists: (path: string): boolean => {
    const keys = path.split('.');
    let value: any = colors;
    
    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        return false;
      }
    }
    
    return typeof value === 'string';
  },

  /**
   * Get all available color paths
   */
  getPaths: (): string[] => {
    const paths: string[] = [];
    
    const traverse = (obj: any, prefix = ''): void => {
      for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'string') {
          paths.push(path);
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, path);
        }
      }
    };
    
    traverse(colors);
    return paths;
  },
};

// Type definitions for better TypeScript support
export type ColorPath = 
  | 'primary.blue'
  | 'primary.darkBlue'
  | 'primary.lightBlue'
  | 'primary.cyan'
  | 'status.success'
  | 'status.warning'
  | 'status.error'
  | 'status.info'
  | 'text.primary'
  | 'text.secondary'
  | 'text.muted'
  | 'text.inverse'
  | 'text.link'
  | 'background.primary'
  | 'background.secondary'
  | 'background.accent'
  | 'background.highlight'
  | 'background.selected'
  | 'background.hover'
  | 'brand.orange'
  | 'brand.green'
  | 'brand.purple'
  | 'brand.yellow';

export type ThemeColorKey = keyof typeof themeColors;

// Default export for convenience
export default {
  colors,
  themeColors,
  colorUtils,
};