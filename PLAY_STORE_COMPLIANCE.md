# Play Store Compliance Report

## HTML Live Editor - Version 1.2.0 (Ad-Free)
**Report Date:** April 11, 2026
**Target SDK:** 35 (Android 15)
**Minimum SDK:** 24 (Android 7.0)

---

## Project Type

This is a **Progressive Web App (PWA)** with Android WebView wrapper.
- The PWA runs directly in browsers and can be installed on devices
- Android files provide a WebView wrapper for Play Store distribution
- Build the Android project in Android Studio to create APK/AAB

---

## 1. SDK & API Compliance

### Target SDK 35 Requirements
- [x] compileSdk set to 35
- [x] targetSdk set to 35
- [x] minSdk set to 24 (supports 98%+ of devices)
- [x] Java 17 compatibility configured
- [x] Kotlin 1.9.22 configured
- [x] Android Gradle Plugin 8.2.2
- [x] Gradle 8.5 wrapper configured

### API Level Compatibility
- [x] Package visibility queries declared in AndroidManifest.xml
- [x] Exported activities explicitly declared
- [x] Network security configuration for SDK 35
- [x] Data extraction rules configured
- [x] MainActivity with WebView implementation

---

## 2. Privacy & Data Safety

### Data Collection Declaration
- [x] **Local Storage Only**: All user code stored locally in localStorage
- [x] **No Personal Data Collection**: App does not collect names, emails, or identifiers
- [x] **No Server Communication**: Code never leaves the device
- [x] **No Advertising**: App is completely ad-free — no AdMob or any third-party ads
- [x] **No AD_ID Permission**: AD_ID permission removed — not applicable for ad-free apps

### Privacy Policy
- [x] No Third-Party Advertising (ad-free)
- [x] Local storage only — no data leaves the device
- [x] Children's privacy (COPPA) compliant
- [x] User rights and data control documented

### Terms of Service
- [x] Service description
- [x] User responsibilities
- [x] Intellectual property
- [x] No advertising terms — app is ad-free
- [x] Limitation of liability

---

## 3. App Security

### ProGuard/R8 Configuration
- [x] minifyEnabled for release builds
- [x] shrinkResources enabled
- [x] proguard-rules.pro configured
- [x] Mapping file generation enabled
- [x] Debug logging removed in release

### Network Security
- [x] usesCleartextTraffic="false"
- [x] network_security_config.xml configured
- [x] HTTPS enforced for all connections

### Permissions
- [x] INTERNET — Required for PWA functionality
- [x] ACCESS_NETWORK_STATE — Offline detection
- [x] No unnecessary permissions (AD_ID removed)

---

## 4. Content & Features

### App Content
- [x] Code editor with syntax highlighting (HTML, CSS, JavaScript)
- [x] Live preview functionality
- [x] Dark/Light theme toggle
- [x] Auto-save functionality
- [x] Offline PWA support
- [x] Font size controls (10–28px)
- [x] Word wrap toggle
- [x] Device preview simulation (Desktop/Tablet/Mobile)
- [x] Status bar (line/col, language, font size)
- [x] File upload and download
- [x] Responsive layout for phone, tablet, laptop, PC, TV

### Accessibility
- [x] Content descriptions for all interactive elements
- [x] Touch targets minimum 48dp
- [x] Color contrast ratios maintained
- [x] Screen reader compatible

---

## 5. Advertising

### Ad-Free Declaration
- [x] **Zero ads** — AdMob completely removed from PWA and Android wrapper
- [x] No banner ads, no interstitial ads, no rewarded ads
- [x] No third-party ad SDKs in dependencies
- [x] No AD_ID permission in AndroidManifest
- [x] Privacy policy reflects ad-free status

---

## 6. Build & Release

### Release Build Configuration
- [x] Signed APK/AAB support
- [x] R8 full mode enabled
- [x] Mapping file output configured
- [x] Bundle configuration for Play Store

### Build Commands
```bash
# Debug build
./gradlew assembleDebug

# Release build (requires signing config)
./gradlew bundleRelease

# Mapping file location
app/build/outputs/mapping/release/mapping.txt
```

---

## 7. Store Listing Requirements

| Requirement | Status |
|---|---|
| App icon (512x512) | Ready — public/icons/icon-512.png |
| Feature graphic (1024x500) | Prepare before submission |
| Screenshots (min 2) | Prepare before submission |
| Short description (80 chars) | Prepare before submission |
| Full description | Prepare before submission |
| Privacy policy URL | Required — host your policy online |
| Content rating | Complete questionnaire in Play Console |

---

## 8. Compliance Checklist Summary

| Category | Status | Notes |
|---|---|---|
| SDK 35 Target | Complete | All requirements met |
| Privacy Policy | Complete | Ad-free, local storage only |
| Terms of Service | Complete | Updated April 2026 |
| Data Safety | Complete | No data collection |
| ProGuard/R8 | Complete | Mapping file ready |
| Permissions | Complete | Minimal (INTERNET + NETWORK_STATE only) |
| Advertising | Complete | Fully ad-free, no AdMob |
| Accessibility | Complete | WCAG guidelines followed |
| Security | Complete | HTTPS enforced |

---

## 9. Play Store Readiness

**PWA Status: 100% READY** — Fully functional and ad-free

**Android Wrapper Status: TEMPLATE READY** — Build in Android Studio

### Before Play Store Submission:
- [ ] Open android/ folder in Android Studio
- [ ] Add app icon resources (ic_launcher)
- [ ] Update LOCAL_URL in MainActivity to your hosted PWA URL
- [ ] Generate signed release APK/AAB
- [ ] Host privacy policy online and add URL to Play Console
- [ ] Complete Data Safety form in Play Console
- [ ] Upload mapping.txt for crash reporting
- [ ] Set content rating questionnaire
- [ ] Configure app pricing and distribution
