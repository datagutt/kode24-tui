import { useTheme } from '../hooks/useTheme.js';

export interface ArticleCardData {
  title: string;
  subtitle?: string;
  author?: string;
  date?: string;
  reactions?: number;
  comments?: number;
  tags?: string[];
}

export interface ArticleCardProps {
  data: ArticleCardData;
  selected?: boolean;
  prefix?: string;
  footnote?: string;
  meta?: string[];
  variant?: 'hero' | 'default' | 'compact';
}

export const ArticleCard = ({ data, selected, prefix, footnote, meta, variant }: ArticleCardProps) => {
  const theme = useTheme();
  const kind = variant ?? 'default';

  const bg = selected ? theme.navigation.selected : theme.colors.surface.card;
  const fg = selected ? theme.navigation.selectedText : theme.colors.text.primary;
  const borderColor = selected
    ? theme.colors.accent.teal
    : kind === 'hero'
      ? theme.colors.accent.pink
      : theme.colors.border.subtle;
  const subtitleColor = selected ? theme.navigation.selectedText : theme.article.subtitle;

  if (kind === 'compact') {
    const authorDate = [data.author, data.date].filter(Boolean).join(' · ');
    return (
      <box
        style={{
          flexDirection: 'row',
          border: true,
          borderColor,
          padding: 1,
          marginBottom: 0,
          backgroundColor: bg,
        }}
      >
        {prefix ? <text content={`${prefix} `} style={{ fg: theme.colors.text.secondary }} /> : null}
        <text content={data.title} style={{ fg, attributes: 1 }} />
        {authorDate ? <text content={`  ${authorDate}`} style={{ fg: theme.colors.text.secondary }} /> : null}
      </box>
    );
  }

  const authorDate = [data.author, data.date].filter(Boolean).join(' · ');
  const tags = data.tags?.length ? data.tags.join(', ') : '';
  const stats = [
    data.reactions !== undefined ? `❤️ ${data.reactions}` : null,
    data.comments !== undefined ? `💬 ${data.comments}` : null,
  ].filter(Boolean) as string[];
  const metas = meta?.filter(Boolean) ?? [];
  const isHero = kind === 'hero';
  const pad = isHero ? 2 : 2;

  return (
    <box
      style={{
        flexDirection: 'column',
        border: true,
        borderColor,
        padding: pad,
        marginBottom: 1,
        backgroundColor: bg,
      }}
    >
      <box style={{ flexDirection: 'row' }}>
        {isHero ? <text content="★ " style={{ fg: theme.colors.accent.pink }} /> : null}
        {prefix ? <text content={`${prefix} `} style={{ fg: theme.colors.text.secondary }} /> : null}
        <text content={data.title} style={{ fg, attributes: 1 }} />
      </box>

      {data.subtitle ? (
        <text content={data.subtitle} style={{ fg: subtitleColor, marginTop: 1 }} />
      ) : null}

      {authorDate ? (
        <text content={authorDate} style={{ fg: theme.colors.text.secondary, marginTop: 1 }} />
      ) : null}

      {metas.length > 0 ? (
        <box style={{ flexDirection: 'column', marginTop: 1 }}>
          {metas.map((item, index) => (
            <text key={`${item}-${index}`} content={item} style={{ fg: theme.colors.text.secondary }} />
          ))}
        </box>
      ) : null}

      {tags ? (
        <text content={`🏷️ ${tags}`} style={{ fg: theme.tag.name, marginTop: 1 }} />
      ) : null}

      {stats.length > 0 ? (
        <box style={{ flexDirection: 'row', marginTop: 1 }}>
          {stats.map((stat, index) => (
            <text
              key={`${stat}-${index}`}
              content={index === stats.length - 1 ? stat : `${stat}  `}
              style={{ fg: theme.colors.text.secondary }}
            />
          ))}
        </box>
      ) : null}

      {footnote ? (
        <text content={footnote} style={{ fg: theme.colors.text.accent, marginTop: 1 }} />
      ) : null}
    </box>
  );
};
