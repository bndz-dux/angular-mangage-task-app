import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar';
import { SidebarComponent } from '../sidebar/sidebar';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb';
import { CreateIssueModalComponent } from '../../../features/board/components/create-issue-modal/create-issue-modal';
import { IssueDetailDrawerComponent } from '../../../features/board/components/issue-detail-drawer/issue-detail-drawer';
import { ConfirmDeleteModalComponent } from '../../../shared/components/confirm-delete-modal/confirm-delete-modal';
import { ToastContainerComponent } from '../../../shared/components/toast/toast-container';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    TopbarComponent,
    SidebarComponent,
    BreadcrumbComponent,
    CreateIssueModalComponent,
    IssueDetailDrawerComponent,
    ConfirmDeleteModalComponent,
    ToastContainerComponent,
  ],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayoutComponent {}
