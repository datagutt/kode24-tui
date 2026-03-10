import { useState, useMemo, useEffect } from "react";
import { useKeyboard } from "@opentui/react";
import type { Frontpage, Article, Panel, KeyEvent } from "../types/index.js";
import { colors, themeColors } from "../theme/colors.js";
import { useListNavigation } from "../hooks/useListNavigation.js";
import { t } from "../i18n/index.js";
import { JobCard } from "../components/JobCard.js";
import { ArticleCard } from "../components/ArticleCard.js";
import ScrollSurface from "../components/ScrollSurface.js";

interface FrontpagePageProps {
  frontpageData: Frontpage;
  selectedTagFilter: string | null;
  onNavigateToArticle: (articleId: string) => void;
  onNavigateToListings: () => void;
  onNavigateToEvents: () => void;
  onToggleTags: () => void;
  onClearFilter: () => void;
  isActive: boolean;
}

const SIDEBAR_LIMITS = { jobs: 3, events: 2, comments: 2 };

const formatDate = (value: Date | string): string => {
  if (value instanceof Date) return value.toLocaleDateString();
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? String(value) : new Date(parsed).toLocaleDateString();
};

// Split articles into hero (width >= 50) and stream.
// Only consecutive leading articles with large width become hero — once we hit
// a smaller article, everything from there on goes to stream.
const splitArticles = (articles: Article[]): { hero: Article[]; stream: Article[] } => {
  let heroCount = 0;
  for (const article of articles) {
    if (heroCount >= 3) break;
    if (typeof article.width === 'number' && article.width >= 50) {
      heroCount++;
    } else {
      break;
    }
  }
  return {
    hero: articles.slice(0, heroCount),
    stream: articles.slice(heroCount),
  };
};

export const FrontpagePage = ({
  frontpageData,
  selectedTagFilter,
  onNavigateToArticle,
  onNavigateToListings,
  onNavigateToEvents,
  onToggleTags,
  onClearFilter,
  isActive,
}: FrontpagePageProps) => {
  const [panel, setPanel] = useState<Panel>('main');
  const [mainIndex, setMainIndex] = useState(0);
  const [sidebarIndex, setSidebarIndex] = useState(0);

  const { hero, stream } = useMemo(
    () => splitArticles(frontpageData.latestArticles),
    [frontpageData.latestArticles]
  );

  // Total navigable articles: hero + stream
  const allArticles = useMemo(() => [...hero, ...stream], [hero, stream]);
  const totalArticles = allArticles.length;

  // Sidebar items: jobs + "view all" + events + comments
  const visibleJobs = useMemo(
    () => frontpageData.jobs.slice(0, SIDEBAR_LIMITS.jobs),
    [frontpageData.jobs]
  );
  const visibleEvents = useMemo(
    () => frontpageData.events.upcomingEvents.slice(0, SIDEBAR_LIMITS.events),
    [frontpageData.events.upcomingEvents]
  );
  const visibleComments = useMemo(
    () => frontpageData.newestComments.slice(0, SIDEBAR_LIMITS.comments),
    [frontpageData.newestComments]
  );
  const totalSidebarItems = visibleJobs.length + 1 + visibleEvents.length + visibleComments.length;

  // Indices for sidebar sections
  const viewAllJobsIndex = visibleJobs.length;
  const eventBaseIndex = viewAllJobsIndex + 1;
  const commentBaseIndex = eventBaseIndex + visibleEvents.length;

  // Stream scrollbox navigation (hero items aren't in the scrollbox)
  const streamScrollRef = useListNavigation({
    selectedIndex: Math.max(0, mainIndex - hero.length),
    isActive: panel === 'main' && mainIndex >= hero.length,
    buffer: 2,
  });

  const sidebarScrollRef = useListNavigation({
    selectedIndex: sidebarIndex,
    isActive: panel === 'sidebar',
    buffer: 2,
  });

  // Responsive: detect narrow terminals
  const [terminalWidth, setTerminalWidth] = useState(() => process.stdout?.columns ?? 120);
  useEffect(() => {
    const output = process.stdout;
    if (!output?.on) return;
    const update = () => setTerminalWidth(output.columns ?? 120);
    output.on("resize", update);
    return () => { output.off?.("resize", update); };
  }, []);
  const showSidebar = terminalWidth >= 80;

  // Keyboard handling - frontpage owns its own keys
  useKeyboard((key: KeyEvent) => {
    if (!isActive) return;

    if (key.name === 'tab') {
      if (showSidebar) setPanel(p => p === 'main' ? 'sidebar' : 'main');
      return;
    }

    if (key.name === 't') {
      onToggleTags();
      return;
    }

    if (key.name === 'l') {
      onNavigateToListings();
      return;
    }

    if (key.name === 'e') {
      onNavigateToEvents();
      return;
    }

    if (key.name === 'c' && selectedTagFilter) {
      onClearFilter();
      return;
    }

    if (panel === 'main') {
      if (key.name === 'up' && mainIndex > 0) {
        setMainIndex(mainIndex - 1);
      } else if (key.name === 'down' && mainIndex < totalArticles - 1) {
        setMainIndex(mainIndex + 1);
      } else if (key.name === 'return') {
        const article = allArticles[mainIndex];
        if (article) onNavigateToArticle(article.id);
      }
      return;
    }

    if (panel === 'sidebar') {
      if (key.name === 'up' && sidebarIndex > 0) {
        setSidebarIndex(sidebarIndex - 1);
      } else if (key.name === 'down' && sidebarIndex < totalSidebarItems - 1) {
        setSidebarIndex(sidebarIndex + 1);
      } else if (key.name === 'return') {
        if (sidebarIndex <= viewAllJobsIndex) {
          onNavigateToListings();
        } else if (sidebarIndex < commentBaseIndex) {
          onNavigateToEvents();
        }
      }
      return;
    }
  });

  // Reset selection when data changes (tag filter)
  useEffect(() => {
    setMainIndex(0);
  }, [frontpageData.latestArticles]);

  const renderHeroArticle = (article: Article, index: number) => {
    const isSelected = panel === 'main' && mainIndex === index;
    const tags = article.tags ? article.tags.split(",").map(tag => tag.trim()).filter(Boolean).slice(0, 3) : [];
    return (
      <ArticleCard
        key={article.id}
        data={{
          title: article.title,
          subtitle: article.subtitle,
          author: article.byline.name,
          date: formatDate(article.published),
          reactions: article.reactions.reactions_count,
          comments: article.reactions.comments_count,
          tags,
        }}
        selected={isSelected}
        variant="hero"
      />
    );
  };

  const renderStreamArticle = (article: Article, streamIndex: number) => {
    const globalIndex = hero.length + streamIndex;
    const isSelected = panel === 'main' && mainIndex === globalIndex;
    const tags = article.tags ? article.tags.split(",").map(tag => tag.trim()).filter(Boolean).slice(0, 3) : [];
    return (
      <ArticleCard
        key={article.id}
        data={{
          title: article.title,
          subtitle: streamIndex < 3 ? article.subtitle : undefined,
          author: article.byline.name,
          date: formatDate(article.published),
          reactions: streamIndex < 3 ? article.reactions.reactions_count : undefined,
          comments: streamIndex < 3 ? article.reactions.comments_count : undefined,
          tags: streamIndex < 3 ? tags : undefined,
        }}
        prefix={`${streamIndex + 1}.`}
        selected={isSelected}
        variant={streamIndex < 3 ? 'default' : 'compact'}
        footnote={isSelected ? t("pressEnter") : undefined}
      />
    );
  };

  const headerText = selectedTagFilter
    ? `🏷️ #${selectedTagFilter}`
    : t("latestArticles");

  return (
    <box
      style={{
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: themeColors.navigation.background,
      }}
    >
      {/* Tag filter indicator */}
      {selectedTagFilter && (
        <box
          style={{
            height: 3,
            width: "100%",
            backgroundColor: themeColors.tag.background,
            padding: 1,
          }}
        >
          <text
            content={`🏷️ Filtrerer: #${selectedTagFilter} (c = fjern, esc = tilbake)`}
            style={{ fg: themeColors.tag.name, attributes: 1 }}
          />
        </box>
      )}

      {/* Hero section - full width, fixed height based on hero count */}
      {hero.length > 0 && !selectedTagFilter && (
        <box style={{ flexDirection: "column", height: hero.length * 10, flexShrink: 0 }}>
          {hero.map((article, index) => renderHeroArticle(article, index))}
        </box>
      )}

      {/* Main content area: stream + sidebar */}
      <box style={{ flexDirection: "row", width: "100%", flexGrow: 1 }}>
        {/* Article stream */}
        <box style={{ flexDirection: "column", width: showSidebar ? "75%" : "100%", marginRight: showSidebar ? 1 : 0 }}>
          <box style={{ marginBottom: 1, padding: 1 }}>
            <text content={headerText} style={{ fg: themeColors.navigation.normal, attributes: 1 }} />
            {stream.length > 0 && (
              <text
                content={`  (${stream.length})`}
                style={{ fg: themeColors.navigation.normal }}
              />
            )}
          </box>

          {totalArticles === 0 && selectedTagFilter ? (
            <box style={{ flexDirection: "column", alignItems: "center", padding: 2 }}>
              <text content={`Ingen artikler for #${selectedTagFilter}`} style={{ fg: 'yellow', attributes: 1 }} />
              <text content="Trykk 'c' eller Esc for å fjerne filter" style={{ fg: 'gray', marginTop: 1 }} />
            </box>
          ) : (
            <ScrollSurface
              ref={streamScrollRef}
              focused={panel === 'main'}
              variant="panel"
              padding={1}
              width="100%"
            >
              {/* When tag filtered, show all articles in stream (no hero split) */}
              {selectedTagFilter
                ? allArticles.map((article, index) => renderStreamArticle(article, index))
                : stream.map((article, index) => renderStreamArticle(article, index))
              }
            </ScrollSurface>
          )}
        </box>

        {/* Sidebar */}
        {showSidebar && (
          <box style={{ width: "25%", flexDirection: "column" }}>
            <box style={{ marginBottom: 1, padding: 1 }}>
              <text
                content={panel === 'sidebar' ? "▶ Sidebar" : "  Sidebar"}
                style={{ fg: themeColors.navigation.normal, attributes: panel === 'sidebar' ? 1 : 0 }}
              />
            </box>

            <ScrollSurface
              ref={sidebarScrollRef}
              variant="sidebar"
              focused={panel === 'sidebar'}
              width="100%"
            >
              {/* Jobs */}
              <text content="💼 Jobber" style={{ fg: themeColors.navigation.normal, attributes: 1, marginBottom: 1 }} />
              {visibleJobs.map((job, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  selected={panel === 'sidebar' && index === sidebarIndex}
                  variant="compact"
                />
              ))}

              {/* View All Jobs */}
              <box
                style={{
                  marginTop: 1,
                  marginBottom: 2,
                  padding: 1,
                  border: true,
                  borderColor: panel === 'sidebar' && sidebarIndex === viewAllJobsIndex
                    ? themeColors.navigation.selectedText
                    : themeColors.navigation.selected,
                  backgroundColor: panel === 'sidebar' && sidebarIndex === viewAllJobsIndex
                    ? themeColors.navigation.selectedText
                    : colors.surface.card,
                }}
              >
                <text
                  content={`→ ${t("viewAllJobs")}`}
                  style={{
                    fg: panel === 'sidebar' && sidebarIndex === viewAllJobsIndex
                      ? themeColors.navigation.background
                      : themeColors.navigation.normal,
                    attributes: 1,
                  }}
                />
              </box>

              {/* Events */}
              <text content={t("upcomingEvents")} style={{ fg: themeColors.navigation.normal, attributes: 1, marginBottom: 1 }} />
              {visibleEvents.map((event, index) => {
                const eventIndex = eventBaseIndex + index;
                const isSelected = panel === 'sidebar' && eventIndex === sidebarIndex;
                return (
                  <box
                    key={event.link}
                    style={{
                      marginBottom: 1,
                      padding: 1,
                      border: true,
                      borderColor: isSelected ? themeColors.navigation.selectedText : themeColors.navigation.selected,
                      backgroundColor: isSelected ? themeColors.navigation.selectedText : colors.surface.card,
                    }}
                  >
                    <text
                      content={event.name}
                      style={{ fg: isSelected ? themeColors.navigation.background : themeColors.navigation.normal }}
                    />
                  </box>
                );
              })}

              {/* Comments */}
              <text content={t("newestComments")} style={{ fg: themeColors.navigation.normal, attributes: 1, marginTop: 2, marginBottom: 1 }} />
              {visibleComments.map((comment, index) => {
                const commentIndex = commentBaseIndex + index;
                const isSelected = panel === 'sidebar' && commentIndex === sidebarIndex;
                return (
                  <box
                    key={comment.url}
                    style={{
                      marginBottom: 1,
                      padding: 1,
                      border: true,
                      borderColor: isSelected ? themeColors.navigation.selectedText : themeColors.navigation.selected,
                      backgroundColor: isSelected ? themeColors.navigation.selectedText : colors.surface.card,
                    }}
                  >
                    <text
                      content={comment.articleTitle || comment.user?.name || t("anonymousComment")}
                      style={{ fg: isSelected ? themeColors.navigation.background : themeColors.navigation.normal }}
                    />
                  </box>
                );
              })}
            </ScrollSurface>
          </box>
        )}
      </box>
    </box>
  );
};
