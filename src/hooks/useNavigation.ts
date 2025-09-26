import { useState, useCallback } from 'react';
import type { Page, NavigationState } from '../types/index.js';

export const useNavigation = (initialPage: Page = 'frontpage') => {
  const [navigation, setNavigation] = useState<NavigationState>({
    currentPage: initialPage,
    selectedIndex: 0,
    selectedSection: 0,
    breadcrumb: [initialPage],
  });

  const navigateToPage = useCallback((page: Page, resetSelection = true) => {
    setNavigation(prev => ({
      ...prev,
      currentPage: page,
      selectedIndex: resetSelection ? 0 : prev.selectedIndex,
      selectedSection: resetSelection ? 0 : prev.selectedSection,
      breadcrumb: [...prev.breadcrumb, page],
    }));
  }, []);

  const goBack = useCallback(() => {
    setNavigation(prev => {
      if (prev.breadcrumb.length <= 1) return prev;
      
      const newBreadcrumb = prev.breadcrumb.slice(0, -1);
      const previousPage = newBreadcrumb[newBreadcrumb.length - 1] as Page;
      
      return {
        ...prev,
        currentPage: previousPage,
        selectedIndex: 0,
        selectedSection: 0,
        breadcrumb: newBreadcrumb,
      };
    });
  }, []);

  const updateSelection = useCallback((selectedIndex: number, selectedSection?: number) => {
    setNavigation(prev => ({
      ...prev,
      selectedIndex,
      selectedSection: selectedSection ?? prev.selectedSection,
    }));
  }, []);

  const resetNavigation = useCallback(() => {
    setNavigation({
      currentPage: 'frontpage',
      selectedIndex: 0,
      selectedSection: 0,
      breadcrumb: ['frontpage'],
    });
  }, []);

  return {
    navigation,
    navigateToPage,
    goBack,
    updateSelection,
    resetNavigation,
  };
};