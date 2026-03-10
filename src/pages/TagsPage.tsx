import { useState, useEffect } from "react";
import { api } from "../services/api.js";
import { useListNavigation } from "../hooks/useListNavigation.js";
import { t } from "../i18n/index.js";
import { themeColors } from "../theme/colors.js";
import { ArticleCard } from "../components/ArticleCard.js";
import type { ArticleCardData } from "../components/ArticleCard.js";
import ScrollSurface from "../components/ScrollSurface.js";

interface TagsPageProps {
  selectedTag: number;
  selectedTagName: string | null;
  onTagSelect: (tag: string) => void;
}

interface TagInfo {
  name: string;
  count: number;
}

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
  const [tags] = useState<TagInfo[]>(popularTags);
  const [tagArticles, setTagArticles] = useState<ArticleCardData[]>([]);
  const [loading, setLoading] = useState(false);

  const tagsScrollboxRef = useListNavigation({
    selectedIndex: selectedTag,
    isActive: true,
    buffer: 1,
  });

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
        const published =
          article.published instanceof Date
            ? article.published.toLocaleDateString()
            : (() => {
                const parsed = Date.parse(article.published as unknown as string);
                return Number.isNaN(parsed)
                  ? String(article.published ?? "")
                  : new Date(parsed).toLocaleDateString();
              })();
        return {
          title: article.title || t("articleNumber", { number: index + 1 }),
          date: published || t("dateUnknown"),
          tags: article.tags?.slice(0, 3) ?? [],
        } satisfies ArticleCardData;
      });
      setTagArticles(mapped);
    } catch {
      setTagArticles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <box style={{ flexDirection: "row", height: "100%", width: "100%" }}>
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
        <ScrollSurface
          ref={tagsScrollboxRef}
          variant="sidebar"
          focused
          width="100%"
        >
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
        </ScrollSurface>
      </box>

      <box
        style={{
          flexDirection: "column",
          padding: 1,
          flexGrow: 1,
          height: "100%",
          marginLeft: 1,
        }}
      >
        {!selectedTagName ? (
          <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <text content={t("selectTag")} style={{ fg: "cyan", attributes: 1, marginBottom: 1 }} />
            <text content={t("chooseCategory")} style={{ fg: "gray" }} />
          </box>
        ) : (
          <box style={{ flexDirection: "column", height: "100%" }}>
            <text
              content={t("articlesTaggedWith", { name: selectedTagName })}
              style={{ fg: "green", attributes: 1, marginBottom: 1 }}
            />
            {loading ? (
              <text content={t("loadingArticles")} style={{ fg: "blue" }} />
            ) : tagArticles.length === 0 ? (
              <text content={t("noArticlesFound")} style={{ fg: "yellow" }} />
            ) : (
              tagArticles.slice(0, 10).map((article, index) => (
                <ArticleCard
                  key={`${article.title}-${index}`}
                  data={article}
                  prefix={`${index + 1}.`}
                  variant="compact"
                />
              ))
            )}
          </box>
        )}
      </box>
    </box>
  );
};
