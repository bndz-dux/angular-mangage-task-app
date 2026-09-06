import { User, SEED_USERS } from './user.model';

export type IssueType = 'story' | 'task' | 'bug' | 'epic';
export type IssuePriority = 'lowest' | 'low' | 'medium' | 'high' | 'highest';
export type IssueStatus = 'backlog' | 'in_progress' | 'in_review' | 'done';

export interface ColumnDef {
  id: IssueStatus;
  title: string;
}

export const COLUMNS: ColumnDef[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'in_review', title: 'In Review' },
  { id: 'done', title: 'Done' },
];

export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  user: User;
  body: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Issue {
  id: string;
  key: string; // e.g. "MJ-101"
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  estimate?: number; // Story points
  assigneeId?: string;
  assignee?: User;
  reporterId: string;
  reporter: User;
  comments: Comment[];
  order: number; // Vertical sort position in column
  createdAt: string;
  updatedAt: string;
}

export function getRelativeTimeString(isoDate: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  return date.toLocaleDateString();
}

export const SEED_ISSUES: Issue[] = [
  // BACKLOG
  {
    id: 'issue-1',
    key: 'MJ-101',
    title: 'Fix auth redirect loop on session timeout',
    description: 'Users report being redirected in an infinite loop when their OAuth access token expires during background polling.',
    type: 'bug',
    status: 'backlog',
    priority: 'highest',
    estimate: 3,
    assigneeId: 'user-3',
    assignee: SEED_USERS[2], // Walter White
    reporterId: 'user-1',
    reporter: SEED_USERS[0],
    comments: [],
    order: 0,
    createdAt: '2026-08-30T10:00:00Z',
    updatedAt: '2026-08-31T08:30:00Z',
  },
  {
    id: 'issue-2',
    key: 'MJ-102',
    title: 'Implement Dark Mode theme tokens & persistent toggle',
    description: 'Provide full dark mode support across all UI elements conforming to WCAG AA contrast standards.',
    type: 'story',
    status: 'backlog',
    priority: 'high',
    estimate: 5,
    assigneeId: 'user-2',
    assignee: SEED_USERS[1], // Baby Yoda
    reporterId: 'user-1',
    reporter: SEED_USERS[0],
    comments: [],
    order: 1,
    createdAt: '2026-08-29T14:15:00Z',
    updatedAt: '2026-08-30T16:45:00Z',
  },
  {
    id: 'issue-3',
    key: 'MJ-103',
    title: 'Export sprint reports to CSV and PDF',
    description: 'Allow project leads to export completed sprint summaries, velocity charts, and burndown metrics.',
    type: 'story',
    status: 'backlog',
    priority: 'low',
    estimate: 8,
    assigneeId: undefined,
    assignee: undefined,
    reporterId: 'user-1',
    reporter: SEED_USERS[0],
    comments: [],
    order: 2,
    createdAt: '2026-08-28T09:00:00Z',
    updatedAt: '2026-08-28T09:00:00Z',
  },
  {
    id: 'issue-4',
    key: 'MJ-104',
    title: 'Audit accessibility focus order in modals',
    description: 'Ensure focus is trapped inside dialogs and returned properly upon dismissal with ESC key.',
    type: 'task',
    status: 'backlog',
    priority: 'medium',
    estimate: 2,
    assigneeId: 'user-4',
    assignee: SEED_USERS[3], // Pickle Rick
    reporterId: 'user-2',
    reporter: SEED_USERS[1],
    comments: [],
    order: 3,
    createdAt: '2026-08-31T08:00:00Z',
    updatedAt: '2026-08-31T08:00:00Z',
  },

  // IN PROGRESS
  {
    id: 'issue-5',
    key: 'MJ-105',
    title: 'Build interactive Kanban board drag & drop engine',
    description: 'Integrate Angular CDK drag-drop with smooth cross-column item transfers and reordering.',
    type: 'story',
    status: 'in_progress',
    priority: 'highest',
    estimate: 5,
    assigneeId: 'user-2',
    assignee: SEED_USERS[1], // Baby Yoda
    reporterId: 'user-1',
    reporter: SEED_USERS[0],
    comments: [],
    order: 0,
    createdAt: '2026-08-30T11:20:00Z',
    updatedAt: '2026-08-31T14:10:00Z',
  },
  {
    id: 'issue-6',
    key: 'MJ-106',
    title: 'Refactor REST API error interceptor and retry strategy',
    description: 'Standardize error payloads and implement exponential backoff for transient 503 gateway timeouts.',
    type: 'task',
    status: 'in_progress',
    priority: 'high',
    estimate: 3,
    assigneeId: 'user-3',
    assignee: SEED_USERS[2], // Walter White
    reporterId: 'user-3',
    reporter: SEED_USERS[2],
    comments: [],
    order: 1,
    createdAt: '2026-08-30T13:45:00Z',
    updatedAt: '2026-08-31T12:00:00Z',
  },
  {
    id: 'issue-7',
    key: 'MJ-107',
    title: 'Mini-Jira 2.0 Architectural Roadmap & Core Epics',
    description: 'Define multi-project support, custom workflow transitions, and webhook event integrations.',
    type: 'epic',
    status: 'in_progress',
    priority: 'medium',
    estimate: 13,
    assigneeId: 'user-1',
    assignee: SEED_USERS[0], // Lord Gaben
    reporterId: 'user-1',
    reporter: SEED_USERS[0],
    comments: [],
    order: 2,
    createdAt: '2026-08-25T08:00:00Z',
    updatedAt: '2026-08-31T09:30:00Z',
  },

  // IN REVIEW
  {
    id: 'issue-8',
    key: 'MJ-108',
    title: 'Optimize Largest Contentful Paint (LCP) on mobile viewport',
    description: 'Preload hero web fonts and optimize bundle splitting to reduce initial paint delay below 1.2s.',
    type: 'task',
    status: 'in_review',
    priority: 'high',
    estimate: 2,
    assigneeId: 'user-2',
    assignee: SEED_USERS[1], // Baby Yoda
    reporterId: 'user-4',
    reporter: SEED_USERS[3],
    comments: [],
    order: 0,
    createdAt: '2026-08-29T15:00:00Z',
    updatedAt: '2026-08-31T15:20:00Z',
  },
  {
    id: 'issue-9',
    key: 'MJ-109',
    title: 'Fix memory leak in websocket event subscription listener',
    description: 'Ensure active subscriptions are unsubscribed in ngOnDestroy when switching between projects.',
    type: 'bug',
    status: 'in_review',
    priority: 'highest',
    estimate: 1,
    assigneeId: 'user-3',
    assignee: SEED_USERS[2], // Walter White
    reporterId: 'user-4',
    reporter: SEED_USERS[3],
    comments: [],
    order: 1,
    createdAt: '2026-08-30T16:00:00Z',
    updatedAt: '2026-08-31T16:00:00Z',
  },

  // DONE
  {
    id: 'issue-10',
    key: 'MJ-110',
    title: 'Initialize Angular v22 architecture with Standalone Components',
    description: 'Setup initial repository scaffold, Vitest runner, routing, and SCSS styling.',
    type: 'task',
    status: 'done',
    priority: 'high',
    estimate: 3,
    assigneeId: 'user-2',
    assignee: SEED_USERS[1], // Baby Yoda
    reporterId: 'user-1',
    reporter: SEED_USERS[0],
    comments: [],
    order: 0,
    createdAt: '2026-08-28T10:00:00Z',
    updatedAt: '2026-08-29T18:00:00Z',
  },
  {
    id: 'issue-11',
    key: 'MJ-111',
    title: 'Setup Collapsible Sidebar & Topbar Shell Navigation',
    description: 'Implement responsive 240px to 56px animated sidebar, quick search shortcuts, and user switcher.',
    type: 'story',
    status: 'done',
    priority: 'medium',
    estimate: 5,
    assigneeId: 'user-1',
    assignee: SEED_USERS[0], // Lord Gaben
    reporterId: 'user-1',
    reporter: SEED_USERS[0],
    comments: [],
    order: 1,
    createdAt: '2026-08-29T09:00:00Z',
    updatedAt: '2026-08-30T17:30:00Z',
  },
  {
    id: 'issue-12',
    key: 'MJ-112',
    title: 'Define design system color tokens & spacing scale',
    description: 'Created comprehensive tokens in styles.scss conforming to Atlassian color palette.',
    type: 'story',
    status: 'done',
    priority: 'lowest',
    estimate: 2,
    assigneeId: 'user-4',
    assignee: SEED_USERS[3], // Pickle Rick
    reporterId: 'user-1',
    reporter: SEED_USERS[0],
    comments: [],
    order: 2,
    createdAt: '2026-08-27T11:00:00Z',
    updatedAt: '2026-08-28T14:00:00Z',
  },
];
