import { colors, themeColors, colorUtils } from '../theme/colors.js';

/**
 * Hook for accessing theme colors and utilities
 * 
 * @example
 * const theme = useTheme();
 * 
 * // Use theme colors
 * style={{ fg: theme.colors.text.primary }}
 * style={{ fg: theme.article.title }}
 * 
 * // Use color utilities
 * const customColor = theme.get('accent.pink');
 */
export const useTheme = () => {
  return {
    // Direct access to color definitions
    colors,
    
    // Semantic theme colors
    ...themeColors,
    
    // Color utilities
    get: colorUtils.get,
    exists: colorUtils.exists,
    getPaths: colorUtils.getPaths,
    
    // Common color combinations for easy access
    common: {
      // Text colors
      primaryText: themeColors.article.title,
      secondaryText: themeColors.article.author,
      mutedText: themeColors.article.date,
      linkText: colors.text.accent,
      
      // Background colors
      selectedBg: themeColors.navigation.selected,
      hoverBg: colors.surface.raised,
      accentBg: colors.surface.lifted,
      
      // Status colors
      loadingColor: themeColors.status.loading,
      errorColor: themeColors.status.error,
      successColor: themeColors.status.success,
      warningColor: themeColors.status.warning,
      
      // Interactive colors
      primaryButton: themeColors.button.primary,
      secondaryButton: themeColors.button.secondary,
    },
    
    // Style helpers for common patterns
    styles: {
      // Common text styles
      title: { fg: themeColors.article.title, attributes: 1 },
      subtitle: { fg: themeColors.article.subtitle },
      body: { fg: colors.text.primary },
      muted: { fg: colors.text.muted },
      
      // Common box styles
      selected: { backgroundColor: themeColors.navigation.selected },
      bordered: { border: true },
      padded: { padding: 1 },

      // Status styles
      loading: { fg: themeColors.status.loading },
      error: { fg: themeColors.status.error },
      success: { fg: themeColors.status.success },
      warning: { fg: themeColors.status.warning },
    }
  };
};

export default useTheme;
