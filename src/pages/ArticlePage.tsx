import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useTheme } from '../hooks/useTheme.js';
import { useScrollboxFocus } from '../hooks/useScrollboxFocus.js';
import { convertHTMLToOpenTUI } from '../utils/htmlToOpenTUI.js';
import type { Lab } from '../types/index.js';
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

  if (!article || !article.page) {
    return (
      <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%", backgroundColor: theme.colors.background.base }}>
        <text content={t('articleNotFound')} style={{ fg: theme.status.warning }} />
        <text content={t('pressEscToGoBack')} style={{ fg: theme.colors.text.muted, marginTop: 1 }} />
      </box>
    );
  }

  if (!article.page.fields?.title && !article.page.fields?.bodytext) {
    return (
      <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%", backgroundColor: theme.colors.background.base }}>
        <text content={t('articleContentNotLoaded')} style={{ fg: theme.status.error }} />
        <text content={t('missingTitleAndContent')} style={{ fg: theme.colors.text.muted, marginTop: 1 }} />
        <text content={t('pressEscToGoBack')} style={{ fg: theme.colors.text.muted, marginTop: 1 }} />
      </box>
    );
  }

  const publishedTimestamp = article.page.fields?.published ? Number(article.page.fields.published) * 1000 : undefined;
  const publishedDate = publishedTimestamp ? new Date(publishedTimestamp) : undefined;
  const readTime = article.page.fields?.readTime ?? article.page.fields?.stats_read_time;
  const wordCount = article.page.fields?.stats_word_count;
  const charCount = article.page.fields?.stats_char_count;
  const tags = article.page.fields?.tags ? article.page.fields.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
  const shareUrl = article.page.fields?.published_url ? `https://www.kode24.no${article.page.fields.published_url}` : undefined;

  return (
    <box style={{ flexDirection: "row", height: "100%", width: "100%", padding: 1, backgroundColor: theme.colors.background.base }}>
      <box style={{ flexDirection: "column", width: "65%", marginRight: 1 }}>
        <box style={{ flexDirection: "column", border: true, borderColor: theme.colors.border.subtle, backgroundColor: theme.colors.surface.card, padding: 2 }}>
          <text content={article.page.fields?.title ?? t('articleTitleUnavailable')} style={{ fg: theme.article.title, attributes: 1 }} />
          {article.page.fields?.subtitle && (
            <text content={article.page.fields.subtitle} style={{ fg: theme.article.subtitle, marginTop: 1 }} />
          )}
          <box style={{ flexDirection: "row", marginTop: 1 }}>
            <text content={`👤 ${article.page.fields?.created_by_name ?? article.page.fields?.created_by ?? article.page.fields?.lockUser ?? ''}`} style={{ fg: theme.article.author, marginRight: 2 }} />
            {publishedDate && (
              <text content={`📅 ${publishedDate.toLocaleDateString()}`} style={{ fg: theme.article.date, marginRight: 2 }} />
            )}
            {readTime && (
              <text content={`⏱️ ${readTime} ${t('minutes')}`} style={{ fg: theme.article.date }} />
            )}
          </box>
          <box style={{ flexDirection: "row", marginTop: 1 }}>
            <text content={`📄 ${article.page.type}`} style={{ fg: theme.article.date, marginRight: 2 }} />
            <text content={`📊 ${article.page.status}`} style={{ fg: theme.article.date }} />
          </box>
          {tags.length > 0 && (
            <box style={{ flexDirection: "row", marginTop: 1 }}>
              <text content="🏷️" style={{ fg: theme.tag.name, marginRight: 1 }} />
              <text content={tags.join(', ')} style={{ fg: theme.tag.name }} />
            </box>
          )}
        </box>

        <scrollbox ref={scrollboxRef} style={{ height: "100%", border: true, borderColor: theme.colors.border.subtle, backgroundColor: theme.colors.surface.raised, padding: 2, marginTop: 1 }}>
          <text content={t('articleContent')} style={{ fg: theme.article.subtitle, attributes: 1, marginBottom: 1 }} />
          {article.page.fields?.bodytext ? (
            <box style={{ flexDirection: "column" }}>
              {convertHTMLToOpenTUI(article.page.fields.bodytext)}
            </box>
          ) : (
            <box style={{ flexDirection: "column" }}>
              <text content={t('articleContentUnavailable')} style={{ fg: theme.status.warning, marginBottom: 1 }} />
              <text content={t('paywallOrFormatting')} style={{ fg: theme.colors.text.muted }} />
            </box>
          )}
        </scrollbox>
      </box>

      <box style={{ flexDirection: "column", width: "35%" }}>
        <box style={{ border: true, borderColor: theme.colors.border.subtle, backgroundColor: theme.colors.surface.card, padding: 1 }}>
          <text content={t('articleOverview')} style={{ fg: theme.article.title, attributes: 1 }} />
          <text content={`${t('articleIdLabel')} ${article.page.id}`} style={{ fg: theme.colors.text.secondary, marginTop: 1 }} />
          <text content={`${t('articleTypeLabel')} ${article.page.type}`} style={{ fg: theme.colors.text.secondary }} />
          <text content={`${t('articleStatusLabel')} ${article.page.status}`} style={{ fg: theme.colors.text.secondary }} />
          {shareUrl && (
            <text content={`${t('articleUrl')} ${shareUrl}`} style={{ fg: theme.colors.text.accent, marginTop: 1 }} />
          )}
        </box>

        <box style={{ border: true, borderColor: theme.colors.border.subtle, backgroundColor: theme.colors.surface.card, padding: 1, marginTop: 1 }}>
          <text content={t('readingStats')} style={{ fg: theme.article.title, attributes: 1 }} />
          {readTime && (
            <text content={`${t('readTimeLabel')} ${readTime} ${t('minutes')}`} style={{ fg: theme.colors.text.secondary, marginTop: 1 }} />
          )}
          {wordCount && (
            <text content={`${t('wordCountLabel')} ${wordCount}`} style={{ fg: theme.colors.text.secondary }} />
          )}
          {charCount && (
            <text content={`${t('charCountLabel')} ${charCount}`} style={{ fg: theme.colors.text.secondary }} />
          )}
        </box>

        <box style={{ border: true, borderColor: theme.colors.border.subtle, backgroundColor: theme.colors.surface.card, padding: 1, marginTop: 1 }}>
          <text content={t('actions')} style={{ fg: theme.article.title, attributes: 1 }} />
          <text content={`↵ ${t('returnToFrontpage')}`} style={{ fg: theme.colors.text.muted, marginTop: 1 }} />
          <text content={`Esc ${t('pressEscToGoBack')}`} style={{ fg: theme.colors.text.muted }} />
        </box>

        <box style={{ border: true, borderColor: theme.colors.border.subtle, backgroundColor: theme.colors.surface.card, padding: 1, marginTop: 1 }}>
          <text content={t('developmentInfo')} style={{ fg: theme.article.title, attributes: 1 }} />
          <text content={`API keys: ${Object.keys(article).join(', ')}`} style={{ fg: theme.colors.text.secondary, marginTop: 1 }} />
          <text content={`${t('articleTemplateLabel')} ${article.page.fields?.page_template_alias ?? '—'}`} style={{ fg: theme.colors.text.secondary }} />
          <text content={`${t('articleSiteLabel')} ${article.page.site_id}`} style={{ fg: theme.colors.text.secondary }} />
        </box>
      </box>
    </box>
  );
};
