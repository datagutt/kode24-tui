import { useTheme } from '../hooks/useTheme.js';
import type { Job } from '../types/index.js';

interface JobCardProps {
  job: Job;
  selected?: boolean;
  prefix?: string;
  footnote?: string;
  variant?: 'default' | 'compact';
  key?: string | number;
}

const typeGlyph: Record<Job['type'], string> = {
  basis: '📄',
  fokus: '⭐',
  premium: '💎',
};

const formatDate = (value: string): string => {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return value;
  }
  return new Date(timestamp).toLocaleDateString();
};

export const JobCard = ({ job, selected, prefix, footnote, variant }: JobCardProps) => {
  const theme = useTheme();
  const kind = variant ?? 'default';
  const badge = `${typeGlyph[job.type]} ${job.type.toUpperCase()}`;
  const published = formatDate(job.published);
  const bg = selected ? theme.navigation.selected : theme.colors.surface.card;
  const fg = selected ? theme.navigation.selectedText : theme.job.title;
  const borderColor = selected ? theme.navigation.selected : theme.colors.border.subtle;
  const pad = kind === 'compact' ? 1 : 2;
  const gap = kind === 'compact' ? 0 : 1;

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
        <text content={job.title} style={{ fg, attributes: 1 }} />
      </box>

      {job.applicationTitle ? (
        <text content={job.applicationTitle} style={{ fg: theme.colors.text.accent, marginTop: gap }} />
      ) : null}

      <text content={`🏢 ${job.company.name}`} style={{ fg: theme.job.company, marginTop: gap }} />

      <box style={{ flexDirection: 'row', marginTop: gap }}>
        <text content={badge} style={{ fg: theme.job.type, marginRight: 2 }} />
        <text content={`📅 ${published}`} style={{ fg: theme.colors.text.secondary }} />
      </box>

      {footnote ? (
        <text content={footnote} style={{ fg: theme.colors.text.secondary, marginTop: gap }} />
      ) : null}
    </box>
  );
};

export type { JobCardProps };
