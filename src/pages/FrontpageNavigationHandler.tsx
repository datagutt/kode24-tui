import type { KeyEvent, Frontpage, Page } from '../types/index.js';
import { popularTags } from './TagsPage.js';

interface NavigationState {
  selectedIndex: number;
  selectedSection: number;
  frontpageSection?: 'left' | 'middle' | 'right';
}

interface FrontpageNavigationHandlerOptions {
  navigation: NavigationState;
  frontpageData: Frontpage;
  filteredFrontpageData: Frontpage | null;
  selectedTagFilter: string | null;
  updateSelection: (selectedIndex: number, selectedSection?: number, frontpageSection?: 'left' | 'middle' | 'right') => void;
  onNavigateToArticle: (articleId: string) => void;
  onNavigateToPage: (page: Page) => void;
  onFilterByTag: (tagName: string) => void;
  onClearFilter: () => void;
}

export const createFrontpageNavigationHandler = (options: FrontpageNavigationHandlerOptions) => {
  return (key: KeyEvent): boolean => {
    const {
      navigation,
      frontpageData,
      filteredFrontpageData,
      selectedTagFilter,
      updateSelection,
      onNavigateToArticle,
      onNavigateToPage,
      onFilterByTag,
      onClearFilter,
    } = options;

    const currentSection = navigation.frontpageSection || 'middle';
    const activeData = filteredFrontpageData || frontpageData;

    if (key.name === 'tab') {
      const sections = ['left', 'middle', 'right'] as const;
      const currentIndex = sections.indexOf(currentSection);
      const nextIndex = (currentIndex + 1) % sections.length;
      updateSelection(navigation.selectedIndex, navigation.selectedSection, sections[nextIndex]);
      return true;
    }

    if (key.name === 'c' && selectedTagFilter) {
      onClearFilter();
      return true;
    }

    if (key.name === 'l') {
      onNavigateToPage('listings');
      return true;
    }

    if (key.name === 'e') {
      onNavigateToPage('events');
      return true;
    }

    if (currentSection === 'left') {
      return handleLeftSidebar(key, navigation, updateSelection, onFilterByTag);
    }

    if (currentSection === 'middle') {
      return handleMiddleSection(key, navigation, activeData, updateSelection, onNavigateToArticle);
    }

    if (currentSection === 'right') {
      return handleRightSidebar(key, navigation, frontpageData, updateSelection, onNavigateToPage);
    }

    return false;
  };
};

const handleLeftSidebar = (
  key: KeyEvent,
  navigation: NavigationState,
  updateSelection: (selectedIndex: number, selectedSection?: number, frontpageSection?: 'left' | 'middle' | 'right') => void,
  onFilterByTag: (tagName: string) => void
): boolean => {
  if (key.name === 'up' && navigation.selectedIndex > 0) {
    updateSelection(navigation.selectedIndex - 1, navigation.selectedSection, 'left');
    return true;
  }

  if (key.name === 'down' && navigation.selectedIndex < popularTags.length - 1) {
    updateSelection(navigation.selectedIndex + 1, navigation.selectedSection, 'left');
    return true;
  }

  if (key.name === 'return') {
    const selectedTag = popularTags[navigation.selectedIndex];
    onFilterByTag(selectedTag.name);
    updateSelection(0, 0, 'middle');
    return true;
  }

  return false;
};

const handleMiddleSection = (
  key: KeyEvent,
  navigation: NavigationState,
  activeData: Frontpage,
  updateSelection: (selectedIndex: number, selectedSection?: number, frontpageSection?: 'left' | 'middle' | 'right') => void,
  onNavigateToArticle: (articleId: string) => void
): boolean => {
  if (key.name === 'up' && navigation.selectedIndex > 0) {
    updateSelection(navigation.selectedIndex - 1, navigation.selectedSection, 'middle');
    return true;
  }

  if (key.name === 'down' && navigation.selectedIndex < activeData.latestArticles.length - 1) {
    updateSelection(navigation.selectedIndex + 1, navigation.selectedSection, 'middle');
    return true;
  }

  if (key.name === 'left' && navigation.selectedSection > 0) {
    const nextSection = navigation.selectedSection - 1;
    const nextIndex = findArticleIndexInSection(activeData, nextSection);
    const clamped = Math.min(Math.max(nextIndex, 0), activeData.latestArticles.length - 1);
    updateSelection(clamped, nextSection, 'middle');
    return true;
  }

  if (key.name === 'right' && navigation.selectedSection < activeData.frontpage.length - 1) {
    const nextSection = navigation.selectedSection + 1;
    const nextIndex = findArticleIndexInSection(activeData, nextSection);
    const clamped = Math.min(Math.max(nextIndex, 0), activeData.latestArticles.length - 1);
    updateSelection(clamped, nextSection, 'middle');
    return true;
  }

  if (key.name === 'return') {
    const selectedArticle = activeData.latestArticles[navigation.selectedIndex];
    if (selectedArticle) {
      onNavigateToArticle(selectedArticle.id);
    }
    return true;
  }

  return false;
};

const findArticleIndexInSection = (activeData: Frontpage, sectionIndex: number): number => {
  const section = activeData.frontpage[sectionIndex];
  const firstArticleId = section?.articles[0]?.id;
  
  if (!firstArticleId) {
    return 0;
  }

  const matchIndex = activeData.latestArticles.findIndex(article => article.id === firstArticleId);
  return matchIndex >= 0 ? matchIndex : 0;
};

const handleRightSidebar = (
  key: KeyEvent,
  navigation: NavigationState,
  frontpageData: Frontpage,
  updateSelection: (selectedIndex: number, selectedSection?: number, frontpageSection?: 'left' | 'middle' | 'right') => void,
  onNavigateToPage: (page: Page) => void
): boolean => {
  const totalItems = frontpageData.jobs.length + frontpageData.events.upcomingEvents.length + frontpageData.newestComments.length + 1;

  if (key.name === 'up' && navigation.selectedIndex > 0) {
    updateSelection(navigation.selectedIndex - 1, navigation.selectedSection, 'right');
    return true;
  }

  if (key.name === 'down' && navigation.selectedIndex < totalItems - 1) {
    updateSelection(navigation.selectedIndex + 1, navigation.selectedSection, 'right');
    return true;
  }

  if (key.name === 'return') {
    if (navigation.selectedIndex < frontpageData.jobs.length || navigation.selectedIndex === totalItems - 1) {
      onNavigateToPage('listings');
    }
    return true;
  }

  return false;
};
