import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useTheme } from '../hooks/useTheme.js';

interface ArticlePageProps {
  articleId: string;
  onBack: () => void;
}

export const ArticlePage = ({ articleId, onBack }: ArticlePageProps) => {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
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

  if (loading) {
    return (
      <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
        <text content="Loading article..." style={theme.styles.loading} />
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

  if (!article) {
    return (
      <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
        <text content="Article not found" style={{ fg: 'yellow' }} />
        <text content="Press Esc to go back" style={{ fg: 'gray', marginTop: 1 }} />
      </box>
    );
  }

  return (
    <box style={{ flexDirection: "column", height: "100%", width: "100%", padding: 2 }}>
      {/* Article Header */}
      <box style={{ flexDirection: "column", marginBottom: 2, border: true, paddingBottom: 1 }}>
        <text content={article.title || 'Article Title'} style={{...theme.styles.title, marginBottom: 1}} />
        <text 
          content={`By ${article.author?.name || 'Unknown Author'} - ${article.publishedDate || 'Date Unknown'}`} 
          style={theme.styles.muted} 
        />
        {article.subtitle && (
          <text content={article.subtitle} style={{...theme.styles.subtitle, marginTop: 1}} />
        )}
        <box style={{ flexDirection: "row", marginTop: 1 }}>
          <text content={`❤️ ${article.reactions?.count || 0}`} style={{ fg: 'red', marginRight: 2 }} />
          <text content={`💬 ${article.comments?.count || 0}`} style={{ fg: 'blue', marginRight: 2 }} />
          <text content={`👁️ ${article.views || 0} views`} style={{ fg: 'green' }} />
        </box>
      </box>

      {/* Article Content */}
      <scrollbox style={{ height: "100%", width: "100%" }}>
        <box style={{ flexDirection: "column", padding: 1 }}>
          {article.content ? (
            <text content={article.content} style={{ fg: 'white' }} />
          ) : (
            <box style={{ flexDirection: "column" }}>
              <text content="📰 Article Content" style={{ fg: 'green', attributes: 1, marginBottom: 1 }} />
              <text content="This is a placeholder for the article content." style={{ fg: 'white', marginBottom: 1 }} />
              <text content="The actual article content would be displayed here when" style={{ fg: 'white', marginBottom: 1 }} />
              <text content="we have proper article schema and content parsing." style={{ fg: 'white', marginBottom: 2 }} />
              
              <text content="🔧 Development Notes:" style={{ fg: 'yellow', attributes: 1, marginBottom: 1 }} />
              <text content="• Article ID: " style={{ fg: 'cyan' }} />
              <text content={articleId} style={{ fg: 'white', marginLeft: 2 }} />
              <text content="• API Response available - needs content parsing" style={{ fg: 'cyan', marginTop: 1 }} />
              <text content="• Add proper article schema in future iteration" style={{ fg: 'cyan', marginTop: 1 }} />
            </box>
          )}
        </box>
      </scrollbox>

      {/* Article Footer */}
      <box style={{ border: true, paddingTop: 1, marginTop: 1 }}>
        <text content="📖 Related Articles | 🏷️ Tags | 💬 Comments" style={{ fg: 'blue' }} />
      </box>
    </box>
  );
};