import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProjectStore } from '../../../../core/services/project-store';
import { UserService } from '../../../../core/services/user.service';
import { COLUMNS, IssuePriority, IssueStatus, IssueType } from '../../../../core/models/issue.model';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon';

@Component({
  selector: 'app-create-issue-modal',
  standalone: true,
  imports: [ReactiveFormsModule, SvgIconComponent],
  templateUrl: './create-issue-modal.html',
  styleUrl: './create-issue-modal.scss',
})
export class CreateIssueModalComponent {
  readonly projectStore = inject(ProjectStore);
  readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  @ViewChild('titleInput') titleInput?: ElementRef<HTMLInputElement>;

  readonly columns = COLUMNS;
  readonly createForm: FormGroup;

  constructor() {
    this.createForm = this.fb.group({
      type: ['story' as IssueType, [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      description: [''],
      status: ['backlog' as IssueStatus, [Validators.required]],
      priority: ['medium' as IssuePriority, [Validators.required]],
      assigneeId: [''],
      estimate: [undefined],
    });

    effect(() => {
      if (this.projectStore.isCreateModalOpen()) {
        const defaultStatus = this.projectStore.createModalDefaultStatus();
        this.createForm.patchValue({
          type: 'story',
          title: '',
          description: '',
          status: defaultStatus,
          priority: 'medium',
          assigneeId: '',
          estimate: undefined,
        });

        setTimeout(() => {
          this.titleInput?.nativeElement.focus();
        }, 50);
      }
    });
  }

  isTitleInvalid(): boolean {
    const control = this.createForm.get('title');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const val = this.createForm.value;
    const currentUser = this.userService.currentUser();
    const assignee = val.assigneeId
      ? this.userService.users().find((u) => u.id === val.assigneeId)
      : undefined;

    this.projectStore.addIssue({
      title: val.title.trim(),
      description: val.description ? val.description.trim() : '',
      type: val.type,
      status: val.status,
      priority: val.priority,
      estimate: val.estimate ? Number(val.estimate) : undefined,
      assigneeId: val.assigneeId || undefined,
      assignee: assignee,
      reporterId: currentUser.id,
      reporter: currentUser,
    });

    this.projectStore.closeCreateModal();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.projectStore.closeCreateModal();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.projectStore.isCreateModalOpen()) {
      this.projectStore.closeCreateModal();
    }
  }
}
