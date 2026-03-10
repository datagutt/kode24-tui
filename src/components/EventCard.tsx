import { useTheme } from '../hooks/useTheme.js';
import type { UpcomingEvent } from '../types/index.js';

interface EventCardProps {
  event: UpcomingEvent;
  selected?: boolean;
  footnote?: string;
}

export const EventCard = ({ event, selected, footnote }: EventCardProps) => {
  const theme = useTheme();
  const bg = selected ? theme.navigation.selected : theme.colors.surface.card;
  const fg = selected ? theme.navigation.selectedText : theme.colors.text.primary;
  const borderColor = selected ? theme.navigation.selected : theme.colors.border.subtle;
  const location = event.digital ? '🌐 Digital' : `📍 ${event.location}`;

  return (
    <box
      style={{
        flexDirection: 'column',
        border: true,
        borderColor,
        padding: 2,
        marginBottom: 1,
        backgroundColor: bg,
      }}
    >
      <text content={event.name} style={{ fg, attributes: 1 }} />
      <text content={event.description} style={{ fg: theme.colors.text.secondary, marginTop: 1 }} />
      <text content={`🏢 ${event.arrangedBy}`} style={{ fg: theme.colors.text.accent, marginTop: 1 }} />
      <box style={{ flexDirection: 'row', marginTop: 1 }}>
        <text content={`📅 ${event.startDateFormatted}`} style={{ fg: theme.colors.text.secondary, marginRight: 2 }} />
        <text content={`🕐 ${event.timeFormatted}`} style={{ fg: theme.colors.text.secondary, marginRight: 2 }} />
        <text content={location} style={{ fg: theme.colors.text.secondary }} />
      </box>
      {event.isPremium && (
        <text content="💎 PREMIUM" style={{ fg: theme.job.type, marginTop: 1 }} />
      )}
      {footnote ? (
        <text content={footnote} style={{ fg: theme.colors.text.secondary, marginTop: 1 }} />
      ) : null}
    </box>
  );
};
