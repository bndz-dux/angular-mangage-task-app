# 📋 Implementation Plan — Feature Set 1: Navigation & Layout

Thiết lập nền tảng kiến trúc UI, CSS tokens, Layout App Shell hoàn chỉnh cho dự án **Mini-Jira** dựa trên Angular v22, bám sát tuyệt đối theo đặc tả thiết kế tại `design-system/MASTER.md` và `design-system/mockup.html`.

---

## 📐 Overview of Feature Set 1

Feature Set 1 xây dựng App Shell khung ứng dụng (Sticky Topbar + Collapsible Sidebar + Workspace with Dynamic Breadcrumbs) hoạt động mượt mà, chuẩn WCAG AA, hỗ trợ Dark/Light mode và Signals-based State Management.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Topbar (48px sticky): [☰] [SidebarToggle] [MJ Mini-Jira] [Search (/)] [+Create] [Theme] [GitHub] [UserAvatar ▾] │
├──────────────┬──────────────────────────────────────────────────────────────┤
│ Sidebar      │ Workspace:                                                   │
│ (240px ↔ 56px│ ┌──────────────────────────────────────────────────────────┐ │
│ transition)  │ │ Breadcrumb (40px): Projects / Mini-Jira / Kanban Board   │ │
│ - Project ID │ ├──────────────────────────────────────────────────────────┤ │
│ - Kanban     │ │ <router-outlet>                                          │ │
│ - Backlog    │ │  (Kanban Board / Backlog / List / Releases / Settings)   │ │
│ - List View  │ │                                                          │ │
│ - Releases   │ │                                                          │ │
│ - Settings   │ │                                                          │ │
│ - [Reset]    │ └──────────────────────────────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System & Style Guide Alignment (MASTER.md)

1. **Tokens & Theme**:
   - Khởi tạo đầy đủ bảng CSS Custom Properties cho Light mode và Dark mode (`data-theme="dark"` & `prefers-color-scheme`).
   - Font chữ: Google Font **Inter** (400, 500, 600, 700) + **JetBrains Mono** cho Issue keys.
   - Màu sắc theo Atlassian Palette: Primary `#2563EB`, Surface `#FFFFFF` / `#22272B`, Background `#F7F8FA` / `#1D2125`, Border `#DFE1E6` / `#38414A`.
   - Z-index scale cố định: `--z-sticky: 10`, `--z-dropdown: 20`, `--z-drawer: 30`, `--z-modal: 40`, `--z-toast: 50`.
2. **Density & Transitions**:
   - Density 8/10 (Dense Dashboard): Topbar 48px, Sidebar 240px (expanded) / 56px (collapsed) với animation `width 160ms ease-out`, Buttons 32px cao, Breadcrumbs 40px cao.
   - Focus outline chuẩn: `2px solid var(--focus-ring)` với `outline-offset: 2px`.

---

## 🧩 Architecture & Components Breakdown

### 1. Core State Services (Signals-based)
- **`ThemeService`**:
  - Quản lý theme `light` | `dark` | `system`.
  - Tự động áp dụng `data-theme` lên `<html>`, lưu vào `localStorage`.
- **`SidebarService`**:
  - Signal `isCollapsed` (true/false) cho desktop rail 56px.
  - Signal `isMobileOpen` (true/false) cho mobile slide-in drawer (< 900px).
- **`UserService`**:
  - Danh sách seed team members (Product Manager, Lead Developer, QA Engineer, UI Designer).
  - Signal `currentUser` + phương thức `switchUser(user)`.
- **`NavigationService` / `ProjectStore`**:
  - Thông tin dự án active (Key: `MJ`, Name: `Mini-Jira`).
  - Breadcrumb signal tính toán tự động dựa trên active router URL.

### 2. Layout Components
- **`TopbarComponent` (`src/app/core/layout/topbar/`)**:
  - Brand Logo + Mini-Jira text.
  - Sidebar toggle buttons (Desktop collapse + Mobile hamburger).
  - Search input (hỗ trợ phím tắt `/` để focus).
  - Quick "+ Create" primary button (hỗ trợ phím tắt `c`).
  - Theme toggle button (Sun/Moon icon).
  - GitHub link.
  - User Switcher dropdown menu (CDK Overlay hoặc custom accessible dropdown với checkmark).
- **`SidebarComponent` (`src/app/core/layout/sidebar/`)**:
  - Project header (Icon badge `MJ` + Name + Key).
  - Nav items:
    - `Kanban Board` (`/projects/MJ/board`)
    - `Backlog` (`/projects/MJ/backlog`)
    - `List View` (`/projects/MJ/list`)
    - `Releases` (`/projects/MJ/releases`)
    - `Project Settings` (`/projects/MJ/settings`)
  - Active indicator bar (left 3px primary bar).
  - Footer action: "Reset demo data" trigger link.
- **`BreadcrumbComponent` (`src/app/core/layout/breadcrumb/`)**:
  - Dynamic breadcrumbs with clickable links and current leaf title.
- **`AppLayoutComponent` (`src/app/core/layout/app-layout/`)**:
  - Root shell chứa Topbar, Sidebar, Breadcrumb và `<router-outlet>`.

### 3. Page Shells (Routed Components)
- `BoardPageComponent` (`/projects/:projectKey/board` & redirect từ `/`)
- `BacklogPageComponent` (`/projects/:projectKey/backlog`)
- `ListPageComponent` (`/projects/:projectKey/list`)
- `ReleasesPageComponent` (`/projects/:projectKey/releases`)
- `SettingsPageComponent` (`/projects/:projectKey/settings`)

---

## 📁 Proposed Changes

### Configuration & Styles
#### [MODIFY] [index.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/index.html)
- Tải Google Fonts: `Inter` và `JetBrains Mono`.
- Cập nhật title và meta tags.

#### [MODIFY] [styles.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/styles.scss)
- Khai báo tất cả Design Tokens (CSS Custom Properties) từ `MASTER.md` cho cả `:root` và `:root[data-theme="dark"]` / `prefers-color-scheme`.
- Cấu hình base styles, typography, reset, scrollbar, utilities, focus-visible.

---

### Core Layer (Models, State & Services)
#### [NEW] [user.model.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/models/user.model.ts)
- Interface `User` (id, name, email, avatarUrl, initials, color, role).
- Seed mock data (Lord Gaben, Baby Yoda, Walter White, Pickler Rick).

#### [NEW] [theme.service.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/services/theme.service.ts)
- Quản lý dark/light mode với Signal, tự động đồng bộ `localStorage` và `document.documentElement`.

#### [NEW] [sidebar.service.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/services/sidebar.service.ts)
- Quản lý trạng thái co giãn của sidebar (desktop collapsed & mobile open/close).

#### [NEW] [user.service.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/services/user.service.ts)
- Quản lý user đang đăng nhập (`activeUser`), danh sách user, switch user.

#### [NEW] [navigation.service.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/services/navigation.service.ts)
- Quản lý breadcrumbs động theo route.

---

### Layout Components
#### [NEW] [svg-icon.component.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/shared/components/svg-icon/svg-icon.ts)
- Component hiển thị các SVG icon chuẩn Lucide / Jira siêu nhẹ, sắc nét và linh hoạt (board, backlog, list, settings, search, moon, sun, chevron, check, etc.).

#### [NEW] [user-avatar.component.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/shared/components/user-avatar/user-avatar.ts)
- Component Avatar hiển thị hình ảnh hoặc chữ cái đầu (Initials) với nền màu hash từ user ID.

#### [NEW] [topbar.component.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/topbar/topbar.ts) & [topbar.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/topbar/topbar.html) & [topbar.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/topbar/topbar.scss)
- Topbar navigation bar, global search, shortcut listeners (`/`, `c`), user switcher popover menu, dark mode toggle.

#### [NEW] [sidebar.component.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/sidebar/sidebar.ts) & [sidebar.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/sidebar/sidebar.html) & [sidebar.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/sidebar/sidebar.scss)
- Collapsible sidebar 240px ↔ 56px với animation mượt, các navigation links với active indicator.

#### [NEW] [breadcrumb.component.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/breadcrumb/breadcrumb.ts) & [breadcrumb.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/breadcrumb/breadcrumb.html) & [breadcrumb.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/breadcrumb/breadcrumb.scss)
- Dynamic breadcrumb bar hiển thị đường dẫn hiện tại.

#### [NEW] [app-layout.component.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/app-layout/app-layout.ts) & [app-layout.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/app-layout/app-layout.html) & [app-layout.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/app-layout/app-layout.scss)
- Khung App shell kết nối Topbar, Sidebar, Breadcrumb và Router Outlet.

---

### Pages & Routing
#### [NEW] [board-page.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/board/board-page.ts)
- Trang Kanban Board (khung placeholder sẵn sàng cho Feature Set 2).

#### [NEW] [backlog-page.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/backlog/backlog-page.ts)
- Trang Backlog.

#### [NEW] [list-page.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/list/list-page.ts)
- Trang List View.

#### [NEW] [releases-page.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/releases/releases-page.ts)
- Trang Releases.

#### [NEW] [settings-page.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/settings/settings-page.ts)
- Trang Project Settings.

#### [MODIFY] [app.routes.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/app.routes.ts)
- Cấu hình Lazy-loaded routes bọc trong `AppLayoutComponent`.

#### [MODIFY] [app.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/app.ts) & [app.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/app.html)
- Clean up root component render `<router-outlet>`.

---

## 🧪 Verification Plan

### Automated Tests
1. Chạy `npm run build` trong `jira-app` để đảm bảo code TypeScript, SCSS và template biên dịch thành công 100%, không có lỗi type.
2. Kiểm tra test suite với `npm run test` (Vitest).

### Manual Verification
1. **Sidebar Collapse / Expand**: Nhấn nút toggle ở Topbar kiểm tra Sidebar thu nhỏ về 56px (chỉ hiện icon) và mở rộng ra 240px với transition `160ms ease-out`.
2. **Navigation & Active States**: Nhấp qua các link (Kanban Board, Backlog, List View, Releases, Settings) kiểm tra:
   - URL thay đổi đúng (`/projects/MJ/board`, `/projects/MJ/backlog`, ...)
   - Thanh active indicator màu xanh bên trái xuất hiện đúng link.
   - Breadcrumbs cập nhật tương ứng theo trang.
3. **User Switcher Dropdown**: Nhấp vào avatar góc phải trên Topbar, chọn user khác và kiểm tra avatar trên Topbar cập nhật tức thì.
4. **Theme Toggle**: Nhấp vào nút Theme để chuyển đổi giữa Dark Mode và Light Mode, kiểm tra màu nền, chữ, border thay đổi mượt mà theo đúng token của `MASTER.md` và lưu vào `localStorage`.
5. **Keyboard Shortcuts**:
   - Nhấn phím `/` kiểm tra ô Search được tự động focus.
6. **Responsive Check**: Thu nhỏ màn hình < 900px kiểm tra hamburger menu mở drawer sidebar mượt mà.
