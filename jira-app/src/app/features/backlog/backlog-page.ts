import { Component, computed, inject, signal } from '@angular/core';
import { ProjectStore } from '../../core/services/project-store';
import { UserService } from '../../core/services/user.service';
import { Issue } from '../../core/models/issue.model';
import { FilterBarComponent } from '../board/components/filter-bar/filter-bar';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon';
import { IssueTypeIconComponent } from '../../shared/components/issue-type-icon/issue-type-icon';
import { IssuePriorityIconComponent } from '../../shared/components/issue-priority-icon/issue-priority-icon';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar';

@Component({
  selector: 'app-backlog-page',
  standalone: true,
  imports: [
    FilterBarComponent,
    SvgIconComponent,
    IssueTypeIconComponent,
    IssuePriorityIconComponent,
    UserAvatarComponent,
  ],
  templateUrl: './backlog-page.html',
  styleUrl: './backlog-page.scss',
})
export class BacklogPageComponent {
  readonly projectStore = inject(ProjectStore);
  readonly userService = inject(UserService);

  readonly isSprintExpanded = signal<boolean>(true);
  readonly isBacklogExpanded = signal<boolean>(true);

  // Derived Active Sprint Issues (status: in_progress, in_review, done)
  readonly sprintIssues = computed(() => {
    return this.projectStore.filteredIssues().filter((i) => i.status !== 'backlog');
  });

  // Derived Uncommitted Backlog Issues (status: backlog)
  readonly backlogIssues = computed(() => {
    return this.projectStore.filteredIssues().filter((i) => i.status === 'backlog');
  });

  // Total Story Points Sums
  readonly sprintPoints = computed(() => {
    return this.sprintIssues().reduce((acc, curr) => acc + (curr.estimate || 0), 0);
  });

  readonly backlogPoints = computed(() => {
    return this.backlogIssues().reduce((acc, curr) => acc + (curr.estimate || 0), 0);
  });

  toggleSprintExpanded(): void {
    this.isSprintExpanded.update((v) => !v);
  }

  toggleBacklogExpanded(): void {
    this.isBacklogExpanded.update((v) => !v);
  }

  onIssueClick(issue: Issue): void {
    this.projectStore.selectIssueByKey(issue.key);
  }

  moveToSprint(issue: Issue, event: MouseEvent): void {
    event.stopPropagation();
    this.projectStore.moveIssueToStatus(issue.id, 'in_progress');
  }

  onCreateIssue(): void {
    this.projectStore.openCreateModal('backlog');
  }
}
