# 🚀 Simplified Jira Clone (Jira Lite) - Feature List & Implementation Plan

A comprehensive, production-ready roadmap and architectural blueprint for building a fast, modern, and simplified Jira Clone using **Angular (v18+ with Standalone Components & Signals)**, **Tailwind CSS**, and **Angular CDK Drag & Drop**.

---

## 📑 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack Recommendation](#2-tech-stack-recommendation)
3. [Core Feature Breakdown](#3-core-feature-breakdown)
4. [Data Models & Schema](#4-data-models--schema)
5. [Application Architecture & Component Tree](#5-application-architecture--component-tree)
6. [Step-by-Step Implementation Roadmap](#6-step-by-step-implementation-roadmap)
7. [Suggested Extensions / Future Enhancements](#7-suggested-extensions--future-enhancements)

---

## 1. Project Overview

The goal is to build a **responsive, high-performance, and intuitive task/project management web app** inspired by Jira, stripped of unnecessary enterprise bloat while retaining its most loved features:
- Interactive **Kanban Board** with smooth drag-and-drop.
- Rich **Issue Details Modal** with inline editable fields.
- Fast **Search & Multi-criteria Filtering**.
- **User Assignee Switcher** & sample seed data.
- **Local Persistence** (LocalStorage/IndexedDB) with an easy path to REST/Firebase/Supabase backend.

---

## 2. Tech Stack Recommendation

| Layer | Recommended Technology | Why? |
| :--- | :--- | :--- |
| **Framework** | **Angular 18+** | Standalone components, modern `@if`/`@for` control flow, Signals. |
| **Styling** | **Tailwind CSS** + **Lucide Angular / Heroicons** | Rapid UI styling, modern clean Jira-like aesthetic. |
| **Interactions** | **Angular CDK (`@angular/cdk/drag-drop`)** | Native smooth cross-column drag and drop. |
| **State Management** | **Angular Signals & Signal Store / RxJS Services** | Lightweight, reactive, predictable state with zero boilerplate. |
| **Data Persistence** | **LocalStorage / IndexedDB** (Phase 1) → **Supabase / Firebase / NestJS** (Phase 2) | Instant offline playground without backend dependencies initially. |
| **Editor** | **TipTap / ngx-quill** or lightweight Markdown parser | Rich description and comment formatting. |

---

## 3. Core Feature Breakdown

### 🎯 Feature Set 1: Navigation & Layout
- **Collapsible Sidebar**:
  - Project identity (Icon, Name, Key e.g., `PROJ-1`).
  - Navigation links: **Kanban Board**, **Backlog**, **Project Settings**, **Releases (simplified)**.
  - Collapse / Expand toggle for maximum board workspace.
- **Top Navigation Bar**:
  - Global Search bar (quick filter by issue key or text).
  - Quick "+ Create Issue" CTA button (accessible via keyboard shortcut `c`).
  - Active User Avatar / Switcher dropdown.
  - GitHub repository link / Dark mode toggle (optional).
- **Breadcrumbs**:
  - Dynamic route breadcrumb (e.g., `Projects / Mini-Jira / Kanban Board`).

---

### 📋 Feature Set 2: Interactive Kanban Board (Core Engine)
- **Multi-Column Workflow**:
  - Standard columns: `Backlog`, `In Progress`, `In Review`, `Done`.
  - Column header showing issue count and column name.
- **Drag-and-Drop (`Angular CDK`)**:
  - Move issues horizontally between status columns.
  - Reorder issues vertically within the same column to adjust priority/rank.
  - Smooth animation with drop placeholder indicators.
- **Issue Card Details on Board**:
  - Issue Type icon (`Story` 🟢, `Task` 🔵, `Bug` 🔴, `Epic` 🟣).
  - Issue Key & Summary (e.g., `JIRA-104: Fix auth redirect loop`).
  - Priority icon (Lowest, Low, Medium, High, Highest).
  - Assignee avatar (or unassigned badge).
  - Story point estimate pill.

---

### 🔍 Feature Set 3: Search, Quick Filters & Sorting
- **Real-time Text Search**: Instant debounced filtering by title or description.
- **Quick Filters**:
  - **Only My Issues**: Filter issues assigned to the currently selected user.
  - **Recently Updated**: Highlight cards modified recently.
- **Filter by Assignee**: Clickable user avatars in the filter bar (multi-select supported).
- **Filter by Issue Type**: Dropdown / chips (Story, Task, Bug, Epic).
- **Clear All Filters**: One-click reset button with active filter badge count.

---

### 📝 Feature Set 4: Issue Management & Detail Modal
- **Quick Create Issue Modal**:
  - Project & Issue Type selector.
  - Summary / Title input (auto-focused).
  - Description input (with markdown preview / rich formatting).
  - Assignee, Reporter, and Priority selectors.
  - Story points estimate number input.
  - Form validation with error feedback.
- **Full Issue Detail Drawer / Modal**:
  - **Inline Editing**: Click on title, description, status, priority, or assignee to update instantly.
  - **Status Transition**: Quick dropdown to move issue through workflow stages.
  - **Time / Date Metadata**: Created at, Last updated timestamps.
  - **Delete Issue**: With confirmation dialog.
- **Comments & Activity Stream**:
  - Post comments under an issue.
  - Edit and delete own comments.
  - Relative timestamps (e.g., "2 hours ago").
  - User avatar alongside comments.

---

### 👥 Feature Set 5: User Switcher & Demo Workspace
- **Mock User Directory**:
  - 4-5 pre-seeded team members with realistic names and avatars (e.g., Product Manager, Lead Dev, QA Specialist, Designer).
- **Quick Switcher**:
  - Switch active user from the top right to simulate different perspectives (assignee filters, comment authors).
- **Default Seed Data**:
  - Pre-populated project with 10-15 realistic development tasks across all columns for immediate demonstration.
  - Reset to Demo Data button in settings.

---

### 📊 Feature Set 6: Backlog & List Views (Alternative Views)
- **Backlog View**:
  - Separate list for unassigned backlog items.
  - Move issues directly from Backlog to Board (simulating Sprint start).
- **List / Table View**:
  - Compact row-based list for quick sorting by status, assignee, priority, or updated date.

---

## 4. Data Models & Schema

```typescript
export type IssueType = 'story' | 'task' | 'bug' | 'epic';
export type IssuePriority = 'lowest' | 'low' | 'medium' | 'high' | 'highest';
export type IssueStatus = 'backlog' | 'in_progress' | 'in_review' | 'done';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  user: User;
  body: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Issue {
  id: string;
  key: string;              // e.g. "JIRA-12"
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  estimate?: number;        // Story points
  assigneeId?: string;
  assignee?: User;
  reporterId: string;
  reporter: User;
  comments: Comment[];
  order: number;            // Vertical sort position in column
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;              // e.g. "JIRA"
  description: string;
  category: string;
  issues: Issue[];
  users: User[];
}

export interface FilterState {
  searchQuery: string;
  userIds: string[];
  types: IssueType[];
  onlyMyIssues: boolean;
}
```

---

## 5. Application Architecture & Component Tree

```
src/app/
├── core/
│   ├── models/           # TypeScript interfaces (Issue, User, Project, Filter)
│   ├── services/         # IssueService, ProjectService, UserService, StorageService
│   ├── state/            # ProjectState (Signal-based store)
│   └── mock/             # Seed data (users.mock.ts, issues.mock.ts)
├── shared/
│   ├── components/       # Avatar, Badge, PriorityIcon, IssueTypeIcon, Modal, Dropdown
│   ├── directives/       # Autofocus, ClickOutside
│   └── pipes/            # TimeAgoPipe, FilterIssuesPipe
└── features/
    ├── layout/
    │   ├── sidebar/      # Collapsible navigation
    │   ├── top-navbar/   # Search, quick create, user switcher
    │   └── shell/        # Main layout container
    ├── board/
    │   ├── board-container/     # Board header + filter bar + columns grid
    │   ├── board-filter-bar/    # Search input, user pills, type dropdown
    │   ├── board-column/        # Individual status column with CDK drop list
    │   └── issue-card/          # Draggable issue card summary
    ├── issue/
    │   ├── issue-create-modal/  # Issue creation dialog
    │   ├── issue-detail-modal/  # Full issue detail drawer/modal with inline editing
    │   └── issue-comments/      # Comments list and comment input box
    └── backlog/
        └── backlog-list/        # List view of backlog items
```

---

## 6. Step-by-Step Implementation Roadmap

### 🏁 Phase 1: Environment & Project Scaffolding
- [ ] Initialize Angular 18+ application with standalone components:
  ```bash
  ng new jira-clone --standalone --routing --style=scss
  ```
- [ ] Install and configure **Tailwind CSS** and **Angular CDK**:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init
  npm install @angular/cdk lucide-angular
  ```
- [ ] Set up color palette matching Jira (Atlassian Design System tokens: Blues, Slates, Status colors).

---

### 🎨 Phase 2: Core Layout & Shell
- [ ] Implement `SidebarComponent` (expand/collapse animation, active route highlights).
- [ ] Implement `TopNavbarComponent` (global search bar, quick action button, user avatar switcher).
- [ ] Implement `LayoutShellComponent` with Angular router outlets.

---

### 🗄️ Phase 3: Data Layer, Seed Data & Signal State
- [ ] Create mock dataset: 4 realistic users, 15 rich issues with descriptions and comments.
- [ ] Implement `StorageService` with automatic LocalStorage sync.
- [ ] Implement `ProjectStore` using Angular Signals:
  - `issues = signal<Issue[]>([])`
  - `filter = signal<FilterState>({...})`
  - `filteredIssues = computed(...)`
  - `issuesByStatus = computed(...)`

---

### 🛹 Phase 4: Kanban Board with CDK Drag & Drop
- [ ] Build `BoardContainerComponent` and `BoardFilterBarComponent`.
- [ ] Build `BoardColumnComponent` connected to `cdkDropListGroup`.
- [ ] Build `IssueCardComponent` with `cdkDrag`.
- [ ] Implement drop event handler:
  - Update issue status when dragged across columns.
  - Re-order issues and update `order` property when moved within the same column.

---

### ✏️ Phase 5: Issue Creation & Detail Modal
- [ ] Build `IssueCreateModalComponent`:
  - Validated reactive form.
  - Automatic issue key generator (e.g., `JIRA-${nextIndex}`).
  - Keyboard shortcut `c` trigger.
- [ ] Build `IssueDetailModalComponent`:
  - URL-synchronized routing (e.g., `/project/board/issues/:issueId`).
  - Inline title editor (contenteditable or input swap on focus).
  - Inline rich description editor with auto-save.
  - Status, Priority, Estimate, and Assignee dropdown selectors.
  - Delete issue action with confirmation.

---

### 💬 Phase 6: Comments & Activity System
- [ ] Build `IssueCommentsComponent`:
  - Render list of comments ordered by date.
  - Add new comment box with active user avatar.
  - Edit & delete comment actions.

---

### 🔎 Phase 7: Filtering, Polish & UX Enhancements
- [ ] Connect debounced search bar to `ProjectStore`.
- [ ] Add quick filters ("Only My Issues", user avatar toggles).
- [ ] Implement keyboard shortcuts:
  - `c` → Open Create Modal
  - `/` → Focus Search Bar
  - `Esc` → Close Modals
- [ ] Empty states and smooth UI feedback (tooltips, toast notifications).

---

## 7. Suggested Extensions / Future Enhancements

Once the core features are running smoothly, consider these valuable extensions:
1. **Dark Mode**: Switch between Atlassian Dark and Light themes.
2. **Export / Import JSON**: Export board data to a JSON file and import backup snapshots.
3. **Backend Integration**: Replace LocalStorage with **Supabase** (Postgres + Auth) or **Firebase Firestore** for real-time multiplayer collaboration.
4. **Sprint Burndown Chart**: Simple Chart.js / ApexCharts visual showing remaining story points.

---
*Generated for: `D:\LEARN BY MYSELF\Angular`*
