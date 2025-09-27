import { useTheme } from '../hooks/useTheme.js';

export interface ArticleCardData {
  title: string;
  subtitle?: string;
  author?: string;
  date?: string;
  excerpt?: string;
  reactions?: number;
  comments?: number;
  views?: number;
  likes?: number;
  tags?: string[];
}

export interface ArticleCardProps {
  data: ArticleCardData;
  selected?: boolean;
  prefix?: string;
  footnote?: string;
  meta?: string[];
  variant?: 'default' | 'compact';
  key?: string | number;
}

export const ArticleCard = ({ data, selected, prefix, footnote, meta, variant }: ArticleCardProps) => {
  const theme = useTheme();
  const kind = variant ?? 'default';
  const bg = selected ? theme.navigation.selected : theme.colors.surface.card;
  const fg = selected ? theme.navigation.selectedText : theme.colors.text.primary;
  const borderColor = selected ? theme.navigation.selected : theme.colors.border.subtle;
  const subtitleColor = selected ? theme.navigation.selectedText : theme.article.subtitle;
  const pad = kind === 'compact' ? 1 : 2;
  const gap = kind === 'compact' ? 0 : 1;
  const authorDate = [data.author, data.date].filter(Boolean).join(' • ');
  const showAuthorDate = Boolean(authorDate) && kind === 'default';
  const tagLine = data.tags?.length ? data.tags.join(', ') : '';
  const stats = [
    data.reactions !== undefined ? `❤️ ${data.reactions}` : null,
    data.comments !== undefined ? `💬 ${data.comments}` : null,
    data.views !== undefined ? `👀 ${data.views}` : null,
    data.likes !== undefined ? `👍 ${data.likes}` : null,
  ].filter(Boolean) as string[];
  const metas = meta?.filter(Boolean) ?? [];
  const showStats = stats.length > 0 && kind === 'default';
  const showExcerpt = Boolean(data.excerpt) && kind === 'default';
  const showTags = Boolean(tagLine) && kind === 'default';
  const hasMeta = metas.length > 0;

  return (
    <box
      style={{
        flexDirection: 'column',
        border: true,
        borderColor,
        padding: pad,
        marginBottom: kind === 'compact' ? 0 : 1,
        backgroundColor: bg,
      }}
    >
      <box style={{ flexDirection: 'row' }}>
        {prefix ? (
          <text content={`${prefix} `} style={{ fg: theme.colors.text.secondary }} />
        ) : null}
        <text content={data.title} style={{ fg, attributes: 1 }} />
      </box>

      {data.subtitle ? (
        <text content={data.subtitle} style={{ fg: subtitleColor, marginTop: gap }} />
      ) : null}

      {showAuthorDate ? (
        <text content={authorDate} style={{ fg: theme.colors.text.secondary, marginTop: gap }} />
      ) : null}

      {hasMeta ? (
        <box style={{ flexDirection: 'column', marginTop: gap }}>
          {metas.map((item, index) => (
            <text key={`${item}-${index}`} content={item} style={{ fg: theme.colors.text.secondary }} />
          ))}
        </box>
      ) : null}

      {showExcerpt ? (
        <text content={data.excerpt ?? ''} style={{ fg: theme.colors.text.accent, marginTop: gap }} />
      ) : null}

      {showStats ? (
        <box style={{ flexDirection: 'row', marginTop: gap }}>
          {stats.map((stat, index) => (
            <text
              key={`${stat}-${index}`}
              content={index === stats.length - 1 ? stat : `${stat}  `}
              style={{ fg: theme.colors.text.secondary }}
            />
          ))}
        </box>
      ) : null}

      {showTags ? (
        <text content={`🏷️ ${tagLine}`} style={{ fg: theme.tag.name, marginTop: gap }} />
      ) : null}

      {footnote ? (
        <text content={footnote} style={{ fg: theme.colors.text.accent, marginTop: gap }} />
      ) : null}
    </box>
  );
};
