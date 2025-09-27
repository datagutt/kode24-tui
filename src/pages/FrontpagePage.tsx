import React, { useRef, useEffect, useMemo } from "react";
import type { Frontpage } from "../types/index.js";
import { colors, themeColors } from "../theme/colors.js";
import type { ScrollBoxRenderable } from "@opentui/core";
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
  onNavigateToArticle: (articleId: string) => void;
  onNavigateToListings: () => void;
}

export const FrontpagePage = ({
  frontpageData,
  selectedSection,
  selectedArticle,
  onNavigateToArticle,
  onNavigateToListings,
}: FrontpagePageProps) => {
  const sectionsRef = useRef<ScrollBoxRenderable>(null);

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

  const measureArticlesBlock = (
    block: Extract<ContentBlock, { type: "articles" }>
  ): number =>
    blockHeaderHeight +
    block.articles.length *
      (block.chunkIndex === 0 ? heroRowHeight : compactRowHeight) +
    blockGapHeight;

  const measureSectionBlock = (
    block: Extract<ContentBlock, { type: "section" }>
  ): number => {
    const items = clampSectionArticles(block.section);
    return blockHeaderHeight + items.length * sectionRowHeight + blockGapHeight;
  };

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

  const findSectionScrollTop = (
    blocks: ContentBlock[],
    targetSectionIndex: number,
    offset = 0
  ): number | null => {
    if (blocks.length === 0) {
      return null;
    }
    const [block, ...rest] = blocks;
    if (block.type === "section") {
      if (block.sectionIndex === targetSectionIndex) {
        return offset;
      }
      return findSectionScrollTop(
        rest,
        targetSectionIndex,
        offset + measureSectionBlock(block)
      );
    }
    return findSectionScrollTop(
      rest,
      targetSectionIndex,
      offset + measureArticlesBlock(block)
    );
  };

  const findArticleScrollTop = (
    blocks: ContentBlock[],
    targetArticleId: string | null,
    offset = 0
  ): number | null => {
    if (!targetArticleId || blocks.length === 0) {
      return null;
    }
    const [block, ...rest] = blocks;
    if (block.type === "articles") {
      const itemHeight =
        block.chunkIndex === 0 ? heroRowHeight : compactRowHeight;
      const index = block.articles.findIndex(
        (article) => article.id === targetArticleId
      );
      if (index >= 0) {
        return offset + blockHeaderHeight + index * itemHeight;
      }
      return findArticleScrollTop(
        rest,
        targetArticleId,
        offset + measureArticlesBlock(block)
      );
    }
    const items = clampSectionArticles(block.section);
    const index = items.findIndex((article) => article.id === targetArticleId);
    if (index >= 0) {
      return offset + blockHeaderHeight + index * sectionRowHeight;
    }
    return findArticleScrollTop(
      rest,
      targetArticleId,
      offset + measureSectionBlock(block)
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

  const selectedArticleId = useMemo(
    () => frontpageData.latestArticles[selectedArticle]?.id ?? null,
    [frontpageData.latestArticles, selectedArticle]
  );

  useEffect(() => {
    if (!sectionsRef.current) {
      return;
    }
    const sectionTop = findSectionScrollTop(contentBlocks, selectedSection);
    if (sectionTop === null) {
      return;
    }
    const buffer = 2;
    sectionsRef.current.scrollTop = Math.max(0, sectionTop - buffer);
  }, [contentBlocks, selectedSection]);

  useEffect(() => {
    if (!sectionsRef.current) {
      return;
    }
    const articleTop = findArticleScrollTop(contentBlocks, selectedArticleId);
    if (articleTop === null) {
      return;
    }
    const buffer = 4;
    sectionsRef.current.scrollTop = Math.max(0, articleTop - buffer);
  }, [contentBlocks, selectedArticleId]);

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
      {/*<box
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 1,
          border: true,
          borderColor: themeColors.navigation.selected,
          backgroundColor: themeColors.navigation.selected,
        }}
      >
        <box style={{ flexDirection: "column" }}>
          <text
            content={t("latestArticles")}
            style={{ fg: themeColors.navigation.selectedText, marginTop: 0 }}
          />
        </box>
        <box style={{ flexDirection: "row" }}>
          <text
            content={`📰 ${totalArticles} ${t("articles")}`}
            style={{ fg: themeColors.navigation.selectedText, marginRight: 2 }}
          />
          <text
            content={`💼 ${totalJobs} ${t("jobListings")}`}
            style={{ fg: themeColors.navigation.selectedText, marginRight: 2 }}
          />
          <text
            content={`📅 ${totalEvents} ${t("upcomingEvents")}`}
            style={{ fg: themeColors.navigation.selectedText }}
          />
        </box>
      </box>*/}

      <box
        style={{
          flexDirection: "row",
          width: "100%",
          height: "100%",
          padding: 1,
        }}
      >
        <box
          style={{
            width: 28,
            backgroundColor: themeColors.navigation.background,
            border: true,
            borderColor: themeColors.navigation.selected,
            flexDirection: "column",
            padding: 1,
          }}
        >
          <text
            content={t("categoriesTags")}
            style={{ fg: themeColors.navigation.normal, attributes: 1 }}
          />
          <scrollbox style={{ height: "80%", marginTop: 1 }}>
            {popularTags.map((tag) => (
              <box
                key={tag.name}
                style={{
                  marginBottom: 1,
                  padding: 1,
                  border: true,
                  borderColor: themeColors.navigation.selected,
                  backgroundColor: colors.surface.card,
                }}
              >
                <text
                  content={`#${tag.name}`}
                  style={{ fg: themeColors.tag.name, attributes: 1 }}
                />
              </box>
            ))}
          </scrollbox>
        </box>

        <box
          style={{
            flexDirection: "column",
            width: "60%",
            marginLeft: 1,
            marginRight: 1,
          }}
        >
          <scrollbox
            ref={sectionsRef}
            style={{
              height: "100%",
              border: true,
              borderColor: themeColors.navigation.selected,
              padding: 1,
            }}
          >
            {contentBlocks.map((block, blockIndex) => {
              if (block.type === "articles") {
                const heading =
                  block.chunkIndex === 0
                    ? t("latestArticles")
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
                      const isSelected = article.id === selectedArticleId;
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
                          prefix={`${articleIndex + 1}.`}
                          selected={isSelected}
                          footnote={
                            isSelected ? t("pressEnter") : undefined
                          }
                          variant="compact"
                        />
                      );
                    })}
                  </box>
                </box>
              );
            })}
          </scrollbox>
        </box>

        <box
          style={{
            width: 32,
            border: true,
            borderColor: themeColors.navigation.selected,
            backgroundColor: colors.surface.raised,
            flexDirection: "column",
            padding: 1,
          }}
        >
          <text
            content={t("recentJobs")}
            style={{ fg: themeColors.navigation.selectedText, attributes: 1 }}
          />
          {frontpageData.jobs.slice(0, 4).map((job) => (
            <JobCard key={job.id} job={job} variant="compact" />
          ))}

          <text
            content={t("upcomingEvents")}
            style={{
              fg: themeColors.navigation.selectedText,
              attributes: 1,
              marginTop: 2,
            }}
          />
          {frontpageData.events.upcomingEvents.slice(0, 3).map((event) => (
            <box
              key={event.name}
              style={{
                border: true,
                borderColor: themeColors.navigation.selected,
                marginTop: 1,
                padding: 1,
                backgroundColor: colors.surface.card,
              }}
            >
              <text
                content={event.name}
                style={{ fg: themeColors.navigation.selectedText }}
              />
              <text
                content={event.arrangedBy}
                style={{ fg: themeColors.navigation.normal }}
              />
              <text
                content={event.startDateFormatted}
                style={{ fg: themeColors.navigation.normal }}
              />
            </box>
          ))}

          <text
            content={t("recentComments")}
            style={{
              fg: themeColors.navigation.selectedText,
              attributes: 1,
              marginTop: 2,
            }}
          />
          {frontpageData.newestComments.slice(0, 3).map((comment) => (
            <box
              key={comment.page_identifier}
              style={{
                border: true,
                borderColor: themeColors.navigation.selected,
                marginTop: 1,
                padding: 1,
                backgroundColor: colors.surface.card,
              }}
            >
              <text
                content={comment.user.name}
                style={{ fg: themeColors.navigation.selectedText }}
              />
              <text
                content={comment.bodySnippet.slice(0, 60)}
                style={{ fg: themeColors.navigation.normal }}
              />
            </box>
          ))}

          <box style={{ marginTop: 2 }}>
            <text
              content={t("viewAllJobs")}
              style={{ fg: themeColors.navigation.selectedText, attributes: 1 }}
            />
            <text
              content={t("pressEnter")}
              style={{ fg: themeColors.navigation.selectedText, marginTop: 0 }}
            />
          </box>
        </box>
      </box>
    </box>
  );
};
