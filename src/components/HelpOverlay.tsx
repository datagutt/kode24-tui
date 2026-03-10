import { t } from '../i18n/index.js';

interface HelpOverlayProps {
  onClose: () => void;
}

export const HelpOverlay = ({ onClose }: HelpOverlayProps) => {
  return (
    <box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      style={{ backgroundColor: 'black' }}
      flexDirection="column"
      padding={2}
    >
      <text content={t('keyboardShortcuts')} style={{ fg: 'cyan', attributes: 1 }} marginBottom={1} />

      <box flexDirection="column" gap={1}>
        <text content={t('navigation')} style={{ fg: 'yellow' }} />
        <text content={t('navUpDown')} />
        <text content="  Tab - Bytt mellom hovedpanel og sidebar" />
        <text content={t('navEnter')} />
        <text content={t('navEsc')} />

        <text content="" />
        <text content={t('pages')} style={{ fg: 'yellow' }} />
        <text content={t('pageListings')} />
        <text content={t('pageTags')} />
        <text content={t('pageEvents')} />

        <text content="" />
        <text content={t('general')} style={{ fg: 'yellow' }} />
        <text content="  c - Fjern tag-filter (når aktivt)" />
        <text content={t('helpToggle')} />
        <text content={t('quit')} />
      </box>

      <box marginTop={2} alignSelf="flex-end">
        <text content={t('pressAnyKey')} style={{ fg: 'gray' }} />
      </box>
    </box>
  );
};
