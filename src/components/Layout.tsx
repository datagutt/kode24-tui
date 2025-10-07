import React from "react";
import type { Page } from "../types/index.js";
import { themeColors } from "../theme/colors.js";
import { t } from "../i18n/index.js";
import { RGBA } from "@opentui/core";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  breadcrumb: string[];
}

export const Layout = ({ children, currentPage, breadcrumb }: LayoutProps) => {
  const getPageTitle = (page: Page): string => {
    switch (page) {
      case "frontpage":
        return "🏠 Frontpage";
      case "article":
        return "📰 Article";
      case "listings":
        return "💼 Job Listings";
      case "events":
        return "📅 Events";
      default:
        return "📱 kode24.no";
    }
  };

  const getBreadcrumbText = (): string => {
    if (breadcrumb.length <= 1) return getPageTitle(currentPage);
    return breadcrumb.map((page) => getPageTitle(page as Page)).join(" > ");
  };

  return (
    <box
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      flexDirection="column"
      height="100%"
      width="100%"
    >
      {/* Header */}
      <box
        height={3}
        width="100%"
        backgroundColor={themeColors.header.background}
        flexDirection="column"
        padding={3}
      >
        <box alignItems="center" justifyContent="center" flexDirection="column">
          <ascii-font
            text={t("headerTitle")}
            fg={RGBA.fromHex(themeColors.header.text)}
            marginBottom={1.5}
          />
          <text
            content={getBreadcrumbText()}
            style={{ fg: themeColors.header.accent }}
          />
        </box>
      </box>

      {/* Main content */}
      <box flexGrow={1} flexDirection="column" height="100%" width="100%">
        {children}
      </box>

      {/* Footer */}
      <box
        style={{
          height: 2,
          width: "100%",
          backgroundColor: themeColors.footer.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <text
          content={t("footerHelp")}
          style={{ fg: themeColors.footer.text }}
        />
      </box>
    </box>
  );
};
