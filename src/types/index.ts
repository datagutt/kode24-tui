// Re-export specific types to avoid conflicts
export type { Frontpage, Article, Job, UpcomingEvent } from '../schemas/frontpage.js';

// Navigation types
export type Page = 'frontpage' | 'article' | 'listings' | 'tags' | 'events';

export interface NavigationState {
  currentPage: Page;
  selectedIndex: number;
  selectedSection: number;
  breadcrumb: string[];
}

// Article view state
export interface ArticleViewState {
  articleId: string;
  article?: any;
  loading: boolean;
  error?: string;
}

// Listings view state
export interface ListingsViewState {
  jobs: any[];
  loading: boolean;
  error?: string;
  selectedJob: number;
}

// Application state
export interface AppState {
  navigation: NavigationState;
  frontpage?: any;
  articleView?: ArticleViewState;
  listingsView?: ListingsViewState;
  loading: boolean;
  error?: string;
}