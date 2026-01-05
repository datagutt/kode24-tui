import { createFetch } from "@better-fetch/fetch";
import * as z from "zod";
import { OldFrontpageApiSchema, ArticleSchema } from "../schemas/frontpage.js";
import {
  LabSchema,
  SearchResultsSchema,
  TagArticlesResponseSchema,
  ResultSchema,
} from "../schemas/lab.js";
import type {
  Frontpage,
  Lab,
  SearchResults,
  TagArticlesResponse,
  Article,
} from "../types/index.js";

const BASE_URL = "https://docs.kode24.no/api";
const LABRADOR_BASE = "https://www.kode24.no";

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

// Create a better-fetch instance with retry configuration
const $fetch = createFetch({
  retry: {
    type: "exponential",
    attempts: 3,
    baseDelay: 1000,
    maxDelay: 5000,
  },
  timeout: 10000,
});

// Schema for the new frontpage API response
const NewFrontpageSchema = z.object({
  page: z.any(),
  result: z.array(ResultSchema).optional(),
});

// Transform a lab Result to an Article format
function transformResultToArticle(result: z.infer<typeof ResultSchema>): Article {
  return {
    id: String(result.id),
    title: result.title,
    published: result.published,
    section: result.section,
    image: result.images[0]?.url ?? "",
    published_url: result.url,
    tags: result.tags.join(", "),
    subtitle: result.teaserSubtitle || result.description,
    oldId: String(result.id),
    frontCropUrl: result.images[0]?.url ?? "",
    byline: {
      imageUrl: result.bylineImage,
      name: result.byline,
    },
    reactions: {
      reactions: [],
      comments_count: 0,
      reactions_count: 0,
    },
  };
}

export const api = {
  async fetchFrontpage(): Promise<Frontpage> {
    // Fetch both APIs in parallel
    const [oldApiResult, newApiResult] = await Promise.all([
      $fetch(`${BASE_URL}/frontpage`, { output: OldFrontpageApiSchema }),
      $fetch(`${LABRADOR_BASE}/?lab_viewport=json`, { output: NewFrontpageSchema }),
    ]);

    if (oldApiResult.error) {
      throw new ApiError(
        `Failed to fetch frontpage data: ${oldApiResult.error.message}`,
        oldApiResult.error.status
      );
    }

    if (newApiResult.error) {
      throw new ApiError(
        `Failed to fetch frontpage articles: ${newApiResult.error.message}`,
        newApiResult.error.status
      );
    }

    const oldData = oldApiResult.data!;
    const newData = newApiResult.data!;

    // Transform new API results to Article format
    const articles = (newData.result ?? []).map(transformResultToArticle);

    // Merge: use articles from new API, everything else from old API
    return {
      ...oldData,
      latestArticles: articles,
      frontpage: [], // No longer available from old API
    };
  },

  async fetchArticle(articleId: string): Promise<Lab> {
    const { data, error } = await $fetch(
      `${LABRADOR_BASE}/artikkel/${articleId}?lab_viewport=json&lab_content=full`,
      {
        output: LabSchema,
      }
    );

    if (error) {
      throw new ApiError(
        `Failed to fetch article: ${error.message}`,
        error.status
      );
    }

    // Check if we have essential article data
    if (!data!.page?.fields?.title && !data!.page?.fields?.bodytext) {
      throw new ApiError(
        "Article data is incomplete - missing title or content"
      );
    }

    return data!;
  },

  async searchArticles(query: string): Promise<SearchResults> {
    const { data, error } = await $fetch(
      `${BASE_URL}/search/${encodeURIComponent(query)}`,
      {
        output: SearchResultsSchema,
      }
    );

    if (error) {
      throw new ApiError(
        `Failed to search articles: ${error.message}`,
        error.status
      );
    }

    return data!;
  },

  async fetchTagArticles(tag: string): Promise<SearchResults> {
    const { data, error } = await $fetch(
      `${LABRADOR_BASE}/tag/${tag}?lab_viewport=json`,
      {
        output: TagArticlesResponseSchema,
      }
    );

    if (error) {
      throw new ApiError(
        `Failed to fetch tag articles: ${error.message}`,
        error.status
      );
    }

    return data!.result || [];
  },
};
