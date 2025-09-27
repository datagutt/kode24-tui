import { useTheme } from '../hooks/useTheme.js';

interface ArticleCardData {
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

interface ArticleCardProps {
  data: ArticleCardData;
  selected?: boolean;
  prefix?: string;
  footnote?: string;
}

export const ArticleCard = ({ data, selected, prefix, footnote }: ArticleCardProps) => {
  const theme = useTheme();
  const bg = selected ? theme.navigation.selected : theme.colors.surface.card;
  const fg = selected ? theme.navigation.selectedText : theme.colors.text.primary;
  const borderColor = selected ? theme.navigation.selected : theme.colors.border.subtle;
  const subtitleColor = selected ? theme.navigation.selectedText : theme.article.subtitle;
  const authorDate = [data.author, data.date].filter(Boolean).join(' • ');
  const tagLine = data.tags?.length ? data.tags.join(', ') : '';
  const stats = [
    data.reactions !== undefined ? `❤️ ${data.reactions}` : null,
    data.comments !== undefined ? `💬 ${data.comments}` : null,
    data.views !== undefined ? `👀 ${data.views}` : null,
    data.likes !== undefined ? `👍 ${data.likes}` : null,
  ].filter(Boolean) as string[];

  return (
    <box
      style={{
        flexDirection: 'column',
        border: true,
        borderColor,
        padding: 1,
        marginBottom: 1,
        backgroundColor: bg,
      }}
    >
      <box style={{ flexDirection: 'row' }}>
        {prefix && (
          <text content={`${prefix} `} style={{ fg: theme.colors.text.secondary }} />
        )}
        <text content={data.title} style={{ fg, attributes: 1 }} />
      </box>

      {data.subtitle && (
        <text content={data.subtitle} style={{ fg: subtitleColor, marginTop: 0 }} />
      )}

      {authorDate && (
        <text content={authorDate} style={{ fg: theme.colors.text.secondary, marginTop: 0 }} />
      )}

      {data.excerpt && (
        <text content={data.excerpt} style={{ fg: theme.colors.text.accent, marginTop: 0 }} />
      )}

      {stats.length > 0 && (
        <box style={{ flexDirection: 'row', marginTop: 0 }}>
          {stats.map((stat, index) => (
            <text
              // Using index as key acceptable due to stable order from same array
              key={`${stat}-${index}`}
              content={index === stats.length - 1 ? stat : `${stat}  `}
              style={{ fg: theme.colors.text.secondary }}
            />
          ))}
        </box>
      )}

      {tagLine && (
        <text content={`🏷️ ${tagLine}`} style={{ fg: theme.tag.name, marginTop: 0 }} />
      )}

      {footnote && (
        <text content={footnote} style={{ fg: theme.colors.text.accent, marginTop: 0 }} />
      )}
    </box>
  );
};

export type { ArticleCardData, ArticleCardProps };
