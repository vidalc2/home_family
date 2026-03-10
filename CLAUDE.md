# CLAUDE.md — Codebase Guide for AI Assistants

## Project Overview

This is a **family shopping list application** built for Costco Ancaster (Ontario, Canada). It is a lightweight, mobile-first, static web app built with pure HTML/CSS/JavaScript — no build tools, no backend, no external dependencies.

The app helps a family plan and execute Costco shopping trips with bilingual support (English/Portuguese), item quantity tracking, shareable links, and persistent shopping history.

---

## Architecture & File Structure

```
home_family/
├── index.html        # Main shopping list — item selection interface (563 lines)
├── list.html         # Shopping trip interface — active trip execution (445 lines)
├── history.html      # Shopping history viewer (101 lines)
├── family-logo.png   # Family logo displayed in all pages
├── .gitignore        # Excludes temp/build artifacts and personal test files
└── CLAUDE.md         # This file
```

There is **no build process**, **no npm/package.json**, and **no server-side code**. All three HTML files are self-contained: HTML structure, CSS styles, and JavaScript are all embedded inline.

---

## Page Descriptions

### `index.html` — Item Selection
- Entry point of the app
- Lists 19 shopping categories, each with pre-defined items
- Users select items via checkboxes and optionally set quantities (1–9)
- Supports "permanent items" (always-needed) that are pinned at the top
- Generates a shareable URL with base64-encoded query parameters for `list.html`
- Includes WhatsApp sharing for the generated URL

### `list.html` — Shopping Trip Execution
- Receives selected items via URL query parameters
- Displays items grouped with quantities and emoji icons
- Tracks which items were found/not found during the trip
- Allows adding custom one-time items during shopping
- Custom items can be approved to be added to the main list permanently
- On completion, logs the trip (items found/missing, total cost, date) to localStorage
- Supports clipboard copy and native share API for sharing the trip log

### `history.html` — Shopping History
- Reads and displays all saved shopping logs from localStorage
- Shows per-trip statistics: found/missing items, cost, date, custom items
- Ordered newest-first
- Supports clearing all history with a confirmation dialog

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (inline, within `<style>` tags) |
| Logic | Vanilla JavaScript (ES5-compatible) |
| Storage | Browser `localStorage` |
| Sharing | `navigator.clipboard`, `navigator.share`, WhatsApp URL scheme |
| No backend | All state is client-side only |

---

## Data Storage (localStorage)

Two localStorage keys are used:

| Key | Purpose |
|-----|---------|
| `costco_permanent_items` | Array of item keys that are always pre-selected |
| `costco_shopping_logs` | Array of completed trip log objects (JSON) |

Shopping logs contain: date, found items, missing items, custom items, and total cost.

---

## URL Parameter Encoding

`index.html` → `list.html` communication uses URL query parameters:
- Selected items and quantities are base64-encoded and appended to the `list.html` URL
- This allows the app to work as a shareable link sent via WhatsApp or messaging apps

---

## Internationalisation (i18n)

The app supports **English** and **Portuguese** with a toggle button.

Items and UI labels are stored in key-value maps:
- English: `'en-{categoryIndex}-{itemIndex}'`
- Portuguese: `'pt-{categoryIndex}-{itemIndex}'`

Emoji mappings use the same index pattern. Language preference is toggled in-page without reloading.

---

## Shopping Categories (19 total)

1. Snacks/Bars
2. Breads/Baked Goods
3. Meat/Protein
4. Fruits
5. Cheese
6. Vegetables
7. Dairy/Eggs
8. Cleaning Supplies
9. Chips/Crackers
10. Frozen Foods
11. Oils/Sauces
12. Canned Goods
13. Spices/Seasonings
14. Personal Care
15. Vitamins/Supplements
16. Kids Food
17. Grains/Dry Goods
18. Beverages
19. Desserts/Sweets

---

## Design Conventions

- **Mobile-first**: Max container width is 600px, optimized for phones
- **Self-contained HTML files**: No external CSS or JS imports; everything is inline
- **No frameworks**: Pure DOM manipulation with `document.getElementById`, `querySelectorAll`, etc.
- **Color palette**:
  - Primary: `#667eea` (purple-blue)
  - WhatsApp green: `#25D366`
  - Found items: green
  - Missing items: red/orange
- **User feedback**: Alert dialogs and inline messages (no toast libraries)
- **Destructive actions**: Always confirmed with `confirm()` dialogs before proceeding

---

## Development Workflow

Since there is no build system:

1. **Edit** any `.html` file directly
2. **Test** by opening the file in a browser (or a local HTTP server for share API testing)
3. **Commit** with a clear message describing the change
4. **Push** to the feature branch

No linting, no tests, no CI/CD pipeline exists. Manual browser testing is the only QA method.

### Local Testing Tips
- `file://` protocol works for most features
- `navigator.share` requires HTTPS or localhost; use a simple HTTP server (`python3 -m http.server`) for full testing
- localStorage persists across page reloads; clear it in DevTools if testing fresh state

---

## Git Conventions

- **Branch naming**: `claude/<description>-<id>` for AI-assisted branches
- **Commit messages**: Imperative, descriptive (e.g., "Add quantity selector to list items")
- **Ignored files** (from `.gitignore`): `*.pyc`, `__pycache__/`, `.DS_Store`, `*.swp`, `app.js`, `grocery_data.js`, `main_app.py`, `build_html.py`, `Costco_*.html`, `test_*.html`

---

## Key Conventions for AI Assistants

- **Do not introduce a build system** unless explicitly requested. The simplicity of a no-build setup is intentional.
- **Do not add external dependencies** (npm packages, CDN scripts). All code stays self-contained.
- **Maintain bilingual support**: Any new UI text must be added in both English and Portuguese using the existing i18n pattern.
- **Maintain emoji support**: New items should include an emoji in the existing emoji mapping object.
- **Preserve mobile-first layout**: Keep max-width constraints and touch-friendly tap targets.
- **Do not add a backend**: This app is intentionally client-only for privacy and simplicity.
- **localStorage schema**: Do not change the key names `costco_permanent_items` or `costco_shopping_logs` without migrating existing data — users will lose stored data.
- **Keep files self-contained**: CSS and JS stay inline within each HTML file. Do not split them into separate files unless asked.
- **No authentication**: This is a personal family app; no login system is needed or wanted.

---

## Commit History Summary

| Commit | Description |
|--------|-------------|
| `6e2cc02` | Initial commit — Costco Ancaster shopping list |
| `12874a7` | Add shareable link with WhatsApp sharing |
| `0ad8cdc` | Fix button functionality and popup blocker handling |
| `2e1608f` | Add language sync, custom items, shopping completion logging, history |
| `ff1c4a0` | Add family logo to all pages |
| `7ebf2b1` | Add quantities, emojis, and custom item approval system |
| `4425866` | Fix URL generation — remove duplicate index.html in path |
| `4d66007` | Add permanent items feature and new food items |
| `d1938d0` | Rename to Pre-selected List, add unpin buttons, numbering, improved PT translations |
| `a982af0` | Add shareable shopping logs via clipboard/WhatsApp |
| `abb6c81` | Remove personal names; use generic names (Work Bars, Kids Items, etc.) |
