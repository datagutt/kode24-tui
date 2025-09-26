# Theme System Documentation

The kode24-tui application uses a centralized theme system for consistent color management across all components.

## Overview

The theme system consists of three main parts:

1. **`src/theme/colors.ts`** - Core color definitions and utilities
2. **`src/hooks/useTheme.ts`** - React hook for accessing theme in components  
3. **Component usage** - How to use theme colors in your components

## Core Color System

### Color Categories

```typescript
// Primary brand colors
colors.primary.blue        // #0066cc
colors.primary.darkBlue    // #004499
colors.primary.lightBlue   // #3399ff
colors.primary.cyan        // #00ffff

// Status colors
colors.status.success      // #00cc00
colors.status.warning      // #ffcc00
colors.status.error        // #cc0000
colors.status.info         // #0099cc

// Text colors
colors.text.primary        // #ffffff
colors.text.secondary      // #cccccc
colors.text.muted          // #999999
colors.text.inverse        // #000000

// Background colors
colors.background.primary    // #000000
colors.background.secondary  // #1a1a1a
colors.background.selected   // #004499
colors.background.hover      // #2a2a2a

// Brand specific colors
colors.brand.orange        // #ff6600
colors.brand.green         // #00cc66
colors.brand.purple        // #9966cc
colors.brand.yellow        // #ffcc00
```

### Semantic Theme Colors

The theme system provides semantic color mappings for specific UI components:

```typescript
// Article colors
themeColors.article.title      // White text for article titles
themeColors.article.subtitle   // Cyan text for subtitles
themeColors.article.author     // Muted text for author names
themeColors.article.reactions  // Red for reaction counts
themeColors.article.comments   // Blue for comment counts

// Job listing colors
themeColors.job.title         // White text for job titles
themeColors.job.company       // Green text for company names
themeColors.job.type          // Yellow for job type (premium, focus, etc.)

// Navigation colors
themeColors.navigation.selected     // Blue background for selected items
themeColors.navigation.selectedText // White text for selected items
themeColors.navigation.normal       // Secondary text for normal items
```

## Using the Theme System

### Method 1: Direct Import

```typescript
import { themeColors, colors } from '../theme/colors.js';

export const MyComponent = () => {
  return (
    <box>
      <text content="Title" style={{ fg: themeColors.article.title }} />
      <text content="Subtitle" style={{ fg: colors.primary.cyan }} />
    </box>
  );
};
```

### Method 2: useTheme Hook (Recommended)

```typescript
import { useTheme } from '../hooks/useTheme.js';

export const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <box>
      {/* Using pre-defined styles */}
      <text content="Title" style={theme.styles.title} />
      <text content="Body text" style={theme.styles.body} />
      <text content="Muted text" style={theme.styles.muted} />
      
      {/* Using semantic colors */}
      <text content="Article title" style={{ fg: theme.article.title }} />
      <text content="Job company" style={{ fg: theme.job.company }} />
      
      {/* Using direct color access */}
      <text content="Custom" style={{ fg: theme.colors.brand.orange }} />
      
      {/* Using common colors */}
      <text content="Primary" style={{ fg: theme.common.primaryText }} />
      
      {/* Using color utilities */}
      <text content="Dynamic" style={{ fg: theme.get('primary.blue') }} />
    </box>
  );
};
```

### Method 3: Style Combinations

```typescript
const theme = useTheme();

// Combine multiple style properties
<box style={{ 
  ...theme.styles.selected, 
  ...theme.styles.padded,
  ...theme.styles.bordered 
}}>
  <text content="Selected item" style={theme.styles.title} />
</box>
```

## Available Style Presets

The theme system provides common style combinations:

```typescript
theme.styles.title      // { fg: white, attributes: 1 } - Bold white text
theme.styles.subtitle   // { fg: cyan } - Cyan colored text
theme.styles.body       // { fg: white } - Regular white text
theme.styles.muted      // { fg: gray } - Muted gray text

theme.styles.selected   // { backgroundColor: blue } - Selected background
theme.styles.bordered   // { border: true } - Border styling
theme.styles.padded     // { padding: 1 } - Standard padding

theme.styles.loading    // { fg: blue } - Loading state color
theme.styles.error      // { fg: red } - Error state color
theme.styles.success    // { fg: green } - Success state color
theme.styles.warning    // { fg: yellow } - Warning state color
```

## Color Utilities

The theme system includes utilities for dynamic color access:

```typescript
const theme = useTheme();

// Get a color by path
const blueColor = theme.get('primary.blue');         // Returns: '#0066cc'
const jobColor = theme.get('content.job');           // Returns: '#00cc66'

// Check if a color exists
const exists = theme.exists('primary.blue');         // Returns: true
const invalid = theme.exists('nonexistent.color');   // Returns: false

// Get all available color paths
const allPaths = theme.getPaths();                   // Returns: ['primary.blue', 'primary.cyan', ...]
```

## Best Practices

### 1. Use Semantic Colors When Available

❌ **Avoid**: Direct color values
```typescript
<text style={{ fg: '#0066cc' }} />
```

✅ **Prefer**: Semantic theme colors
```typescript
<text style={{ fg: theme.article.title }} />
```

### 2. Use Style Presets for Common Patterns

❌ **Avoid**: Repeating style definitions
```typescript
<text style={{ fg: 'white', attributes: 1 }} />
<text style={{ fg: 'white', attributes: 1 }} />
```

✅ **Prefer**: Predefined style presets
```typescript
<text style={theme.styles.title} />
<text style={theme.styles.title} />
```

### 3. Combine Styles When Needed

✅ **Good**: Combine styles for complex components
```typescript
<box style={{ 
  ...theme.styles.selected,
  ...theme.styles.padded,
  marginTop: 1 
}}>
```

### 4. Use the useTheme Hook for Components

✅ **Recommended**: Import theme once per component
```typescript
const theme = useTheme();
// Use theme.* throughout the component
```

## Adding New Colors

To add new colors to the theme system:

1. **Add to core colors** in `src/theme/colors.ts`:
```typescript
colors.newCategory = {
  newColor: '#hexvalue'
}
```

2. **Add semantic mappings** if needed:
```typescript
themeColors.newComponent = {
  newProperty: colors.newCategory.newColor
}
```

3. **Update TypeScript types** for better autocomplete:
```typescript
export type ColorPath = 
  | 'newCategory.newColor'  // Add your new path
  | 'primary.blue'
  // ... existing paths
```

4. **Add to style presets** if it's commonly used:
```typescript
styles: {
  newStyle: { fg: colors.newCategory.newColor }
}
```

## Examples

See `src/components/ThemeExample.tsx` for a comprehensive example of all theme usage patterns.

The theme system ensures consistent styling across the entire application while making it easy to maintain and update colors from a central location.