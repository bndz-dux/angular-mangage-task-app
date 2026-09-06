import {
  Component,
  input,
  output,
} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Issue, IssueStatus } from '../../../../core/models/issue.model';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon';
import { IssueCardComponent } from '../issue-card/issue-card';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    CdkDragPreview,
    SvgIconComponent,
    IssueCardComponent,
  ],
  templateUrl: './board-column.html',
  styleUrl: './board-column.scss',
})
export class BoardColumnComponent {
  readonly status = input.required<IssueStatus>();
  readonly title = input.required<string>();
  readonly issues = input.required<Issue[]>();
  readonly count = input.required<number>();
  readonly connectedDropLists = input<string[]>([]);

  readonly drop = output<CdkDragDrop<Issue[]>>();
  readonly issueClick = output<Issue>();
  readonly createClick = output<IssueStatus>();

  onDrop(event: CdkDragDrop<Issue[]>): void {
    this.drop.emit(event);
  }

  onIssueClick(issue: Issue): void {
    this.issueClick.emit(issue);
  }

  onAddIssueClick(): void {
    this.createClick.emit(this.status());
  }
}
