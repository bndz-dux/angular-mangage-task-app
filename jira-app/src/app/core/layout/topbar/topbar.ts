import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { ThemeService } from '../../services/theme.service';
import { UserService } from '../../services/user.service';
import { ProjectStore } from '../../services/project-store';
import { User } from '../../models/user.model';
import { SvgIconComponent } from '../../../shared/components/svg-icon/svg-icon';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [SvgIconComponent, UserAvatarComponent],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class TopbarComponent {
  readonly sidebarService = inject(SidebarService);
  readonly themeService = inject(ThemeService);
  readonly userService = inject(UserService);
  readonly projectStore = inject(ProjectStore);
  private readonly elementRef = inject(ElementRef);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('userMenuWrap') userMenuWrap!: ElementRef<HTMLElement>;

  readonly isUserMenuOpen = signal<boolean>(false);
  readonly isSearchFocused = signal<boolean>(false);

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((open) => !open);
  }

  selectUser(user: User): void {
    this.userService.switchUser(user);
    this.isUserMenuOpen.set(false);
  }

  onCreateIssue(): void {
    this.projectStore.openCreateModal();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.projectStore.searchTerm.set(value);
  }

  onSearchFocus(): void {
    this.isSearchFocused.set(true);
  }

  onSearchBlur(): void {
    this.isSearchFocused.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isUserMenuOpen() && this.userMenuWrap) {
      if (!this.userMenuWrap.nativeElement.contains(event.target as Node)) {
        this.isUserMenuOpen.set(false);
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const activeEl = document.activeElement;
    const isTyping =
      activeEl instanceof HTMLInputElement ||
      activeEl instanceof HTMLTextAreaElement ||
      (activeEl as HTMLElement)?.isContentEditable;

    if (event.key === '/' && !isTyping) {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
    } else if (event.key === 'c' && !isTyping && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      this.onCreateIssue();
    } else if (event.key === 'Escape') {
      if (this.isUserMenuOpen()) {
        this.isUserMenuOpen.set(false);
      }
      if (this.isSearchFocused()) {
        this.searchInput?.nativeElement.blur();
      }
    }
  }
}
