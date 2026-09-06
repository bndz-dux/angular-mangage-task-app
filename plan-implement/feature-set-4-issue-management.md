# 📋 Implementation Plan — Feature Set 4: Issue Management & Detail Modal

Xây dựng hệ thống quản lý và chỉnh sửa công việc chi tiết (**Issue Management & Detail Modal/Drawer**) cho **Mini-Jira** dựa trên Angular v22, **Typed Reactive Forms**, **Angular CDK FocusTrap & Overlay**, bám sát 100% đặc tả thiết kế tại `design-system/MASTER.md` & `design-system/mockup.html`.

---

## 📐 Overview of Feature Set 4

Feature Set 4 cung cấp đầy đủ vòng đời tạo mới, xem chi tiết, chỉnh sửa trực tiếp (Inline Editing), bình luận và xóa công việc:
1. **Quick Create Issue Modal**: Modal tạo mới Issue với form validation, tự động focus ô tiêu đề, chọn Loại Issue, Priority, Assignee, Story Points.
2. **Issue Detail Drawer**: Panel trượt từ bên phải (`480px` slide-in), hỗ trợ deep-link URL `/projects/MJ/board/issues/MJ-104`.
   - **Inline Editing**: Nhấp vào Tiêu đề, Mô tả, Status, Priority, Assignee để cập nhật ngay lập tức.
   - **Right Metadata Rail**: Hiển thị trạng thái, độ ưu tiên, người thực hiện, người báo cáo, điểm ước lượng, ngày tạo & ngày cập nhật tương đối ("2 hours ago").
3. **Comments & Activity Stream**: Viết bình luận mới, xóa bình luận, hiển thị avatar tác giả.
4. **Confirm Delete Modal**: Modal xác nhận xóa an toàn 400px trước khi xóa issue vĩnh viễn.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ WORKSPACE: Kanban Board                                                                     │
│ ┌──────────────┐ ┌──────────────┐ ┌───────────────────────────────────────────────────────┐ │
│ │ BACKLOG    4 │ │ IN PROGRESS 3│ │ ISSUES DETAIL DRAWER (480px Slide-in Right)           │ │
│ ├──────────────┤ ├──────────────┤ │ ┌───────────────────────────────────────────────────┐ │ │
│ │ [MJ-101]     │ │ [MJ-105]     │ │ │ [🟢 Story] MJ-105                       [X] │ │ │
│ │              │ │ (Clicked)    │ │ ├───────────────────────────────────────────────────┤ │ │
│ │              │ │              │ │ │ Title: Build interactive Kanban board engine...   │ │ │
│ │              │ │              │ │ │ Description: Integrate Angular CDK drag-drop...   │ │ │
│ │              │ │              │ │ │ ───────────────────────────────────────────────── │ │ │
│ │              │ │              │ │ │ Activity & Comments (2)                           │ │ │
│ │              │ │              │ │ │ [BY] Baby Yoda: Working on drag preview styling!  │ │ │
│ │              │ │              │ │ │ [Input: Add a comment...] [Save]                  │ │ │
│ │              │ │              │ │ └───────────────────────────────────────────────────┘ │ │
│ └──────────────┘ └──────────────┘ └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System Alignment (MASTER.md & mockup.html)

1. **Create Issue Modal**:
   - `width: 520px` max-width 100%, `background: var(--surface)`, `radius: var(--radius-lg)`, `shadow: var(--shadow-modal)`.
   - Animation: Scrim fade 120ms + Modal `pop` (`translateY(8px) -> 0`, `opacity 0 -> 1` 160ms `ease-out`).
   - Phím tắt `c` hoặc nút **+ Create** trên Topbar / cuối cột mở modal.
2. **Detail Drawer**:
   - `width: 480px` (full width < 768px), `position: fixed; top: 0; right: 0; bottom: 0; z-index: var(--z-drawer)`.
   - Animation: `transform 160ms ease`, `opacity 160ms ease`.
   - **Inline Edit Title**: Textarea font `18px / 600`, hover đổi nền, `focus` hiện focus-ring, `Enter`/`blur` lưu, `Esc` hủy.
   - **Inline Edit Description**: Textarea min-height `90px`.
   - **Right Rail (`.rail`)**: Nền `var(--surface-sunken)`, chứa dropdown Status, Priority, Assignee, Story Points, và thời gian tạo/cập nhật `<time>`.
3. **Confirm Delete Modal**:
   - `width: 400px`, tiêu đề cảnh báo, nút "Cancel" mặc định, nút "Delete" dạng `--danger`.

---

## 🧩 Architecture & Components Breakdown

### 1. Data Models & Store Enhancements
- **`src/app/core/models/issue.model.ts`**:
  - Bổ sung helper format relative time (ví dụ: "Just now", "5 minutes ago", "2 hours ago", "Yesterday").
- **`src/app/core/services/project-store.ts`**:
  - Signals: `selectedIssueKey = signal<string | null>(null)`, `isCreateModalOpen = signal<boolean>(false)`, `createModalDefaultStatus = signal<IssueStatus>('backlog')`.
  - Computed: `selectedIssue = computed(...)`.
  - Methods:
    - `openCreateModal(status?: IssueStatus)`
    - `closeCreateModal()`
    - `selectIssueByKey(key: string | null)`
    - `addComment(issueId: string, body: string)`
    - `deleteComment(issueId: string, commentId: string)`

### 2. UI Components
- **`CreateIssueModalComponent` (`src/app/features/board/components/create-issue-modal/`)**:
  - `create-issue-modal.ts`, `html`, `scss`.
  - Form validation với Typed Reactive Forms (`FormBuilder`).
  - Hỗ trợ chọn Issue Type, Title (auto-focused), Description, Assignee, Reporter, Priority, Story points.
- **`IssueDetailDrawerComponent` (`src/app/features/board/components/issue-detail-drawer/`)**:
  - `issue-detail-drawer.ts`, `html`, `scss`.
  - Chỉnh sửa Inline Title & Description, Dropdown đổi Status / Priority / Assignee.
  - Bình luận & dòng hoạt động (Activity stream).
- **`ConfirmDeleteModalComponent` (`src/app/shared/components/confirm-delete-modal/`)**:
  - `confirm-delete-modal.ts`, `html`, `scss`.
  - Modal hộp thoại xác nhận xóa issue vĩnh viễn.

---

## 📁 Proposed Changes

### Core Models & Store
#### [MODIFY] [issue.model.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/models/issue.model.ts)
- Thêm helper hàm tính thời gian tương đối `getRelativeTimeString(isoDate: string)`.

#### [MODIFY] [project-store.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/services/project-store.ts)
- Bổ sung các signals `selectedIssueKey`, `isCreateModalOpen`, `createModalDefaultStatus` và các hàm `addComment`, `deleteComment`, `openCreateModal`, `closeCreateModal`, `selectIssueByKey`.

---

### Components & Templates
#### [NEW] [create-issue-modal.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/create-issue-modal/create-issue-modal.ts) & [create-issue-modal.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/create-issue-modal/create-issue-modal.html) & [create-issue-modal.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/create-issue-modal/create-issue-modal.scss)
- Modal tạo Issue mới với Typed Reactive Form.

#### [NEW] [confirm-delete-modal.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/shared/components/confirm-delete-modal/confirm-delete-modal.ts) & [confirm-delete-modal.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/shared/components/confirm-delete-modal/confirm-delete-modal.html) & [confirm-delete-modal.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/shared/components/confirm-delete-modal/confirm-delete-modal.scss)
- Modal xác nhận xóa an toàn.

#### [NEW] [issue-detail-drawer.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/issue-detail-drawer/issue-detail-drawer.ts) & [issue-detail-drawer.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/issue-detail-drawer/issue-detail-drawer.html) & [issue-detail-drawer.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/issue-detail-drawer/issue-detail-drawer.scss)
- Panel slide-in chi tiết công việc, chỉnh sửa trực tiếp inline, đăng bình luận.

#### [MODIFY] [topbar.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/topbar/topbar.ts)
- Kết nối phím tắt `c` và nút **+ Create** với `projectStore.openCreateModal()`.

#### [MODIFY] [app-layout.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/app-layout/app-layout.html) & [app-layout.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/app-layout/app-layout.ts)
- Nhúng `CreateIssueModalComponent` và `IssueDetailDrawerComponent` cấp toàn cục trong App Layout Shell.

---

## 🧪 Verification Plan

### Automated Tests
1. `npm run build`: Kiểm tra toàn bộ code TypeScript, Forms validation, SCSS biên dịch 100% không lỗi.
2. `npm run test`: Thêm unit tests cho `ProjectStore` kiểm tra logic `addComment`, `deleteComment`, `addIssue` và `updateIssue`.

### Manual Verification
1. **Tạo Issue mới**: Bấm phím `c` hoặc nút **+ Create** trên Topbar, điền tiêu đề "Test New Task", chọn Assignee, bấm Create Issue -> Kiểm tra thẻ mới xuất hiện trên cột Backlog.
2. **Inline Edit Title & Description**: Nhấp vào thẻ `MJ-105`, drawer trượt ra từ bên phải. Nhấp vào tiêu đề để sửa, bấm Enter -> kiểm tra tiêu đề trên thẻ Kanban thay đổi ngay lập tức.
3. **Chuyển Status trên Drawer**: Thay đổi Status dropdown từ `In Progress` sang `Done` trong drawer -> kiểm tra thẻ tự di chuyển sang cột Done.
4. **Thêm Bình Luận (Comments)**: Gõ bình luận "Testing comment system", bấm Save -> kiểm tra comment mới xuất hiện kèm avatar và mốc thời gian "Just now".
5. **Xóa Issue con**: Bấm biểu tượng thùng rác trong drawer -> kiểm tra Modal 400px hỏi xác nhận xuất hiện -> Bấm Delete -> kiểm tra issue bị xóa khỏi bảng.
