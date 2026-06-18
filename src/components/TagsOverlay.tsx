import { useMemo } from 'react';
import { colors, themeColors } from '../theme/colors.js';
import { t } from '../i18n/index.js';
import { popularTags } from '../pages/TagsPage.js';
import { useKeyboard } from '@opentui/react';
import type { KeyEvent } from '../types/index.js';
import type { SelectOption } from '@opentui/core';

interface TagsOverlayProps {
  onClose: () => void;
  onSelectTag: (tagName: string) => void;
  selectedTagFilter: string | null;
}

export const TagsOverlay = ({ onClose, onSelectTag, selectedTagFilter }: TagsOverlayProps) => {
  const options = useMemo<SelectOption[]>(
    () =>
      popularTags.map(tag => ({
        name: `${selectedTagFilter === tag.name ? '✓ ' : ''}#${tag.name}`,
        description: '',
        value: tag.name,
      })),
    [selectedTagFilter]
  );

  // Esc/t close the overlay; up/down/enter are owned by the focused <select>.
  useKeyboard((key: KeyEvent) => {
    if (key.name === 'escape' || key.name === 't') {
      onClose();
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
        <text content={t('categoriesTags')} style={{ fg: themeColors.tag.name, attributes: 1 }} />
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

      <select
        focused
        options={options}
        showDescription={false}
        showScrollIndicator
        wrapSelection
        backgroundColor={colors.surface.card}
        textColor={themeColors.tag.name}
        focusedBackgroundColor={colors.surface.card}
        selectedBackgroundColor={themeColors.navigation.selected}
        selectedTextColor={themeColors.navigation.selectedText}
        onSelect={(_index, option) => {
          if (!option) return;
          onSelectTag(option.value);
          onClose();
        }}
        style={{ flexGrow: 1, width: '100%' }}
      />

      <box marginTop={1}>
        <text content="↑↓ = naviger | Enter = velg | Esc/t = lukk" style={{ fg: colors.text.muted }} />
      </box>
    </box>
  );
};
