import { useKeyboard, useRenderer } from '@opentui/react';
import type { KeyEvent } from '../types/index.js';

type KeyAwareRenderable = {
  focused?: boolean;
  handleKeyPress?: (key: KeyEvent) => boolean;
};

const hasKeyHandler = (value: unknown): value is KeyAwareRenderable => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  return typeof (value as { handleKeyPress?: unknown }).handleKeyPress === 'function';
};

export const useKeyboardHandler = (handler: (key: KeyEvent) => void) => {
  const renderer = useRenderer();

  useKeyboard((key: KeyEvent) => {
    const focusedRenderable = renderer?.currentFocusedRenderable;
    if (hasKeyHandler(focusedRenderable) && focusedRenderable.focused && focusedRenderable.handleKeyPress?.(key)) {
      return;
    }
    handler(key);
  });
};
