import React from "react";
import type { Page } from "../types/index.js";
import { t } from "../i18n/index.js";
import { useTheme } from "../hooks/useTheme.js";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  breadcrumb: string[];
}

const pageLabel = (page: Page): string => {
  switch (page) {
    case "frontpage":
      return "🏠 Frontpage";
    case "article":
      return "📰 Article";
    case "listings":
      return "💼 Listings";
    case "events":
      return "📅 Events";
    default:
      return "📱 kode24";
  }
};

export const Layout = ({ children, currentPage, breadcrumb }: LayoutProps) => {
  const theme = useTheme();
  const now = new Date().toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
  const trail = breadcrumb.length > 1
    ? breadcrumb.map((item) => pageLabel(item as Page)).join(" › ")
    : pageLabel(currentPage);

  return (
    <box
      style={{
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.background.base,
      }}
    >
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
        <text content={t("headerTitle")} style={{ fg: theme.colors.text.primary, attributes: 1 }} />
        <text content={trail} style={{ fg: theme.colors.text.secondary }} />
        <text content={now} style={{ fg: theme.colors.text.accent }} />
      </box>

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
        <text content={t("footerHelp")} style={{ fg: theme.colors.text.secondary }} />
      </box>
    </box>
  );
};
