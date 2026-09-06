import { Component, inject } from '@angular/core';
import { CdkDragDrop, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COLUMNS, Issue, IssueStatus } from '../../core/models/issue.model';
import { ProjectStore } from '../../core/services/project-store';
import { BoardColumnComponent } from './components/board-column/board-column';
import { FilterBarComponent } from './components/filter-bar/filter-bar';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon';

@Component({
  selector: 'app-board-page',
  standalone: true,
  imports: [
    CdkDropListGroup,
    BoardColumnComponent,
    FilterBarComponent,
    SvgIconComponent,
  ],
  templateUrl: './board-page.html',
  styleUrl: './board-page.scss',
})
export class BoardPageComponent {
  readonly projectStore = inject(ProjectStore);
  private readonly liveAnnouncer = inject(LiveAnnouncer);

  readonly columns = COLUMNS;
  readonly allDropListIds = COLUMNS.map((c) => 'col-' + c.id);

  onColumnDrop(event: CdkDragDrop<Issue[]>, targetStatus: IssueStatus): void {
    const item = event.item.data as Issue;
    const targetColTitle = this.columns.find((c) => c.id === targetStatus)?.title || targetStatus;

    if (event.previousContainer === event.container) {
      // Reordering within the same status column
      this.projectStore.moveIssueInColumn(
        targetStatus,
        event.previousIndex,
        event.currentIndex,
      );

      this.liveAnnouncer.announce(
        `Reordered ${item.key} in ${targetColTitle} to position ${event.currentIndex + 1}`,
      );
    } else {
      // Transferring across columns
      const fromStatus = (event.previousContainer.id.replace('col-', '') as IssueStatus) || item.status;

      this.projectStore.transferIssue(
        fromStatus,
        targetStatus,
        event.previousIndex,
        event.currentIndex,
      );

      this.liveAnnouncer.announce(
        `Moved ${item.key} to ${targetColTitle}, position ${event.currentIndex + 1}`,
      );
    }
  }

  onIssueSelected(issue: Issue): void {
    this.projectStore.selectIssueByKey(issue.key);
  }

  onCreateIssueInColumn(status: IssueStatus): void {
    this.projectStore.openCreateModal(status);
  }
}
