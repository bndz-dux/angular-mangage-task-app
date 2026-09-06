import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User, SEED_USERS } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly toastService = inject(ToastService);
  private readonly STORAGE_KEY = 'mini-jira-current-user-id';

  readonly users = signal<User[]>(SEED_USERS);
  readonly currentUser = signal<User>(SEED_USERS[0]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedId = localStorage.getItem(this.STORAGE_KEY);
      if (savedId) {
        const found = SEED_USERS.find((u) => u.id === savedId);
        if (found) {
          this.currentUser.set(found);
        }
      }

      effect(() => {
        localStorage.setItem(this.STORAGE_KEY, this.currentUser().id);
      });
    }
  }

  switchUser(user: User): void {
    if (this.currentUser().id !== user.id) {
      this.currentUser.set(user);
      this.toastService.showSuccess(`Switched identity to ${user.name} (${user.role})`);
    }
  }
}
