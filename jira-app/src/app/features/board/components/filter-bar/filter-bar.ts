import { Component, inject } from '@angular/core';
import { ProjectStore } from '../../../../core/services/project-store';
import { UserService } from '../../../../core/services/user.service';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon';
import { UserAvatarComponent } from '../../../../shared/components/user-avatar/user-avatar';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [SvgIconComponent, UserAvatarComponent],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.scss',
})
export class FilterBarComponent {
  readonly projectStore = inject(ProjectStore);
  readonly userService = inject(UserService);

  onTypeChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.projectStore.setTypeFilter(val);
  }
}
