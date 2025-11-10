import { forwardRef, useMemo } from 'react';
import type { ScrollBoxRenderable } from '@opentui/core';
import { MacOSScrollAccel } from '@opentui/core';
import { useTheme } from '../hooks/useTheme.js';

interface ScrollSurfaceProps {
  children: React.ReactNode;
  height?: number | `${number}%` | 'auto';
  width?: number | `${number}%` | 'auto';
  padding?: number;
  marginTop?: number;
  marginBottom?: number;
  variant?: 'panel' | 'sidebar' | 'translucent';
  focused?: boolean;
  sticky?: boolean;
  stickyStart?: 'top' | 'bottom' | 'left' | 'right';
  scrollX?: boolean;
  scrollY?: boolean;
  borderless?: boolean;
}

export const ScrollSurface = forwardRef<ScrollBoxRenderable, ScrollSurfaceProps>((props, ref) => {
  const theme = useTheme();
  const variant = props.variant ?? 'panel';
  const focusColor = props.focused ? theme.navigation.selectedText : theme.colors.border.subtle;
  const baseBg = variant === 'sidebar'
    ? theme.colors.surface.card
    : variant === 'translucent'
      ? theme.colors.background.highlight
      : theme.colors.surface.raised;
  const backgroundColor = props.focused ? theme.navigation.selected : baseBg;
  const border = props.borderless ? false : true;
  const padding = props.padding ?? 1;

  const scrollAcceleration = useMemo(() => new MacOSScrollAccel({ maxMultiplier: variant === 'panel' ? 2.4 : 1.8 }), [variant]);
  const trackOptions = {
    backgroundColor: theme.colors.background.alt,
    border: true,
    borderColor: theme.colors.border.subtle,
  };
  const arrowOptions = {
    foregroundColor: theme.colors.text.secondary,
    backgroundColor: theme.colors.background.alt,
  };

  const height = props.height;
  const width = props.width;
  const grow = height ? undefined : 1;

  return (
    <scrollbox
      ref={ref}
      scrollAcceleration={scrollAcceleration}
      scrollY={props.scrollY ?? true}
      scrollX={props.scrollX ?? false}
      stickyScroll={props.sticky}
      stickyStart={props.stickyStart}
      scrollbarOptions={{
        showArrows: false,
        trackOptions,
        arrowOptions,
      }}
      verticalScrollbarOptions={{
        showArrows: false,
        trackOptions,
        arrowOptions,
      }}
      horizontalScrollbarOptions={{
        showArrows: false,
        trackOptions,
        arrowOptions,
      }}
      style={{
        border,
        borderColor: focusColor,
        backgroundColor,
        padding,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        height,
        width,
        flexGrow: grow,
        flexShrink: 1,
      }}
    >
      {props.children}
    </scrollbox>
  );
});

ScrollSurface.displayName = 'ScrollSurface';

export default ScrollSurface;
