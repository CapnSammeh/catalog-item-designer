# Catalog Item Designer

A browser-based drag-and-drop designer for building [Servicely](https://servicely.ai) Service Catalog Items — no installation, no backend, runs entirely in the browser.

---

## What it does

The Catalog Item Designer lets Servicely administrators and solution architects visually compose catalog item forms before building them in the platform. Drag fields onto a canvas, organise them into sections, configure labels and options, annotate each field with implementation notes, then preview the result as an end user would see it.

---

## Features

| | |
|---|---|
| **Drag & drop** | Drag any field type from the palette onto the canvas. Drop it at a specific position between existing fields — a blue insertion line shows exactly where it will land. |
| **13 field types** | String, Text, Integer, Decimal, Money, Boolean, Date, Date and Time, Choice, Reference, Multiple Reference, HTML, Acknowledgement |
| **Sections** | Group fields under named section headers. Add, rename, reorder, and delete sections. |
| **Field config** | Per-field label, help text, required toggle, and type-specific options (choice options list, reference table name, HTML content, acknowledgement statement). |
| **Notes** | Annotate any field with implementation notes — logic, business rules, data sources. Toggle notes on/off globally. |
| **Preview mode** | Switch to a live, interactive preview that renders the form exactly as Servicely users would see it. |
| **Notes flyover** | In preview mode, a flyover sidebar lists every annotated field and its notes without affecting the form layout. |
| **Import / Export** | Download the full catalog item definition (layout, config, and notes) as a `.json` file. Upload it again on any device to continue editing. |

---

## Getting started

### Use it online

The app is hosted on GitHub Pages — no install needed:

```
https://<your-org>.github.io/catalog-item-designer/
```

### Run locally

Requires Node.js 18+.

```bash
git clone https://github.com/<your-org>/catalog-item-designer.git
cd catalog-item-designer
npm install
npm run dev
```

Open [http://localhost:5173/catalog-item-designer/](http://localhost:5173/catalog-item-designer/)

### Build for production

```bash
npm run build
# output in /dist
```

---

## How to use

### 1. Name your catalog item

Click the item name in the header and type a name. Add an optional description in the canvas area below it.

### 2. Add fields

- **Click** any field type in the left palette to append it to the bottom of the first section.
- **Drag** a field type from the palette onto the canvas. A blue insertion line shows where it will land — drop between existing fields to insert at that exact position.

### 3. Configure fields

Click any field card on the canvas to open the config panel on the right:

- **Config tab** — set the label, help text, required toggle, and type-specific options
- **Notes tab** — write free-form implementation notes for your team (logic, data sources, business rules)

### 4. Organise into sections

Click **+ Add Section** in the palette sidebar to add a new section. Drag the ⠿ handle to reorder sections. Click a section title to rename it inline.

### 5. Preview

Click **Preview** in the header to see the form as an end user would. All fields are interactive — you can fill them in to validate the flow. Click **Exit Preview** to return to the editor.

### 6. Notes overlay

Toggle **Notes on/off** (amber button in the header) at any time — in both editor and preview modes. In preview, a flyover panel slides in from the right listing every annotated field and its notes.

### 7. Export & Import

- **Export** — downloads the current design as `<item-name>.json`
- **Import** — opens a file picker to load a previously exported `.json` and restore the full design

---

## Field types

| Type | Description |
|---|---|
| String | Single-line text input |
| Text | Multi-line textarea |
| Integer | Whole number |
| Decimal | Floating-point number |
| Money | Currency amount |
| Boolean | True / False toggle |
| Date | Date picker |
| Date and Time | Date + time picker |
| Choice | Dropdown from a defined options list |
| Reference | Lookup to a single Servicely record (freeform table name) |
| Multiple Reference | Lookup to multiple Servicely records |
| HTML | Read-only rich display text |
| Acknowledgement | Checkbox statement the user must accept |

---

## Export format

The exported `.json` is a plain object you can inspect, version-control, or hand to a developer:

```json
{
  "id": "...",
  "name": "Upgrade Servicely Instance",
  "description": "Upgrades a Servicely Instance to a newer version",
  "category": "",
  "sections": [
    {
      "id": "...",
      "title": "Instance",
      "fields": [
        {
          "id": "...",
          "type": "choice",
          "label": "Which instance do you want to upgrade?",
          "helpText": "",
          "required": true,
          "typeConfig": {
            "options": ["prod-us-1", "prod-eu-1"]
          },
          "notes": "Populate from CMDB. Only show production instances."
        }
      ]
    }
  ]
}
```

---

## Tech stack

| | |
|---|---|
| Framework | React 19 + Vite |
| Drag & drop | [@dnd-kit/core](https://dndkit.com) + @dnd-kit/sortable |
| Styling | Tailwind CSS v4 |
| State | [Zustand](https://zustand-demo.pmnd.rs) |
| Hosting | GitHub Pages |

---

## Roadmap

- [ ] Conditional visibility rules (show/hide fields based on other field values)
- [ ] Export in Servicely import format
- [ ] Section-level notes
- [ ] URL-based sharing (design state encoded in the URL hash)
- [ ] LocalStorage autosave

---

## Contributing

Pull requests welcome. Open an issue first for anything beyond a small fix.

```bash
npm run dev      # development server with HMR
npm run build    # production build
npm run preview  # preview the production build locally
```
