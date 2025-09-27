import React, { useRef, useEffect } from "react";
import type { Frontpage } from "../types/index.js";
import { colors, themeColors } from "../theme/colors.js";
import type { ScrollBoxRenderable } from "@opentui/core";
import { t } from "../i18n/index.js";
import { JobCard } from "../components/JobCard.js";
import { ArticleCard } from "../components/ArticleCard.js";

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
  const scrollboxRef = useRef<ScrollBoxRenderable>(null);

  useEffect(() => {
    if (scrollboxRef.current) {
      const estimatedHeightPerArticle = 8;
      scrollboxRef.current.scrollTop =
        selectedArticle * estimatedHeightPerArticle;
    }
  }, [selectedArticle]);

  const hero =
    frontpageData.latestArticles[selectedArticle] ??
    frontpageData.latestArticles[0];
  const focusSection =
    frontpageData.frontpage[selectedSection] ?? frontpageData.frontpage[0];
  const sectionName = focusSection?.title ?? t("sections");
  const totalArticles = frontpageData.latestArticles.length;
  const totalJobs = frontpageData.jobs.length;
  const totalEvents = frontpageData.events.upcomingEvents.length;
  const heroTags = hero?.tags
    ? hero.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 2)
    : [];

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
            width: 32,
            backgroundColor: themeColors.navigation.background,
            border: true,
            borderColor: themeColors.navigation.selected,
            flexDirection: "column",
            padding: 1,
          }}
        >
          <text
            content={t("sections")}
            style={{ fg: themeColors.navigation.normal, attributes: 1 }}
          />
          <scrollbox style={{ height: "70%", marginTop: 1 }}>
            {frontpageData.frontpage.map((section, index) => {
              const isSelected = index === selectedSection;
              const marker = isSelected ? "▶" : " ";
              const fg = isSelected
                ? themeColors.navigation.selectedText
                : themeColors.tag.name;
              const bg = isSelected
                ? themeColors.navigation.selected
                : undefined;
              return (
                <box
                  key={section.title ?? `${index}`}
                  style={{
                    marginBottom: 1,
                    backgroundColor: bg,
                    padding: 1,
                    border: isSelected,
                  }}
                >
                  <text content={`${marker} ${section.title}`} style={{ fg }} />
                  {section.description && (
                    <text
                      content={section.description}
                      style={{
                        fg: themeColors.navigation.normal,
                        marginTop: 0,
                      }}
                    />
                  )}
                </box>
              );
            })}
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
          {hero && (
            <box
              style={{
                border: true,
                borderColor: themeColors.navigation.selected,
                padding: 2,
                marginBottom: 1,
                backgroundColor: colors.surface.raised,
                flexDirection: "column",
              }}
            >
              <text
                content={sectionName.toUpperCase()}
                style={{
                  fg: themeColors.navigation.selectedText,
                  attributes: 1,
                }}
              />
              <text
                content={hero.title}
                style={{
                  fg: themeColors.navigation.selectedText,
                  attributes: 1,
                  marginTop: 1,
                }}
              />
              {hero.subtitle && (
                <text
                  content={hero.subtitle}
                  style={{ fg: themeColors.tag.name, marginTop: 1 }}
                />
              )}
              <text
                content={`${hero.byline.name} • ${new Date(
                  hero.published
                ).toLocaleString()}`}
                style={{ fg: themeColors.navigation.normal, marginTop: 1 }}
              />
              <box style={{ flexDirection: "row", marginTop: 1 }}>
                <text
                  content={`🔥 ${hero.reactions.reactions_count}`}
                  style={{
                    fg: themeColors.navigation.selectedText,
                    marginRight: 2,
                  }}
                />
                <text
                  content={`💬 ${hero.reactions.comments_count}`}
                  style={{
                    fg: themeColors.navigation.selectedText,
                    marginRight: 2,
                  }}
                />
                {heroTags.length > 0 ? (
                  <text
                    content={`🏷️ ${heroTags.join(", ")}`}
                    style={{ fg: themeColors.navigation.selectedText }}
                  />
                ) : null}
              </box>
              <text
                content={t("pressEnter")}
                style={{
                  fg: themeColors.navigation.selectedText,
                  marginTop: 1,
                }}
              />
            </box>
          )}

          <scrollbox
            ref={scrollboxRef}
            style={{
              height: "100%",
              border: true,
              borderColor: themeColors.navigation.selected,
              padding: 1,
            }}
          >
            {frontpageData.latestArticles.map((article, index) => {
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
                  prefix={`${index + 1}.`}
                  selected={index === selectedArticle}
                  footnote={
                    index === selectedArticle ? t("pressEnter") : undefined
                  }
                />
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
