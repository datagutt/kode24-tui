import { useTheme } from '../hooks/useTheme.js';

/**
 * Example component demonstrating theme usage
 * This component shows different ways to use the centralized theme system
 */
export const ThemeExample = () => {
  const theme = useTheme();

  return (
    <box style={{ flexDirection: "column", padding: 2 }}>
      {/* Header using theme styles */}
      <text content="Theme Example" style={theme.styles.title} />
      
      {/* Different text styles */}
      <text content="This is primary text" style={theme.styles.body} />
      <text content="This is muted/secondary text" style={theme.styles.muted} />
      <text content="This is a subtitle" style={theme.styles.subtitle} />
      
      {/* Direct color access */}
      <text content="Direct color: Primary Blue" style={{ fg: theme.colors.primary.blue }} />
      <text content="Direct color: Brand Orange" style={{ fg: theme.colors.brand.orange }} />
      
      {/* Semantic theme colors */}
      <text content="Article title color" style={{ fg: theme.article.title }} />
      <text content="Job title color" style={{ fg: theme.job.title }} />
      <text content="Tag name color" style={{ fg: theme.tag.name }} />
      
      {/* Status colors */}
      <text content="Loading..." style={theme.styles.loading} />
      <text content="Error message" style={theme.styles.error} />
      <text content="Success message" style={theme.styles.success} />
      <text content="Warning message" style={theme.styles.warning} />
      
      {/* Common colors for easy access */}
      <text content="Common primary text" style={{ fg: theme.common.primaryText }} />
      <text content="Common secondary text" style={{ fg: theme.common.secondaryText }} />
      
      {/* Boxes with theme backgrounds */}
      <box style={{ ...theme.styles.selected, ...theme.styles.padded, marginTop: 1 }}>
        <text content="Selected item with theme colors" style={{ fg: theme.navigation.selectedText }} />
      </box>
      
      <box style={{ ...theme.styles.bordered, ...theme.styles.padded, marginTop: 1 }}>
        <text content="Bordered box with theme styling" />
      </box>
      
      {/* Using color utilities */}
      <text 
        content={`Dynamic color: ${theme.get('brand.purple')}`} 
        style={{ fg: theme.get('brand.purple') }} 
      />
      
      {/* Check if color exists */}
      <text 
        content={`Color 'primary.blue' exists: ${theme.exists('primary.blue')}`} 
        style={theme.styles.muted} 
      />
    </box>
  );
};