import { createFetch } from '@better-fetch/fetch';
import * as z from 'zod';
import { FrontpageSchema } from '../schemas/frontpage.js';
import { LabSchema, SearchResultsSchema, TagArticlesResponseSchema } from '../schemas/lab.js';
import type { Frontpage, Lab, SearchResults, TagArticlesResponse } from '../types/index.js';

const BASE_URL = 'https://docs.kode24.no/api';
const LABRADOR_BASE = 'https://www.kode24.no';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Create a better-fetch instance with retry configuration
const $fetch = createFetch({
  retry: {
    type: 'exponential',
    attempts: 3,
    baseDelay: 1000,
    maxDelay: 5000,
  },
  timeout: 10000, // 10 second timeout
});

export const api = {
  async fetchFrontpage(): Promise<Frontpage> {
    const { data, error } = await $fetch(`${BASE_URL}/frontpage`, {
      output: FrontpageSchema,
    });

    if (error) {
      throw new ApiError(`Failed to fetch frontpage: ${error.message}`, error.status);
    }

    return data!;
  },

  async fetchArticle(articleId: string): Promise<Lab> {
    const { data, error } = await $fetch(`${LABRADOR_BASE}/artikkel/${articleId}?lab_viewport=json&lab_content=full`, {
      output: LabSchema,
    });

    if (error) {
      throw new ApiError(`Failed to fetch article: ${error.message}`, error.status);
    }

    // Check if we have essential article data
    if (!data!.page?.fields?.title && !data!.page?.fields?.bodytext) {
      throw new ApiError('Article data is incomplete - missing title or content');
    }

    return data!;
  },

  async searchArticles(query: string): Promise<SearchResults> {
    const { data, error } = await $fetch(`${BASE_URL}/search/${encodeURIComponent(query)}`, {
      output: SearchResultsSchema,
    });

    if (error) {
      throw new ApiError(`Failed to search articles: ${error.message}`, error.status);
    }

    return data!;
  },

  async fetchTagArticles(tag: string): Promise<SearchResults> {
    const { data, error } = await $fetch(`${LABRADOR_BASE}/tag/${encodeURIComponent(tag)}?lab_viewport=json`, {
      output: TagArticlesResponseSchema,
    });

    if (error) {
      throw new ApiError(`Failed to fetch tag articles: ${error.message}`, error.status);
    }

    return data!.result || [];
  }
};