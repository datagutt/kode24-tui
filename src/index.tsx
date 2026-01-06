import { useState, useEffect } from 'react';
import { createRoot } from '@opentui/react';
import { createCliRenderer } from '@opentui/core';
import { api } from './services/api.js';
import { useNavigation } from './hooks/useNavigation.js';
import { useKeyboardHandler } from './hooks/useKeyboardHandler.js';
import { createFrontpageNavigationHandler } from './pages/FrontpageNavigationHandler.js';
import { Layout } from './components/Layout.js';
import { HelpOverlay } from './components/HelpOverlay.js';
import { TagsOverlay } from './components/TagsOverlay.js';
import { FrontpagePage } from './pages/FrontpagePage.js';
import { ArticlePage } from './pages/ArticlePage.js';
import { ListingsPage } from './pages/ListingsPage.js';
import type { Frontpage, Article, KeyEvent } from './types/index.js';
import { t } from './i18n/index.js';

export const App = () => {
  const [frontpageData, setFrontpageData] = useState<Frontpage | null>(null);
  const [filteredFrontpageData, setFilteredFrontpageData] = useState<Frontpage | null>(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const { navigation, navigateToPage, goBack, updateSelection } = useNavigation();

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

  const clearFilter = () => {
    setSelectedTagFilter(null);
    setFilteredFrontpageData(null);
    updateSelection(0, 0, 'middle');
  };

  const navigateToArticle = (articleId: string) => {
    setCurrentArticleId(articleId);
    navigateToPage('article');
  };

  useKeyboardHandler((key: KeyEvent) => {
    if (key.name === 'q') {
      process.exit(0);
    }

    if (key.name === 'escape') {
      if (showHelp) {
        setShowHelp(false);
      } else if (selectedTagFilter && navigation.currentPage === 'frontpage') {
        clearFilter();
      } else {
        goBack();
      }
      return;
    }

    if (key.name === 'h') {
      setShowHelp(!showHelp);
      return;
    }

    if (navigation.currentPage === 'frontpage' && frontpageData && !showTags) {
      const handler = createFrontpageNavigationHandler({
        navigation,
        frontpageData,
        filteredFrontpageData,
        selectedTagFilter,
        updateSelection,
        onNavigateToArticle: navigateToArticle,
        onNavigateToPage: navigateToPage,
        onToggleTags: () => setShowTags(true),
        onClearFilter: clearFilter,
      });
      handler(key);
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
    if (navigation.currentPage !== 'frontpage' && selectedTagFilter) {
      setSelectedTagFilter(null);
      setFilteredFrontpageData(null);
    }
  }, [navigation.currentPage, selectedTagFilter]);

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
      case 'frontpage': {
        const activeData = filteredFrontpageData || frontpageData;
        const maxArticleIndex = Math.max(0, activeData.latestArticles.length - 1);
        const safeSelectedArticle = Math.min(navigation.selectedIndex, maxArticleIndex);
        
        return (
          <FrontpagePage
            frontpageData={activeData}
            selectedSection={navigation.selectedSection}
            selectedArticle={navigation.frontpageSection === 'middle' ? safeSelectedArticle : 0}
            frontpageSection={navigation.frontpageSection || 'middle'}
            selectedSidebarIndex={navigation.frontpageSection === 'right' ? navigation.selectedIndex : 0}
            selectedTagFilter={selectedTagFilter}
            onNavigateToArticle={navigateToArticle}
            onNavigateToListings={() => navigateToPage('listings')}
          />
        );
      }
      
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

  const handleTagSelect = (tagName: string) => {
    setSelectedTagFilter(tagName);
    filterFrontpageByTag(tagName);
    updateSelection(0, 0, 'middle');
  };

  return (
    <Layout currentPage={navigation.currentPage} breadcrumb={navigation.breadcrumb}>
      {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}
      {showTags && (
        <TagsOverlay 
          onClose={() => setShowTags(false)} 
          onSelectTag={handleTagSelect}
          selectedTagFilter={selectedTagFilter}
        />
      )}
      {renderCurrentPage()}
    </Layout>
  );
};

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);