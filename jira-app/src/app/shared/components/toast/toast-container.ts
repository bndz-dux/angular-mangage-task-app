import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { SvgIconComponent } from '../svg-icon/svg-icon';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
