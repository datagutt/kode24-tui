import { useState, useCallback } from 'react';
import type { Page, NavigationState } from '../types/index.js';

export const useNavigation = (initialPage: Page = 'frontpage') => {
  const [history, setHistory] = useState<NavigationState[]>([{
    currentPage: initialPage,
    selectedIndex: 0,
    selectedSection: 0,
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

  const updateSelection = useCallback((selectedIndex: number, selectedSection?: number) => {
    setHistory(prev => {
      const current = prev[prev.length - 1];
      const newState = {
        ...current,
        selectedIndex,
        selectedSection: selectedSection ?? current.selectedSection,
      };
      return [...prev.slice(0, -1), newState];
    });
  }, []);

  const resetNavigation = useCallback(() => {
    setHistory([{
      currentPage: 'frontpage',
      selectedIndex: 0,
      selectedSection: 0,
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