import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { ToastService } from './toast.service';
import { SEED_USERS } from '../models/user.model';

describe('UserService', () => {
  let userService: UserService;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, ToastService],
    });
    userService = TestBed.inject(UserService);
    toastService = TestBed.inject(ToastService);
  });

  it('should initialize with 5 seed users', () => {
    expect(userService.users().length).toBe(5);
  });

  it('should switch user identity and trigger a toast notification', () => {
    const newUser = SEED_USERS[1]; // Baby Yoda
    userService.switchUser(newUser);

    expect(userService.currentUser().id).toBe(newUser.id);
    expect(toastService.toasts().length).toBe(1);
    expect(toastService.toasts()[0].message).toContain('Baby Yoda');
  });
});
