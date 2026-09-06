import { Component, HostListener, inject } from '@angular/core';
import { ProjectStore } from '../../../../core/services/project-store';
import { UserService } from '../../../../core/services/user.service';
import {
  COLUMNS,
  Issue,
  IssuePriority,
  IssueStatus,
  getRelativeTimeString,
} from '../../../../core/models/issue.model';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon';
import { IssueTypeIconComponent } from '../../../../shared/components/issue-type-icon/issue-type-icon';
import { UserAvatarComponent } from '../../../../shared/components/user-avatar/user-avatar';

@Component({
  selector: 'app-issue-detail-drawer',
  standalone: true,
  imports: [
    SvgIconComponent,
    IssueTypeIconComponent,
    UserAvatarComponent,
  ],
  templateUrl: './issue-detail-drawer.html',
  styleUrl: './issue-detail-drawer.scss',
})
export class IssueDetailDrawerComponent {
  readonly projectStore = inject(ProjectStore);
  readonly userService = inject(UserService);
  readonly columns = COLUMNS;

  getRelativeTime(isoDate: string): string {
    return getRelativeTimeString(isoDate);
  }

  closeDrawer(): void {
    this.projectStore.selectIssueByKey(null);
  }

  saveTitle(issue: Issue, newTitle: string): void {
    const trimmed = newTitle.trim();
    if (trimmed && trimmed !== issue.title) {
      this.projectStore.updateIssue(issue.id, { title: trimmed });
    }
  }

  saveTitleOnEnter(event: Event, issue: Issue, newTitle: string): void {
    event.preventDefault();
    (event.target as HTMLElement).blur();
    this.saveTitle(issue, newTitle);
  }

  saveDescription(issue: Issue, newDesc: string): void {
    const trimmed = newDesc.trim();
    if (trimmed !== issue.description) {
      this.projectStore.updateIssue(issue.id, { description: trimmed });
    }
  }

  onStatusChange(issue: Issue, event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value as IssueStatus;
    if (newStatus && newStatus !== issue.status) {
      this.projectStore.updateIssue(issue.id, { status: newStatus });
    }
  }

  onPriorityChange(issue: Issue, event: Event): void {
    const newPrio = (event.target as HTMLSelectElement).value as IssuePriority;
    if (newPrio && newPrio !== issue.priority) {
      this.projectStore.updateIssue(issue.id, { priority: newPrio });
    }
  }

  onAssigneeChange(issue: Issue, event: Event): void {
    const newAssigneeId = (event.target as HTMLSelectElement).value;
    const assignee = newAssigneeId
      ? this.userService.users().find((u) => u.id === newAssigneeId)
      : undefined;

    this.projectStore.updateIssue(issue.id, {
      assigneeId: newAssigneeId || undefined,
      assignee,
    });
  }

  onEstimateChange(issue: Issue, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const estimate = val ? Number(val) : undefined;
    this.projectStore.updateIssue(issue.id, { estimate });
  }

  submitComment(issueId: string, inputEl: HTMLTextAreaElement): void {
    const body = inputEl.value.trim();
    if (body) {
      this.projectStore.addComment(issueId, body);
      inputEl.value = '';
    }
  }

  onDeleteClick(issueId: string): void {
    this.projectStore.openConfirmDelete(issueId);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.projectStore.selectedIssueKey() && !this.projectStore.confirmDeleteIssueId()) {
      this.closeDrawer();
    }
  }
}
