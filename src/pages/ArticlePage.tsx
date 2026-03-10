import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useTheme } from '../hooks/useTheme.js';
import { useScrollboxFocus } from '../hooks/useScrollboxFocus.js';
import { convertHTMLToOpenTUI } from '../utils/htmlToOpenTUI.js';
import type { Lab } from '../types/index.js';
import { t } from '../i18n/index.js';
import ScrollSurface from '../components/ScrollSurface.js';

interface ArticlePageProps {
  articleId: string;
  onBack: () => void;
}

export const ArticlePage = ({ articleId }: ArticlePageProps) => {
  const [article, setArticle] = useState<Lab | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const scrollboxRef = useScrollboxFocus([article]);

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

  if (loading) {
    return (
      <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%", backgroundColor: theme.colors.background.base }}>
        <text content={t('loadingArticle')} style={{ fg: theme.status.loading }} />
      </box>
    );
  }

  if (error) {
    return (
      <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%", backgroundColor: theme.colors.background.base }}>
        <text content={t('articleLoadFailed')} style={{ fg: theme.status.error }} />
        <text content={error} style={{ fg: theme.colors.text.muted, marginTop: 1 }} />
        <text content={t('pressEscToGoBack')} style={{ fg: theme.colors.text.muted, marginTop: 1 }} />
      </box>
    );
  }

  if (!article?.page?.fields?.title && !article?.page?.fields?.bodytext) {
    return (
      <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%", backgroundColor: theme.colors.background.base }}>
        <text content={t('articleNotFound')} style={{ fg: theme.status.warning }} />
        <text content={t('pressEscToGoBack')} style={{ fg: theme.colors.text.muted, marginTop: 1 }} />
      </box>
    );
  }

  const fields = article!.page.fields;
  const publishedTimestamp = fields?.published ? Number(fields.published) * 1000 : undefined;
  const publishedDate = publishedTimestamp ? new Date(publishedTimestamp) : undefined;
  const readTime = fields?.readTime ?? fields?.stats_read_time;
  const tags = fields?.tags ? fields.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
  const author = fields?.created_by_name ?? fields?.created_by ?? '';
  const shareUrl = fields?.published_url ? `https://www.kode24.no${fields.published_url}` : undefined;

  // Metadata bar: author · date · read time · url
  const metaParts = [
    author ? `👤 ${author}` : null,
    publishedDate ? `📅 ${publishedDate.toLocaleDateString()}` : null,
    readTime ? `⏱️ ${readTime} min` : null,
  ].filter(Boolean).join('  ');

  return (
    <box style={{ flexDirection: "column", height: "100%", width: "100%", padding: 1, backgroundColor: theme.colors.background.base }}>
      {/* Article header bar */}
      <box style={{ flexDirection: "column", border: true, borderColor: theme.colors.border.subtle, backgroundColor: theme.colors.surface.card, padding: 2, marginBottom: 1 }}>
        <text content={fields?.title ?? t('articleTitleUnavailable')} style={{ fg: theme.article.title, attributes: 1 }} />
        {fields?.subtitle && (
          <text content={fields.subtitle} style={{ fg: theme.article.subtitle, marginTop: 1 }} />
        )}
        <text content={metaParts} style={{ fg: theme.colors.text.secondary, marginTop: 1 }} />
        {tags.length > 0 && (
          <text content={`🏷️ ${tags.join(', ')}`} style={{ fg: theme.tag.name, marginTop: 1 }} />
        )}
        {shareUrl && (
          <text content={`🔗 ${shareUrl}`} style={{ fg: theme.colors.text.accent, marginTop: 1 }} />
        )}
      </box>

      {/* Article content - ScrollBox owns keyboard for scrolling */}
      <ScrollSurface
        ref={scrollboxRef}
        variant="panel"
        focused
        padding={2}
        width="100%"
      >
        {fields?.bodytext ? (
          <box style={{ flexDirection: "column" }}>
            {convertHTMLToOpenTUI(fields.bodytext)}
          </box>
        ) : (
          <box style={{ flexDirection: "column" }}>
            <text content={t('articleContentUnavailable')} style={{ fg: theme.status.warning, marginBottom: 1 }} />
            <text content={t('paywallOrFormatting')} style={{ fg: theme.colors.text.muted }} />
          </box>
        )}
      </ScrollSurface>
    </box>
  );
};
