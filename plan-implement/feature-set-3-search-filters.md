# 📋 Implementation Plan — Feature Set 3: Search, Quick Filters & Sorting

Xây dựng hệ thống tìm kiếm thời gian thực (**Real-time Search**) và thanh lọc nâng cao (**Quick Filters & Sorting Bar**) cho **Mini-Jira** dựa trên Angular v22, **Angular Signals**, bám sát 100% đặc tả thiết kế tại `design-system/MASTER.md` và `design-system/mockup.html`.

---

## 📐 Overview of Feature Set 3

Feature Set 3 cung cấp cho người dùng khả năng tìm kiếm và lọc tức thì các issue trên toàn bộ bảng Kanban:
- **Avatar Stack**: Lọc theo một hoặc nhiều thành viên được phân công việc với hiệu ứng viền sáng nổi bật khi active.
- **Only My Issues**: Nhanh chóng chỉ xem những việc thuộc về người dùng đang đăng nhập (`activeUser`).
- **Recently Updated**: Lọc các issue vừa được cập nhật trong 48h qua kèm chỉ báo highlight trên thẻ.
- **Issue Type Dropdown Chip**: Lọc nhanh theo Story, Task, Bug, Epic.
- **Clear All Filters**: Nút xóa toàn bộ bộ lọc một chạm, đi kèm huy hiệu số lượng bộ lọc đang áp dụng (`filter-count`).
- **Zero Dead-Ends Empty State**: Khi không có kết quả phù hợp, hiển thị giao diện hướng dẫn và nút "Clear all filters" thay vì bảng trống.
- **Screen Reader Live Announcement**: Thông báo số lượng kết quả (`aria-live="polite"`: "Showing 8 of 12 issues").

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ WORKSPACE: Kanban Board                                                                                 │
│                                                                                                         │
│ ┌─ FILTER BAR ────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ [LG][BY][WW][PR]   [👤 Only my issues]   [🕒 Recently updated]   [🏷️ Type: All types ▾]  [Clear all (2)]│ │
│ └─────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                         │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                                     │
│ │ BACKLOG    2 │ │ IN PROGRESS 1│ │ IN REVIEW  1 │ │ DONE       2 │  (Filtered issues)               │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System Alignment (MASTER.md & mockup.html)

1. **Filter Bar**:
   - `height: auto`, `padding: 10px 16px`, `border-bottom: 1px solid var(--border)`, `background: var(--surface)`.
2. **Avatar Stack (`.avatar-stack`)**:
   - Các nút avatar tròn xếp chồng lấn nhẹ `margin-left: -6px`, viền `2px solid var(--surface)`.
   - Hover: `translateY(-2px)`, `z-index: 1`.
   - Trạng thái Active (`.on`): `box-shadow: 0 0 0 2px var(--primary)`, `z-index: 2`.
3. **Filter Chips (`.chip`)**:
   - Kích thước: `height: 28px`, `padding: 0 10px`, `border-radius: var(--radius-sm)`, `font-size: 12px / 500`.
   - Rest: `background: var(--surface-sunken)`, `color: var(--text-muted)`.
   - Hover: `background: var(--border)`, `color: var(--text)`.
   - Active (`.on`): `background: var(--primary-weak)`, `color: var(--primary)`, `border: 1px solid var(--primary)`.
4. **Clear All Button (`.clear`)**:
   - Nằm phía bên phải (`margin-left: auto`).
   - Huy hiệu `filter-count`: `min-width: 16px; height: 16px; background: var(--primary); color: var(--on-primary); border-radius: 8px; font-size: 10px; font-weight: 700;`.
5. **No Dead-End Empty State**:
   - Khi bộ lọc cho kết quả 0 thẻ: hiển thị banner thân thiện "No issues match your filters" kèm nút "Clear all filters".

---

## 🧩 Architecture & Components Breakdown

### 1. State Management Enhancements (`ProjectStore`)
- **`src/app/core/services/project-store.ts`**:
  - Signals: `searchTerm`, `assigneeFilter`, `typeFilter`, `onlyMineFilter`, `recentFilter`.
  - Computed: `totalIssuesCount`, `isFilterActive`, `activeFilterCount`, `filteredIssues`, `issuesByStatus`, `columnCounts`.
  - Methods:
    - `toggleAssigneeFilter(userId: string)`: Thêm/bớt user khỏi danh sách lọc đa chọn.
    - `toggleOnlyMine()`: Bật/tắt lọc issue của user hiện tại.
    - `toggleRecent()`: Bật/tắt lọc issue mới cập nhật.
    - `setTypeFilter(type: string)`: Đặt loại issue cần lọc.
    - `clearFilters()`: Đặt lại toàn bộ bộ lọc và từ khóa tìm kiếm về mặc định.

### 2. UI Components
- **`FilterBarComponent` (`src/app/features/board/components/filter-bar/`)**:
  - `filter-bar.ts`, `filter-bar.html`, `filter-bar.scss`.
  - Chứa Avatar stack tương tác, các chip lọc nhanh, dropdown chọn Type, và nút Clear All.
- **`BoardPageComponent` (`src/app/features/board/`)**:
  - Tích hợp `FilterBarComponent` lên trên khu vực bảng Kanban.
  - Thêm vùng thông báo `aria-live="polite"` thông báo số lượng thẻ đang hiển thị.
  - Hiển thị Empty State khi không có issue nào thỏa mãn bộ lọc.
- **`IssueCardComponent` (`src/app/features/board/components/issue-card/`)**:
  - Bổ sung hiệu ứng hiển thị chỉ báo thẻ được cập nhật gần đây khi kích hoạt lọc hoặc khi issue vừa được chỉnh sửa.

---

## 📁 Proposed Changes

### Core State
#### [MODIFY] [project-store.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/services/project-store.ts)
- Bổ sung các helper methods: `toggleAssigneeFilter`, `toggleOnlyMine`, `toggleRecent`, `setTypeFilter`, `totalIssuesCount`.

---

### Shared & Board Components
#### [NEW] [filter-bar.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/filter-bar/filter-bar.ts) & [filter-bar.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/filter-bar/filter-bar.html) & [filter-bar.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/components/filter-bar/filter-bar.scss)
- Component thanh lọc FilterBar với đầy đủ các bộ lọc và tương tác chuẩn mockup.

#### [MODIFY] [board-page.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/board-page.html) & [board-page.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/board-page.scss) & [board-page.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/board-page.ts)
- Nhúng `FilterBarComponent`, thêm Empty State khi 0 kết quả và vùng `aria-live="polite"`.

---

## 🧪 Verification Plan

### Automated Tests
1. `npm run build`: Đảm bảo toàn bộ dự án biên dịch 100% không lỗi.
2. `npm run test`: Bổ sung và chạy unit tests cho các tính năng lọc trong `ProjectStore` (lọc theo assignee đa chọn, onlyMine, type, search keyword).

### Manual Verification
1. **Real-time Search**: Nhập từ khóa (ví dụ "auth", "dark", "MJ-105") vào ô tìm kiếm trên Topbar, kiểm tra các cột lọc đúng các thẻ tương ứng.
2. **Assignee Multi-select**: Nhấp vào avatar của Lord Gaben và Baby Yoda trên thanh Filter bar, kiểm tra chỉ những issue được phân công cho 2 người này xuất hiện.
3. **Only My Issues**: Nhấp nút "Only my issues", kiểm tra bảng chỉ hiển thị công việc của user đang active trên Topbar (thử đổi user ở Topbar và thấy bảng lọc theo user mới ngay).
4. **Issue Type Filter**: Chọn "Bug" trong dropdown, kiểm tra bảng chỉ hiển thị các issue loại Bug màu đỏ.
5. **Clear All**: Kiểm tra huy hiệu số lượng bộ lọc (ví dụ: `Clear all 2`), bấm nút và kiểm tra tất cả các bộ lọc được reset về ban đầu.
6. **Zero Result State**: Nhập từ khóa không tồn tại (ví dụ: "xyz123"), kiểm tra giao diện hiển thị Empty State kèm nút xóa bộ lọc.
