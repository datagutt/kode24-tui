# Refactoring Summary

## Overview

This document describes the refactoring work done on 2025-10-07 to improve code organization and reusability.

## Changes Made

### 1. Generic Hooks Created

#### `src/hooks/useListNavigation.ts`
- **Purpose**: Generic hook for auto-scrolling to selected items in a list
- **Features**:
  - Accepts selectedIndex, isActive flag, metrics (Map or Record), and optional buffer
  - Automatically scrolls scrollbox to keep selected item in view
  - Works with both Map and Record-based metrics
  - Reusable across any page with list navigation
- **Usage**:
  ```typescript
  const scrollboxRef = useListNavigation({
    selectedIndex: 0,
    isActive: true,
    metrics: { 0: { top: 0, height: 10 } },
    buffer: 2
  });
  ```

#### `src/hooks/useKeyboardHandler.ts`
- **Purpose**: Generic keyboard event handler that respects focused renderables
- **Features**:
  - Checks if focused renderable can handle key events first
  - Falls back to app-level keyboard handler
  - Properly typed with KeyEvent interface
- **Usage**:
  ```typescript
  useKeyboardHandler((key: KeyEvent) => {
    if (key.name === 'q') process.exit(0);
  });
  ```

### 2. Page-Specific Navigation Handlers

#### `src/pages/FrontpageNavigationHandler.tsx`
- **Purpose**: Encapsulates all frontpage navigation logic
- **Features**:
  - Factory function `createFrontpageNavigationHandler()` returns a handler
  - Separates left/middle/right sidebar navigation into dedicated functions
  - Returns boolean to indicate if key was handled
  - Fully typed with proper interfaces
- **Benefits**:
  - Removes 200+ lines of navigation logic from main App component
  - Easy to test in isolation
  - Can be reused or extended
  - Clear separation of concerns

### 3. Refactored Main App Component (`src/index.tsx`)

#### Before
- 373 lines
- Mixed concerns (navigation, state, keyboard handling, rendering)
- Deeply nested keyboard handler with page-specific logic
- Hard to test and maintain

#### After
- ~250 lines (reduced by ~33%)
- Clean separation of concerns
- Uses generic hooks and page-specific handlers
- Much easier to maintain and extend

#### Key Improvements
- Removed inline keyboard navigation logic
- Delegates to page-specific handlers
- Uses `useKeyboardHandler` hook
- Cleaner state management with focused helper functions

### 4. Type System Enhancements

#### `src/types/index.ts`
- Added `KeyEvent` interface (exported centrally)
- Ensures type consistency across all keyboard handlers
- Prevents duplication of type definitions

## Benefits

### Code Organization
- Clear separation of concerns
- Each file has a single, well-defined purpose
- Easier to navigate codebase

### Reusability
- Generic hooks can be used across multiple pages
- Navigation patterns can be shared
- Less code duplication

### Maintainability
- Smaller, focused functions
- Easier to understand and modify
- Better for onboarding new developers

### Testability
- Navigation handlers can be unit tested
- Hooks can be tested independently
- Less mocking required

### Extensibility
- Easy to add new pages with navigation
- Can create page-specific handlers following the pattern
- Generic hooks work with any data structure

## Migration Guide

### To Add Navigation to a New Page

1. Create navigation handler:
   ```typescript
   // src/pages/YourPageNavigationHandler.tsx
   export const createYourPageNavigationHandler = (options) => {
     return (key: KeyEvent): boolean => {
       // Handle keys
       return handled;
     };
   };
   ```

2. Use in main App:
   ```typescript
   if (navigation.currentPage === 'yourpage') {
     const handler = createYourPageNavigationHandler({ ... });
     handler(key);
   }
   ```

### To Add Scroll-to-Selection to a Component

1. Calculate metrics for your items:
   ```typescript
   const metrics = useMemo(() => {
     const offsets: Record<string, { top: number; height: number }> = {};
     // Calculate offsets for each item
     return offsets;
   }, [dependencies]);
   ```

2. Use the hook:
   ```typescript
   const scrollboxRef = useListNavigation({
     selectedIndex,
     isActive: true,
     metrics,
   });
   ```

3. Attach to scrollbox:
   ```tsx
   <scrollbox ref={scrollboxRef}>
     {/* content */}
   </scrollbox>
   ```

## Future Improvements

- Create navigation handlers for ArticlePage and ListingsPage
- Extract more page-specific logic from main App component
- Add unit tests for navigation handlers
- Create generic list rendering component with built-in navigation
- Consider creating a navigation factory/registry pattern

## Files Modified

- `src/index.tsx` - Refactored to use generic hooks and handlers
- `src/pages/FrontpagePage.tsx` - Updated imports (no logic changes)
- `src/pages/ArticlePage.tsx` - Uses `useScrollboxFocus` hook
- `src/types/index.ts` - Added `KeyEvent` interface

## Files Created

- `src/hooks/useListNavigation.ts` - Generic list navigation hook
- `src/hooks/useKeyboardHandler.ts` - Generic keyboard handler hook
- `src/pages/FrontpageNavigationHandler.tsx` - Frontpage navigation logic

## Testing

All changes have been type-checked with `bun run tsc --noEmit` and confirmed to compile without errors.

The application starts successfully and maintains all existing functionality.

---

Last Updated: 2025-10-07
