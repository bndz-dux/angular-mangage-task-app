import { Component, HostListener, inject } from '@angular/core';
import { ProjectStore } from '../../../core/services/project-store';
import { SvgIconComponent } from '../svg-icon/svg-icon';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './confirm-delete-modal.html',
  styleUrl: './confirm-delete-modal.scss',
})
export class ConfirmDeleteModalComponent {
  readonly projectStore = inject(ProjectStore);

  onConfirmDelete(id: string): void {
    this.projectStore.deleteIssue(id);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.projectStore.closeConfirmDelete();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.projectStore.confirmDeleteIssueId()) {
      this.projectStore.closeConfirmDelete();
    }
  }
}
