import { useState, useEffect, useRef } from "react";
import { api } from "../services/api.js";
import { useScrollboxFocus } from "../hooks/useScrollboxFocus.js";
import type { ScrollBoxRenderable } from "@opentui/core";
import { t } from "../i18n/index.js";
import { themeColors } from "../theme/colors.js";
import { ArticleCard } from "../components/ArticleCard.js";
import type { ArticleCardData } from "../components/ArticleCard.js";

interface TagsPageProps {
  selectedTag: number;
  selectedTagName: string | null;
  onTagSelect: (tag: string) => void;
}

interface TagInfo {
  name: string;
  count: number;
  description?: string;
}

// Kode24 tags from left menu navigation
export const popularTags: TagInfo[] = [
  { name: "lønn", count: 0 },
  { name: "sikkerhet", count: 0 },
  { name: "meninger", count: 0 },
  { name: "utdanning", count: 0 },
  { name: "karriere", count: 0 },
  { name: "kontor", count: 0 },
  { name: "frontend", count: 0 },
  { name: "backend", count: 0 },
  { name: "apputvikling", count: 0 },
  { name: "devops", count: 0 },
  { name: "IoT", count: 0 },
  { name: "maskinlæring", count: 0 },
  { name: "design", count: 0 },
  { name: "tilgjengelighet", count: 0 },
  { name: "ukas koder", count: 0 },
  { name: "inn/ut", count: 0 },
  { name: "hobby", count: 0 },
];

export const TagsPage = ({
  selectedTag,
  selectedTagName,
  onTagSelect,
}: TagsPageProps) => {
  const [tags, setTags] = useState<TagInfo[]>([]);
  const [tagArticles, setTagArticles] = useState<ArticleCardData[]>([]);
  const [loading, setLoading] = useState(false);

  const tagsScrollboxRef = useRef<ScrollBoxRenderable>(null);
  const articlesScrollboxRef = useScrollboxFocus([tagArticles]);

  useEffect(() => {
    if (tagsScrollboxRef.current) {
      const estimatedHeightPerTag = 2;
      tagsScrollboxRef.current.scrollTop = selectedTag * estimatedHeightPerTag;
    }
  }, [selectedTag]);

  useEffect(() => {
    setTags(popularTags);
  }, []);

  useEffect(() => {
    if (selectedTagName) {
      fetchTagArticles(selectedTagName);
    }
  }, [selectedTagName]);

  const fetchTagArticles = async (tagName: string) => {
    try {
      setLoading(true);
      const articles = await api.fetchTagArticles(tagName);
      const mapped: ArticleCardData[] = articles.map((article, index) => {
        const primaryByline = article.full_bylines?.[0];
        const author = primaryByline
          ? `${primaryByline.firstname}${
              primaryByline.lastname ? ` ${primaryByline.lastname}` : ""
            }`.trim()
          : article.byline;
        const published =
          article.published instanceof Date
            ? article.published.toLocaleDateString()
            : (() => {
                const parsed = Date.parse(
                  article.published as unknown as string
                );
                return Number.isNaN(parsed)
                  ? String(article.published ?? "")
                  : new Date(parsed).toLocaleDateString();
              })();
        return {
          title: article.title || t("articleNumber", { number: index + 1 }),
          subtitle: article.teaserSubtitle || article.teaserTitle,
          author: author || t("unknownAuthor"),
          date: published || t("dateUnknown"),
          excerpt:
            article.description ||
            article.someDescription ||
            article.teaserDescription,
          tags: article.tags?.slice(0, 3) ?? [],
        } satisfies ArticleCardData;
      });
      setTagArticles(mapped);
    } catch (error) {
      console.error("Failed to fetch tag articles:", error);
      setTagArticles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <box style={{ flexDirection: "row", height: "100%", width: "100%" }}>
      {/* Left: Tags List */}
      <box
        style={{
          width: 30,
          backgroundColor: themeColors.navigation.background,
          flexDirection: "column",
          padding: 1,
        }}
      >
        <text
          content={t("categoriesTags")}
          style={{ fg: themeColors.navigation.normal, attributes: 1 }}
        />
        <scrollbox ref={tagsScrollboxRef} style={{ height: "100%" }}>
          {tags.map((tag, index) => (
            <box
              key={tag.name}
              style={{
                marginTop: 1,
                backgroundColor:
                  index === selectedTag
                    ? themeColors.navigation.selected
                    : undefined,
              }}
            >
              <text
                content={`${index === selectedTag ? "▶" : " "} ${tag.name}`}
                style={{
                  fg:
                    index === selectedTag
                      ? themeColors.navigation.selectedText
                      : themeColors.tag.name,
                }}
              />
            </box>
          ))}
        </scrollbox>
      </box>

      {/* Main: Tag Articles or Instructions */}
      <box style={{ flexDirection: "column", padding: 1, width: "70%" }}>
        {!selectedTagName ? (
          <box
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <text
              content={t("selectTag")}
              style={{ fg: "cyan", attributes: 1, marginBottom: 1 }}
            />
            <text
              content={t("chooseCategory")}
              style={{ fg: "gray", marginBottom: 2 }}
            />
            <text
              content={t("popularCategories")}
              style={{ fg: "white", marginBottom: 1 }}
            />
            <text
              content={t("frontend")}
              style={{ fg: "blue", marginBottom: 1 }}
            />
            <text
              content={t("backend")}
              style={{ fg: "blue", marginBottom: 1 }}
            />
            <text
              content={t("devops")}
              style={{ fg: "blue", marginBottom: 1 }}
            />
            <text content={t("maskinlaering")} style={{ fg: "blue" }} />
          </box>
        ) : (
          <box style={{ flexDirection: "column", height: "100%" }}>
            <text
              content={t("articlesTaggedWith", { name: selectedTagName })}
              style={{ fg: "green", attributes: 1, marginBottom: 1 }}
            />

            {loading ? (
              <box
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <text content={t("loadingArticles")} style={{ fg: "blue" }} />
              </box>
            ) : tagArticles.length === 0 ? (
              <box
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <text content={t("noArticlesFound")} style={{ fg: "yellow" }} />
              </box>
            ) : (
              tagArticles
                .slice(0, 10)
                .map((article, index) => (
                  <ArticleCard
                    key={`${article.title}-${index}`}
                    data={article}
                    prefix={`${index + 1}.`}
                  />
                ))
            )}
          </box>
        )}
      </box>
    </box>
  );
};
