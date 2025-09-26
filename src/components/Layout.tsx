import React from 'react';
import type { Page } from '../types/index.js';
import { themeColors } from '../theme/colors.js';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  breadcrumb: string[];
}

export const Layout = ({ children, currentPage, breadcrumb }: LayoutProps) => {
  const getPageTitle = (page: Page): string => {
    switch (page) {
      case 'frontpage': return '🏠 Frontpage';
      case 'article': return '📰 Article';
      case 'listings': return '💼 Job Listings';
      case 'tags': return '🏷️  Tags';
      case 'events': return '📅 Events';
      default: return '📱 kode24.no';
    }
  };

  const getBreadcrumbText = (): string => {
    if (breadcrumb.length <= 1) return getPageTitle(currentPage);
    return breadcrumb.map(page => getPageTitle(page as Page)).join(' > ');
  };

  return (
    <box style={{ flexDirection: "column", height: "100%", width: "100%" }}>
      {/* Header */}
      <box style={{ height: 3, width: "100%", backgroundColor: themeColors.header.background, flexDirection: "column", padding: 1 }}>
        <box style={{ alignItems: "center", justifyContent: "center" }}>
          <text content="🖥️  kode24.no - Terminal Edition" style={{ fg: themeColors.header.text, attributes: 1 }} />
        </box>
        <box style={{ alignItems: "center", justifyContent: "center" }}>
          <text content={getBreadcrumbText()} style={{ fg: themeColors.header.accent }} />
        </box>
      </box>
      
      {/* Main content */}
      <box style={{ flexDirection: "column", width: "100%", height: "100%" }}>
        {children}
      </box>
      
      {/* Footer */}
      <box style={{ height: 2, width: "100%", backgroundColor: themeColors.footer.background, alignItems: "center", justifyContent: "center" }}>
        <text content="q=Quit | Esc=Back | ↑↓←→=Navigate | Enter=Select | l=Jobs | t=Tags | e=Events" style={{ fg: themeColors.footer.text }} />
      </box>
    </box>
  );
};