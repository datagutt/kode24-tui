import { useState } from 'react';
import { colors, themeColors } from '../theme/colors.js';
import { t } from '../i18n/index.js';
import { popularTags } from '../pages/TagsPage.js';
import ScrollSurface from './ScrollSurface.js';
import { useListNavigation } from '../hooks/useListNavigation.js';
import { useKeyboard } from '@opentui/react';

interface TagsOverlayProps {
  onClose: () => void;
  onSelectTag: (tagName: string) => void;
  selectedTagFilter: string | null;
}

export const TagsOverlay = ({ onClose, onSelectTag, selectedTagFilter }: TagsOverlayProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollRef = useListNavigation({
    selectedIndex,
    isActive: true,
    buffer: 2,
  });

  useKeyboard((key) => {
    if (key.name === 'escape' || key.name === 't') {
      onClose();
      return;
    }

    if (key.name === 'up' && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      return;
    }

    if (key.name === 'down' && selectedIndex < popularTags.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      return;
    }

    if (key.name === 'return') {
      const tag = popularTags[selectedIndex];
      if (tag) {
        onSelectTag(tag.name);
        onClose();
      }
      return;
    }
  });

  return (
    <box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      style={{ backgroundColor: colors.background.base }}
      flexDirection="column"
      padding={2}
    >
      <box flexDirection="row" justifyContent="space-between" marginBottom={1}>
        <text
          content={t('categoriesTags')}
          style={{ fg: themeColors.tag.name, attributes: 1 }}
        />
        <text
          content={selectedTagFilter ? `Aktiv: #${selectedTagFilter}` : ''}
          style={{ fg: themeColors.tag.selected }}
        />
      </box>

      <text
        content="Velg en tag for å filtrere artikler. Enter = velg, Esc/t = lukk."
        style={{ fg: colors.text.muted }}
        marginBottom={1}
      />

      <ScrollSurface
        ref={scrollRef}
        variant="sidebar"
        focused={true}
        width="100%"
      >
        {popularTags.map((tag, index) => {
          const isSelected = index === selectedIndex;
          const isActiveFilter = selectedTagFilter === tag.name;
          return (
            <box
              key={tag.name}
              style={{
                marginBottom: 1,
                padding: 1,
                border: true,
                borderColor: isSelected ? themeColors.navigation.selectedText : isActiveFilter ? themeColors.tag.background : themeColors.navigation.selected,
                backgroundColor: isSelected ? themeColors.navigation.selectedText : isActiveFilter ? themeColors.tag.background : colors.surface.card,
              }}
            >
              <text
                content={`${isActiveFilter ? '✓ ' : ''}#${tag.name}`}
                style={{
                  fg: isSelected ? themeColors.navigation.background : themeColors.tag.name,
                  attributes: isActiveFilter ? 1 : 0
                }}
              />
            </box>
          );
        })}
      </ScrollSurface>

      <box marginTop={1}>
        <text
          content="↑↓ = naviger | Enter = velg | Esc/t = lukk"
          style={{ fg: colors.text.muted }}
        />
      </box>
    </box>
  );
};
