import { Injectable, signal, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly router = inject(Router);

  readonly project = signal({
    key: 'MJ',
    name: 'Mini-Jira',
  });

  readonly breadcrumbs = signal<BreadcrumbItem[]>([
    { label: 'Projects', url: '/projects/MJ/board' },
    { label: 'Mini-Jira', url: '/projects/MJ/board' },
    { label: 'Kanban Board' },
  ]);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateBreadcrumbs(event.urlAfterRedirects || event.url);
      });
  }

  private updateBreadcrumbs(url: string): void {
    const projName = this.project().name;
    const baseItems: BreadcrumbItem[] = [
      { label: 'Projects', url: '/projects/MJ/board' },
      { label: projName, url: '/projects/MJ/board' },
    ];

    if (url.includes('/backlog')) {
      this.breadcrumbs.set([...baseItems, { label: 'Backlog' }]);
    } else if (url.includes('/list')) {
      this.breadcrumbs.set([...baseItems, { label: 'List View' }]);
    } else if (url.includes('/releases')) {
      this.breadcrumbs.set([...baseItems, { label: 'Releases' }]);
    } else if (url.includes('/settings')) {
      this.breadcrumbs.set([...baseItems, { label: 'Project Settings' }]);
    } else {
      this.breadcrumbs.set([...baseItems, { label: 'Kanban Board' }]);
    }
  }
}
