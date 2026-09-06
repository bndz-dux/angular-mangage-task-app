# 🚀 Jira Clone (Angular 19 + Signals + CDK)

[![Angular](https://img.shields.io/badge/Angular-19+-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Angular CDK](https://img.shields.io/badge/Angular_CDK-Drag_&_Drop-FF5722?style=for-the-badge&logo=angular&logoColor=white)](https://material.angular.io/cdk/drag-drop/overview)
[![SCSS](https://img.shields.io/badge/SCSS-Design_Tokens-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> A modern, high-performance, and responsive Jira Clone built with **Angular (Standalone Components, Signals & Control Flow)**, **Angular CDK Drag & Drop**, and a custom **SCSS Design System**.

---

## 📸 Overview

This project is a streamlined, fast, and feature-rich Jira-inspired task management workspace. It eliminates enterprise bloat while delivering essential agile workflows: an interactive Kanban board, Backlog view, List view, real-time filtering, inline issue editing, and user switching.

---

## ✨ Features

### 📋 1. Interactive Kanban Board
- **Cross-Column Drag & Drop**: Move issues across workflow columns (`Backlog`, `In Progress`, `In Review`, `Done`) powered by `@angular/cdk/drag-drop`.
- **Vertical Reordering**: Smooth re-ranking of cards within the same column.
- **Card Metadata**: Displays issue type icons (Story, Task, Bug, Epic), priority badges, assignee avatars, story points, and unique keys (e.g., `JIRA-101`).

### 🔍 2. Real-time Search & Filter Engine
- **Instant Search**: Debounced text search query matching summary and description.
- **Quick Filters**: One-click toggles for *"Only My Issues"* and *"Recently Updated"*.
- **Assignee Filter**: Filter issues by clicking on teammate avatars with multi-select support.
- **Type & Priority Filter**: Dropdowns to narrow down specific issue types and priorities.
- **Reset All**: Clear all active filters with a single click.

### 📝 3. Comprehensive Issue Lifecycle Management
- **Quick Create Modal**: Press `C` or click **"+ Create"** to open a modal with field validations (Title, Description, Type, Priority, Assignee, Reporter, Story Points).
- **Issue Detail Drawer**: Slide-out panel for deep inspection with:
  - **Inline Editing**: Instant edit for title, description, status, priority, and assignee.
  - **Delete Confirmation Dialog**: Safe deletion with visual confirmation.
  - **Timestamps**: Created at and updated at tracking.

### 👥 4. Multi-User & Workspace Experience
- **User Switcher**: Easily switch between team members (Ngoc Dung, Sarah Connor, Alex Rivera, Emily Watson) to test role-based perspectives.
- **Light / Dark Mode**: Theme toggle with full SCSS token support.
- **Toast Notifications**: Real-time feedback for create, update, and delete actions.
- **Alternative Views**: Includes **Backlog Page**, **List View**, **Releases**, and **Project Settings**.

### 💾 5. State Persistence
- Fully reactive state architecture using **Angular Signals** (`signal`, `computed`, `effect`).
- Automatic synchronization with **LocalStorage** for offline persistence with pre-seeded sample data.

---

## 📂 Project Structure

```text
.
├── design-system/                  # Design system tokens and standalone HTML mockup
│   ├── MASTER.md                   # Comprehensive design specification & guidelines
│   └── mockup.html                 # Interactive static prototype
├── jira-app/                       # Main Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/               # Core services, models, layout (TopBar, Sidebar, Breadcrumb)
│   │   │   │   ├── models/         # Issue & User TypeScript interfaces
│   │   │   │   ├── services/       # ProjectStore, UserService, ThemeService, ToastService
│   │   │   │   └── layout/         # AppLayout, Topbar, Sidebar, Breadcrumb components
│   │   │   ├── features/           # Feature pages (Board, Backlog, List, Releases, Settings)
│   │   │   │   ├── board/          # Kanban Board, Columns, Cards, Modals, Filters, Drawer
│   │   │   │   ├── backlog/        # Backlog list & sprint planning
│   │   │   │   ├── list/           # Tabular view of all issues
│   │   │   │   ├── releases/       # Releases overview
│   │   │   │   └── settings/       # Project settings
│   │   │   └── shared/             # Reusable UI components & icons
│   │   │       ├── components/     # SvgIcon, UserAvatar, ToastContainer, ConfirmModal...
│   │   └── styles.scss             # Global design tokens, CSS variables, utility classes
├── plan-implement/                 # Feature breakdown & implementation guides
│   ├── feature-set-1-navigation-layout.md
│   ├── feature-set-2-kanban-board.md
│   ├── feature-set-3-search-filters.md
│   ├── feature-set-4-issue-management.md
│   ├── feature-set-5-user-switcher.md
│   └── feature-set-6-backlog-list-views.md
├── PLAN.md                         # Master architectural plan
└── README.md                       # Repository documentation
```

---

## 🛠️ Tech Stack

- **Framework**: [Angular 19+](https://angular.dev/) (Standalone Components, modern `@if`/`@for`/`@switch` control flow)
- **State Management**: Angular Signals & RxJS
- **Drag & Drop**: [@angular/cdk/drag-drop](https://material.angular.io/cdk/drag-drop/overview)
- **Styling**: SCSS with CSS Custom Properties / Design Tokens
- **Icons**: [Lucide Angular](https://lucide.dev/) & Custom SVG components
- **Testing**: [Vitest](https://vitest.dev/) with `@angular/build`

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ngocdung12112000/angular-app.git
   cd angular-app/jira-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   # or
   npx ng serve
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:4200/` in your browser.

---

## 🧪 Running Tests

To run the unit tests with Vitest:
```bash
cd jira-app
npm test
```

---

## 🎨 Design System Mockup

To view the standalone HTML/CSS prototype without running the Angular dev server:
1. Open `design-system/mockup.html` directly in any web browser.
2. Read `design-system/MASTER.md` for the complete design tokens and component specifications.

---

