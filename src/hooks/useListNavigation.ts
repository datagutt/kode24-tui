import { useRef, useEffect } from 'react';
import type { ScrollBoxRenderable } from '@opentui/core';

interface UseListNavigationOptions {
  selectedIndex: number;
  isActive: boolean;
  itemCount?: number;
  buffer?: number;
}

const readViewportHeight = (node: ScrollBoxRenderable): number => {
  const viewport = node.viewport?.height;
  if (typeof viewport === 'number') return viewport;
  if (typeof node.height === 'number') return node.height;
  return 60;
};

// Estimate item positions from direct children of the scrollbox
const estimateItemTop = (node: ScrollBoxRenderable, index: number): { top: number; height: number } | undefined => {
  const children = node.getChildren();
  let offset = 0;
  for (let i = 0; i < children.length; i++) {
    const h = typeof children[i].height === 'number' ? (children[i].height as number) : 4;
    if (i === index) return { top: offset, height: h };
    offset += h;
  }
  return undefined;
};

export const useListNavigation = (options: UseListNavigationOptions) => {
  const scrollRef = useRef<ScrollBoxRenderable>(null);
  const prevIndexRef = useRef(options.selectedIndex);
  const buffer = options.buffer ?? 3;

  useEffect(() => {
    const node = scrollRef.current;
    if (!node || !options.isActive) return;

    const metric = estimateItemTop(node, options.selectedIndex);
    if (!metric) return;

    const viewport = readViewportHeight(node);
    const scrollTop = node.scrollTop ?? 0;
    const top = metric.top;
    const bottom = top + metric.height;

    // Only scroll if item is outside visible area
    if (top < scrollTop + buffer) {
      node.scrollTop = Math.max(0, top - buffer);
    } else if (bottom > scrollTop + viewport - buffer) {
      node.scrollTop = Math.max(0, bottom - viewport + buffer);
    }

    prevIndexRef.current = options.selectedIndex;
  }, [options.selectedIndex, options.isActive, buffer]);

  return scrollRef;
};

export type { UseListNavigationOptions };
