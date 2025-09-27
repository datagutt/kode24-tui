import { useRef, useEffect } from 'react';
import type { ScrollBoxRenderable } from '@opentui/core';

export const useScrollboxFocus = (deps: any[] = []) => {
  const scrollboxRef = useRef<ScrollBoxRenderable>(null);

  useEffect(() => {
    scrollboxRef.current?.focus();
  }, deps);

  return scrollboxRef;
};