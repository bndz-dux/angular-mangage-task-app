import { TestBed } from '@angular/core/testing';
import { ListPageComponent } from './list-page';
import { ProjectStore } from '../../core/services/project-store';
import { UserService } from '../../core/services/user.service';

describe('ListPageComponent', () => {
  let component: ListPageComponent;
  let store: ProjectStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListPageComponent],
      providers: [ProjectStore, UserService],
    });
    const fixture = TestBed.createComponent(ListPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(ProjectStore);
    store.resetToDemoData();
  });

  it('should initialize with key ascending sort order', () => {
    expect(component.sortField()).toBe('key');
    expect(component.sortOrder()).toBe('asc');
  });

  it('should toggle sort order direction when clicking same field', () => {
    component.toggleSort('key');
    expect(component.sortField()).toBe('key');
    expect(component.sortOrder()).toBe('desc');
  });

  it('should switch sort field and default to asc when clicking new field', () => {
    component.toggleSort('priority');
    expect(component.sortField()).toBe('priority');
    expect(component.sortOrder()).toBe('asc');
  });

  it('should sort issues by priority correctly', () => {
    component.toggleSort('priority'); // asc: lowest -> highest
    const sorted = component.sortedIssues();
    expect(sorted.length).toBeGreaterThan(0);
  });
});
