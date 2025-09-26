import { FrontpageSchema } from '../schemas/frontpage.js';
import type { Frontpage, Article } from '../types/index.js';

const BASE_URL = 'https://docs.kode24.no/api';
const LABRADOR_BASE = 'https://www.kode24.no';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  async fetchFrontpage(): Promise<Frontpage> {
    try {
      const response = await fetch(`${BASE_URL}/frontpage`);
      if (!response.ok) {
        throw new ApiError(`Failed to fetch frontpage: ${response.statusText}`, response.status);
      }
      const data = await response.json();
      return FrontpageSchema.parse(data);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch frontpage data');
    }
  },

  async fetchArticle(articleId: string): Promise<any> {
    try {
      const response = await fetch(`${LABRADOR_BASE}/artikkel/${articleId}?lab_viewport=json&lab_content=full`);
      if (!response.ok) {
        throw new ApiError(`Failed to fetch article: ${response.statusText}`, response.status);
      }
      const data = await response.json();
      // For now, return the raw data - we can add article schema validation later
      return data as any;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch article data');
    }
  },

  async searchArticles(query: string): Promise<any[]> {
    try {
      const response = await fetch(`${BASE_URL}/search/${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new ApiError(`Failed to search articles: ${response.statusText}`, response.status);
      }
      const data = await response.json();
      return data as any[];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to search articles');
    }
  },

  async fetchTagArticles(tag: string): Promise<any[]> {
    try {
      const response = await fetch(`${LABRADOR_BASE}/tag/${encodeURIComponent(tag)}?lab_viewport=json`);
      if (!response.ok) {
        throw new ApiError(`Failed to fetch tag articles: ${response.statusText}`, response.status);
      }
      const data = await response.json();
      return (data as any).result || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch tag articles');
    }
  }
};