import { useState, useCallback } from 'react';
import type { Page, NavigationState } from '../types/index.js';

export const useNavigation = (initialPage: Page = 'frontpage') => {
  const [history, setHistory] = useState<NavigationState[]>([{
    currentPage: initialPage,
    selectedIndex: 0,
    selectedSection: 0,
    frontpageSection: 'middle',
    breadcrumb: [initialPage],
  }]);

  const navigation = history[history.length - 1];

  const navigateToPage = useCallback((page: Page, resetSelection = true) => {
    setHistory(prev => {
      const current = prev[prev.length - 1];
      const newState = {
        currentPage: page,
        selectedIndex: resetSelection ? 0 : current.selectedIndex,
        selectedSection: resetSelection ? 0 : current.selectedSection,
        frontpageSection: resetSelection ? 'middle' : current.frontpageSection,
        breadcrumb: [...current.breadcrumb, page],
      };
      return [...prev, newState];
    });
  }, []);

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  const updateSelection = useCallback((selectedIndex: number, selectedSection?: number, frontpageSection?: 'left' | 'middle' | 'right') => {
    setHistory(prev => {
      const current = prev[prev.length - 1];
      const newState = {
        ...current,
        selectedIndex,
        selectedSection: selectedSection ?? current.selectedSection,
        frontpageSection: frontpageSection ?? current.frontpageSection,
      };
      return [...prev.slice(0, -1), newState];
    });
  }, []);

  const resetNavigation = useCallback(() => {
    setHistory([{
      currentPage: 'frontpage',
      selectedIndex: 0,
      selectedSection: 0,
      frontpageSection: 'middle',
      breadcrumb: ['frontpage'],
    }]);
  }, []);

  return {
    navigation,
    navigateToPage,
    goBack,
    updateSelection,
    resetNavigation,
  };
};