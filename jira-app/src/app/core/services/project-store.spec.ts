import { TestBed } from '@angular/core/testing';
import { ProjectStore } from './project-store';
import { UserService } from './user.service';
import { SEED_ISSUES } from '../models/issue.model';

describe('ProjectStore', () => {
  let store: ProjectStore;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectStore, UserService],
    });
    store = TestBed.inject(ProjectStore);
    userService = TestBed.inject(UserService);
    store.resetToDemoData();
  });

  it('should initialize with seed issues', () => {
    expect(store.issues().length).toBe(SEED_ISSUES.length);
  });

  it('should group issues by status correctly', () => {
    const grouped = store.issuesByStatus();
    expect(grouped.backlog.length).toBeGreaterThan(0);
    expect(grouped.in_progress.length).toBeGreaterThan(0);
    expect(grouped.in_review.length).toBeGreaterThan(0);
    expect(grouped.done.length).toBeGreaterThan(0);
  });

  it('should transfer issue to a new status', () => {
    const initialBacklogCount = store.issuesByStatus().backlog.length;
    const initialInProgressCount = store.issuesByStatus().in_progress.length;

    store.transferIssue('backlog', 'in_progress', 0, 0);

    expect(store.issuesByStatus().backlog.length).toBe(initialBacklogCount - 1);
    expect(store.issuesByStatus().in_progress.length).toBe(initialInProgressCount + 1);
  });

  it('should reorder issue within same column', () => {
    const initialFirst = store.issuesByStatus().backlog[0];
    const initialSecond = store.issuesByStatus().backlog[1];

    store.moveIssueInColumn('backlog', 0, 1);

    expect(store.issuesByStatus().backlog[0].id).toBe(initialSecond.id);
    expect(store.issuesByStatus().backlog[1].id).toBe(initialFirst.id);
  });

  it('should filter issues by search term keyword', () => {
    store.searchTerm.set('redirect');
    expect(store.filteredIssues().length).toBeGreaterThan(0);
    expect(store.filteredIssues().every((i) =>
      i.title.toLowerCase().includes('redirect') ||
      i.key.toLowerCase().includes('redirect') ||
      i.description.toLowerCase().includes('redirect'),
    )).toBe(true);
  });

  it('should filter issues by issue type', () => {
    store.setTypeFilter('bug');
    expect(store.filteredIssues().length).toBeGreaterThan(0);
    expect(store.filteredIssues().every((i) => i.type === 'bug')).toBe(true);
  });

  it('should clear all filters correctly', () => {
    store.searchTerm.set('test');
    store.setTypeFilter('story');
    store.toggleOnlyMine();
    expect(store.isFilterActive()).toBe(true);

    store.clearFilters();
    expect(store.isFilterActive()).toBe(false);
    expect(store.filteredIssues().length).toBe(SEED_ISSUES.length);
  });

  it('should add a new issue correctly', () => {
    const currentUser = userService.currentUser();
    const newIssue = store.addIssue({
      title: 'New Unit Test Task',
      description: 'Test description',
      type: 'task',
      status: 'backlog',
      priority: 'high',
      reporterId: currentUser.id,
      reporter: currentUser,
    });

    expect(newIssue.key).toBeDefined();
    expect(store.issues().some((i) => i.id === newIssue.id)).toBe(true);
  });

  it('should add and delete comments correctly', () => {
    const targetIssue = store.issues()[0];
    const initialCommentCount = targetIssue.comments.length;

    store.addComment(targetIssue.id, 'This is a new test comment');

    const updatedIssue = store.issues().find((i) => i.id === targetIssue.id)!;
    expect(updatedIssue.comments.length).toBe(initialCommentCount + 1);

    const addedComment = updatedIssue.comments[updatedIssue.comments.length - 1];
    expect(addedComment.body).toBe('This is a new test comment');

    store.deleteComment(targetIssue.id, addedComment.id);

    const finalIssue = store.issues().find((i) => i.id === targetIssue.id)!;
    expect(finalIssue.comments.length).toBe(initialCommentCount);
  });
});
