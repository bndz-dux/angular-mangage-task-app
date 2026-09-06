import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });
    service = TestBed.inject(ToastService);
  });

  it('should add a success toast correctly', () => {
    service.showSuccess('Test success message');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Test success message');
    expect(service.toasts()[0].type).toBe('success');
  });

  it('should remove a toast by id', () => {
    service.showInfo('Message 1');
    service.showError('Message 2');
    expect(service.toasts().length).toBe(2);

    const firstId = service.toasts()[0].id;
    service.remove(firstId);

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Message 2');
  });
});
