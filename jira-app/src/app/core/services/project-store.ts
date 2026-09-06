import {
  Injectable,
  computed,
  effect,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Issue,
  IssueStatus,
  SEED_ISSUES,
  COLUMNS,
} from '../models/issue.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectStore {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly userService = inject(UserService);
  private readonly STORAGE_KEY = 'mini-jira-issues-v1';

  // Master State
  readonly issues = signal<Issue[]>(SEED_ISSUES);

  // Filters State (For Feature Set 3 & Board Filtering)
  readonly searchTerm = signal<string>('');
  readonly assigneeFilter = signal<string[]>([]);
  readonly typeFilter = signal<string>('');
  readonly onlyMineFilter = signal<boolean>(false);
  readonly recentFilter = signal<boolean>(false);

  // UI Modal & Drawer State (Feature Set 4)
  readonly selectedIssueKey = signal<string | null>(null);
  readonly isCreateModalOpen = signal<boolean>(false);
  readonly createModalDefaultStatus = signal<IssueStatus>('backlog');
  readonly confirmDeleteIssueId = signal<string | null>(null);

  // Derived Selected Issue
  readonly selectedIssue = computed(() => {
    const key = this.selectedIssueKey();
    if (!key) return null;
    return this.issues().find((i) => i.key === key) || null;
  });

  // Derived Confirm Delete Issue
  readonly confirmDeleteIssue = computed(() => {
    const id = this.confirmDeleteIssueId();
    if (!id) return null;
    return this.issues().find((i) => i.id === id) || null;
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Issue[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.issues.set(parsed);
          }
        } catch (e) {
          console.error('Failed to parse saved issues from localStorage', e);
        }
      }

      effect(() => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.issues()));
      });
    }
  }

  // Derived: Filtered Issues list
  readonly filteredIssues = computed(() => {
    const list = this.issues();
    const query = this.searchTerm().trim().toLowerCase();
    const assignees = this.assigneeFilter();
    const type = this.typeFilter();
    const onlyMine = this.onlyMineFilter();
    const currentUserId = this.userService.currentUser()?.id;
    const isRecent = this.recentFilter();

    return list.filter((issue) => {
      // 1. Text Search (matches key or title or description)
      if (query) {
        const matchesKey = issue.key.toLowerCase().includes(query);
        const matchesTitle = issue.title.toLowerCase().includes(query);
        const matchesDesc = issue.description.toLowerCase().includes(query);
        if (!matchesKey && !matchesTitle && !matchesDesc) {
          return false;
        }
      }

      // 2. Assignee Multi-select Filter
      if (assignees.length > 0) {
        if (!issue.assigneeId || !assignees.includes(issue.assigneeId)) {
          return false;
        }
      }

      // 3. Only Mine Filter
      if (onlyMine && currentUserId) {
        if (issue.assigneeId !== currentUserId) {
          return false;
        }
      }

      // 4. Issue Type Filter
      if (type && issue.type !== type) {
        return false;
      }

      // 5. Recent Filter (updated in the last 48 hours)
      if (isRecent) {
        const updatedTime = new Date(issue.updatedAt).getTime();
        const twoDaysAgo = Date.now() - 48 * 60 * 60 * 1000;
        if (updatedTime < twoDaysAgo) {
          return false;
        }
      }

      return true;
    });
  });

  // Derived: Issues grouped by status and sorted by order
  readonly issuesByStatus = computed(() => {
    const map: Record<IssueStatus, Issue[]> = {
      backlog: [],
      in_progress: [],
      in_review: [],
      done: [],
    };

    for (const issue of this.filteredIssues()) {
      if (map[issue.status]) {
        map[issue.status].push(issue);
      }
    }

    // Sort ascending by order
    for (const key of Object.keys(map) as IssueStatus[]) {
      map[key].sort((a, b) => a.order - b.order);
    }

    return map;
  });

  // Derived: Count per column
  readonly columnCounts = computed(() => {
    const grouped = this.issuesByStatus();
    return {
      backlog: grouped.backlog.length,
      in_progress: grouped.in_progress.length,
      in_review: grouped.in_review.length,
      done: grouped.done.length,
    };
  });

  // Derived: Total issue count before filtering
  readonly totalIssuesCount = computed(() => this.issues().length);

  // Derived: Active filter count
  readonly activeFilterCount = computed(() => {
    let count = 0;
    if (this.searchTerm().trim()) count++;
    if (this.assigneeFilter().length > 0) count += this.assigneeFilter().length;
    if (this.typeFilter()) count++;
    if (this.onlyMineFilter()) count++;
    if (this.recentFilter()) count++;
    return count;
  });

  // Derived: Whether any filter is currently active
  readonly isFilterActive = computed(() => this.activeFilterCount() > 0);

  // -------------------------------------------------------------
  // Filter Toggles & Actions
  // -------------------------------------------------------------

  toggleAssigneeFilter(userId: string): void {
    this.assigneeFilter.update((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId],
    );
  }

  toggleOnlyMine(): void {
    this.onlyMineFilter.update((v) => !v);
  }

  toggleRecent(): void {
    this.recentFilter.update((v) => !v);
  }

  setTypeFilter(type: string): void {
    this.typeFilter.set(type);
  }

  // -------------------------------------------------------------
  // Mutations / Actions
  // -------------------------------------------------------------

  /**
   * Reorder an issue within the same status column
   */
  moveIssueInColumn(status: IssueStatus, fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) return;

    this.issues.update((allIssues) => {
      // Get all issues for this status
      const columnIssues = allIssues
        .filter((i) => i.status === status)
        .sort((a, b) => a.order - b.order);

      const [movedItem] = columnIssues.splice(fromIndex, 1);
      columnIssues.splice(toIndex, 0, movedItem);

      // Recompute orders for this column
      const orderMap = new Map<string, number>();
      columnIssues.forEach((item, idx) => {
        orderMap.set(item.id, idx);
      });

      return allIssues.map((issue) => {
        if (orderMap.has(issue.id)) {
          return {
            ...issue,
            order: orderMap.get(issue.id)!,
            updatedAt: new Date().toISOString(),
          };
        }
        return issue;
      });
    });
  }

  /**
   * Transfer an issue from one status column to another at target index
   */
  transferIssue(
    fromStatus: IssueStatus,
    toStatus: IssueStatus,
    fromIndex: number,
    toIndex: number,
  ): void {
    this.issues.update((allIssues) => {
      const sourceColumn = allIssues
        .filter((i) => i.status === fromStatus)
        .sort((a, b) => a.order - b.order);

      const targetColumn = allIssues
        .filter((i) => i.status === toStatus)
        .sort((a, b) => a.order - b.order);

      const [movedItem] = sourceColumn.splice(fromIndex, 1);
      const updatedMovedItem: Issue = {
        ...movedItem,
        status: toStatus,
        updatedAt: new Date().toISOString(),
      };

      targetColumn.splice(toIndex, 0, updatedMovedItem);

      const orderMap = new Map<string, { order: number; status: IssueStatus }>();
      sourceColumn.forEach((item, idx) => {
        orderMap.set(item.id, { order: idx, status: fromStatus });
      });
      targetColumn.forEach((item, idx) => {
        orderMap.set(item.id, { order: idx, status: toStatus });
      });

      return allIssues.map((issue) => {
        if (orderMap.has(issue.id)) {
          const update = orderMap.get(issue.id)!;
          return {
            ...issue,
            status: update.status,
            order: update.order,
            updatedAt: issue.id === movedItem.id ? new Date().toISOString() : issue.updatedAt,
          };
        }
        return issue;
      });
    });
  }

  /**
   * Accessible action: Move issue directly to a target status
   */
  moveIssueToStatus(issueId: string, targetStatus: IssueStatus): void {
    const current = this.issues().find((i) => i.id === issueId);
    if (!current || current.status === targetStatus) return;

    this.issues.update((all) => {
      const targetColumn = all
        .filter((i) => i.status === targetStatus)
        .sort((a, b) => a.order - b.order);

      const newOrder = targetColumn.length;

      return all.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            status: targetStatus,
            order: newOrder,
            updatedAt: new Date().toISOString(),
          };
        }
        return issue;
      });
    });
  }

  /**
   * Accessible action: Move issue Up or Down in its current column
   */
  moveIssuePosition(issueId: string, direction: 'up' | 'down'): void {
    const issue = this.issues().find((i) => i.id === issueId);
    if (!issue) return;

    const columnIssues = this.issues()
      .filter((i) => i.status === issue.status)
      .sort((a, b) => a.order - b.order);

    const currentIndex = columnIssues.findIndex((i) => i.id === issueId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= columnIssues.length) return;

    this.moveIssueInColumn(issue.status, currentIndex, targetIndex);
  }

  /**
   * Update issue fields
   */
  updateIssue(id: string, updates: Partial<Issue>): void {
    this.issues.update((all) =>
      all.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      }),
    );
  }

  /**
   * Add a new issue
   */
  addIssue(newIssueData: Omit<Issue, 'id' | 'key' | 'order' | 'createdAt' | 'updatedAt' | 'comments'>): Issue {
    const all = this.issues();
    const nextNumber = all.length > 0
      ? Math.max(...all.map((i) => parseInt(i.key.replace(/\D/g, '') || '100', 10))) + 1
      : 101;

    const columnIssues = all.filter((i) => i.status === newIssueData.status);
    const newOrder = columnIssues.length;

    const newIssue: Issue = {
      ...newIssueData,
      id: `issue-${Date.now()}`,
      key: `MJ-${nextNumber}`,
      comments: [],
      order: newOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.issues.update((prev) => [...prev, newIssue]);
    return newIssue;
  }

  /**
   * Delete an issue
   */
  deleteIssue(id: string): void {
    this.issues.update((all) => all.filter((i) => i.id !== id));
    if (this.confirmDeleteIssueId() === id) {
      this.closeConfirmDelete();
    }
    const currentSelected = this.selectedIssue();
    if (currentSelected && currentSelected.id === id) {
      this.selectIssueByKey(null);
    }
  }

  // -------------------------------------------------------------
  // UI Modal & Drawer Control
  // -------------------------------------------------------------

  openCreateModal(defaultStatus: IssueStatus = 'backlog'): void {
    this.createModalDefaultStatus.set(defaultStatus);
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  selectIssueByKey(key: string | null): void {
    this.selectedIssueKey.set(key);
  }

  openConfirmDelete(id: string): void {
    this.confirmDeleteIssueId.set(id);
  }

  closeConfirmDelete(): void {
    this.confirmDeleteIssueId.set(null);
  }

  // -------------------------------------------------------------
  // Comment Actions
  // -------------------------------------------------------------

  addComment(issueId: string, body: string): void {
    const currentUser = this.userService.currentUser();
    if (!currentUser || !body.trim()) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      issueId,
      userId: currentUser.id,
      user: currentUser,
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };

    this.issues.update((all) =>
      all.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            comments: [...issue.comments, newComment],
            updatedAt: new Date().toISOString(),
          };
        }
        return issue;
      }),
    );
  }

  deleteComment(issueId: string, commentId: string): void {
    this.issues.update((all) =>
      all.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            comments: issue.comments.filter((c) => c.id !== commentId),
            updatedAt: new Date().toISOString(),
          };
        }
        return issue;
      }),
    );
  }

  /**
   * Reset all issues back to original SEED_ISSUES
   */
  resetToDemoData(): void {
    this.issues.set(SEED_ISSUES);
    this.clearFilters();
    this.selectIssueByKey(null);
    this.closeCreateModal();
    this.closeConfirmDelete();
  }

  /**
   * Clear all active search & filters
   */
  clearFilters(): void {
    this.searchTerm.set('');
    this.assigneeFilter.set([]);
    this.typeFilter.set('');
    this.onlyMineFilter.set(false);
    this.recentFilter.set(false);
  }
}
