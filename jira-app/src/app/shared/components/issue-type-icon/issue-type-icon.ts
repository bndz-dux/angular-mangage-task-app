import { Component, input } from '@angular/core';
import { IssueType } from '../../../core/models/issue.model';
import { SvgIconComponent, IconName } from '../svg-icon/svg-icon';

@Component({
  selector: 'app-issue-type-icon',
  standalone: true,
  imports: [SvgIconComponent],
  template: `
    <span
      class="type-icon"
      [class.story]="type() === 'story'"
      [class.task]="type() === 'task'"
      [class.bug]="type() === 'bug'"
      [class.epic]="type() === 'epic'"
      [attr.title]="getTitle()"
      [attr.aria-label]="getTitle()"
    >
      <app-svg-icon [name]="getIconName()" [size]="size()" />
    </span>
  `,
  styles: [`
    .type-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      &.story {
        color: var(--type-story);
      }
      &.task {
        color: var(--type-task);
      }
      &.bug {
        color: var(--type-bug);
      }
      &.epic {
        color: var(--type-epic);
      }
    }
  `],
})
export class IssueTypeIconComponent {
  readonly type = input.required<IssueType>();
  readonly size = input<number | string>(14);

  getIconName(): IconName {
    switch (this.type()) {
      case 'story':
        return 'type-story';
      case 'task':
        return 'type-task';
      case 'bug':
        return 'type-bug';
      case 'epic':
        return 'type-epic';
      default:
        return 'type-task';
    }
  }

  getTitle(): string {
    const t = this.type();
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
}
