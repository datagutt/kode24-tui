import { useState, useCallback } from 'react';
import type { Page, NavigationState } from '../types/index.js';

export const useNavigation = (initialPage: Page = 'frontpage') => {
  const [history, setHistory] = useState<NavigationState[]>([{
    currentPage: initialPage,
    breadcrumb: [initialPage],
  }]);

  const navigation = history[history.length - 1];

  const navigateToPage = useCallback((page: Page) => {
    setHistory(prev => {
      const current = prev[prev.length - 1];
      return [...prev, {
        currentPage: page,
        breadcrumb: [...current.breadcrumb, page],
      }];
    });
  }, []);

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  // Top-level sections (the tab bar) are siblings, not a stack: switching one
  // resets history so Esc from a detail view returns to that section, not a
  // trail of previously visited tabs.
  const navigateToSection = useCallback((page: Page) => {
    setHistory([{ currentPage: page, breadcrumb: [page] }]);
  }, []);

  return { navigation, navigateToPage, navigateToSection, goBack };
};
