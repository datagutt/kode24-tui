// Re-export specific types to avoid conflicts
export type { Frontpage, Article, Job, UpcomingEvent } from '../schemas/frontpage.js';
export type { Lab, Page as LabPage, SearchResults, TagArticlesResponse } from '../schemas/lab.js';

// Import types for use in interfaces
import type { Frontpage, Job } from '../schemas/frontpage.js';
import type { Lab } from '../schemas/lab.js';

// Navigation types
export type Page = 'frontpage' | 'article' | 'listings' | 'tags' | 'events';

export interface NavigationState {
  currentPage: Page;
  selectedIndex: number;
  selectedSection: number;
  frontpageSection?: 'left' | 'middle' | 'right';
  breadcrumb: string[];
}

// Article view state
export interface ArticleViewState {
  articleId: string;
  article?: Lab;
  loading: boolean;
  error?: string;
}

// Listings view state
export interface ListingsViewState {
  jobs: Job[];
  loading: boolean;
  error?: string;
  selectedJob: number;
}

// Application state
export interface AppState {
  navigation: NavigationState;
  frontpage?: Frontpage;
  articleView?: ArticleViewState;
  listingsView?: ListingsViewState;
  loading: boolean;
  error?: string;
}