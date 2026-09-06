import { Component } from '@angular/core';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon';

export interface ReleaseMilestone {
  version: string;
  status: 'released' | 'in_progress' | 'unreleased';
  description: string;
  progressPct: number;
  completedIssues: number;
  totalIssues: number;
  releaseDate: string;
}

@Component({
  selector: 'app-releases-page',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './releases-page.html',
  styleUrl: './releases-page.scss',
})
export class ReleasesPageComponent {
  readonly releases: ReleaseMilestone[] = [
    {
      version: 'v1.0.0 — MVP Core Engine',
      status: 'released',
      description: 'Initial release featuring full 4-column interactive Kanban board, Signals state management, and basic issue layout.',
      progressPct: 100,
      completedIssues: 12,
      totalIssues: 12,
      releaseDate: 'August 28, 2026',
    },
    {
      version: 'v1.1.0 — Advanced Filters & Detail Drawer',
      status: 'in_progress',
      description: 'Feature-rich update introducing multi-select assignee filter, inline editing drawer, comments stream, and quick create modal.',
      progressPct: 85,
      completedIssues: 10,
      totalIssues: 12,
      releaseDate: 'September 5, 2026',
    },
    {
      version: 'v2.0.0 — Enterprise Workflows & Analytics',
      status: 'unreleased',
      description: 'Future milestone planned for custom workflow transitions, time tracking burn-down charts, and multi-project boards.',
      progressPct: 15,
      completedIssues: 2,
      totalIssues: 15,
      releaseDate: 'October 15, 2026',
    },
  ];
}
