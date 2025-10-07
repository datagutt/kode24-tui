import { useRef, useEffect } from 'react';
import type { ScrollBoxRenderable } from '@opentui/core';

interface NavigationMetrics {
  top: number;
  height: number;
}

interface UseListNavigationOptions {
  selectedIndex: number;
  isActive: boolean;
  metrics: Map<number, NavigationMetrics> | Record<string, NavigationMetrics>;
  buffer?: number;
  scrollBehavior?: 'smooth' | 'minimal';
}

export const useListNavigation = ({ 
  selectedIndex, 
  isActive, 
  metrics, 
  buffer = 3,
  scrollBehavior = 'minimal'
}: UseListNavigationOptions) => {
  const scrollboxRef = useRef<ScrollBoxRenderable>(null);
  const previousIndexRef = useRef(selectedIndex);

  useEffect(() => {
    if (!scrollboxRef.current || !isActive) {
      return;
    }

    const itemMetrics = metrics instanceof Map 
      ? metrics.get(selectedIndex)
      : metrics[selectedIndex];

    if (!itemMetrics) {
      return;
    }

    const scrollTop = scrollboxRef.current.scrollTop ?? 0;
    const viewportHeight = typeof scrollboxRef.current.height === 'number' 
      ? scrollboxRef.current.height 
      : 60;

    const top = itemMetrics.top;
    const bottom = itemMetrics.top + itemMetrics.height;
    const viewTop = scrollTop;
    const viewBottom = scrollTop + viewportHeight;

    const isFullyVisible = top >= viewTop + buffer && bottom <= viewBottom - buffer;
    
    if (isFullyVisible) {
      previousIndexRef.current = selectedIndex;
      return;
    }

    const movingDown = selectedIndex > previousIndexRef.current;
    previousIndexRef.current = selectedIndex;

    if (scrollBehavior === 'minimal') {
      if (top < viewTop + buffer) {
        scrollboxRef.current.scrollTop = Math.max(0, top - buffer);
      } else if (bottom > viewBottom - buffer) {
        scrollboxRef.current.scrollTop = Math.max(0, bottom - viewportHeight + buffer);
      }
    } else {
      const targetScroll = movingDown
        ? Math.max(0, bottom - viewportHeight + buffer)
        : Math.max(0, top - buffer);
      scrollboxRef.current.scrollTop = targetScroll;
    }
  }, [selectedIndex, isActive, metrics, buffer, scrollBehavior]);

  return scrollboxRef;
};
