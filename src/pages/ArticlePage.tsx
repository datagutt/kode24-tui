import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api.js';
import { useTheme } from '../hooks/useTheme.js';
import { convertHTMLToOpenTUI } from '../utils/htmlToOpenTUI.js';
import type { Lab } from '../types/index.js';
import type { ScrollBoxRenderable } from '@opentui/core';
import { t } from '../i18n/index.js';

interface ArticlePageProps {
  articleId: string;
  onBack: () => void;
}

export const ArticlePage = ({ articleId, onBack }: ArticlePageProps) => {
  const [article, setArticle] = useState<Lab | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const scrollboxRef = useRef<ScrollBoxRenderable | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.fetchArticle(articleId);
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [articleId]);

  // Focus the scrollbox when article loads
  useEffect(() => {
    if (article && scrollboxRef.current) {
      scrollboxRef.current.focus();
    }
  }, [article]);

  if (loading) {
    return (
      <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
        <text content={t('loadingArticle')} style={theme.styles.loading} />
      </box>
    );
  }

  if (error) {
    return (
      <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
        <text content={`Error: ${error}`} style={{ fg: 'red' }} />
        <text content="Press Esc to go back" style={{ fg: 'gray', marginTop: 1 }} />
      </box>
    );
  }

  if (!article || !article.page) {
    return (
      <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
        <text content="Article not found or invalid data" style={{ fg: 'yellow' }} />
        <text content="Press Esc to go back" style={{ fg: 'gray', marginTop: 1 }} />
      </box>
    );
  }

  // Check if essential data is missing
  if (!article.page.fields?.title && !article.page.fields?.bodytext) {
    return (
      <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
        <text content="Article content could not be loaded" style={{ fg: 'red' }} />
        <text content="Missing title and content data" style={{ fg: 'gray', marginTop: 1 }} />
        <text content="Press Esc to go back" style={{ fg: 'gray', marginTop: 1 }} />
      </box>
    );
  }

  return (
    <box style={{ flexDirection: "column", height: "100%", width: "100%", padding: 2 }}>
      {/* Article Header */}
      <box style={{ flexDirection: "column", marginBottom: 2, border: true, paddingBottom: 1 }}>
        {article.page.fields?.title ? (
          <text content={article.page.fields.title} style={{...theme.styles.title, marginBottom: 1}} />
        ) : (
          <text content="Article title unavailable" style={{ fg: 'red', marginBottom: 1 }} />
        )}
        
        <text 
          content={`Article ID: ${article.page.id} - ${article.page.fields?.published ? new Date(parseInt(article.page.fields.published) * 1000).toLocaleDateString() : 'Date not available'}`} 
          style={theme.styles.muted} 
        />
        
        {article.page.fields?.subtitle && (
          <text content={article.page.fields.subtitle} style={{...theme.styles.subtitle, marginTop: 1}} />
        )}
        
        <box style={{ flexDirection: "row", marginTop: 1 }}>
          {article.page.fields?.readTime && (
            <text content={`📖 ${article.page.fields.readTime} min read`} style={{ fg: 'green', marginRight: 2 }} />
          )}
          <text content={`📄 ${article.page.type}`} style={{ fg: 'blue', marginRight: 2 }} />
          <text content={`📊 ${article.page.status}`} style={{ fg: 'yellow' }} />
        </box>
      </box>

      {/* Article Content */}
      <scrollbox ref={scrollboxRef} style={{ height: "100%", width: "100%" }}>
        <box style={{ flexDirection: "column", padding: 1 }}>
          <text content="📰 Article Content" style={{ fg: 'green', attributes: 1, marginBottom: 1 }} />
          
          {/* Article body/content */}
          {article.page.fields?.bodytext ? (
            <box style={{ flexDirection: "column", marginBottom: 2 }}>
              {convertHTMLToOpenTUI(article.page.fields.bodytext)}
            </box>
          ) : (
            <box style={{ flexDirection: "column", marginBottom: 2 }}>
              <text content="⚠️ Article content is not available" style={{ fg: 'yellow', marginBottom: 1 }} />
              <text content="This could be due to paywall or content formatting issues" style={{ fg: 'gray' }} />
            </box>
          )}
          
          {/* Article URL */}
          {article.page.fields?.published_url && (
            <box style={{ flexDirection: "column", marginTop: 2 }}>
              <text content="🔗 Article URL:" style={{ fg: 'cyan', attributes: 1, marginBottom: 1 }} />
              <text content={`https://www.kode24.no${article.page.fields.published_url}`} style={{ fg: 'blue' }} />
            </box>
          )}
          
          {/* Development info */}
          <box style={{ flexDirection: "column", marginTop: 2, border: true, padding: 1 }}>
            <text content="🔧 Development Info:" style={{ fg: 'yellow', attributes: 1, marginBottom: 1 }} />
            <text content={`Article ID: ${articleId}`} style={{ fg: 'cyan', marginBottom: 1 }} />
            <text content={`API Response Keys: ${Object.keys(article).join(', ')}`} style={{ fg: 'cyan', marginBottom: 1 }} />
            <text content={`Type: ${article.page.type}`} style={{ fg: 'cyan', marginBottom: 1 }} />
            {article.page.fields?.published_url && (
              <text content={`URL: ${article.page.fields.published_url}`} style={{ fg: 'cyan' }} />
            )}
          </box>
        </box>
      </scrollbox>


    </box>
  );
};