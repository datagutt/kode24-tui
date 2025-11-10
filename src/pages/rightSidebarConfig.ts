import type { Frontpage } from "../types/index.js";

export const RIGHT_SIDEBAR_LIMITS = {
  jobs: 3,
  events: 2,
  comments: 2,
} as const;

export interface RightSidebarCounts {
  jobs: number;
  events: number;
  comments: number;
}

export const getRightSidebarCounts = (data: Frontpage): RightSidebarCounts => ({
  jobs: Math.min(data.jobs.length, RIGHT_SIDEBAR_LIMITS.jobs),
  events: Math.min(data.events.upcomingEvents.length, RIGHT_SIDEBAR_LIMITS.events),
  comments: Math.min(data.newestComments.length, RIGHT_SIDEBAR_LIMITS.comments),
});

export const getRightSidebarTotal = (counts: RightSidebarCounts): number => {
  return counts.jobs + 1 + counts.events + counts.comments;
};

export type RightSidebarItemType = "job" | "viewAll" | "event" | "comment";

export const getRightSidebarItemType = (
  index: number,
  counts: RightSidebarCounts
): RightSidebarItemType => {
  if (index < counts.jobs) {
    return "job";
  }
  if (index === counts.jobs) {
    return "viewAll";
  }
  if (index < counts.jobs + 1 + counts.events) {
    return "event";
  }
  return "comment";
};
