import React, { useEffect, useRef } from "react";
import type { TabSelectRenderable, TabSelectOption } from "@opentui/core";
import type { Page } from "../types/index.js";
import { t } from "../i18n/index.js";
import { useTheme } from "../hooks/useTheme.js";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  breadcrumb: string[];
  onSelectSection: (page: Page) => void;
  tabsFocused: boolean;
}

const sections: { page: Page; name: string }[] = [
  { page: "frontpage", name: "🏠 Forside" },
  { page: "listings", name: "💼 Jobber" },
  { page: "events", name: "📅 Arrangementer" },
];

const tabOptions: TabSelectOption[] = sections.map(({ page, name }) => ({ name, description: "", value: page }));

const pageLabel = (page: Page): string => {
  switch (page) {
    case "frontpage": return "🏠 Forside";
    case "article": return "📰 Artikkel";
    case "listings": return "💼 Jobber";
    case "events": return "📅 Arrangementer";
    default: return "📱 kode24";
  }
};

const footerHints: Record<Page, string> = {
  frontpage: "q=Avslutt | ↑↓=Naviger | ←→=Bytt seksjon | Tab=Bytt panel | Enter=Velg | t=Tags | h=Hjelp",
  article: "q=Avslutt | ↑↓/PgUp/PgDn=Rull | Esc=Tilbake | h=Hjelp",
  listings: "q=Avslutt | ↑↓=Naviger | ←→=Bytt seksjon | Enter=Åpne | Esc=Tilbake | h=Hjelp",
  events: "q=Avslutt | ↑↓=Naviger | ←→=Bytt seksjon | Enter=Åpne | Esc=Tilbake | h=Hjelp",
};

export const Layout = ({ children, currentPage, breadcrumb, onSelectSection, tabsFocused }: LayoutProps) => {
  const theme = useTheme();
  const tabsRef = useRef<TabSelectRenderable>(null);
  const now = new Date().toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
  const trail = breadcrumb.length > 1
    ? breadcrumb.map((item) => pageLabel(item as Page)).join(" › ")
    : pageLabel(currentPage);

  const sectionIndex = sections.findIndex((s) => s.page === currentPage);
  const showTabs = sectionIndex !== -1;

  // Keep the tab highlight in sync when navigation happens via a shortcut or
  // back button rather than the tab bar itself.
  useEffect(() => {
    if (showTabs && tabsRef.current?.getSelectedIndex() !== sectionIndex) {
      tabsRef.current?.setSelectedIndex(sectionIndex);
    }
  }, [sectionIndex, showTabs]);

  return (
    <box
      style={{
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.background.base,
      }}
    >
      {/* Header */}
      <box
        style={{
          height: 3,
          width: "100%",
          padding: 1,
          border: true,
          borderColor: theme.colors.border.subtle,
          backgroundColor: theme.colors.background.highlight,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <text content={t("headerTitle")} style={{ fg: theme.colors.accent.teal, attributes: 1 }} />
        <text content={trail} style={{ fg: theme.colors.text.secondary }} />
        <text content={now} style={{ fg: theme.colors.text.accent }} />
      </box>

      {/* Section tabs (hidden on detail views like an open article) */}
      {showTabs && (
        <tab-select
          ref={tabsRef}
          focused={tabsFocused}
          options={tabOptions}
          tabWidth={18}
          showDescription={false}
          showUnderline
          showScrollArrows={false}
          wrapSelection
          backgroundColor={theme.colors.background.highlight}
          textColor={theme.colors.text.secondary}
          focusedBackgroundColor={theme.colors.background.highlight}
          selectedBackgroundColor={theme.navigation.selected}
          selectedTextColor={theme.navigation.selectedText}
          // Only left/right are bound, so Enter/↑/↓ pass through to the page below.
          keyBindings={[
            { name: "left", action: "move-left" },
            { name: "right", action: "move-right" },
          ]}
          onChange={(_index, option) => {
            const page = option?.value as Page | undefined;
            if (page && page !== currentPage) onSelectSection(page);
          }}
          style={{ width: "100%", height: 3 }}
        />
      )}

      {/* Main content */}
      <box
        style={{
          flexGrow: 1,
          padding: 1,
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </box>

      {/* Footer - context-sensitive */}
      <box
        style={{
          height: 2,
          width: "100%",
          backgroundColor: theme.colors.background.highlight,
          border: true,
          borderColor: theme.colors.border.subtle,
          alignItems: "center",
          justifyContent: "center",
          padding: 1,
        }}
      >
        <text content={footerHints[currentPage]} style={{ fg: theme.colors.text.secondary }} />
      </box>
    </box>
  );
};
