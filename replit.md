# Html Live Editor

A mobile-friendly Progressive Web App (PWA) for editing and previewing HTML, CSS, and JavaScript code with live preview. Fully ad-free and works offline.

## Overview

A fully-featured code editor designed for every screen size — phone, tablet, laptop, and desktop. Works offline as a PWA and can be installed from the browser.

## Features

- **Code Editor**: Syntax highlighting for HTML, CSS, and JavaScript using CodeMirror 6
- **Live Preview**: Side-by-side live preview that updates as you type, plus full-screen Preview mode
- **Device Preview Simulation**: Preview at Desktop, Tablet, and Mobile sizes
- **Status Bar**: Real-time cursor line/column, total lines, active language, and font size
- **Font Size Control**: Adjust editor font size (10–28px) via sidebar, toolbar, or Ctrl+=/- shortcuts
- **Word Wrap Toggle**: Toggle line wrapping in Settings
- **Auto-Save**: Code automatically saved to localStorage as you type
- **Offline Support**: Works offline as a PWA with service worker caching
- **Dark/Light Mode**: Toggle between dark and light themes in Settings
- **Multi-Project**: Create, rename, and delete multiple projects
- **File Upload/Download**: Upload and download individual HTML/CSS/JS files
- **Code Snippets**: Quick-insert toolbar for common symbols and patterns
- **Find**: Custom search bar (Ctrl+F) with next/previous navigation

## Project Structure

```
/
├── index.html           # Main HTML entry point
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite build config with PWA plugin
├── tsconfig.json        # TypeScript config
├── src/
│   ├── main.ts          # App entry point + service worker
│   ├── app.ts           # Main App class with all editor logic
│   ├── storage.ts       # localStorage for code/project persistence
│   ├── settings.ts      # Settings (dark mode, font size, word wrap)
│   ├── styles.css       # Full responsive styling
│   └── vite-env.d.ts    # Vite TypeScript declarations
└── public/
    └── icons/           # PWA icons
```

## Tech Stack

- **Vite** — build tool and dev server
- **TypeScript** — type-safe JavaScript
- **CodeMirror 6** — editor with syntax highlighting and autocomplete
- **vite-plugin-pwa** — PWA/service worker support
- **localStorage** — offline data persistence (no backend)

## Running

```bash
npm run dev     # Dev server on port 5000
npm run build   # Production build
```

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| Ctrl/Cmd + S | Save |
| Ctrl/Cmd + Enter | Open full preview |
| Ctrl/Cmd + F | Find in editor |
| Ctrl/Cmd + = | Increase font size |
| Ctrl/Cmd + - | Decrease font size |
| Ctrl/Cmd + Z | Undo |
| Ctrl/Cmd + / | Toggle comment |
| Tab | Indent |

## Responsive Breakpoints

- **Mobile** (default): toolbar, tabs, no sidebar
- **Tablet (768px+)**: sidebar + live preview panel, toolbar hidden
- **Laptop (1024px+)**: wider sidebar and preview
- **Desktop (1280px+)**: max-width layout, 3-column shortcuts grid
- **Large/TV (1800px+)**: larger fonts and spacing

## User Preferences

- Keep the web-only stack (TypeScript + Vite + CodeMirror). No backend needed.
