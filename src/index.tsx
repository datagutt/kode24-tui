import { useState, useEffect } from 'react';
import { createRoot, useKeyboard } from '@opentui/react';
import { createCliRenderer } from '@opentui/core';
import { api } from './services/api.js';
import { useNavigation } from './hooks/useNavigation.js';
import { Layout } from './components/Layout.js';
import { HelpOverlay } from './components/HelpOverlay.js';
import { TagsOverlay } from './components/TagsOverlay.js';
import { FrontpagePage } from './pages/FrontpagePage.js';
import { ArticlePage } from './pages/ArticlePage.js';
import { ListingsPage } from './pages/ListingsPage.js';
import { EventsPage } from './pages/EventsPage.js';
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
  const { navigation, navigateToPage, goBack } = useNavigation();

  const filterFrontpageByTag = (tagName: string) => {
    if (!frontpageData) return;
    const filtered: Frontpage = {
      ...frontpageData,
      latestArticles: frontpageData.latestArticles.filter(article => {
        const tags = article.tags ? article.tags.split(',').map(tag => tag.trim().toLowerCase()) : [];
        return tags.includes(tagName.toLowerCase());
      }),
    };
    setFilteredFrontpageData(filtered);
  };

  const clearFilter = () => {
    setSelectedTagFilter(null);
    setFilteredFrontpageData(null);
  };

  const navigateToArticle = (articleId: string) => {
    setCurrentArticleId(articleId);
    navigateToPage('article');
  };

  // Global keyboard handler - only global keys here
  useKeyboard((key: KeyEvent) => {
    if (key.name === 'q') {
      process.exit(0);
    }

    if (key.name === 'escape') {
      if (showHelp) {
        setShowHelp(false);
      } else if (showTags) {
        setShowTags(false);
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

  if (error || !frontpageData) {
    return (
      <Layout currentPage={navigation.currentPage} breadcrumb={navigation.breadcrumb}>
        <box flexDirection="column" alignItems="center" justifyContent="center" height="100%" width="100%">
          <text content={error ? `Error: ${error}` : t('noDataAvailable')} style={{ fg: 'red' }} />
          <text content={t('pressQToQuit')} style={{ fg: 'gray' }} marginTop={1} />
        </box>
      </Layout>
    );
  }

  const handleTagSelect = (tagName: string) => {
    setSelectedTagFilter(tagName);
    filterFrontpageByTag(tagName);
  };

  const activeData = filteredFrontpageData || frontpageData;
  const overlaysOpen = showHelp || showTags;

  const renderCurrentPage = () => {
    switch (navigation.currentPage) {
      case 'frontpage':
        return (
          <FrontpagePage
            frontpageData={activeData}
            selectedTagFilter={selectedTagFilter}
            onNavigateToArticle={navigateToArticle}
            onNavigateToListings={() => navigateToPage('listings')}
            onNavigateToEvents={() => navigateToPage('events')}
            onToggleTags={() => setShowTags(true)}
            onClearFilter={clearFilter}
            isActive={!overlaysOpen}
          />
        );

      case 'article':
        return currentArticleId ? (
          <ArticlePage articleId={currentArticleId} onBack={goBack} />
        ) : (
          <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
            <text content={t('noArticleSelected')} style={{ fg: 'yellow' }} />
            <text content={t('pressEscToGoBack')} style={{ fg: 'gray', marginTop: 1 }} />
          </box>
        );

      case 'listings':
        return (
          <ListingsPage initialJobs={frontpageData.jobs} />
        );

      case 'events':
        return (
          <EventsPage events={frontpageData.events.upcomingEvents} />
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
