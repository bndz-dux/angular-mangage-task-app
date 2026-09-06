import { Component, input } from '@angular/core';
import { User } from '../../../core/models/user.model';

export type AvatarSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  template: `
    @if (user(); as u) {
      <div
        class="avatar"
        [class.sm]="size() === 'sm'"
        [class.lg]="size() === 'lg'"
        [style.background-color]="u.color"
        [attr.title]="u.name + ' (' + u.role + ')'"
        [attr.aria-label]="u.name"
      >
        @if (u.avatarUrl) {
          <img [src]="u.avatarUrl" [alt]="u.name" class="avatar-img" />
        } @else {
          <span class="initials">{{ u.initials }}</span>
        }
      </div>
    } @else {
      <div
        class="avatar unassigned"
        [class.sm]="size() === 'sm'"
        [class.lg]="size() === 'lg'"
        title="Unassigned"
        aria-label="Unassigned"
      >
        <span class="initials">?</span>
      </div>
    }
  `,
  styles: [`
    .avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-size: 10px;
      font-weight: 700;
      color: #ffffff;
      flex-shrink: 0;
      user-select: none;
      overflow: hidden;
      line-height: 1;

      &.lg {
        width: 32px;
        height: 32px;
        font-size: 12px;
      }

      &.sm {
        width: 20px;
        height: 20px;
        font-size: 9px;
      }

      &.unassigned {
        background-color: transparent !important;
        border: 1px dashed var(--border-strong);
        color: var(--text-subtle);
      }
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .initials {
      text-transform: uppercase;
    }
  `],
})
export class UserAvatarComponent {
  readonly user = input<User | null>(null);
  readonly size = input<AvatarSize>('md');
}
