import { Component, computed, inject, signal } from '@angular/core';
import { ProjectStore } from '../../core/services/project-store';
import { Issue, getRelativeTimeString } from '../../core/models/issue.model';
import { FilterBarComponent } from '../board/components/filter-bar/filter-bar';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon';
import { IssueTypeIconComponent } from '../../shared/components/issue-type-icon/issue-type-icon';
import { IssuePriorityIconComponent } from '../../shared/components/issue-priority-icon/issue-priority-icon';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar';

export type SortField = 'key' | 'title' | 'status' | 'priority' | 'estimate' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports: [
    FilterBarComponent,
    SvgIconComponent,
    IssueTypeIconComponent,
    IssuePriorityIconComponent,
    UserAvatarComponent,
  ],
  templateUrl: './list-page.html',
  styleUrl: './list-page.scss',
})
export class ListPageComponent {
  readonly projectStore = inject(ProjectStore);

  readonly sortField = signal<SortField>('key');
  readonly sortOrder = signal<SortOrder>('asc');

  private readonly priorityWeight: Record<string, number> = {
    highest: 5,
    high: 4,
    medium: 3,
    low: 2,
    lowest: 1,
  };

  private readonly statusWeight: Record<string, number> = {
    backlog: 1,
    in_progress: 2,
    in_review: 3,
    done: 4,
  };

  // Derived Sorted & Filtered Issues
  readonly sortedIssues = computed(() => {
    const list = [...this.projectStore.filteredIssues()];
    const field = this.sortField();
    const isAsc = this.sortOrder() === 'asc';

    return list.sort((a, b) => {
      let result = 0;

      switch (field) {
        case 'key':
          const numA = parseInt(a.key.replace(/\D/g, '') || '0', 10);
          const numB = parseInt(b.key.replace(/\D/g, '') || '0', 10);
          result = numA - numB;
          break;
        case 'title':
          result = a.title.localeCompare(b.title);
          break;
        case 'status':
          result = (this.statusWeight[a.status] || 0) - (this.statusWeight[b.status] || 0);
          break;
        case 'priority':
          result = (this.priorityWeight[a.priority] || 0) - (this.priorityWeight[b.priority] || 0);
          break;
        case 'estimate':
          result = (a.estimate || 0) - (b.estimate || 0);
          break;
        case 'updatedAt':
          result = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }

      return isAsc ? result : -result;
    });
  });

  toggleSort(field: SortField): void {
    if (this.sortField() === field) {
      this.sortOrder.update((order) => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortOrder.set('asc');
    }
  }

  getRelativeTime(isoDate: string): string {
    return getRelativeTimeString(isoDate);
  }

  onIssueClick(issue: Issue): void {
    this.projectStore.selectIssueByKey(issue.key);
  }

  onCreateIssue(): void {
    this.projectStore.openCreateModal();
  }
}
