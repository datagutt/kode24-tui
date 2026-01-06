import { useMemo } from "react";
import type { Frontpage } from "../types/index.js";
import { colors, themeColors } from "../theme/colors.js";
import { useListNavigation } from "../hooks/useListNavigation.js";
import { t } from "../i18n/index.js";
import { JobCard } from "../components/JobCard.js";
import { ArticleCard } from "../components/ArticleCard.js";
import ScrollSurface from "../components/ScrollSurface.js";
import { getRightSidebarCounts } from "./rightSidebarConfig.js";

type FrontpageArticle = Frontpage["latestArticles"][number];

interface FrontpagePageProps {
  frontpageData: Frontpage;
  selectedSection: number;
  selectedArticle: number;
  frontpageSection: 'middle' | 'right';
  selectedSidebarIndex?: number;
  selectedTagFilter?: string | null;
  onNavigateToArticle: (articleId: string) => void;
  onNavigateToListings: () => void;
}

// Flattened item type for the middle section
type FlatItem = 
  | { type: 'header'; text: string; key: string }
  | { type: 'article'; article: FrontpageArticle; globalIndex: number; variant: 'default' | 'compact'; key: string };

export const FrontpagePage = ({
  frontpageData,
  selectedArticle,
  frontpageSection,
  selectedSidebarIndex = 0,
  selectedTagFilter,
}: FrontpagePageProps) => {

  const formatArticleDate = (value: Date | string): string => {
    if (value instanceof Date) return value.toLocaleDateString();
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? value : new Date(parsed).toLocaleDateString();
  };

  // Build a flat list of items for the middle section
  // Each article is a direct item, headers are separate items (but not navigable)
  const flatItems = useMemo((): FlatItem[] => {
    const items: FlatItem[] = [];
    const articles = frontpageData.latestArticles;
    
    // Add header for latest articles
    const headerText = selectedTagFilter 
      ? `Articles tagged with #${selectedTagFilter}`
      : t("latestArticles");
    items.push({ type: 'header', text: headerText, key: 'header-latest' });
    
    // Add all articles in a flat list
    articles.forEach((article, index) => {
      // First 3 are "hero" style, rest are compact
      const variant = index < 3 ? 'default' : 'compact';
      items.push({ 
        type: 'article', 
        article, 
        globalIndex: index, 
        variant,
        key: article.id 
      });
    });
    
    return items;
  }, [frontpageData.latestArticles, selectedTagFilter]);

  // Count only articles (not headers) for navigation
  const articleCount = frontpageData.latestArticles.length;

  const middleSectionRef = useListNavigation({
    selectedIndex: selectedArticle,
    isActive: frontpageSection === 'middle',
    itemCount: flatItems.length,
    buffer: 2,
    scrollBehavior: 'minimal',
  });

  const rightSidebarCounts = useMemo(() => getRightSidebarCounts(frontpageData), [
    frontpageData.jobs.length,
    frontpageData.events.upcomingEvents.length,
    frontpageData.newestComments.length,
  ]);

  const rightSidebarRef = useListNavigation({
    selectedIndex: selectedSidebarIndex,
    isActive: frontpageSection === 'right',
    itemCount: getRightSidebarTotal(rightSidebarCounts),
    buffer: 2,
  });

  const visibleJobs = useMemo(
    () => frontpageData.jobs.slice(0, rightSidebarCounts.jobs),
    [frontpageData.jobs, rightSidebarCounts.jobs]
  );
  const visibleEvents = useMemo(
    () => frontpageData.events.upcomingEvents.slice(0, rightSidebarCounts.events),
    [frontpageData.events.upcomingEvents, rightSidebarCounts.events]
  );
  const visibleComments = useMemo(
    () => frontpageData.newestComments.slice(0, rightSidebarCounts.comments),
    [frontpageData.newestComments, rightSidebarCounts.comments]
  );

  const viewAllIndex = rightSidebarCounts.jobs;
  const eventBaseIndex = viewAllIndex + 1;
  const commentBaseIndex = eventBaseIndex + rightSidebarCounts.events;

  // Map article globalIndex to flat list index (accounting for headers)
  const articleToFlatIndex = (articleIndex: number): number => {
    // Header is at index 0, so article 0 is at flat index 1, etc.
    return articleIndex + 1;
  };

  const selectedFlatIndex = articleToFlatIndex(selectedArticle);

  return (
    <box
      style={{
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: themeColors.navigation.background,
      }}
    >
      {/* Filter indicator */}
      {selectedTagFilter && (
        <box
          style={{
            height: 3,
            width: "100%",
            backgroundColor: themeColors.tag.background,
            padding: 1,
            marginBottom: 1,
          }}
        >
          <text
            content={`🏷️ Filtering by: #${selectedTagFilter} (press c to clear, esc to clear)`}
            style={{ fg: themeColors.tag.name, attributes: 1 }}
          />
        </box>
      )}

      <box style={{ flexDirection: "row", width: "100%", flexGrow: 1 }}>
        {/* Middle Section - Flattened article list */}
        <box style={{ flexDirection: "column", width: "75%", marginRight: 1 }}>
          <ScrollSurface
            ref={middleSectionRef}
            focused={frontpageSection === 'middle'}
            variant="panel"
            padding={1}
            width="100%"
          >
            {articleCount === 0 && selectedTagFilter ? (
              <box
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <text
                  content={`No articles found for tag: #${selectedTagFilter}`}
                  style={{ fg: 'yellow', attributes: 1, marginBottom: 2 }}
                />
                <text
                  content="Press 'c' or 'esc' to clear filter"
                  style={{ fg: 'gray' }}
                />
              </box>
            ) : (
              flatItems.map((item, flatIndex) => {
                if (item.type === 'header') {
                  return (
                    <box
                      key={item.key}
                      style={{
                        marginBottom: 1,
                        padding: 1,
                      }}
                    >
                      <text
                        content={item.text}
                        style={{ fg: themeColors.navigation.normal, attributes: 1 }}
                      />
                    </box>
                  );
                }

                const tags = item.article.tags
                  ? item.article.tags.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 3)
                  : [];
                const isSelected = item.globalIndex === selectedArticle && frontpageSection === 'middle';

                return (
                  <ArticleCard
                    key={item.key}
                    data={{
                      title: item.article.title,
                      subtitle: item.article.subtitle,
                      author: item.article.byline.name,
                      date: formatArticleDate(item.article.published),
                      reactions: item.article.reactions.reactions_count,
                      comments: item.article.reactions.comments_count,
                      tags,
                    }}
                    prefix={`${item.globalIndex + 1}.`}
                    selected={isSelected}
                    footnote={isSelected ? t("pressEnter") : undefined}
                    variant={item.variant}
                  />
                );
              })
            )}
          </ScrollSurface>
        </box>

        {/* Right Sidebar */}
        <box
          style={{
            width: "22%",
            backgroundColor: themeColors.navigation.background,
            flexDirection: "column",
            marginLeft: 1,
          }}
        >
          <text
            content={t("jobsEvents")}
            style={{ fg: themeColors.navigation.normal, attributes: 1 }}
          />
          <ScrollSurface
            ref={rightSidebarRef}
            variant="sidebar"
            focused={frontpageSection === 'right'}
            width="100%"
          >
            {/* Jobs */}
            {visibleJobs.map((job, index) => {
              const isSelected = frontpageSection === 'right' && index === selectedSidebarIndex;
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  selected={isSelected}
                />
              );
            })}

            {/* View All Jobs Button */}
            <box
              style={{
                marginTop: 1,
                marginBottom: 2,
                padding: 1,
                border: true,
                borderColor: frontpageSection === 'right' && selectedSidebarIndex === viewAllIndex 
                  ? themeColors.navigation.selectedText 
                  : themeColors.navigation.selected,
                backgroundColor: frontpageSection === 'right' && selectedSidebarIndex === viewAllIndex 
                  ? themeColors.navigation.selectedText 
                  : colors.surface.card,
              }}
            >
              <text
                content={`→ ${t("viewAllJobs")}`}
                style={{
                  fg: frontpageSection === 'right' && selectedSidebarIndex === viewAllIndex 
                    ? themeColors.navigation.background 
                    : themeColors.navigation.normal,
                  attributes: 1,
                }}
              />
            </box>

            {/* Events */}
            <text
              content={t("upcomingEvents")}
              style={{ fg: themeColors.navigation.normal, attributes: 1, marginBottom: 1 }}
            />
            {visibleEvents.map((event, index) => {
              const eventIndex = eventBaseIndex + index;
              const isSelected = frontpageSection === 'right' && eventIndex === selectedSidebarIndex;
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
            <text
              content={t("newestComments")}
              style={{ fg: themeColors.navigation.normal, attributes: 1, marginTop: 2, marginBottom: 1 }}
            />
            {visibleComments.map((comment, index) => {
              const commentIndex = commentBaseIndex + index;
              const isSelected = frontpageSection === 'right' && commentIndex === selectedSidebarIndex;
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
      </box>
    </box>
  );
};

const getRightSidebarTotal = (counts: { jobs: number; events: number; comments: number }): number => {
  return counts.jobs + 1 + counts.events + counts.comments; // +1 for "View All" button
};
