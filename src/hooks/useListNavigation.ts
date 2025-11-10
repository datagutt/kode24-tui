import { useRef, useEffect } from 'react';
import type { ScrollBoxRenderable } from '@opentui/core';

interface NavigationMetrics {
  top: number;
  height: number;
}

type MetricStore = Map<number, NavigationMetrics> | Record<string | number, NavigationMetrics>;

interface UseListNavigationOptions {
  selectedIndex: number;
  isActive: boolean;
  metrics?: MetricStore;
  useDynamicMetrics?: boolean;
  buffer?: number;
  scrollBehavior?: 'smooth' | 'minimal';
}

const buildDynamicMetrics = (node: ScrollBoxRenderable): Record<number, NavigationMetrics> => {
  const children = node.getChildren();
  const seed = { map: {} as Record<number, NavigationMetrics>, offset: 0 };
  const result = children.reduce((state, child, index) => {
    const height = typeof child.height === 'number' ? child.height : 3;
    state.map[index] = { top: state.offset, height };
    return { map: state.map, offset: state.offset + height };
  }, seed);
  return result.map;
};

const readViewportHeight = (node: ScrollBoxRenderable): number => {
  const viewport = node.viewport?.height;
  if (typeof viewport === 'number') {
    return viewport;
  }
  if (typeof node.height === 'number') {
    return node.height;
  }
  return 60;
};

const pickMetric = (store: MetricStore, index: number): NavigationMetrics | undefined => {
  if (store instanceof Map) {
    return store.get(index);
  }
  return store[index] ?? store[index.toString()];
};

const resolveMinimal = (top: number, bottom: number, viewport: number, buffer: number, scrollTop: number): number => {
  if (top < scrollTop + buffer) {
    return Math.max(0, top - buffer);
  }
  if (bottom > scrollTop + viewport - buffer) {
    return Math.max(0, bottom - viewport + buffer);
  }
  return scrollTop;
};

const resolveSmooth = (top: number, bottom: number, viewport: number, buffer: number, movingDown: boolean): number => {
  if (movingDown) {
    return Math.max(0, bottom - viewport + buffer);
  }
  return Math.max(0, top - buffer);
};

export const useListNavigation = (options: UseListNavigationOptions) => {
  const scrollRef = useRef<ScrollBoxRenderable>(null);
  const prevIndexRef = useRef(options.selectedIndex);
  const activeRef = useRef(options.isActive);
  const buffer = options.buffer ?? 3;
  const behavior = options.scrollBehavior ?? 'minimal';
  const dynamic = options.useDynamicMetrics === true;

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) {
      activeRef.current = options.isActive;
      return;
    }
    if (!options.isActive) {
      activeRef.current = false;
      return;
    }

    const store = dynamic ? buildDynamicMetrics(node) : options.metrics;
    if (!store) {
      return;
    }

    const metric = pickMetric(store, options.selectedIndex);
    if (!metric) {
      return;
    }

    const viewport = readViewportHeight(node);
    const scrollTop = node.scrollTop ?? 0;
    const top = metric.top;
    const bottom = metric.top + metric.height;
    const justActivated = !activeRef.current;
    activeRef.current = true;

    const viewTop = scrollTop + buffer;
    const viewBottom = scrollTop + viewport - buffer;
    const fullyVisible = top >= viewTop && bottom <= viewBottom;
    if (fullyVisible && !justActivated) {
      prevIndexRef.current = options.selectedIndex;
      return;
    }

    const movingDown = options.selectedIndex > prevIndexRef.current;
    prevIndexRef.current = options.selectedIndex;

    const target = behavior === 'minimal'
      ? resolveMinimal(top, bottom, viewport, buffer, scrollTop)
      : resolveSmooth(top, bottom, viewport, buffer, movingDown);

    if (target === scrollTop) {
      return;
    }

    node.scrollTop = target;
  }, [options.selectedIndex, options.isActive, options.metrics, dynamic, buffer, behavior]);

  return scrollRef;
};
