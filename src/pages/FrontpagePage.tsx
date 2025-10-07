import { useMemo, useEffect, useRef } from "react";
import type { Frontpage } from "../types/index.js";
import { colors, themeColors } from "../theme/colors.js";
import type { ScrollBoxRenderable } from "@opentui/core";
import { useListNavigation } from "../hooks/useListNavigation.js";
import { t } from "../i18n/index.js";
import { JobCard } from "../components/JobCard.js";
import { ArticleCard } from "../components/ArticleCard.js";
import { popularTags } from "./TagsPage.js";

type FrontpageArticle = Frontpage["latestArticles"][number];
type FrontpageSection = Frontpage["frontpage"][number];

type ContentBlock =
  | {
      type: "articles";
      articles: FrontpageArticle[];
      chunkIndex: number;
      startIndex: number;
    }
  | {
      type: "section";
      section: FrontpageSection;
      sectionIndex: number;
    };

interface FrontpagePageProps {
  frontpageData: Frontpage;
  selectedSection: number;
  selectedArticle: number;
  frontpageSection: 'left' | 'middle' | 'right';
  selectedTagIndex?: number;
  selectedSidebarIndex?: number;
  selectedTagFilter?: string | null;
  onNavigateToArticle: (articleId: string) => void;
  onNavigateToListings: () => void;
}

export const FrontpagePage = ({
  frontpageData,
  selectedSection,
  selectedArticle,
  frontpageSection,
  selectedTagIndex = 0,
  selectedSidebarIndex = 0,
  selectedTagFilter,
  onNavigateToArticle,
  onNavigateToListings,
}: FrontpagePageProps) => {

  const chunkPattern = [3, 2] as const;
  const totalSections = frontpageData.frontpage.length;

  const clampSectionArticles = (
    section: FrontpageSection
  ): FrontpageArticle[] => {
    const parsed = Number.parseInt(section.antall, 10);
    const limit = Number.isNaN(parsed)
      ? section.articles.length
      : parsed;
    return section.articles.slice(0, limit);
  };

  const heroRowHeight = 7;
  const compactRowHeight = 5;
  const sectionRowHeight = 5;
  const blockHeaderHeight = 2;
  const blockGapHeight = 1;

  const buildContentBlocks = (
    articles: FrontpageArticle[],
    sections: FrontpageSection[],
    pattern: readonly number[],
    chunkIndex = 0,
    startIndex = 0,
    acc: ContentBlock[] = []
  ): ContentBlock[] => {
    if (articles.length === 0) {
      if (sections.length === 0) {
        return acc;
      }
      const [nextSection, ...restSections] = sections;
      const sectionIndex = totalSections - sections.length;
      const nextAcc: ContentBlock[] = [
        ...acc,
        { type: "section", section: nextSection, sectionIndex },
      ];
      return buildContentBlocks(
        articles,
        restSections,
        pattern,
        chunkIndex,
        startIndex,
        nextAcc
      );
    }

    const size = pattern[chunkIndex % pattern.length];
    const chunk = articles.slice(0, size);
    const remainingArticles = articles.slice(chunk.length);
    const chunkBlock: ContentBlock = {
      type: "articles",
      articles: chunk,
      chunkIndex,
      startIndex,
    };
    const nextAcc = [...acc, chunkBlock];

    if (chunkIndex !== 0 && sections.length > 0) {
      const [nextSection, ...restSections] = sections;
      const sectionIndex = totalSections - sections.length;
      const withSection: ContentBlock[] = [
        ...nextAcc,
        { type: "section", section: nextSection, sectionIndex },
      ];
      return buildContentBlocks(
        remainingArticles,
        restSections,
        pattern,
        chunkIndex + 1,
        startIndex + chunk.length,
        withSection
      );
    }

    return buildContentBlocks(
      remainingArticles,
      sections,
      pattern,
      chunkIndex + 1,
      startIndex + chunk.length,
      nextAcc
    );
  };

  const contentBlocks = useMemo(
    () =>
      buildContentBlocks(
        frontpageData.latestArticles,
        frontpageData.frontpage,
        chunkPattern
      ),
    [frontpageData.frontpage, frontpageData.latestArticles]
  );

  const metrics = useMemo(() => {
    const articleOffsets: Record<string, { top: number; height: number }> = {};
    const sectionOffsets = new Map<number, { top: number; height: number }>();
    let offset = 0;
    contentBlocks.forEach((block) => {
      const blockStart = offset;
      offset += blockHeaderHeight;
      if (block.type === "articles") {
        const rowHeight = block.chunkIndex === 0 ? heroRowHeight : compactRowHeight;
        block.articles.forEach((article) => {
          articleOffsets[article.id] = { top: offset, height: rowHeight };
          offset += rowHeight;
        });
      } else {
        const items = clampSectionArticles(block.section);
        items.forEach((article) => {
          articleOffsets[article.id] = { top: offset, height: sectionRowHeight };
          offset += sectionRowHeight;
        });
        sectionOffsets.set(block.sectionIndex, {
          top: blockStart,
          height: offset - blockStart,
        });
      }
      offset += blockGapHeight;
    });
    return { articleOffsets, sectionOffsets };
  }, [contentBlocks]);

  const selectedArticleId = useMemo(
    () => frontpageSection === 'middle' ? frontpageData.latestArticles[selectedArticle]?.id ?? null : null,
    [frontpageData.latestArticles, selectedArticle, frontpageSection]
  );

  const leftSidebarMetrics = useMemo(() => {
    const metrics: Record<number, { top: number; height: number }> = {};
    const itemHeight = 4;
    popularTags.forEach((_, index) => {
      metrics[index] = { top: index * itemHeight, height: itemHeight };
    });
    return metrics;
  }, []);

  const rightSidebarMetrics = useMemo(() => {
    const metrics: Record<number, { top: number; height: number }> = {};
    const itemHeight = 4;
    const jobCount = frontpageData.jobs.length;
    const eventCount = frontpageData.events.upcomingEvents.length;
    const commentCount = frontpageData.newestComments.length;
    
    let offset = 0;
    
    for (let i = 0; i < jobCount; i++) {
      metrics[i] = { top: offset, height: itemHeight };
      offset += itemHeight;
    }
    
    offset += 5;
    metrics[jobCount] = { top: offset, height: 3 };
    offset += 3;
    
    offset += 3;
    for (let i = 0; i < eventCount; i++) {
      const index = jobCount + 1 + i;
      metrics[index] = { top: offset, height: itemHeight };
      offset += itemHeight;
    }
    
    offset += 4;
    for (let i = 0; i < commentCount; i++) {
      const index = jobCount + 1 + eventCount + i;
      metrics[index] = { top: offset, height: itemHeight };
      offset += itemHeight;
    }
    
    return metrics;
  }, [frontpageData.jobs.length, frontpageData.events.upcomingEvents.length, frontpageData.newestComments.length]);

  const leftSidebarRef = useListNavigation({
    selectedIndex: selectedTagIndex,
    isActive: frontpageSection === 'left',
    metrics: leftSidebarMetrics,
    buffer: 2,
  });

  const rightSidebarRef = useListNavigation({
    selectedIndex: selectedSidebarIndex,
    isActive: frontpageSection === 'right',
    metrics: rightSidebarMetrics,
    buffer: 2,
  });

  const middleSectionRef = useListNavigation({
    selectedIndex: selectedArticle,
    isActive: frontpageSection === 'middle',
    metrics: metrics.articleOffsets,
    buffer: 1,
    scrollBehavior: 'minimal',
  });

  const formatArticleDate = (value: Date | string): string => {
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
      return value;
    }
    return new Date(parsed).toLocaleDateString();
  };

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
            style={{
              fg: themeColors.tag.name,
              attributes: 1,
            }}
          />
        </box>
      )}

      <box
        style={{
          flexDirection: "row",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Left Sidebar */}
        <box
          style={{
            width: "20%",
            backgroundColor: themeColors.navigation.background,
            flexDirection: "column",
            padding: 1,
            marginRight: 1,
          }}
        >
          <text
            content={t("categoriesTags")}
            style={{ fg: themeColors.navigation.normal, attributes: 1 }}
          />
          <scrollbox
            ref={leftSidebarRef}
            style={{
              height: "100%",
              border: true,
              borderColor: frontpageSection === 'left' ? themeColors.navigation.selectedText : themeColors.navigation.selected,
              backgroundColor: frontpageSection === 'left' ? themeColors.navigation.selected : 'transparent',
              padding: 1,
              marginTop: 1,
            }}
          >
            {popularTags.map((tag, index) => {
              const isSelected = frontpageSection === 'left' && index === selectedTagIndex;
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
                    content={`${isActiveFilter ? '🏷️ ' : ''}#${tag.name}`}
                    style={{ 
                      fg: isSelected ? themeColors.navigation.background : isActiveFilter ? themeColors.tag.name : themeColors.tag.name, 
                      attributes: isActiveFilter ? 1 : 0
                    }}
                  />
                </box>
              );
            })}
          </scrollbox>
        </box>

        {/* Middle Section */}
        <box
          style={{
            flexDirection: "column",
            width: "60%",
            marginLeft: 1,
            marginRight: 1,
          }}
        >
          <scrollbox
            ref={middleSectionRef}
            style={{
              height: "100%",
              border: true,
              borderColor: frontpageSection === 'middle' ? themeColors.navigation.selectedText : themeColors.navigation.selected,
              backgroundColor: frontpageSection === 'middle' ? themeColors.navigation.selected : 'transparent',
              padding: 1,
            }}
          >
            {contentBlocks.length === 0 && selectedTagFilter ? (
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
              contentBlocks.map((block, blockIndex) => {
                if (block.type === "articles") {
                  const heading =
                    block.chunkIndex === 0
                      ? selectedTagFilter 
                        ? `Articles tagged with #${selectedTagFilter}`
                        : t("latestArticles")
                      : t("moreFrontpageArticles");
                  return (
                    <box
                      key={`articles-${blockIndex}`}
                      style={{
                        flexDirection: "column",
                        border: true,
                        borderColor: themeColors.navigation.selected,
                        padding: 1,
                        marginBottom: 1,
                        backgroundColor: colors.surface.card,
                      }}
                    >
                      <text
                        content={heading}
                        style={{
                          fg: themeColors.navigation.normal,
                          attributes: block.chunkIndex === 0 ? 1 : 0,
                        }}
                      />
                      <box style={{ flexDirection: "column", marginTop: 1 }}>
                        {block.articles.map((article, articleIndex) => {
                          const tags = article.tags
                            ? article.tags
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter(Boolean)
                                .slice(0, 3)
                            : [];
                          const globalIndex = block.startIndex + articleIndex;
                          const isSelected = globalIndex === selectedArticle;
                          return (
                            <ArticleCard
                              key={article.id}
                              data={{
                                title: article.title,
                                subtitle: article.subtitle,
                                author: article.byline.name,
                                date: formatArticleDate(article.published),
                                reactions: article.reactions.reactions_count,
                                comments: article.reactions.comments_count,
                                tags,
                              }}
                              prefix={`${globalIndex + 1}.`}
                              selected={isSelected}
                              footnote={
                                isSelected ? t("pressEnter") : undefined
                              }
                              variant={block.chunkIndex === 0 ? "default" : "compact"}
                            />
                          );
                        })}
                      </box>
                    </box>
                  );
                }

                const isFocus = block.sectionIndex === selectedSection;
                const focusBg = isFocus
                  ? themeColors.navigation.selected
                  : colors.surface.card;
                const titleFg = isFocus
                  ? themeColors.navigation.selectedText
                  : themeColors.navigation.normal;
                const items = clampSectionArticles(block.section);
                const tagLabel = block.section.tags1
                  ? `#${block.section.tags1}`
                  : undefined;
                return (
                  <box
                    key={`section-${block.section.title}-${blockIndex}`}
                    style={{
                      flexDirection: "column",
                      border: true,
                      borderColor: themeColors.navigation.selected,
                      padding: 1,
                      marginBottom: 1,
                      backgroundColor: focusBg,
                    }}
                  >
                    <text
                      content={block.section.title}
                      style={{ fg: titleFg, attributes: 1 }}
                    />
                    {block.section.description ? (
                      <text
                        content={block.section.description}
                        style={{ fg: themeColors.navigation.normal, marginTop: 0 }}
                      />
                    ) : null}
                    {tagLabel ? (
                      <text
                        content={tagLabel}
                        style={{ fg: themeColors.tag.name, marginTop: 1 }}
                      />
                    ) : null}
                    <box style={{ flexDirection: "column", marginTop: 1 }}>
                      {items.map((article, articleIndex) => {
                        const tags = article.tags
                          ? article.tags
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean)
                              .slice(0, 3)
                          : [];
                        return (
                          <ArticleCard
                            key={article.id}
                            data={{
                              title: article.title,
                              subtitle: article.subtitle,
                              author: article.byline.name,
                              date: formatArticleDate(article.published),
                              reactions: article.reactions.reactions_count,
                              comments: article.reactions.comments_count,
                              tags,
                            }}
                            footnote={t("pressEnterToRead")}
                            prefix={`${articleIndex + 1}.`}
                            variant="compact"
                          />
                        );
                      })}
                    </box>
                  </box>
                );
              })
            )}
          </scrollbox>
        </box>

        {/* Right Sidebar */}
        <box
          style={{
            width: "20%",
            backgroundColor: themeColors.navigation.background,
            flexDirection: "column",
            padding: 1,
            marginLeft: 1,
          }}
        >
          <text
            content={t("jobsEvents")}
            style={{ fg: themeColors.navigation.normal, attributes: 1 }}
          />
          <scrollbox
            style={{
              height: "100%",
              border: true,
              borderColor: frontpageSection === 'right' ? themeColors.navigation.selectedText : themeColors.navigation.selected,
              backgroundColor: frontpageSection === 'right' ? themeColors.navigation.selected : 'transparent',
              padding: 1,
              marginTop: 1,
            }}
          >
            {/* Jobs */}
            {frontpageData.jobs.slice(0, 3).map((job, index) => {
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
                borderColor: frontpageSection === 'right' && selectedSidebarIndex === frontpageData.jobs.length ? themeColors.navigation.selectedText : themeColors.navigation.selected,
                backgroundColor: frontpageSection === 'right' && selectedSidebarIndex === frontpageData.jobs.length ? themeColors.navigation.selectedText : colors.surface.card,
              }}
            >
              <text
                content={`→ ${t("viewAllJobs")}`}
                style={{
                  fg: frontpageSection === 'right' && selectedSidebarIndex === frontpageData.jobs.length ? themeColors.navigation.background : themeColors.navigation.normal,
                  attributes: 1,
                }}
              />
            </box>

            {/* Events */}
            <text
              content={t("upcomingEvents")}
              style={{ fg: themeColors.navigation.normal, attributes: 1, marginBottom: 1 }}
            />
            {frontpageData.events.upcomingEvents.slice(0, 2).map((event, index) => {
              const eventIndex = frontpageData.jobs.length + 1 + index;
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
                    style={{
                      fg: isSelected ? themeColors.navigation.background : themeColors.navigation.normal,
                    }}
                  />
                </box>
              );
            })}

            {/* Comments */}
            <text
              content={t("newestComments")}
              style={{ fg: themeColors.navigation.normal, attributes: 1, marginTop: 2, marginBottom: 1 }}
            />
            {frontpageData.newestComments.slice(0, 2).map((comment, index) => {
              const commentIndex = frontpageData.jobs.length + 1 + frontpageData.events.upcomingEvents.length + index;
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
                    style={{
                      fg: isSelected ? themeColors.navigation.background : themeColors.navigation.normal,
                    }}
                  />
                </box>
              );
            })}
          </scrollbox>
        </box>
      </box>
    </box>
  );
};