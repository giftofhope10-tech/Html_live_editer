# HTML Live Editor

A mobile-friendly Progressive Web App (PWA) for editing and previewing HTML, CSS, and JavaScript code with live preview functionality.

## Overview

This is a fully-featured code editor designed for mobile and desktop use. It works offline as a PWA and can be installed on Android devices. The app is 100% Play Store compliant with SDK 35 targeting.

## Features

- **Code Editor**: Full-featured code editor with syntax highlighting for HTML, CSS, and JavaScript using CodeMirror 6
- **Live Preview**: Instantly preview your HTML/CSS/JS code with the Preview button in the top right corner
- **Auto-Save**: Code is automatically saved to localStorage as you type
- **Offline Support**: Works offline as a Progressive Web App (PWA) with service worker caching
- **Dark/Light Mode**: Toggle between dark and light themes in Settings
- **Mobile-First Design**: Responsive layout optimized for mobile devices
- **Tab-Based Navigation**: Switch between HTML, CSS, and JavaScript editors
- **Settings Page**: Access dark mode toggle, clear data, and legal pages
- **Privacy Policy & Terms**: Play Store compliant legal pages (December 4, 2024)
- **AdMob Integration**: Test banner placeholder for advertising

## Project Structure

```
/
├── index.html           # Main HTML entry point
├── package.json         # Node.js dependencies and scripts
├── vite.config.ts       # Vite build configuration with PWA plugin
├── tsconfig.json        # TypeScript configuration
├── PLAY_STORE_COMPLIANCE.md  # Play Store compliance checklist
├── src/
│   ├── main.ts          # Application entry point
│   ├── app.ts           # Main App class with editor logic
│   ├── storage.ts       # LocalStorage handling for code persistence
│   ├── settings.ts      # Settings management and UI
│   ├── styles.css       # Complete styling with dark/light themes
│   └── vite-env.d.ts    # TypeScript declarations for Vite
├── public/
│   └── icons/           # PWA icons (SVG format)
├── android/
│   ├── build.gradle     # Root Gradle configuration
│   ├── settings.gradle  # Gradle settings
│   ├── gradle.properties # SDK 35 compatible properties
│   └── app/
│       ├── build.gradle       # App-level build config (SDK 35)
│       ├── proguard-rules.pro # R8 ProGuard mapping rules
│       └── src/main/
│           ├── AndroidManifest.xml  # SDK 35 manifest
│           └── res/
│               ├── xml/       # Network security, backup rules
│               └── values/    # Strings resources
└── .gitignore           # Git ignore rules
```

## Technologies

- **Vite**: Fast build tool and dev server
- **TypeScript**: Type-safe JavaScript
- **CodeMirror 6**: Code editor with syntax highlighting
- **vite-plugin-pwa**: PWA support with service worker
- **LocalStorage**: For offline data persistence

## Running the App

```bash
npm run dev     # Start development server on port 5000
npm run build   # Build for production
npm run preview # Preview production build
```

## Android Build

```bash
cd android
./gradlew assembleDebug    # Debug build
./gradlew bundleRelease    # Release AAB for Play Store
```

## Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save code (also auto-saves after 1 second)
- **Ctrl/Cmd + Enter**: Run live preview

## Play Store Compliance

- **SDK Target**: 35 (Android 15)
- **Minimum SDK**: 24 (Android 7.0)
- **Privacy Policy**: December 4, 2024
- **Terms of Service**: December 4, 2024
- **ProGuard Mapping**: Configured in proguard-rules.pro
- **AdMob**: Compliant integration with proper disclosure

## User Preferences

- Dark mode is enabled by default
- All code and settings are stored locally

## Recent Changes

- December 4, 2024: Preview button moved to top right corner next to Settings
- December 4, 2024: Privacy Policy and Terms updated with latest date
- December 4, 2024: Android SDK 35 configuration added
- December 4, 2024: ProGuard/R8 mapping rules added
- December 4, 2024: Play Store compliance documentation created
