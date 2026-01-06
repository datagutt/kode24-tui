import { useState, useEffect } from "react";
import { api } from "../services/api.js";
import { useScrollboxFocus } from "../hooks/useScrollboxFocus.js";
import { useListNavigation } from "../hooks/useListNavigation.js";
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
  const [terminalWidth, setTerminalWidth] = useState(() => {
    if (typeof process === "undefined") {
      return 120;
    }
    const output = process.stdout;
    if (!output) {
      return 120;
    }
    return output.columns ?? 120;
  });

  const tagsScrollboxRef = useListNavigation({
    selectedIndex: selectedTag,
    isActive: true,
    useDynamicMetrics: true,
    buffer: 1,
    scrollBehavior: 'minimal',
  });
  const articlesScrollboxRef = useScrollboxFocus([tagArticles]);

  useEffect(() => {
    if (typeof process === "undefined") {
      return;
    }
    const output = process.stdout;
    if (!output) {
      return;
    }
    const update = () => {
      setTerminalWidth(output.columns ?? 120);
    };
    update();
    if (typeof output.on !== "function") {
      return;
    }
    output.on("resize", update);
    return () => {
      if (typeof output.off === "function") {
        output.off("resize", update);
        return;
      }
      if (typeof output.removeListener === "function") {
        output.removeListener("resize", update);
      }
    };
  }, []);

  const narrowLayout = terminalWidth < 100;
  const tagsWidth = narrowLayout
    ? "100%"
    : Math.max(22, Math.min(36, Math.floor(terminalWidth * 0.22)));
  const contentHeight = narrowLayout ? "auto" : "100%";

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
          date: published || t("dateUnknown"),
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
    <box
      style={{
        flexDirection: narrowLayout ? "column" : "row",
        height: "100%",
        width: "100%",
      }}
    >
      {/* Left: Tags List */}
      <box
        style={{
          width: tagsWidth,
          backgroundColor: themeColors.navigation.background,
          flexDirection: "column",
          padding: 1,
          ...(narrowLayout ? { marginBottom: 1 } : {}),
        }}
      >
        <text
          content={t("categoriesTags")}
          style={{ fg: themeColors.navigation.normal, attributes: 1 }}
        />
        <scrollbox
          ref={tagsScrollboxRef}
          style={{ height: narrowLayout ? 12 : "100%" }}
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
        </scrollbox>
      </box>

      {/* Main: Tag Articles or Instructions */}
      <box
        style={{
          flexDirection: "column",
          padding: 1,
          width: narrowLayout ? "100%" : "auto",
          flexGrow: 1,
          height: contentHeight,
          ...(narrowLayout ? {} : { marginLeft: 1 }),
        }}
      >
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
              tagArticles.slice(0, 10).map((article, index) => {
                const metas = [
                  article.date ? `🗓️ ${article.date}` : null,
                  article.tags?.length ? `🏷️ ${article.tags.join(", ")}` : null,
                ].filter(Boolean) as string[];
                return (
                  <ArticleCard
                    key={`${article.title}-${index}`}
                    data={article}
                    prefix={`${index + 1}.`}
                    meta={metas.length > 0 ? metas : undefined}
                    variant="compact"
                  />
                );
              })
            )}
          </box>
        )}
      </box>
    </box>
  );
};
