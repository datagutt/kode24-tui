import React from 'react';
import { useTheme } from '../hooks/useTheme.js';
import type { Job } from '../types/index.js';

interface JobCardProps {
  job: Job;
  selected?: boolean;
  prefix?: string;
  footnote?: string;
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

export const JobCard: React.FC<JobCardProps> = ({ job, selected, prefix, footnote }) => {
  const theme = useTheme();
  const badge = `${typeGlyph[job.type]} ${job.type.toUpperCase()}`;
  const published = formatDate(job.published);
  const bg = selected ? theme.navigation.selected : theme.colors.surface.card;
  const fg = selected ? theme.navigation.selectedText : theme.job.title;
  const borderColor = selected ? theme.navigation.selected : theme.colors.border.subtle;

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
        <text content={job.title} style={{ fg, attributes: 1 }} />
      </box>

      {job.applicationTitle && (
        <text content={job.applicationTitle} style={{ fg: theme.colors.text.accent, marginTop: 0 }} />
      )}

      <text content={`🏢 ${job.company.name}`} style={{ fg: theme.job.company, marginTop: 0 }} />

      <box style={{ flexDirection: 'row', marginTop: 0 }}>
        <text content={badge} style={{ fg: theme.job.type, marginRight: 2 }} />
        <text content={`📅 ${published}`} style={{ fg: theme.colors.text.secondary }} />
      </box>

      {footnote && (
        <text content={footnote} style={{ fg: theme.colors.text.secondary, marginTop: 0 }} />
      )}
    </box>
  );
};

export type { JobCardProps };
