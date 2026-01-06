import { useRef, useEffect, useCallback } from 'react';
import type { ScrollBoxRenderable } from '@opentui/core';

interface NavigationMetrics {
  top: number;
  height: number;
}

type MetricStore = Map<number, NavigationMetrics> | Record<string | number, NavigationMetrics>;

interface UseListNavigationOptions {
  selectedIndex: number;
  isActive: boolean;
  itemCount?: number;
  metrics?: MetricStore;
  useDynamicMetrics?: boolean;
  buffer?: number;
  scrollBehavior?: 'smooth' | 'minimal';
}

interface Renderable {
  height?: number | string;
  top?: number | string;
  getChildren?: () => Renderable[];
}

const collectDescendants = (node: Renderable): Renderable[] => {
  const result: Renderable[] = [];
  const stack: Renderable[] = [node];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    const children = current.getChildren?.() ?? [];
    for (const child of children) {
      result.push(child);
      stack.push(child);
    }
  }
  return result;
};

const buildDynamicMetrics = (node: ScrollBoxRenderable, itemCount: number): Record<number, NavigationMetrics> => {
  const descendants = collectDescendants(node as unknown as Renderable);
  
  // Find all box-like elements with numeric height (likely our items)
  const candidates = descendants.filter((d) => {
    const h = d.height;
    return typeof h === 'number' && h > 2;
  });
  
  // Build metrics from top positions if available, otherwise accumulate heights
  const map: Record<number, NavigationMetrics> = {};
  
  // Try using actual top positions first
  const withPositions = candidates.filter((d) => typeof d.top === 'number');
  if (withPositions.length >= itemCount) {
    const sorted = withPositions
      .map((d) => ({ top: d.top as number, height: d.height as number }))
      .sort((a, b) => a.top - b.top)
      .slice(0, itemCount);
    
    sorted.forEach((item, index) => {
      map[index] = { top: item.top, height: item.height };
    });
    return map;
  }
  
  // Fall back to accumulating heights from direct children
  const children = node.getChildren();
  let offset = 0;
  let index = 0;
  
  for (const child of children) {
    if (index >= itemCount) break;
    const height = typeof child.height === 'number' ? child.height : 5;
    map[index] = { top: offset, height };
    offset += height;
    index++;
  }
  
  return map;
};

const readViewportHeight = (node: ScrollBoxRenderable): number => {
  const viewport = node.viewport?.height;
  if (typeof viewport === 'number') return viewport;
  if (typeof node.height === 'number') return node.height;
  return 60;
};

const pickMetric = (store: MetricStore, index: number): NavigationMetrics | undefined => {
  if (store instanceof Map) return store.get(index);
  return store[index] ?? store[index.toString()];
};

const computeScrollTarget = (
  top: number,
  bottom: number,
  viewport: number,
  buffer: number,
  scrollTop: number,
  behavior: 'smooth' | 'minimal',
  movingDown: boolean
): number => {
  if (behavior === 'minimal') {
    // Only scroll if item is outside visible area
    if (top < scrollTop + buffer) {
      return Math.max(0, top - buffer);
    }
    if (bottom > scrollTop + viewport - buffer) {
      return Math.max(0, bottom - viewport + buffer);
    }
    return scrollTop;
  }
  
  // Smooth: always position item at edge
  if (movingDown) {
    return Math.max(0, bottom - viewport + buffer);
  }
  return Math.max(0, top - buffer);
};

export const useListNavigation = (options: UseListNavigationOptions) => {
  const scrollRef = useRef<ScrollBoxRenderable>(null);
  const prevIndexRef = useRef(options.selectedIndex);
  const activeRef = useRef(options.isActive);
  const disabledRef = useRef(false);
  
  const buffer = options.buffer ?? 3;
  const behavior = options.scrollBehavior ?? 'minimal';
  const itemCount = options.itemCount ?? 100;

  // Disable scrollbox's built-in keyboard handling
  const disableKeyboardScroll = useCallback(() => {
    const node = scrollRef.current;
    if (!node || disabledRef.current) return;
    
    // Override handleKeyPress to disable built-in arrow key scrolling
    node.handleKeyPress = () => false;
    disabledRef.current = true;
  }, []);

  // Re-disable after any render (in case scrollbox recreates)
  useEffect(() => {
    disableKeyboardScroll();
  });

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) {
      activeRef.current = options.isActive;
      return;
    }
    
    disableKeyboardScroll();
    
    if (!options.isActive) {
      activeRef.current = false;
      return;
    }

    const store = options.metrics ?? buildDynamicMetrics(node, itemCount);
    const metric = pickMetric(store, options.selectedIndex);
    if (!metric) return;

    const viewport = readViewportHeight(node);
    const scrollTop = node.scrollTop ?? 0;
    const top = metric.top;
    const bottom = metric.top + metric.height;
    const justActivated = !activeRef.current;
    activeRef.current = true;

    // Check if item is already fully visible
    const viewTop = scrollTop + buffer;
    const viewBottom = scrollTop + viewport - buffer;
    const fullyVisible = top >= viewTop && bottom <= viewBottom;
    
    if (fullyVisible && !justActivated) {
      prevIndexRef.current = options.selectedIndex;
      return;
    }

    const movingDown = options.selectedIndex > prevIndexRef.current;
    prevIndexRef.current = options.selectedIndex;

    const target = computeScrollTarget(top, bottom, viewport, buffer, scrollTop, behavior, movingDown);
    
    if (target !== scrollTop) {
      node.scrollTop = target;
    }
  }, [options.selectedIndex, options.isActive, options.metrics, itemCount, buffer, behavior, disableKeyboardScroll]);

  return scrollRef;
};

export type { NavigationMetrics, MetricStore, UseListNavigationOptions };
