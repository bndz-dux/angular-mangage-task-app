import { Component, input } from '@angular/core';
import { IssuePriority } from '../../../core/models/issue.model';
import { SvgIconComponent, IconName } from '../svg-icon/svg-icon';

@Component({
  selector: 'app-issue-priority-icon',
  standalone: true,
  imports: [SvgIconComponent],
  template: `
    <span
      class="prio-icon"
      [class.highest]="priority() === 'highest'"
      [class.high]="priority() === 'high'"
      [class.medium]="priority() === 'medium'"
      [class.low]="priority() === 'low'"
      [class.lowest]="priority() === 'lowest'"
      [attr.title]="getTitle()"
      [attr.aria-label]="getTitle()"
    >
      <app-svg-icon [name]="getIconName()" [size]="size()" />
    </span>
  `,
  styles: [`
    .prio-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      &.highest,
      &.high {
        color: var(--danger);
      }
      &.medium {
        color: var(--warning);
      }
      &.low,
      &.lowest {
        color: var(--text-subtle);
      }
    }
  `],
})
export class IssuePriorityIconComponent {
  readonly priority = input.required<IssuePriority>();
  readonly size = input<number | string>(14);

  getIconName(): IconName {
    switch (this.priority()) {
      case 'highest':
        return 'prio-highest';
      case 'high':
        return 'prio-high';
      case 'medium':
        return 'prio-medium';
      case 'low':
        return 'prio-low';
      case 'lowest':
        return 'prio-lowest';
      default:
        return 'prio-medium';
    }
  }

  getTitle(): string {
    const p = this.priority();
    return p.charAt(0).toUpperCase() + p.slice(1) + ' Priority';
  }
}
