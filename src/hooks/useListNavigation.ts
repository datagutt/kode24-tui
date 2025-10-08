import { useRef, useEffect } from 'react';
import type { ScrollBoxRenderable } from '@opentui/core';

interface NavigationMetrics {
  top: number;
  height: number;
}

interface UseListNavigationOptions {
  selectedIndex: number;
  isActive: boolean;
  metrics?: Map<number, NavigationMetrics> | Record<string, NavigationMetrics>;
  useDynamicMetrics?: boolean;
  buffer?: number;
  scrollBehavior?: 'smooth' | 'minimal';
}

const calculateDynamicMetrics = (scrollbox: ScrollBoxRenderable): Record<number, NavigationMetrics> => {
  const metrics: Record<number, NavigationMetrics> = {};
  const children = scrollbox.getChildren();
  
  let offset = 0;
  children.forEach((child, index) => {
    const childHeight = typeof child.height === 'number' ? child.height : 3;
    metrics[index] = { top: offset, height: childHeight };
    offset += childHeight;
  });
  
  return metrics;
};

export const useListNavigation = ({ 
  selectedIndex, 
  isActive, 
  metrics,
  useDynamicMetrics = false,
  buffer = 3,
  scrollBehavior = 'minimal'
}: UseListNavigationOptions) => {
  const scrollboxRef = useRef<ScrollBoxRenderable>(null);
  const previousIndexRef = useRef(selectedIndex);
  const wasActiveRef = useRef(isActive);

  useEffect(() => {
    if (!scrollboxRef.current || !isActive) {
      wasActiveRef.current = isActive;
      return;
    }

    const effectiveMetrics = useDynamicMetrics 
      ? calculateDynamicMetrics(scrollboxRef.current)
      : metrics;

    if (!effectiveMetrics) {
      return;
    }

    const itemMetrics = effectiveMetrics instanceof Map 
      ? effectiveMetrics.get(selectedIndex)
      : effectiveMetrics[selectedIndex];

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

    const justBecameActive = !wasActiveRef.current && isActive;
    wasActiveRef.current = isActive;

    const isFullyVisible = top >= viewTop + buffer && bottom <= viewBottom - buffer;
    
    if (isFullyVisible && !justBecameActive) {
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
  }, [selectedIndex, isActive, metrics, useDynamicMetrics, buffer, scrollBehavior]);

  return scrollboxRef;
};
