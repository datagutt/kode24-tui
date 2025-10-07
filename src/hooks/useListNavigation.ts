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
}

export const useListNavigation = ({ selectedIndex, isActive, metrics, buffer = 2 }: UseListNavigationOptions) => {
  const scrollboxRef = useRef<ScrollBoxRenderable>(null);

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
    const viewBottom = scrollTop + viewportHeight;

    if (top < scrollTop + buffer) {
      scrollboxRef.current.scrollTop = Math.max(0, top - buffer);
      return;
    }

    if (bottom > viewBottom - buffer) {
      scrollboxRef.current.scrollTop = Math.max(0, bottom - viewportHeight + buffer);
    }
  }, [selectedIndex, isActive, metrics, buffer]);

  return scrollboxRef;
};
