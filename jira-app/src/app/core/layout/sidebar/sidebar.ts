import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { ProjectStore } from '../../services/project-store';
import { ToastService } from '../../services/toast.service';
import { SvgIconComponent } from '../../../shared/components/svg-icon/svg-icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SvgIconComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  readonly sidebarService = inject(SidebarService);
  private readonly projectStore = inject(ProjectStore);
  private readonly toastService = inject(ToastService);

  onNavClick(): void {
    if (this.sidebarService.isMobileOpen()) {
      this.sidebarService.closeMobile();
    }
  }

  onResetDemoData(): void {
    this.projectStore.resetToDemoData();
    this.toastService.showSuccess('Workspace reset to demo data (12 issues)');
    if (this.sidebarService.isMobileOpen()) {
      this.sidebarService.closeMobile();
    }
  }
}
