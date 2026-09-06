# 📋 Implementation Plan — Feature Set 2: Interactive Kanban Board (Core Engine)

Xây dựng bảng Kanban tương tác cốt lõi (**Interactive Kanban Board**) cho **Mini-Jira** dựa trên Angular v22, **Angular CDK Drag & Drop** (`@angular/cdk/drag-drop`), **Angular Signals** và bám sát tuyệt đối đặc tả thiết kế tại `design-system/MASTER.md` & `design-system/mockup.html`.

---

## 📐 Overview of Feature Set 2

Feature Set 2 là trái tim của Mini-Jira — cho phép người dùng kéo thả mượt mà các issue giữa 4 cột trạng thái, sắp xếp thứ tự ưu tiên trong cùng cột, xem chi tiết tóm tắt trên thẻ Card với đầy đủ Icon loại Issue, Priority, Story Point, Mã Issue (`MJ-xxx`) và Avatar người phụ trách.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ WORKSPACE: Kanban Board                                                                     │
│                                                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                         │
│ │ BACKLOG    4 │ │ IN PROGRESS 3│ │ IN REVIEW  2 │ │ DONE       3 │  (272px fixed column)   │
│ ├──────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────┤                         │
│ │ ┌──────────┐ │ │ ┌──────────┐ │ │ ┌──────────┐ │ │ ┌──────────┐ │                         │
│ │ │ 🟢 Story │ │ │ │ 🔵 Task  │ │ │ │ 🟣 Epic  │ │ │ │ 🟢 Story │ │  (Card with 3px type-   │
│ │ │ MJ-101   │ │ │ │ MJ-104   │ │ │ │ MJ-108   │ │ │ │ MJ-100   │ │   accent left border,   │
│ │ │ Auth fix │ │ │ │ Refactor │ │ │ │ Landing  │ │ │ │ Done job │ │   story point pill,     │
│ │ │ ⬆️ [BY]  │ │ │ │ ⬇️ [LG]  │ │ │ │ ⬆️ [WW]  │ │ │ │ ⬇️ [PR]  │ │   priority & avatar)    │
│ │ └──────────┘ │ │ └──────────┘ │ │ └──────────┘ │ │ └──────────┘ │                         │
│ │ ┌──────────┐ │ │ ┌──────────┐ │ │              │ │              │                         │
│ │ │ 🔴 Bug   │ │ │ │ ...      │ │ │              │ │              │                         │
│ │ └──────────┘ │ │ └──────────┘ │ │              │ │              │                         │
│ │ + Create     │ │ + Create     │ │ + Create     │ │ + Create     │                         │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘                         │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System Alignment (MASTER.md)

1. **Columns**:
   - 4 cột: `Backlog`, `In Progress`, `In Review`, `Done`.
   - Kích thước: `width: 272px` cố định, `gap: 8px`, `background: var(--surface-sunken)`, `radius: var(--radius-md)`, `padding: 6px`.
   - Tiêu đề cột: `12px / 600` uppercase `--text-muted`, số lượng issue badge `--text-subtle`.
   - Trạng thái trống: centered `--text-subtle` 12px "No issues".
2. **Issue Cards**:
   - Viền trái `3px solid` theo loại issue (`--type-story: #22A06B`, `--type-task: #2563EB`, `--type-bug: #DE350B`, `--type-epic: #8B5CF6`).
   - Summary: `14px / 500`, clamp 3 dòng.
   - Metadata footer:
     - Trái: Type icon + Mã Issue (`MJ-xxx` font JetBrains Mono 12px `--text-muted`).
     - Phải: Priority icon (Highest/High đỏ, Medium vàng, Low/Lowest xám xanh).
     - Story points pill: pill bo tròn 10px nền `--surface-sunken`.
     - Assignee Avatar 24px (hoặc unassigned dashed border).
3. **Drag & Drop Interactions**:
   - Drag preview (`.cdk-drag-preview`): `box-shadow: var(--shadow-drag)`, xoay nhẹ `rotate(3deg)`, opacity 1.
   - Drop placeholder (`.cdk-drag-placeholder`): viền nét đứt `2px dashed var(--border-strong)`, nền trong suốt, cùng chiều cao card.
   - Reorder animation: `transition: transform 200ms ease-out`.
4. **Accessibility (WCAG 2.2 AA)**:
   - Menu phụ "⋯" trên mỗi card cho phép di chuyển sang cột khác hoặc di chuyển lên/xuống bằng bàn phím mà không cần chuột (WCAG 2.5.7).
   - Announce kết quả kéo thả bằng `@angular/cdk/a11y` `LiveAnnouncer`.

---

## 🧩 Architecture & Components Breakdown

### 1. Data Models & Seed Data
- **`src/app/core/models/issue.model.ts`**:
  - `IssueType`: `'story' | 'task' | 'bug' | 'epic'`
  - `IssuePriority`: `'lowest' | 'low' | 'medium' | 'high' | 'highest'`
  - `IssueStatus`: `'backlog' | 'in_progress' | 'in_review' | 'done'`
  - `ColumnDef`: Cấu hình danh sách 4 cột.
  - `Issue`: Model issue đầy đủ (id, key, title, description, type, status, priority, estimate, assignee, reporter, order, timestamps).
  - `SEED_ISSUES`: Bộ dữ liệu mẫu gồm 12-15 công việc phát triển phần mềm chân thực phân bổ đều khắp 4 cột.

### 2. State Management (`ProjectStore`)
- **`src/app/core/services/project-store.ts`**:
  - Quản lý `issues = signal<Issue[]>(...)`.
  - Derived State qua `computed()`:
    - `issuesByStatus = computed(...)`: Phân nhóm issues theo từng cột và sắp xếp theo `order`.
    - `columnCounts = computed(...)`: Số lượng card trong mỗi cột.
  - Mutation methods:
    - `moveIssueInColumn(status, fromIndex, toIndex)`
    - `transferIssue(fromStatus, toStatus, fromIndex, toIndex)`
    - `updateIssue(id, updates)`
    - `addIssue(issue)`
    - `deleteIssue(id)`
    - `resetToDemoData()`
  - Tự động đồng bộ và lưu vào `localStorage` ('mini-jira-issues') qua `effect()`.

### 3. UI Components
- **`IssueTypeIconComponent` (`src/app/shared/components/issue-type-icon/`)**:
  - Hiển thị icon Story 🟢, Task 🔵, Bug 🔴, Epic 🟣.
- **`IssuePriorityIconComponent` (`src/app/shared/components/issue-priority-icon/`)**:
  - Hiển thị icon Highest ⏫, High 🔼, Medium 🟰, Low 🔽, Lowest ⏬.
- **`IssueCardComponent` (`src/app/features/board/components/issue-card/`)**:
  - Hiển thị thẻ Issue Card hoàn chỉnh với drag handle, metadata, type border, assignee avatar, story point pill, menu di chuyển không cần kéo thả.
- **`BoardColumnComponent` (`src/app/features/board/components/board-column/`)**:
  - Khung cột 272px với `cdkDropList`, header đếm issue, danh sách card `@for`, nút `+ Create issue` nhanh.
- **`BoardPageComponent` (`src/app/features/board/board-page.ts`)**:
  - Bảng Kanban tổng hợp kết nối `cdkDropListGroup`, 4 cột, thanh cuộn ngang mượt mà, xử lý sự kiện `cdkDropListDropped`.

---

## 📁 Proposed Changes

### Core Models & State
#### [NEW] [issue.model.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/models/issue.model.ts)
- Khai báo các type, interfaces và 14 seed issues mẫu thực tế.

#### [NEW] [project-store.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/services/project-store.ts)
- Signals State Store xử lý kéo thả, sắp xếp, cập nhật và đồng bộ LocalStorage.

---

### Shared Components
#### [MODIFY] [svg-icon.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/shared/components/svg-icon/svg-icon.ts)
- Bổ sung SVG icons cho issue types (`type-story`, `type-task`, `type-bug`, `type-epic`) và priorities (`prio-highest`, `prio-high`, `prio-medium`, `prio-low`, `prio-lowest`, `more-horizontal`, `corner-down-right`).

#### [NEW] [issue-type-icon.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/shared/components/issue-type-icon/issue-type-icon.ts)
- Component hiển thị icon và màu sắc cho loại Issue.

#### [NEW] [issue-priority-icon.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/shared/components/issue-priority-icon/issue-priority-icon.ts)
- Component hiển thị icon và màu sắc cho mức độ ưu tiên.

---

### Kanban Board Components
#### [NEW] [issue-card.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/issue-card/issue-card.ts) & [issue-card.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/issue-card/issue-card.html) & [issue-card.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/issue-card/issue-card.scss)
- Issue Card Component với CDK drag preview, placeholder và context action menu.

#### [NEW] [board-column.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/board-column/board-column.ts) & [board-column.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/board-column/board-column.html) & [board-column.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/board-column/board-column.scss)
- Board Column Component bọc CDK drop list và empty state.

#### [MODIFY] [board-page.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/board-page.ts) & [board-page.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/board-page.html) & [board-page.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/board-page.scss)
- Trang Kanban Board hoàn chỉnh với `cdkDropListGroup` kết nối 4 cột.

---

## 🧪 Verification Plan

### Automated Tests
1. `npm run build`: Đảm bảo toàn bộ code TypeScript, CDK Drag-Drop và SCSS biên dịch 100% không lỗi.
2. `npm run test`: Chạy unit tests cho `ProjectStore` kiểm tra logic di chuyển trong cột và chuyển cột.

### Manual Verification
1. **Drag and Drop cùng cột**: Kéo thẻ từ vị trí 1 xuống vị trí 3 trong cột `Backlog`, kiểm tra thẻ đổi vị trí mượt mà và lưu lại đúng thứ tự khi tải lại trang.
2. **Drag and Drop khác cột**: Kéo thẻ từ `In Progress` sang `In Review`, kiểm tra trạng thái thẻ tự động đổi thành `in_review` và số lượng đếm ở header 2 cột cập nhật ngay lập tức.
3. **Drag Preview & Placeholder**: Kiểm tra khi đang kéo thẻ có bóng đổ (`--shadow-drag`), xoay nhẹ 3 độ, và ô placeholder viền nét đứt xuất hiện tại vị trí sẽ thả.
4. **Accessible Move Menu**: Bấm nút "⋯" trên card, chọn "Move to Done" kiểm tra card chuyển sang cột Done không cần kéo chuột.
5. **Theme Check**: Chuyển sang Dark Mode kiểm tra viền màu accent, màu thẻ và màu cột chuyển đổi chính xác theo token Dark mode.
