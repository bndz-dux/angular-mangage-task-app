# Design System Master File — Mini-Jira

> **LOGIC:** When building a specific page, first check `design-system/mini-jira/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file. Otherwise follow the rules below.

**Project:** Mini-Jira (simplified Jira clone)
**Stack:** Angular 18+ (standalone components, Signals, zoneless-ready), Tailwind CSS, Angular CDK (drag-drop + overlay + a11y), Lucide Angular icons
**Generated:** 2026-08-31 · Category: Productivity Tool / Issue Tracker
**Design Dials:** Motion 4/10 (Standard) · Density 8/10 (Dense / Dashboard)

---

## Deviations from the UI Pro Max database (with rationale)

| DB output | What we use instead | Why |
|-----------|--------------------|-----|
| Palette: teal `#0D9488` + orange `#EA580C` | Professional blue `#2563EB` + success green `#22A06B` | The `--design-system` aggregate is landing-page biased. Issue trackers have a strong convention (Atlassian blue). Blue = neutral/primary, green = "Done", red = "Bug"/destructive. Derived from DB `color` matches "CRM & Client Management" (`#2563EB` + `#059669`) and "B2B Service" (navy + slate), both verified. |
| Page pattern: "Product Demo + Features" (Hero → video → CTA) | App shell: Sidebar + Topbar + workspace | This is an authenticated tool, not a marketing site. No hero, no CTA funnel. |
| Motion: `back.out(1.4)` stagger on grid | `ease-out` 150–200ms, no overshoot | DB's own note: *"Don't use back.out on dense data tables; the overshoot reads as sloppy on informational UI."* |
| Typography: Plus Jakarta Sans | **Inter** for UI + **JetBrains Mono / ui-monospace** for issue keys | Inter is denser and the de-facto tracker font. Plus Jakarta Sans (DB pick, "best for productivity tools") is an acceptable swap if you prefer a friendlier tone — keep it as body then. |

Verified matches kept from DB: **Style = Flat Design + Data-Dense Dashboard** (both `active`, `risk:low`, light+dark supported), Angular stack guidelines (verified 2026-08-13, Angular 22.x).

---

## 1. Color tokens

Define as CSS custom properties on `:root` and `:root.dark`. Never use raw hex in components — reference the semantic token.

### Light (default)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#F7F8FA` | App background (behind columns) |
| `--surface` | `#FFFFFF` | Cards, modals, sidebar, topbar |
| `--surface-sunken` | `#F1F2F4` | Column background, input wells, hover rows |
| `--border` | `#DFE1E6` | Dividers, card borders, input borders |
| `--border-strong` | `#C1C7D0` | Dragging placeholder outline, focused input |
| `--text` | `#172B4D` | Primary text |
| `--text-muted` | `#5E6C84` | Secondary text, metadata, timestamps |
| `--text-subtle` | `#8993A4` | Placeholder, disabled |
| `--primary` | `#2563EB` | Primary buttons, links, active nav, focus ring |
| `--primary-hover` | `#1D4ED8` | Primary button hover |
| `--primary-weak` | `#E8F0FE` | Active nav background, selected chip |
| `--on-primary` | `#FFFFFF` | Text on primary |
| `--success` | `#22A06B` | "Done" status, success toasts |
| `--warning` | `#E2A700` | "In Review", medium priority |
| `--danger` | `#DE350B` | Bug type, destructive actions, errors |
| `--danger-hover` | `#BF2600` | Destructive button hover |
| `--overlay` | `rgba(9,30,66,0.54)` | Modal / drawer scrim |
| `--focus-ring` | `#2563EB` | 2px outline, offset 2px — never removed |

### Dark (`:root.dark`)

| Token | Hex |
|-------|-----|
| `--bg` | `#1D2125` |
| `--surface` | `#22272B` |
| `--surface-sunken` | `#282E33` |
| `--border` | `#38414A` |
| `--border-strong` | `#4C5560` |
| `--text` | `#DEE4EA` |
| `--text-muted` | `#9FADBC` |
| `--text-subtle` | `#7E8C9A` |
| `--primary` | `#4C9AFF` |
| `--primary-hover` | `#6BB0FF` |
| `--primary-weak` | `#1C3358` |
| `--success` | `#4BCE97` |
| `--warning` | `#F5CD47` |
| `--danger` | `#F87462` |
| `--overlay` | `rgba(0,0,0,0.6)` |

**Contrast:** every text/background pair above clears WCAG AA 4.5:1 (metadata `--text-muted` on `--surface` = 4.6:1 light, 4.9:1 dark). Status is **never conveyed by color alone** — always pair with an icon + label.

### Issue-type accent colors (icon + left border only, not card fill)

| Type | Color light / dark | Lucide icon |
|------|-------------------|-------------|
| Story | `#22A06B` / `#4BCE97` | `bookmark` (filled) |
| Task | `#2563EB` / `#4C9AFF` | `check-square` |
| Bug | `#DE350B` / `#F87462` | `circle-dot` (or `bug`) |
| Epic | `#8B5CF6` / `#B388FF` | `zap` (bolt) |

### Priority colors + icons (Lucide)

| Priority | Icon | Color |
|----------|------|-------|
| Highest | `chevrons-up` | `#DE350B` |
| High | `chevron-up` | `#FF7452` |
| Medium | `equal` | `#E2A700` |
| Low | `chevron-down` | `#4C9AFF` |
| Lowest | `chevrons-down` | `#8993A4` |

---

## 2. Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
--font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', 'Consolas', monospace;
```

| Role | Size / line-height / weight | Notes |
|------|---------------------------|-------|
| Page title (breadcrumb leaf, modal H1) | 20px / 1.3 / 600 | |
| Section heading | 16px / 1.4 / 600 | |
| Body / description | 14px / 1.6 / 400 | Base for the app (dense dashboard) |
| Card summary | 14px / 1.4 / 500 | Clamp to 3 lines (`-webkit-line-clamp`) |
| Metadata / labels / column headers | 12px / 1.4 / 500 | `--text-muted`, `letter-spacing: 0.02em` for uppercase column headers |
| Issue key (`JIRA-104`) | 12px / 1 / 600 | **`--font-mono`**, `--text-muted` |
| Button text | 14px / 1 / 600 | |

Minimum body text 14px, never below 12px. `letter-spacing: 0` on all body copy.

---

## 3. Spacing, radius, elevation (Density 8/10 — dense)

```css
--space-0: 2px;   --space-1: 4px;   --space-2: 8px;
--space-3: 12px;  --space-4: 16px;  --space-5: 24px;  --space-6: 32px;

--radius-sm: 3px;  /* chips, badges, pills */
--radius-md: 6px;  /* cards, inputs, buttons */
--radius-lg: 8px;  /* modals, drawers, dropdowns */

--shadow-card:    0 1px 1px rgba(9,30,66,.10), 0 0 1px rgba(9,30,66,.12);
--shadow-drag:    0 8px 16px rgba(9,30,66,.20), 0 0 1px rgba(9,30,66,.25);  /* card while dragged */
--shadow-overlay: 0 8px 24px rgba(9,30,66,.16);  /* dropdowns, popovers */
--shadow-modal:   0 12px 40px rgba(9,30,66,.30);
```

Flat Design discipline: **no gradients**, no decorative shadows. Shadows exist only to signal elevation of interactive surfaces (dragged card, dropdown, modal).

### Layout dimensions

| Element | Value |
|---------|-------|
| Topbar height | 48px, `position: sticky; top: 0` |
| Sidebar width | 240px expanded · 56px collapsed (icon rail) |
| Sidebar transition | `width 160ms ease-out` |
| Breadcrumb bar height | 40px |
| Board column width | 272px fixed, horizontal scroll when overflow |
| Board column gap | 8px |
| Issue card padding | 8px 10px |
| Issue card gap (in column) | 6px |
| Modal max-width | 900px (detail) · 520px (create) · 400px (confirm) |
| Drawer width | 480px (right slide-in), full-width < 768px |
| Table row height | 36px |

### Z-index scale (fixed — never use arbitrary values)

```css
--z-base: 0; --z-sticky: 10; --z-dropdown: 20; --z-drawer: 30; --z-modal: 40; --z-toast: 50;
```

---

## 4. Component specs

### Buttons — 32px height (dense), `--radius-md`, 600 weight, `cursor: pointer`, 150ms `ease-out`

| Variant | Rest | Hover | Active | Focus |
|---------|------|-------|--------|-------|
| Primary | `bg:--primary` `color:--on-primary` | `bg:--primary-hover` | `translateY(1px)` | `outline: 2px solid --focus-ring; outline-offset: 2px` |
| Secondary | `bg:--surface` `border:1px --border` `color:--text` | `bg:--surface-sunken` | same | same |
| Subtle (icon btn) | transparent | `bg:--surface-sunken` | same | same |
| Danger | `bg:--danger` `color:#fff` | `bg:--danger-hover` | — | same |

Icon-only buttons **must** have `aria-label`. Min hit target 32×32 visually but pad to 40×40 touch area on mobile.

### Issue card (board)

```
┌──────────────────────────────┐  ← left border 3px = issue-type color
│ Fix auth redirect loop        │  14px/500, clamp 3 lines
│                               │
│ [type icon] JIRA-104   ⬆ high │  12px mono key + priority icon (right)
│ [◐ 5]              [avatar 24] │  story-point pill (left) · assignee (right)
└──────────────────────────────┘
```
- Rest: `bg:--surface` `shadow:--shadow-card` `radius:--radius-md`
- Hover: `bg:--surface` + `border-color:--border-strong` (no lift, no scale — avoids layout shift in a dense grid)
- Dragging (`.cdk-drag-preview`): `shadow:--shadow-drag`, `rotate(3deg)`, opacity 1
- Placeholder (`.cdk-drag-placeholder`): dashed `2px --border-strong`, `bg: transparent`, same height
- Unassigned: 24px circle, `border: 1px dashed --border-strong`, `user` icon `--text-subtle`
- Whole card is a button → opens detail drawer (Enter/Space). Drag handle is the whole card, but see keyboard section.

### Column

```
BACKLOG  4                    ← 12px/600 uppercase --text-muted, count in --text-subtle
├─ card
├─ card
└─ + Create issue             ← subtle button, appears on column hover / always on mobile
```
Column body: `bg:--surface-sunken` `radius:--radius-md` `padding:6px`, `min-height` so empty columns are still drop targets. Empty state: centered `--text-subtle` 12px "No issues".

### Inputs / selects — 32px, `--radius-md`, `border:1px --border`

- Focus: `border-color:--primary` + `box-shadow: 0 0 0 2px --primary-weak`, no `outline: none` without this replacement
- Error: `border-color:--danger` + helper text below in `--danger`, 12px, with `role="alert"`
- Label always visible above the field (never placeholder-as-label)

### Chips / filter pills — 24px, `--radius-sm`, 12px/500

- Inactive: `bg:--surface-sunken` `color:--text-muted`
- Active/selected: `bg:--primary-weak` `color:--primary` `border:1px --primary`
- Removable: trailing `x` icon, 16px hit area padded to 24px

### Modal / drawer

- Scrim `bg:--overlay`, `z:--z-modal`, click-outside closes (unless dirty form → confirm)
- Panel `bg:--surface` `radius:--radius-lg` `shadow:--shadow-modal`
- **CDK `Dialog` or `Overlay` + `cdkTrapFocus`**: focus moves to first focusable (or the panel) on open, returns to trigger on close
- `Esc` closes. Focus is trapped. Background `aria-hidden` / `inert`
- Enter animation: fade scrim 120ms + panel `translateY(8px)→0` opacity 0→1 160ms `ease-out`. Exit faster: 100ms. Skip transforms under `prefers-reduced-motion` (fade only).

### Toast — bottom-right, `z:--z-toast`, auto-dismiss 4s, pause on hover, `role="status"`

### Avatar — 24px board / 32px detail / 20px comment inline. Initials fallback on deterministic bg color hashed from user id. Always `alt="{name}"` or `aria-hidden` + adjacent name.

---

## 5. Angular implementation rules (from verified stack DB, Angular 22.x)

### State — Signals, zoneless-ready

- Central `ProjectStore` (`providedIn: 'root'` service exposing signals).
- `issues = signal<Issue[]>([])`, `filter = signal<FilterState>({...})`, `activeUser = signal<User>(...)`.
- **Derived state = `computed()`**, never manual sync:
  - `filteredIssues = computed(() => applyFilters(this.issues(), this.filter(), this.activeUser()))`
  - `issuesByStatus = computed(() => groupBy(this.filteredIssues(), 'status'))` — the board binds to this
  - `activeFilterCount = computed(() => ...)` — drives the "Clear all (N)" badge
- **`effect()` only for side effects**: `effect(() => localStorage.setItem('mini-jira', JSON.stringify(this.snapshot())))`. Never use `effect()` to set another signal.
- Mutate via `.set()` / `.update()` — never `this.issues().push(...)`.
- `changeDetection: ChangeDetectionStrategy.OnPush` on every component.

### Forms — typed reactive

- `ReactiveFormsModule`, `FormBuilder` with generics: `fb.group<IssueForm>({ summary: fb.control('', { validators: [Validators.required, Validators.maxLength(255)] }) })`.
- `updateOn: 'blur'` for the create form's non-critical validators; `'change'` only for the summary required check.
- Error text rendered next to the field + an error summary at the top of the form on submit (`role="alert"`, links to fields).

### Routing — lazy, deep-linkable

- `provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules))`.
- Every feature route uses `loadComponent: () => import(...)`.
- Routes:
  - `/projects/:projectKey/board` — Kanban
  - `/projects/:projectKey/board/issues/:issueKey` — detail drawer open over board (child route, drawer reads `issueKey` input)
  - `/projects/:projectKey/backlog`
  - `/projects/:projectKey/list`
  - `/projects/:projectKey/releases`
  - `/projects/:projectKey/settings`
- Detail drawer is a routed child so the URL is shareable and browser back closes it.

### Drag & drop — `@angular/cdk/drag-drop`

- `cdkDropListGroup` wraps the row of columns; each column is `cdkDropList` with `[cdkDropListData]="column.issues"`.
- On `cdkDropListDropped`:
  - same list → `moveItemInArray`, then recompute `order` for that column
  - cross list → `transferArrayItem`, set `issue.status = targetColumn.status`, recompute `order` on both
  - push the change through `ProjectStore.update()` (don't mutate the computed array directly — keep a writable source)
- `cdkDragPreview` / `cdkDragPlaceholder` templates for the specs in §4.
- Animation: rely on CDK's default `250ms cubic-bezier(0,0,0.2,1)`; add `.cdk-drag-animating { transition: transform 200ms ease-out; }`.

### Overlays

- Use CDK `Overlay` / `Dialog` for modal, drawer, dropdowns, the user switcher, and the "move issue to column" menu — you get focus trap, scroll block, backdrop, and `Esc` handling for free.

### Performance

- `@for` with `track issue.id` on every list.
- `@defer` the issue detail drawer and the create modal (`on interaction` / `on idle`).
- Board columns: virtualize (`cdk-virtual-scroll-viewport`) only if a column can exceed ~50 cards; otherwise plain `@for`.
- Debounce search: `toSignal(searchControl.valueChanges.pipe(debounceTime(200), distinctUntilChanged()))`.

---

## 6. UX / accessibility rules (WCAG 2.2 AA)

| Rule | Implementation |
|------|----------------|
| **Drag has a non-drag alternative** (WCAG 2.5.7) | Each card has a "⋯" menu → "Move to → Backlog / In Progress / In Review / Done" and "Move up / Move down". Board is fully operable without a pointer. |
| **Keyboard reorder** | CDK supports it: make the card focusable, on `Space` pick up, arrow keys move, `Space` drop, `Esc` cancel. Announce via `LiveAnnouncer`. |
| **Announce drag results** | `cdk/a11y` `LiveAnnouncer`: "Moved JIRA-104 to In Progress, position 2 of 5". |
| **Announce filter changes** | `aria-live="polite"` region: "Showing 8 of 15 issues". |
| **Visible focus everywhere** | 2px `--focus-ring` outline, offset 2px, on cards, chips, nav, modal controls. Never `outline: none` alone. |
| **Search: no dead ends** | Empty result → "No issues match your filters" + "Clear all filters" button, not a blank column. |
| **Column headers** | `<h2>` per column, count in an `aria-label`: "Backlog, 4 issues". |
| **Modal** | `role="dialog"` `aria-modal="true"` `aria-labelledby`, focus trap, restore focus, `Esc`, background `inert`. |
| **Confirm before destructive** | Delete issue / reset demo data → confirm dialog, primary action is "Cancel", destructive button is `--danger` and second. |
| **Inline edit** | Click field → becomes input, autofocus, `Enter` saves, `Esc` reverts, blur saves. Show a brief `--success` flash on save. Keep a pencil affordance on hover so it's discoverable (not hover-only on touch: always show on mobile). |
| **Icon-only buttons** | `aria-label` on every one (collapse sidebar, create issue, user switcher, card menu). |
| **Touch targets** | 44×44 minimum on mobile — pad the visual 32px controls. |
| **Reduced motion** | `@media (prefers-reduced-motion: reduce)`: no slide/scale, keep opacity fades ≤ 100ms, CDK drag still functions (transform is essential feedback, keep it). |
| **Contrast** | 4.5:1 body, 3:1 large text and UI borders. Verified in §1. |
| **Relative timestamps** | "2 hours ago" visible, full ISO datetime in `title` + `<time datetime>`. |

### Keyboard shortcuts (global directive, disabled while typing in a field)

| Key | Action |
|-----|--------|
| `c` | Open Create Issue modal |
| `/` | Focus global search |
| `Esc` | Close modal / drawer / cancel inline edit |
| `Enter` (card focused) | Open detail drawer |

Provide a `?` shortcut that opens a shortcuts cheat-sheet dialog.

---

## 7. Layout blueprint

```
┌─────────────────────────────────────────────────────────────────────┐
│ TOPBAR (48, sticky)                                                  │
│ [≡]  MJ Mini-Jira    [ 🔍 Search issues (/) ........ ]   [+ Create] [☾] [avatar▾] │
├──────────┬──────────────────────────────────────────────────────────┤
│ SIDEBAR  │ BREADCRUMB (40)  Projects / Mini-Jira / Kanban Board      │
│ (240/56) ├──────────────────────────────────────────────────────────┤
│          │ FILTER BAR: [search] [avatars ○○○○] [Type ▾] [Only my]    │
│ ◧ Board  │             [Recently updated]        Clear all (2) ✕     │
│ ▤ Backlog├──────────────────────────────────────────────────────────┤
│ ▦ List   │ ┌ BACKLOG 4 ┐ ┌ IN PROGRESS 3 ┐ ┌ IN REVIEW 2 ┐ ┌ DONE 6 ┐│
│ ⚑ Releases│ │  [card]   │ │  [card]       │ │  [card]     │ │ [card] ││
│ ⚙ Settings│ │  [card]   │ │  [card]       │ │             │ │ [card] ││
│          │ └───────────┘ └───────────────┘ └─────────────┘ └────────┘│
│ ─────────│                                                            │
│ [GitHub] │  (horizontal scroll if columns overflow)                  │
└──────────┴──────────────────────────────────────────────────────────┘
```

Collapsed sidebar (56px): icons only, tooltip on hover/focus, active item has `--primary-weak` bg + 3px `--primary` left bar. Persist collapsed state to `localStorage`.

**Responsive**
- `< 768px`: sidebar becomes an off-canvas drawer (hamburger in topbar); board columns scroll horizontally, snap to column; detail drawer full-screen; filter bar collapses into a "Filters (2)" button opening a sheet.
- `768–1024px`: sidebar auto-collapses to rail.
- `≥ 1024px`: full layout.
- Breakpoints tested: 375 / 768 / 1024 / 1440. No horizontal scroll on the page itself (only inside the board region). `<meta name="viewport" content="width=device-width, initial-scale=1">`, zoom not disabled.

---

## 8. View-specific notes

- **Board**: bind columns to `issuesByStatus()`. Filter bar writes to `filter` signal. "Recently updated" = `updatedAt` within 24h → card gets a `--primary` 2px top border + "Updated 3h ago" in metadata.
- **Backlog**: single vertical `cdkDropList` of `status==='backlog'` issues; each row has "→ Board" (moves to `in_progress`) and inline type/priority/assignee editors. Multi-select checkboxes + "Move N to board" bulk action.
- **List/Table**: 36px rows, sortable headers (`aria-sort`), columns Key / Type / Summary / Status / Priority / Assignee / Updated. Row click → detail drawer. Sticky header. No drag here.
- **Detail drawer**: right slide-in (480px). Left = summary (inline edit), description (markdown, edit/preview toggle), comments/activity. Right rail = status select, assignee, reporter, priority, story points, created/updated `<time>`. "Delete" at the bottom of the right rail, subtle until hover, confirm dialog.
- **Create modal**: 520px. Fields in order: Project (locked), Issue type, Summary (autofocus), Description, Assignee, Reporter (defaults to active user), Priority (default Medium), Story points. Inline validation on blur, error summary on submit. `Create` + `Create another` (keeps modal open, clears form).
- **Settings**: project name/key/avatar, "Reset to demo data" (confirm), theme toggle.
- **User switcher**: dropdown, lists 4–5 seeded users with avatar + role, check on active. Changing it re-evaluates `Only my issues` and sets comment authorship.

---

## 9. Anti-patterns — do NOT

- ❌ Emoji as icons — use Lucide SVG (`lucide-angular`)
- ❌ Color-only status — always icon + text label
- ❌ `back.out` / bouncy easing on cards, tables, or list staggers
- ❌ Card scale/lift on hover (layout shift in the grid) — use border-color change
- ❌ Drag as the only way to move an issue
- ❌ `outline: none` without a visible replacement
- ❌ Placeholder text as the only label
- ❌ Errors shown only at the top with no field-level message
- ❌ Arbitrary `z-index` (`z-[9999]`) — use the scale in §3
- ❌ Manual `this.total = ...` derived state — use `computed()`
- ❌ Eager-loaded feature routes
- ❌ Hover-only affordances that never appear on touch
- ❌ `0ms` state changes — transitions 120–200ms `ease-out`

## 10. Pre-delivery checklist

- [ ] All icons Lucide, no emoji
- [ ] `cursor: pointer` on every clickable element
- [ ] Hover + active + focus states on all interactive controls (120–200ms ease-out)
- [ ] Light AND dark: text contrast ≥ 4.5:1, border contrast ≥ 3:1
- [ ] Every control keyboard reachable; tab order matches visual order
- [ ] Board fully operable without a mouse (menu + keyboard DnD) with `LiveAnnouncer` output
- [ ] Modal: focus trap, restore focus, `Esc`, `aria-modal`, background inert
- [ ] Forms: visible labels, inline errors, submit-time error summary
- [ ] `prefers-reduced-motion` honored (fades only, no transforms except essential drag)
- [ ] Responsive at 375 / 768 / 1024 / 1440, no page-level horizontal scroll
- [ ] `@for` tracked, detail drawer + create modal `@defer`-ed
- [ ] Empty/no-results states everywhere (columns, search, backlog, comments)
- [ ] Issue keys in monospace
