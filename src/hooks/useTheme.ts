import { colors, themeColors, colorUtils } from '../theme/colors.js';

/**
 * Hook for accessing theme colors and utilities
 * 
 * @example
 * const theme = useTheme();
 * 
 * // Use theme colors
 * style={{ fg: theme.colors.primary.blue }}
 * style={{ fg: theme.article.title }}
 * 
 * // Use color utilities
 * const customColor = theme.get('brand.orange');
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
      linkText: colors.text.link,
      
      // Background colors
      selectedBg: colors.background.selected,
      hoverBg: colors.background.hover,
      accentBg: colors.background.accent,
      
      // Status colors
      loadingColor: themeColors.loading,
      errorColor: themeColors.error,
      successColor: themeColors.success,
      warningColor: themeColors.warning,
      
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
      selected: { backgroundColor: colors.background.selected },
      bordered: { border: true },
      padded: { padding: 1 },
      
      // Status styles
      loading: { fg: themeColors.loading },
      error: { fg: themeColors.error },
      success: { fg: themeColors.success },
      warning: { fg: themeColors.warning },
    }
  };
};

export default useTheme;