export type { Frontpage, Article, Job, UpcomingEvent } from '../schemas/frontpage.js';
export type { Lab, Page as LabPage, Result, SearchResult, SearchResults, TagArticlesResponse } from '../schemas/lab.js';

export type Page = 'frontpage' | 'article' | 'listings' | 'events';

export type Panel = 'main' | 'sidebar';

export type { KeyEvent } from '@opentui/core';

export interface NavigationState {
  currentPage: Page;
  breadcrumb: string[];
}
