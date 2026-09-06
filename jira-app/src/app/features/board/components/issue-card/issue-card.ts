import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Issue, COLUMNS, IssueStatus } from '../../../../core/models/issue.model';
import { ProjectStore } from '../../../../core/services/project-store';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon';
import { IssueTypeIconComponent } from '../../../../shared/components/issue-type-icon/issue-type-icon';
import { IssuePriorityIconComponent } from '../../../../shared/components/issue-priority-icon/issue-priority-icon';
import { UserAvatarComponent } from '../../../../shared/components/user-avatar/user-avatar';

@Component({
  selector: 'app-issue-card',
  standalone: true,
  imports: [
    SvgIconComponent,
    IssueTypeIconComponent,
    IssuePriorityIconComponent,
    UserAvatarComponent,
  ],
  templateUrl: './issue-card.html',
  styleUrl: './issue-card.scss',
})
export class IssueCardComponent {
  readonly issue = input.required<Issue>();
  readonly cardClick = output<Issue>();

  private readonly projectStore = inject(ProjectStore);

  @ViewChild('menuWrap') menuWrap?: ElementRef<HTMLElement>;

  readonly isMenuOpen = signal<boolean>(false);
  readonly columns = COLUMNS;

  isRecentlyUpdated(): boolean {
    const updatedAt = new Date(this.issue().updatedAt).getTime();
    return Date.now() - updatedAt < 48 * 60 * 60 * 1000;
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen.update((open) => !open);
  }

  onCardClick(event: MouseEvent): void {
    if (!this.isMenuOpen()) {
      this.cardClick.emit(this.issue());
    }
  }

  moveToStatus(status: IssueStatus, event: MouseEvent): void {
    event.stopPropagation();
    this.projectStore.moveIssueToStatus(this.issue().id, status);
    this.isMenuOpen.set(false);
  }

  movePosition(direction: 'up' | 'down', event: MouseEvent): void {
    event.stopPropagation();
    this.projectStore.moveIssuePosition(this.issue().id, direction);
    this.isMenuOpen.set(false);
  }

  deleteIssue(event: MouseEvent): void {
    event.stopPropagation();
    this.projectStore.deleteIssue(this.issue().id);
    this.isMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isMenuOpen() && this.menuWrap) {
      if (!this.menuWrap.nativeElement.contains(event.target as Node)) {
        this.isMenuOpen.set(false);
      }
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    if (this.isMenuOpen()) {
      this.isMenuOpen.set(false);
    }
  }
}
