import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'mini-jira-sidebar-collapsed';

  readonly isCollapsed = signal<boolean>(false);
  readonly isMobileOpen = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved !== null) {
        this.isCollapsed.set(saved === 'true');
      }

      effect(() => {
        localStorage.setItem(this.STORAGE_KEY, String(this.isCollapsed()));
      });
    }
  }

  toggleCollapsed(): void {
    this.isCollapsed.update((c) => !c);
  }

  toggleMobile(): void {
    this.isMobileOpen.update((m) => !m);
  }

  closeMobile(): void {
    this.isMobileOpen.set(false);
  }
}
