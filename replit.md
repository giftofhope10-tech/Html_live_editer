# Html Live Editor — Native Android App

**Package Name:** `com.iftechstudio.html_live_editor`

A cross-device Progressive Web App (PWA) for editing and previewing HTML, CSS, and JavaScript code with live preview functionality. Fully ad-free.

## Overview

A fully-featured code editor designed for every screen size — phone, tablet, laptop, desktop PC, and TV. Works offline as a PWA and can be installed on Android devices.

## Features

- **Code Editor**: Full-featured editor with syntax highlighting for HTML, CSS, and JavaScript using CodeMirror 6
- **Live Preview**: Side-by-side live preview that updates as you type, plus a full-screen Preview mode
- **Device Preview Simulation**: Preview at Desktop, Tablet, and Mobile sizes directly in the live preview panel
- **Status Bar**: Shows real-time cursor line/column, total lines, active language, and current font size
- **Font Size Control**: Adjust editor font size (10–28px) via sidebar, quick actions, or Ctrl+=/- shortcuts. Saved per session.
- **Word Wrap Toggle**: Toggle line wrapping in Settings
- **Auto-Save**: Code is automatically saved to localStorage as you type
- **Offline Support**: Works offline as a Progressive Web App (PWA) with service worker caching
- **Dark/Light Mode**: Toggle between dark and light themes in Settings
- **Keyboard Shortcuts Panel**: All shortcuts listed in Settings
- **Multi-Project**: Create, rename, delete multiple projects
- **Tab-Based Navigation**: Switch between HTML, CSS, and JavaScript editors
- **File Upload/Download**: Upload and download individual files
- **Code Snippets**: Quick-insert toolbar for common symbols and patterns
- **Find/Replace**: Custom search bar (Ctrl+F) with next/previous navigation
- **Privacy Policy & Terms**: Legal pages (no AdMob, no advertising)
- **Ad-Free**: Completely ad-free experience

## Project Structure

```
/
├── index.html           # Main HTML entry point
├── package.json         # Node.js dependencies and scripts
├── vite.config.ts       # Vite build configuration with PWA plugin
├── tsconfig.json        # TypeScript configuration
├── src/
│   ├── main.ts          # Application entry point
│   ├── app.ts           # Main App class with editor logic
│   ├── storage.ts       # LocalStorage handling for code persistence
│   ├── settings.ts      # Settings management (dark mode, font size, word wrap)
│   ├── styles.css       # Complete styling with responsive breakpoints
│   └── vite-env.d.ts    # TypeScript declarations for Vite
├── public/
│   └── icons/           # PWA icons
└── android/             # Android WebView wrapper (optional)
```

## Technologies

- **Vite**: Fast build tool and dev server
- **TypeScript**: Type-safe JavaScript
- **CodeMirror 6**: Code editor with syntax highlighting and autocomplete
- **vite-plugin-pwa**: PWA support with service worker
- **LocalStorage**: For offline data persistence

## Running the App

```bash
npm run dev     # Start web dev server on port 5000
npm run build   # Build web PWA
```

### Android (Native) Build
The `android/` folder is a pure-native Jetpack Compose app. Build via Codemagic CI/CD (`codemagic.yaml`) or open in Android Studio:
```
cd android && ./gradlew assembleDebug
```

## Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save code
- **Ctrl/Cmd + Enter**: Open full preview
- **Ctrl/Cmd + F**: Find in editor
- **Ctrl/Cmd + =**: Increase font size
- **Ctrl/Cmd + -**: Decrease font size
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + /**: Toggle comment
- **Tab**: Indent

## Responsive Breakpoints

- **Mobile** (default): Quick actions toolbar, no sidebar, tab navigation
- **Tablet (768px+)**: Sidebar + live preview panel side by side, quick actions hidden
- **Laptop (1024px+)**: Wider sidebar, larger header, wider preview panel
- **Desktop (1280px+)**: Max-width content areas, 3-column shortcuts grid
- **Large/TV (1800px+)**: Larger fonts, bigger header/tabs, extra spacing

## Settings Stored

- Dark mode (default: on)
- Editor font size (default: 14px, range 10–28px)
- Word wrap (default: on)
- Project code (per project)
- Active project ID

## Recent Changes

- April 2026: **AdMob completely removed** - app is now 100% ad-free (no interstitial, no banner, no ad intervals)
- April 2026: **Multi-device responsive layout** - improved breakpoints for tablet (768px), laptop (1024px), desktop (1280px), large/TV (1800px+)
- April 2026: **Status bar** - real-time cursor position, line count, language, and font size display at bottom of editor
- April 2026: **Font size control** - adjustable editor font size (10–28px) via sidebar, quick actions bar, or keyboard shortcuts; persisted in settings
- April 2026: **Word wrap toggle** - toggle in Settings page; recreates editor with/without line wrapping
- April 2026: **Device preview buttons** - Desktop/Tablet/Mobile preview size simulation in both side panel and full-screen preview
- April 2026: **Keyboard shortcuts panel** - displayed in Settings page for easy reference
- April 2026: **More code snippets** - added [], =>, // to quick actions bar
- April 2026: **Privacy Policy & Terms updated** - removed all AdMob/advertising references
- April 2026: **Version bumped to 1.2.0**
- December 5, 2024: Custom compact inline search bar, styled modal dialogs, multiple project management
- December 4, 2024: Initial feature set, dark/light mode, PWA, Android WebView wrapper
