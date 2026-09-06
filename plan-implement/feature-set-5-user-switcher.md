# 📋 Implementation Plan — Feature Set 5: User Switcher & Demo Workspace

Xây dựng hệ thống chuyển đổi góc nhìn người dùng (**User Switcher**) và quản lý dữ liệu mẫu (**Demo Workspace Reset**) cùng **Hệ thống thông báo Toast Notifications** cho **Mini-Jira** dựa trên Angular v22, **Angular Signals**, bám sát 100% đặc tả thiết kế tại `design-system/MASTER.md` & `design-system/mockup.html`.

---

## 📐 Overview of Feature Set 5

Feature Set 5 hoàn thiện trải nghiệm mô phỏng quy trình làm việc nhóm thực tế và quản lý Workspace:
1. **Mock User Directory (5 Thành viên)**:
   - `user-1`: **Lord Gaben** (Product Manager)
   - `user-2`: **Baby Yoda** (Lead Developer)
   - `user-3`: **Walter White** (QA Specialist)
   - `user-4`: **Pickle Rick** (UI/UX Designer)
   - `user-5`: **SpongeBob SquarePants** (DevOps Engineer)
2. **Quick User Switcher & Toast Notifications**:
   - Chuyển đổi góc nhìn nhanh tại Topbar hoặc trang Settings.
   - Hiển thị Toast Notification thông báo trực quan khi chuyển đổi người dùng: *"Switched perspective to Baby Yoda (Lead Developer)"*.
3. **Demo Workspace Management & Reset**:
   - Đặt lại dữ liệu dự án về 12 Issue chuẩn ban đầu.
   - Trang **Project Settings** đầy đủ với cấu hình dự án (Project Name, Key, Lead), góc nhìn người dùng dạng Card, và nút bấm Đặt lại dữ liệu an toàn.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ PROJECT SETTINGS: Mini-Jira (MJ)                                                            │
│                                                                                             │
│ ┌─ ACTIVE USER PERSPECTIVE ───────────────────────────────────────────────────────────────┐ │
│ │ [LG Lord Gaben (PM)]  [BY Baby Yoda (Lead)]  [WW Walter White (QA)]  [PR Pickle Rick (UX)]│ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ ┌─ DEMO WORKSPACE MANAGEMENT ─────────────────────────────────────────────────────────────┐ │
│ │ Reset all issues and filters back to original seed data.                                │ │
│ │ [🔄 Reset to Demo Data]                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│                                                     ┌─ TOAST NOTIFICATION ────────────────┐ │
│                                                     │ ✓ Workspace reset to demo data (12) │ │
│                                                     └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System Alignment (MASTER.md & mockup.html)

1. **Toast Notifications (`.toasts`, `.toast`)**:
   - `position: fixed; right: 16px; bottom: 16px; z-index: var(--z-toast)`.
   - Border-left: `3px solid var(--success)` (xanh lá), `3px solid var(--danger)` (đỏ), `3px solid var(--primary)` (xanh dương).
   - Card nền `var(--surface)`, shadow `var(--shadow-overlay)`, bo góc `var(--radius-md)`.
   - Animation slide-in từ phải sang: `transform 160ms ease`. Auto-dismiss sau 3 giây.
2. **Settings Page Layout**:
   - Padding `20px 24px`, max-width `840px`.
   - Các phần phân chia bằng khung `.settings-card` bo góc `var(--radius-lg)` và viền `1px solid var(--border)`.

---

## 🧩 Architecture & Components Breakdown

### 1. Toast Notification Service & Component
- **`src/app/core/services/toast.service.ts`**:
  - Signals: `toasts = signal<Toast[]>([])`.
  - Methods: `showSuccess(message)`, `showError(message)`, `showInfo(message)`, `removeToast(id)`.
- **`src/app/shared/components/toast/`**:
  - `toast-container.ts`, `html`, `scss`.
  - Tự động hiển thị các thông báo popup ở góc dưới bên phải màn hình.

### 2. User Directory & Switcher Enhancements
- **`src/app/core/models/user.model.ts`**:
  - Bổ sung user thứ 5: SpongeBob SquarePants (DevOps Engineer).
- **`src/app/core/services/user.service.ts`**:
  - Đồng bộ `switchUser()` kích hoạt Toast thông báo.

### 3. Project Settings Page (`SettingsPageComponent`)
- **`src/app/features/settings/`**:
  - `settings-page.ts`, `html`, `scss`.
  - Form xem thông tin dự án, danh sách card thành viên để chọn nhanh góc nhìn active user, và khu vực Đặt lại dữ liệu mẫu với nút **Reset to Demo Data**.

---

## 📁 Proposed Changes

### Core Services & Models
#### [MODIFY] [user.model.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/models/user.model.ts)
- Bổ sung `user-5` SpongeBob SquarePants vào `SEED_USERS`.

#### [NEW] [toast.service.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/services/toast.service.ts)
- Service quản lý Toast notifications với Signals và tự động đóng sau 3 giây.

#### [MODIFY] [user.service.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/services/user.service.ts)
- Nhúng `ToastService` để gửi thông báo khi người dùng đổi góc nhìn identity.

---

### Shared & Settings Components
#### [NEW] [toast-container.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/shared/components/toast/toast-container.ts) & [toast-container.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/shared/components/toast/toast-container.html) & [toast-container.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/shared/components/toast/toast-container.scss)
- Component hiển thị Toast popup ở góc dưới phải mượt mà.

#### [MODIFY] [settings-page.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/settings/settings-page.ts) & [settings-page.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/settings/settings-page.html) & [settings-page.scss](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/features/settings/settings-page.scss)
- Thiết kế hoàn chỉnh giao diện Project Settings, chọn góc nhìn Active User và nút Reset Demo Workspace.

#### [MODIFY] [sidebar.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/sidebar/sidebar.ts)
- Tích hợp Toast notification khi bấm "Reset demo data" từ thanh Sidebar.

#### [MODIFY] [app-layout.html](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/app-layout/app-layout.html) & [app-layout.ts](file:///d:/LEARN%20BY%20MYSELF/Angular/jira-app/src/app/core/layout/app-layout/app-layout.ts)
- Nhúng `<app-toast-container />` vào App Shell.

---

## 🧪 Verification Plan

### Automated Tests
1. `npm run build`: Kiểm tra toàn bộ mã nguồn biên dịch thành công 100%.
2. `npm run test`: Bổ sung unit test cho `ToastService` và `UserService`.

### Manual Verification
1. **Quick User Switcher ở Topbar**: Nhấp vào User dropdown ở Topbar, chọn Baby Yoda -> Kiểm tra Toast thông báo hiển thị ở góc dưới màn hình. Kiểm tra nút "Only my issues" trên FilterBar đổi sang lọc việc của Baby Yoda.
2. **Project Settings Page**: Truy cập `/settings`, chuyển góc nhìn bằng các card người dùng, bấm nút **Reset to Demo Data** -> Kiểm tra Toast *"Workspace reset to demo data"* xuất hiện và toàn bộ issue được khôi phục về ban đầu.
3. **Reset từ Sidebar**: Bấm nút "Reset demo data" ở chân Sidebar -> Kiểm tra thông báo Toast xuất hiện và dữ liệu được làm mới.
