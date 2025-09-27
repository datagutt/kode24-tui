import React, { useState, useEffect } from 'react';
import { render, useKeyboard, useRenderer } from '@opentui/react';
import { api } from './services/api.js';
import { useNavigation } from './hooks/useNavigation.js';
import { Layout } from './components/Layout.js';
import { HelpOverlay } from './components/HelpOverlay.js';
import { FrontpagePage } from './pages/FrontpagePage.js';
import { ArticlePage } from './pages/ArticlePage.js';
import { ListingsPage } from './pages/ListingsPage.js';
import { TagsPage, popularTags } from './pages/TagsPage.js';
import type { Frontpage } from './types/index.js';

export const App = () => {
  const [frontpageData, setFrontpageData] = useState<Frontpage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [selectedTagName, setSelectedTagName] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const { navigation, navigateToPage, goBack, updateSelection } = useNavigation();
  const renderer = useRenderer();

  useKeyboard((key: any) => {
    // Check if there's a focused renderable that can handle keyboard events
    const focusedRenderable = renderer?.currentFocusedRenderable;
    if (focusedRenderable && typeof (focusedRenderable as any).handleKeyPress === 'function') {
      if ((focusedRenderable as any).handleKeyPress(key)) {
        return; // Event was handled by the focused renderable
      }
    }

    if (key.name === 'q') {
      process.exit(0);
    }

    if (key.name === 'escape') {
      if (showHelp) {
        setShowHelp(false);
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
      if (key.name === 'up' && navigation.selectedIndex > 0) {
        updateSelection(navigation.selectedIndex - 1);
      }
      if (key.name === 'down' && navigation.selectedIndex < frontpageData.latestArticles.length - 1) {
        updateSelection(navigation.selectedIndex + 1);
      }
      if (key.name === 'left' && navigation.selectedSection > 0) {
        updateSelection(navigation.selectedIndex, navigation.selectedSection - 1);
      }
      if (key.name === 'right' && navigation.selectedSection < frontpageData.frontpage.length - 1) {
        updateSelection(navigation.selectedIndex, navigation.selectedSection + 1);
      }
      if (key.name === 'return') {
        // Navigate to selected article
        const selectedArticle = frontpageData.latestArticles[navigation.selectedIndex];
        if (selectedArticle) {
          navigateToArticle(selectedArticle.id);
        }
      }
      if (key.name === 'l') {
        // Quick navigation to listings
        navigateToPage('listings');
      }
      if (key.name === 't') {
        // Quick navigation to tags
        navigateToPage('tags');
      }
      if (key.name === 'e') {
        // Quick navigation to events
        navigateToPage('events');
      }
    }

    // Navigation for tags
    if (navigation.currentPage === 'tags') {
      if (key.name === 'up' && navigation.selectedIndex > 0) {
        updateSelection(navigation.selectedIndex - 1);
      }
      if (key.name === 'down' && navigation.selectedIndex < popularTags.length - 1) {
        updateSelection(navigation.selectedIndex + 1);
      }
      if (key.name === 'return') {
        // Select the tag
        setSelectedTagName(popularTags[navigation.selectedIndex].name);
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

  const navigateToArticle = (articleId: string) => {
    setCurrentArticleId(articleId);
    navigateToPage('article');
  };

  const navigateToListings = () => {
    navigateToPage('listings');
  };

  const navigateToTags = () => {
    navigateToPage('tags');
  };

  const navigateToEvents = () => {
    navigateToPage('events');
  };

  if (loading) {
    return (
      <Layout currentPage={navigation.currentPage} breadcrumb={navigation.breadcrumb}>
        <box flexDirection="column" alignItems="center" justifyContent="center" height="100%" width="100%">
          <text content="Loading kode24.no frontpage..." style={{ fg: 'blue' }} />
        </box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout currentPage={navigation.currentPage} breadcrumb={navigation.breadcrumb}>
        <box flexDirection="column" alignItems="center" justifyContent="center" height="100%" width="100%">
          <text content={`Error: ${error}`} style={{ fg: 'red' }} />
          <text content="Press 'q' to quit" style={{ fg: 'gray' }} marginTop={1} />
        </box>
      </Layout>
    );
  }

  if (!frontpageData) {
    return (
      <Layout currentPage={navigation.currentPage} breadcrumb={navigation.breadcrumb}>
        <box flexDirection="column" alignItems="center" justifyContent="center" height="100%" width="100%">
          <text content="No data available" style={{ fg: 'yellow' }} />
        </box>
      </Layout>
    );
  }

  const renderCurrentPage = () => {
    switch (navigation.currentPage) {
      case 'frontpage':
        return (
          <FrontpagePage
            frontpageData={frontpageData}
            selectedSection={navigation.selectedSection}
            selectedArticle={navigation.selectedIndex}
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
            <text content="No article selected" style={{ fg: 'yellow' }} />
            <text content="Press Esc to go back" style={{ fg: 'gray', marginTop: 1 }} />
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
      
      case 'tags':
        return (
          <TagsPage
            selectedTag={navigation.selectedIndex}
            selectedTagName={selectedTagName}
            onTagSelect={(tag: string) => {
              // Could navigate to tag articles view
              console.log('Selected tag:', tag);
            }}
          />
        );
      
      case 'events':
        return (
          <box flexDirection="column" alignItems="center" justifyContent="center" height="100%" width="100%">
            <text content="Events Page (Coming Soon)" style={{ fg: 'cyan' }} />
            <text content="Press Esc to go back" style={{ fg: 'gray' }} marginTop={1} />
          </box>
        );
      
      default:
        return (
          <box flexDirection="column" alignItems="center" justifyContent="center" height="100%" width="100%">
            <text content="Unknown Page" style={{ fg: 'red' }} />
          </box>
        );
    }
  };

  return (
    <Layout currentPage={navigation.currentPage} breadcrumb={navigation.breadcrumb}>
      {renderCurrentPage()}
      {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}
    </Layout>
  );
};

render(<App />);