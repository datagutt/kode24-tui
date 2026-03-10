import { useState } from 'react';
import { useKeyboard } from '@opentui/react';
import type { UpcomingEvent, KeyEvent } from '../types/index.js';
import { t } from '../i18n/index.js';
import { useTheme } from '../hooks/useTheme.js';
import { EventCard } from '../components/EventCard.js';
import ScrollSurface from '../components/ScrollSurface.js';
import { useListNavigation } from '../hooks/useListNavigation.js';

interface EventsPageProps {
  events: UpcomingEvent[];
}

export const EventsPage = ({ events }: EventsPageProps) => {
  const [selected, setSelected] = useState(0);
  const theme = useTheme();

  const scrollboxRef = useListNavigation({
    selectedIndex: selected,
    isActive: true,
    buffer: 2,
  });

  useKeyboard((key: KeyEvent) => {
    if (key.name === 'up' && selected > 0) {
      setSelected(selected - 1);
    } else if (key.name === 'down' && selected < events.length - 1) {
      setSelected(selected + 1);
    } else if (key.name === 'return' && events[selected]) {
      Bun.spawn(['open', events[selected].link]);
    }
  });

  return (
    <box style={{ flexDirection: "column", height: "100%", width: "100%", padding: 1 }}>
      <box style={{ flexDirection: "column", marginBottom: 1 }}>
        <text content={t('upcomingEvents')} style={{ fg: 'cyan', attributes: 1, marginBottom: 1 }} />
        <text content={t('foundEvents', { count: events.length })} style={{ fg: 'gray' }} />
      </box>

      <ScrollSurface
        ref={scrollboxRef}
        variant="panel"
        focused
        width="100%"
      >
        {events.length === 0 ? (
          <text content={t('noEventsFound')} style={{ fg: 'yellow' }} />
        ) : (
          events.map((event, index) => (
            <EventCard
              key={event.link}
              event={event}
              selected={index === selected}
              footnote={index === selected ? t('pressEnter') : undefined}
            />
          ))
        )}
      </ScrollSurface>
    </box>
  );
};
