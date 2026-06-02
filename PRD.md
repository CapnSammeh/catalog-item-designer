# Service Catalog Item Designer — PRD
**GitHub Pages SPWA**

---

## 1. Overview

| | |
|---|---|
| **Product Name** | Catalog Item Designer |
| **Target Platform** | GitHub Pages (static hosting, no backend) |
| **Primary Users** | Servicely administrators and catalog designers |

**Problem Statement**

Designing Service Catalog Items in Servicely today requires knowledge of the platform's internal field types, layout conventions, and form schema. There is no visual, drag-and-drop tool that lets administrators prototype and export catalog item definitions without needing direct access to a live Servicely instance. This creates friction during onboarding, workshop design sessions, and cross-team collaboration.

**Solution**

A browser-based, zero-install Single Page Web Application (SPWA) hosted on GitHub Pages that allows users to visually design a Servicely Catalog Item form — dragging fields onto a canvas, configuring each field's type, label, and help text — and then export the resulting definition for import or reference in Servicely.

---

## 2. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Reduce time to design a catalog item | Prototype completed in < 15 minutes vs. hours in-platform |
| No installation required | 100% browser-based; zero server dependencies |
| Exportable output | JSON export matches Servicely import schema |
| Shareable designs | Design state persists in URL hash or downloadable file |

---

## 3. User Stories

**As a Servicely Admin, I want to:**
- Drag question/field types from a palette onto a canvas so I can visually compose a form
- Reorder fields on the canvas by dragging them up or down
- Set a label, help text, and required flag for each field
- Choose from all supported Servicely question types (dropdown, text, date, etc.)
- Preview what the form will look like to an end user
- Export the design as a JSON definition I can hand to a developer or import into Servicely
- Save my design to local storage or download it as a file
- Load a previously saved design to continue editing

**As a Workshop Facilitator, I want to:**
- Quickly mock up several catalog item variants during a design session
- Share a design via URL with stakeholders who don't have Servicely access
- Print or screenshot the canvas for documentation purposes

---

## 4. Scope

### 4.1 In Scope (v1)
- Field palette panel (left sidebar) with all supported Servicely question types
- Canvas panel (center) — linear, top-to-bottom ordered list of fields
- Drag-and-drop from palette → canvas to add fields
- Drag-and-drop reordering within the canvas
- Per-field configuration panel (right sidebar): label, help text, required toggle, type-specific options
- Field deletion
- Form-level metadata: Catalog Item name, description, category
- Named section headers to group fields, with drag-and-drop reordering of sections and fields within sections
- Live preview mode — read-only render of the form as a Servicely user would see it
- Responsive layout (desktop-first, tablet-friendly)
- Hosted on GitHub Pages with no backend

### 4.2 Out of Scope (v1) / v2 Backlog
- **Conditional visibility** — show/hide fields based on the value of another field
- Export / import of JSON definitions
- Direct Servicely API integration / one-click publish
- Multi-page / wizard-style catalog items
- User authentication or cloud save
- Collaborative real-time editing
- Branding / Servicely visual theming
- Instance chrome (header, sidebar, background)

---

## 5. Question / Field Types

| Type Key | Display Name | Notes |
|---|---|---|
| `money` | Money | Currency amount |
| `multi_reference` | Multiple Reference | Lookup to multiple Servicely records |
| `text` | Text | Multi-line free text |
| `string` | String | Single-line free text |
| `reference` | Reference | Lookup to a single Servicely record |
| `integer` | Integer | Whole number |
| `html` | HTML | Read-only rich text / display block |
| `decimal` | Decimal | Floating-point number |
| `datetime` | Date and Time | Date + time picker |
| `date` | Date | Date picker |
| `choice` | Choice | Select from a defined list of options |
| `boolean` | Boolean | True / False toggle |
| `acknowledgement` | Acknowledgement | Checkbox the user must tick to proceed |

---

## 6. UX / Interaction Design

### 6.1 Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  Header: App name  |  Item name (editable)  |  [Preview]             │
├──────────────┬──────────────────────────────┬───────────────────────┤
│              │                              │                        │
│   Field      │          Canvas              │   Field Config         │
│   Palette    │   (ordered field list)       │   Panel                │
│              │                              │   (on field select)    │
│  [ Text    ] │  ┌────────────────────────┐  │                        │
│  [ Choice  ] │  │ ▸ Section Title    🗑  │  │   Label: __________   │
│  [ Date    ] │  │ ⠿  [Type]  Label   🗑  │  │   Help:  __________   │
│  [ ...     ] │  │ ⠿  [Type]  Label   🗑  │  │   Required: [ ]       │
│              │  ├────────────────────────┤  │                        │
│  [+ Section] │  │ ▸ Section Title    🗑  │  │   [Type-specific opts] │
│              │  │ ⠿  [Type]  Label   🗑  │  │                        │
│              │  └────────────────────────┘  │                        │
└──────────────┴──────────────────────────────┴───────────────────────┘
```

### 6.2 Interactions

| Action | Behaviour |
|---|---|
| **Add field** | Drag from palette to canvas, OR click palette item to append at bottom |
| **Reorder** | Drag the ⠿ handle on any canvas field card |
| **Configure** | Click a canvas field card to open its config in the right panel |
| **Delete** | Trash icon (visible on hover); no confirmation required in v1 |
| **Preview** | Header toggle switches canvas to read-only rendered form view |

### 6.3 Canvas Field Card Anatomy

```
┌──────────────────────────────────────────────────────────┐
│  ⠿   [ Dropdown ▾ ]   Field Label here          🖊  🗑  │
│       Help text shown here in muted style               │
└──────────────────────────────────────────────────────────┘
```

---

## 7. Data Model

### 7.1 CatalogItem

```json
{
  "id": "uuid",
  "name": "Upgrade Servicely Instance",
  "description": "Upgrades a Servicely Instance to a newer version",
  "category": "Ops",
  "sections": []
}
```

### 7.2 Section

Fields are always owned by a section. A default unnamed section is created automatically so the canvas is never sectionless.

```json
{
  "id": "uuid",
  "title": "Instance",
  "order": 0,
  "fields": []
}
```

### 7.3 Field

```json
{
  "id": "uuid",
  "type": "choice",
  "label": "Which instance do you want to upgrade?",
  "helpText": "",
  "required": true,
  "order": 1,
  "typeConfig": {
    "options": ["prod-us-1", "prod-eu-1"]
  }
}
```

**Type-specific `typeConfig` shapes:**

| Type | typeConfig fields |
|---|---|
| `choice` | `options: string[]` |
| `reference` / `multi_reference` | `table: string` (freeform table name, user-entered) |
| `html` | `content: string` (static HTML) |
| `acknowledgement` | `statementText: string` |
| All others | *(empty — no extra config)* |

---

## 8. Technical Architecture

| Concern | Decision |
|---|---|
| Framework | React (Vite) — lightweight, no SSR needed |
| Drag & drop | `dnd-kit` — accessible, headless |
| Styling | Tailwind CSS |
| State management | Zustand — minimal boilerplate |
| Persistence | `localStorage` + JSON file download/upload |
| Hosting | GitHub Pages (via `gh-pages` branch or Actions) |
| Build output | `vite build` → `/dist` |
| Backend | None — fully client-side |

---

## 10. Open Questions

*All open questions resolved. See v2 backlog below.*

---

## 11. Milestones

| Milestone | Deliverable |
|---|---|
| **M0 — PRD Sign-off** | This document approved; open questions answered |
| **M1 — Scaffold** | Vite + React + Tailwind + dnd-kit boilerplate live on GitHub Pages |
| **M2 — Core Canvas** | Palette → drag → canvas → reorder working end-to-end |
| **M3 — Field Config** | Right panel config for all field types |
| **M4 — Preview Mode** | Read-only form render |
| **M5 — Polish & QA** | Responsive layout, accessibility, cross-browser testing |
| **M7 — Launch** | GitHub Pages URL shared with stakeholders |
