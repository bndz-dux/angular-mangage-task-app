import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { ProjectStore } from '../../core/services/project-store';
import { ToastService } from '../../core/services/toast.service';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [UserAvatarComponent, SvgIconComponent],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPageComponent {
  readonly userService = inject(UserService);
  readonly projectStore = inject(ProjectStore);
  private readonly toastService = inject(ToastService);

  readonly projectName = signal<string>('Mini-Jira');

  updateProjectName(event: Event): void {
    const val = (event.target as HTMLInputElement).value.trim();
    if (val) {
      this.projectName.set(val);
      this.toastService.showSuccess('Project name updated to ' + val);
    }
  }

  resetDemoWorkspace(): void {
    this.projectStore.resetToDemoData();
    this.toastService.showSuccess('Workspace reset to demo data (12 seed issues)');
  }
}
