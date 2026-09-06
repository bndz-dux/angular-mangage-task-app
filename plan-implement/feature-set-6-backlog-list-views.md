# 📋 Implementation Plan — Feature Set 6: Backlog & List Views (Alternative Views)

Xây dựng các góc nhìn quản lý thay thế (**Backlog Planning View**, **Tabular List View**, và **Releases Milestones View**) cho **Mini-Jira** dựa trên Angular v22, **Angular Signals**, bám sát 100% đặc tả thiết kế tại `design-system/MASTER.md` & `design-system/mockup.html`.

---

## 📐 Overview of Feature Set 6

Feature Set 6 mở rộng Mini-Jira với hai giao diện xem công việc chính cùng trang quản lý phiên bản phát hành:
1. **Backlog Planning View (`/backlog`)**:
   - Phân chia làm 2 khu vực danh sách: **Sprint 1 (Active Sprint)** và **Product Backlog (Uncommitted Items)**.
   - Thống kê tổng điểm ước lượng (**Total Story Points Sum**).
   - Nút hành động nhanh: Nút "Move to Sprint/In Progress" cho từng công việc, nút "+ Create issue".
   - Nhấp vào bất kỳ dòng công việc nào để mở Slide-in Drawer xem & chỉnh sửa chi tiết.
2. **Tabular List / Table View (`/list`)**:
   - Bảng danh sách công việc dạng dòng (Row-based compact table) tối ưu khả năng quan sát tổng thể.
   - Cột hiển thị: **Type**, **Key**, **Title**, **Status Badge**, **Priority**, **Assignee**, **Story Points**, **Last Updated**.
   - **Sắp xếp theo cột (Column Sorting)**: Nhấp vào tiêu đề cột (Key, Title, Status, Priority, Date) để sắp xếp tăng/giảm dần (`asc` / `desc`).
   - Tìm kiếm & lọc nhanh bằng FilterBar tích hợp.
3. **Releases Milestones View (`/releases`)**:
   - Trang quản lý các cột mốc phiên bản phần mềm (`v1.0.0`, `v1.1.0-beta`, `v2.0.0-planned`), thanh tiến độ hoàn thành (%) và trạng thái phát hành.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ WORKSPACE: List View                                                                        │
│                                                                                             │
│  Type │ Key ▴  │ Title                            │ Status      │ Priority │ Assignee  │Pts│
│ ──────┼────────┼──────────────────────────────────┼─────────────┼──────────┼───────────┼───│
│  🟢   │ MJ-101 │ Setup Angular 22 & Tailwind CSS  │ DONE        │ Medium   │ Lord G.   │ 3 │
│  🔴   │ MJ-102 │ Fix authentication redirect loop │ IN PROGRESS │ Highest  │ Baby Yoda │ 5 │
│  🔵   │ MJ-103 │ Implement Kanban drag-and-drop   │ IN REVIEW   │ High     │ Walter W. │ 8 │
│  🟣   │ MJ-104 │ Design dark theme tokens        │ BACKLOG     │ Low      │ Pickle R. │ 2 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System Alignment (MASTER.md & mockup.html)

1. **Backlog Planning View**:
   - Panel header dạng accordion bo góc `var(--radius-md)`, nền `var(--surface-sunken)`.
   - Danh sách công việc dạng thanh nằm ngang `height: 38px`, padding `6px 12px`, border-bottom `1px solid var(--border)`.
   - Hover dòng đổi nền nhẹ `var(--surface-sunken)`.
2. **List / Table View**:
   - Clean tabular HTML table `width: 100%`, `border-collapse: collapse`.
   - Header `<th>`: `font-size: 11px`, `text-transform: uppercase`, `color: var(--text-subtle)`, hover đổi icon mũi tên sắp xếp.
   - Status Badge: Bo góc pill `12px`, màu nền mềm tương ứng với Status (`--success`, `--primary`, `--warning`, `--surface-sunken`).

---

## 🧩 Architecture & Components Breakdown

### 1. Backlog Planning Page (`BacklogPageComponent`)
- **`src/app/features/backlog/`**:
  - `backlog-page.ts`, `backlog-page.html`, `backlog-page.scss`.
  - Phân nhóm Signal: `sprintIssues = computed(...)`, `backlogIssues = computed(...)`, `sprintPoints = computed(...)`, `backlogPoints = computed(...)`.
  - Nhúng `FilterBarComponent` để lọc danh sách.
  - Nhấp dòng công việc -> gọi `projectStore.selectIssueByKey(issue.key)`.

### 2. Tabular List Page (`ListPageComponent`)
- **`src/app/features/list/`**:
  - `list-page.ts`, `list-page.html`, `list-page.scss`.
  - Signal sắp xếp: `sortField = signal<string>('key')`, `sortDirection = signal<'asc' | 'desc'>('asc')`.
  - `sortedIssues = computed(...)`: Tự động sắp xếp lại danh sách khi người dùng nhấp tiêu đề cột.
  - Nhấp dòng -> gọi `projectStore.selectIssueByKey(issue.key)`.

### 3. Releases Milestones Page (`ReleasesPageComponent`)
- **`src/app/features/releases/`**:
  - `releases-page.ts`, `releases-page.html`, `releases-page.scss`.
  - Card mốc phiên bản với thanh Progress bar và thống kê issue completed.

---

## 📁 Proposed Changes

### Pages & Components
#### [MODIFY] [backlog-page.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/backlog/backlog-page.ts) & [NEW] [backlog-page.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/backlog/backlog-page.html) & [NEW] [backlog-page.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/backlog/backlog-page.scss)
- Xây dựng giao diện Backlog Planning đầy đủ với 2 danh sách Sprint 1 & Product Backlog, tổng điểm Story Points.

#### [MODIFY] [list-page.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/list/list-page.ts) & [NEW] [list-page.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/list/list-page.html) & [NEW] [list-page.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/list/list-page.scss)
- Xây dựng giao diện Tabular List View với bảng sắp xếp linh hoạt theo các cột.

#### [MODIFY] [releases-page.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/releases/releases-page.ts) & [NEW] [releases-page.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/releases/releases-page.html) & [NEW] [releases-page.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/releases/releases-page.scss)
- Xây dựng giao diện Releases Milestones chuyên nghiệp.

---

## 🧪 Verification Plan

### Automated Tests
1. `npm run build`: Đảm bảo toàn bộ dự án biên dịch thành công 100%.
2. `npm run test`: Thêm unit test cho logic sắp xếp cột trong `ListPageComponent` và gom nhóm Sprint trong `BacklogPageComponent`.

### Manual Verification
1. **Backlog Planning View**: Truy cập `/backlog`, kiểm tra 2 vùng Sprint 1 và Backlog, tổng điểm Story Points được tính chính xác. Nhấp nút "Move to In Progress" trên dòng -> Kiểm tra công việc chuyển sang Sprint 1.
2. **List / Table View**: Truy cập `/list`, nhấp vào tiêu đề cột "Priority" -> Kiểm tra danh sách tự động sắp xếp theo độ ưu tiên. Nhấp vào 1 dòng -> Kiểm tra Issue Detail Drawer trượt ra đúng thẻ tương ứng.
3. **Releases View**: Truy cập `/releases`, kiểm tra danh sách 3 phiên bản phát hành và thanh tiến độ hoàn thành.
