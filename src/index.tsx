import React, { useState, useEffect } from 'react';
import { render, useKeyboard, useRenderer } from '@opentui/react';
import { api } from './services/api.js';
import { useNavigation } from './hooks/useNavigation.js';
import { Layout } from './components/Layout.js';
import { HelpOverlay } from './components/HelpOverlay.js';
import { FrontpagePage } from './pages/FrontpagePage.js';
import { ArticlePage } from './pages/ArticlePage.js';
import { ListingsPage } from './pages/ListingsPage.js';
import { popularTags } from './pages/TagsPage.js';
import type { Frontpage, Article } from './types/index.js';
import { t } from './i18n/index.js';

type KeyEvent = {
  name: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
};

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

export const App = () => {
  const [frontpageData, setFrontpageData] = useState<Frontpage | null>(null);
  const [filteredFrontpageData, setFilteredFrontpageData] = useState<Frontpage | null>(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [selectedTagName, setSelectedTagName] = useState<string | null>(null);
  const { navigation, navigateToPage, goBack, updateSelection } = useNavigation();
  const renderer = useRenderer();

  useKeyboard((key: KeyEvent) => {
    // Check if there's a focused renderable that can handle keyboard events
    const focusedRenderable = renderer?.currentFocusedRenderable;
    if (hasKeyHandler(focusedRenderable) && focusedRenderable.focused && focusedRenderable.handleKeyPress?.(key)) {
      return; // Event was handled by the focused renderable
    }

    if (key.name === 'q') {
      process.exit(0);
    }

    if (key.name === 'escape') {
      if (showHelp) {
        setShowHelp(false);
      } else if (selectedTagFilter && navigation.currentPage === 'frontpage') {
        // Clear tag filter when on frontpage
        setSelectedTagFilter(null);
        setFilteredFrontpageData(null);
        updateSelection(0, 0, 'middle');
      } else {
        goBack();
      }
      return;
    }

    if (key.name === 'h') {
      setShowHelp(!showHelp);
      return;
    }

    // Navigation for frontpage
    if (navigation.currentPage === 'frontpage' && frontpageData) {
      const currentSection = navigation.frontpageSection || 'middle';
      const activeData = filteredFrontpageData || frontpageData;
      
      if (key.name === 'tab') {
        // Tab between sections: left -> middle -> right -> left
        const sections = ['left', 'middle', 'right'] as const;
        const currentIndex = sections.indexOf(currentSection);
        const nextIndex = (currentIndex + 1) % sections.length;
        updateSelection(navigation.selectedIndex, navigation.selectedSection, sections[nextIndex]);
        return;
      }

      if (currentSection === 'left') {
        // Left sidebar navigation (tags)
        if (key.name === 'up' && navigation.selectedIndex > 0) {
          updateSelection(navigation.selectedIndex - 1, navigation.selectedSection, 'left');
        }
        if (key.name === 'down' && navigation.selectedIndex < popularTags.length - 1) {
          updateSelection(navigation.selectedIndex + 1, navigation.selectedSection, 'left');
        }
        if (key.name === 'return') {
          // Filter frontpage by selected tag instead of navigating to tags page
          const selectedTag = popularTags[navigation.selectedIndex];
          setSelectedTagFilter(selectedTag.name);
          filterFrontpageByTag(selectedTag.name);
          // Switch to middle section to show filtered results
          updateSelection(0, 0, 'middle');
        }
      } else if (currentSection === 'middle') {
        // Middle section navigation (main articles)
        if (key.name === 'up' && navigation.selectedIndex > 0) {
          updateSelection(navigation.selectedIndex - 1, navigation.selectedSection, 'middle');
        }
        if (key.name === 'down' && navigation.selectedIndex < activeData.latestArticles.length - 1) {
          updateSelection(navigation.selectedIndex + 1, navigation.selectedSection, 'middle');
        }
        if (key.name === 'left' && navigation.selectedSection > 0) {
          const nextSection = navigation.selectedSection - 1;
          const nextIndex = (() => {
            const section = activeData.frontpage[nextSection];
            const firstArticleId = section?.articles[0]?.id;
            if (!firstArticleId) {
              return navigation.selectedIndex;
            }
            const matchIndex = activeData.latestArticles.findIndex(
              (article) => article.id === firstArticleId
            );
            if (matchIndex >= 0) {
              return matchIndex;
            }
            return navigation.selectedIndex;
          })();
          const clamped = Math.min(
            Math.max(nextIndex, 0),
            activeData.latestArticles.length - 1
          );
          updateSelection(clamped, nextSection, 'middle');
        }
        if (key.name === 'right' && navigation.selectedSection < activeData.frontpage.length - 1) {
          const nextSection = navigation.selectedSection + 1;
          const nextIndex = (() => {
            const section = activeData.frontpage[nextSection];
            const firstArticleId = section?.articles[0]?.id;
            if (!firstArticleId) {
              return navigation.selectedIndex;
            }
            const matchIndex = activeData.latestArticles.findIndex(
              (article) => article.id === firstArticleId
            );
            if (matchIndex >= 0) {
              return matchIndex;
            }
            return navigation.selectedIndex;
          })();
          const clamped = Math.min(
            Math.max(nextIndex, 0),
            activeData.latestArticles.length - 1
          );
          updateSelection(clamped, nextSection, 'middle');
        }
        if (key.name === 'return') {
          // Navigate to selected article
          const selectedArticle = activeData.latestArticles[navigation.selectedIndex];
          if (selectedArticle) {
            navigateToArticle(selectedArticle.id);
          }
        }
      } else if (currentSection === 'right') {
        // Right sidebar navigation (jobs/events)
        const totalItems = frontpageData.jobs.length + frontpageData.events.upcomingEvents.length + frontpageData.newestComments.length + 1; // +1 for "view all jobs"
        if (key.name === 'up' && navigation.selectedIndex > 0) {
          updateSelection(navigation.selectedIndex - 1, navigation.selectedSection, 'right');
        }
        if (key.name === 'down' && navigation.selectedIndex < totalItems - 1) {
          updateSelection(navigation.selectedIndex + 1, navigation.selectedSection, 'right');
        }
        if (key.name === 'return') {
          // Handle selection based on index
          if (navigation.selectedIndex < frontpageData.jobs.length) {
            // Selected a job
            navigateToPage('listings');
          } else if (navigation.selectedIndex === totalItems - 1) {
            // Selected "view all jobs"
            navigateToPage('listings');
          }
        }
      }

      // Global shortcuts
      if (key.name === 'l') {
        navigateToPage('listings');
      }
      if (key.name === 'e') {
        navigateToPage('events');
      }
      if (key.name === 'c') {
        // Clear filter shortcut
        if (selectedTagFilter) {
          setSelectedTagFilter(null);
          setFilteredFrontpageData(null);
          updateSelection(0, 0, 'middle');
        }
      }
    }
  });

  useEffect(() => {
    async function fetchFrontpage() {
      try {
        setLoading(true);
        const data = await api.fetchFrontpage();
        setFrontpageData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchFrontpage();
  }, []);

  useEffect(() => {
    if (navigation.currentPage !== 'article') {
      setCurrentArticleId(null);
    }
  }, [navigation.currentPage]);

  useEffect(() => {
    // Clear filter when leaving frontpage and returning to it
    if (navigation.currentPage !== 'frontpage' && selectedTagFilter) {
      setSelectedTagFilter(null);
      setFilteredFrontpageData(null);
    }
  }, [navigation.currentPage, selectedTagFilter]);

  const filterFrontpageByTag = (tagName: string) => {
    if (!frontpageData) return;

    const filterArticlesByTag = (articles: Article[]) => {
      return articles.filter(article => {
        const tags = article.tags ? article.tags.split(',').map((tag: string) => tag.trim().toLowerCase()) : [];
        return tags.includes(tagName.toLowerCase());
      });
    };

    const filterSectionsByTag = (sections: Frontpage["frontpage"]) => {
      return sections.map(section => ({
        ...section,
        articles: filterArticlesByTag(section.articles)
      })).filter(section => section.articles.length > 0);
    };

    const filtered: Frontpage = {
      ...frontpageData,
      latestArticles: filterArticlesByTag(frontpageData.latestArticles),
      frontpage: filterSectionsByTag(frontpageData.frontpage)
    };

    setFilteredFrontpageData(filtered);
  };

  const navigateToArticle = (articleId: string) => {
    setCurrentArticleId(articleId);
    navigateToPage('article');
  };

  const navigateToListings = () => {
    navigateToPage('listings');
  };

  const navigateToEvents = () => {
    navigateToPage('events');
  };

  if (loading) {
    return (
      <Layout currentPage={navigation.currentPage} breadcrumb={navigation.breadcrumb}>
        <box flexDirection="column" alignItems="center" justifyContent="center" height="100%" width="100%">
          <text content={t('loadingFrontpage')} style={{ fg: 'blue' }} />
        </box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout currentPage={navigation.currentPage} breadcrumb={navigation.breadcrumb}>
        <box flexDirection="column" alignItems="center" justifyContent="center" height="100%" width="100%">
          <text content={`Error: ${error}`} style={{ fg: 'red' }} />
          <text content={t('pressQToQuit')} style={{ fg: 'gray' }} marginTop={1} />
        </box>
      </Layout>
    );
  }

  if (!frontpageData) {
    return (
      <Layout currentPage={navigation.currentPage} breadcrumb={navigation.breadcrumb}>
        <box flexDirection="column" alignItems="center" justifyContent="center" height="100%" width="100%">
          <text content={t('noDataAvailable')} style={{ fg: 'yellow' }} />
        </box>
      </Layout>
    );
  }

  const renderCurrentPage = () => {
    switch (navigation.currentPage) {
      case 'frontpage':
        const activeData = filteredFrontpageData || frontpageData;
        const maxArticleIndex = Math.max(0, activeData.latestArticles.length - 1);
        const safeSelectedArticle = Math.min(navigation.selectedIndex, maxArticleIndex);
        
        return (
          <FrontpagePage
            frontpageData={activeData}
            selectedSection={navigation.selectedSection}
            selectedArticle={navigation.frontpageSection === 'middle' ? safeSelectedArticle : 0}
            frontpageSection={navigation.frontpageSection || 'middle'}
            selectedTagIndex={navigation.frontpageSection === 'left' ? navigation.selectedIndex : 0}
            selectedSidebarIndex={navigation.frontpageSection === 'right' ? navigation.selectedIndex : 0}
            selectedTagFilter={selectedTagFilter}
            onNavigateToArticle={navigateToArticle}
            onNavigateToListings={navigateToListings}
          />
        );
      
      case 'article':
        return currentArticleId ? (
          <ArticlePage
            articleId={currentArticleId}
            onBack={goBack}
          />
        ) : (
          <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
            <text content={t('noArticleSelected')} style={{ fg: 'yellow' }} />
            <text content={t('pressEscToGoBack')} style={{ fg: 'gray', marginTop: 1 }} />
          </box>
        );
      
      case 'listings':
        return (
          <ListingsPage
            initialJobs={frontpageData.jobs}
            selectedJob={navigation.selectedIndex}
            onJobSelect={(jobId: string) => {
              // Could navigate to job details page in future
              console.log('Selected job:', jobId);
            }}
          />
        );
      
      case 'events':
        return (
          <box flexDirection="column" alignItems="center" justifyContent="center" height="100%" width="100%">
            <text content={t('eventsComingSoon')} style={{ fg: 'cyan' }} />
            <text content={t('pressEscToGoBack')} style={{ fg: 'gray' }} marginTop={1} />
          </box>
        );
      
      default:
        return (
          <box flexDirection="column" alignItems="center" justifyContent="center" height="100%" width="100%">
            <text content={t('unknownPage')} style={{ fg: 'red' }} />
          </box>
        );
    }
  };

  return (
    <Layout currentPage={navigation.currentPage} breadcrumb={navigation.breadcrumb}>
      {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}
      {renderCurrentPage()}
    </Layout>
  );
};

render(<App />);