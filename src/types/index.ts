export type { Frontpage, Article, Job, UpcomingEvent } from '../schemas/frontpage.js';
export type { Lab, Page as LabPage, SearchResults, TagArticlesResponse } from '../schemas/lab.js';

export type Page = 'frontpage' | 'article' | 'listings' | 'events';

export type Panel = 'main' | 'sidebar';

export interface KeyEvent {
  name: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
}

export interface NavigationState {
  currentPage: Page;
  breadcrumb: string[];
}
