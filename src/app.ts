import { EditorView, basicSetup } from 'codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorState, Prec } from '@codemirror/state';
import { highlightSelectionMatches, SearchQuery, findNext, findPrevious, setSearchQuery, search } from '@codemirror/search';
import { keymap } from '@codemirror/view';
import { Storage } from './storage';
import { Settings } from './settings';

const AD_INTERVAL_MS = 2 * 60 * 60 * 1000;
const VIEW_AD_INTERVAL_MS = 3 * 60 * 60 * 1000;

export class App {
  private storage: Storage;
  private settings: Settings;
  private editors: Map<string, EditorView> = new Map();
  private activeTab: string = 'html';
  private autoSaveTimeout: number | null = null;
  private isOnline: boolean = navigator.onLine;
  private showingInterstitial: boolean = false;
  private modalMode: 'create' | 'rename' = 'create';
  private renameProjectId: string | null = null;
  private currentSearchQuery: string = '';

  constructor() {
    this.storage = new Storage();
    this.settings = new Settings();
  }

  init(): void {
    this.render();
    this.initEditors();
    this.bindEvents();
    this.updateOnlineStatus();
    this.applyTheme();
    this.checkAndShowAds();
    this.setupAdIntervals();
  }

  private renderProjectsList(): string {
    const projects = this.storage.getProjects();
    const activeId = this.storage.getActiveProjectId();
    
    return projects.map(p => `
      <div class="project-item ${p.id === activeId ? 'active' : ''}" data-project-id="${p.id}">
        <span class="project-name">${p.name}</span>
        <div class="project-actions">
          <button class="project-action-btn rename-project" data-project-id="${p.id}" title="Rename">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="project-action-btn delete-project" data-project-id="${p.id}" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  private render(): void {
    const app = document.getElementById('app');
    if (!app) return;

    const activeProject = this.storage.getActiveProject();
    const projectName = activeProject ? activeProject.name : 'Project 1';

    app.innerHTML = `
      <header class="header">
        <div class="header-left">
          <div class="logo">
            <img src="./icons/app-logo.png" alt="Html Live Editer" class="logo-image">
            <span class="logo-text">Html Live Editer</span>
          </div>
          <div class="project-selector" id="projectSelector">
            <button class="project-selector-btn" id="projectSelectorBtn">
              <span id="currentProjectName">${projectName}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div class="project-dropdown" id="projectDropdown">
              <div class="project-dropdown-header">
                <span>My Projects</span>
                <button class="new-project-btn" id="newProjectBtn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>New</span>
                </button>
              </div>
              <div class="project-list" id="projectList">
                ${this.renderProjectsList()}
              </div>
            </div>
          </div>
          <span class="save-indicator" id="saveIndicator">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            <span>Saved</span>
          </span>
        </div>
        <div class="header-right">
          <button class="header-preview-btn" id="runBtn" aria-label="Run Preview">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21"></polygon>
            </svg>
            <span>Preview</span>
          </button>
          <button class="icon-btn" id="settingsBtn" aria-label="Settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>
      </header>

      <div class="app-layout">
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-section">
            <div class="sidebar-title">Files</div>
            <div class="file-tree">
              <div class="file-item active" data-tab="html">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span>index.html</span>
              </div>
              <div class="file-item" data-tab="css">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span>style.css</span>
              </div>
              <div class="file-item" data-tab="js">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span>script.js</span>
              </div>
            </div>
          </div>
          <div class="sidebar-section">
            <div class="sidebar-title">Actions</div>
            <div class="sidebar-actions">
              <button class="sidebar-btn" id="sidebarUpload" title="Upload File">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span>Upload</span>
              </button>
              <button class="sidebar-btn" id="sidebarDownload" title="Download File">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Download</span>
              </button>
            </div>
          </div>
        </aside>

        <main class="main-content">
          <div class="tabs">
            <button class="tab active" data-tab="html">HTML</button>
            <button class="tab" data-tab="css">CSS</button>
            <button class="tab" data-tab="js">JavaScript</button>
          </div>

          <div class="quick-actions">
            <div class="action-group">
              <button class="action-btn" id="uploadBtn" title="Upload File">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </button>
              <button class="action-btn" id="downloadBtn" title="Download File">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
              <button class="action-btn" id="searchBtn" title="Search (Ctrl+F)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
            <div class="action-group">
              <button class="action-btn" id="copyBtn" title="Copy All">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              <button class="action-btn" id="pasteBtn" title="Paste">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
              </button>
              <button class="action-btn" id="selectAllBtn" title="Select All">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                  <path d="M9 12l2 2 4-4"></path>
                </svg>
              </button>
            </div>
            <div class="action-group code-snippets">
              <button class="snippet-btn" data-snippet="<>" title="Insert Tags">&lt;&gt;</button>
              <button class="snippet-btn" data-snippet="{}" title="Insert Braces">{}</button>
              <button class="snippet-btn" data-snippet="()" title="Insert Parentheses">()</button>
              <button class="snippet-btn" data-snippet='""' title="Insert Quotes">""</button>
              <button class="snippet-btn" data-snippet=";" title="Insert Semicolon">;</button>
              <button class="snippet-btn" data-snippet="=" title="Insert Equals">=</button>
            </div>
          </div>

          <div class="editor-container">
            <div class="editor-panel active" id="htmlEditor" data-lang="html"></div>
            <div class="editor-panel" id="cssEditor" data-lang="css"></div>
            <div class="editor-panel" id="jsEditor" data-lang="js"></div>
          </div>
        </main>

        <aside class="preview-panel" id="livePreviewPanel">
          <div class="preview-panel-header">
            <span>Live Preview</span>
            <button class="icon-btn" id="refreshPreview" title="Refresh Preview">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
            </button>
          </div>
          <iframe class="preview-panel-iframe" id="livePreviewFrame" sandbox="allow-scripts allow-same-origin"></iframe>
        </aside>
      </div>

      <input type="file" id="fileInput" accept=".html,.css,.js,.txt" style="display: none;">

      <div class="interstitial-ad" id="interstitialAd">
        <div class="interstitial-content">
          <div class="interstitial-header">
            <span>Advertisement</span>
            <button class="close-ad-btn" id="closeAdBtn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="interstitial-body">
            <p>AdMob Interstitial Test</p>
            <p class="ad-timer" id="adTimer">Close in 5s</p>
          </div>
        </div>
      </div>

      <div class="admob-banner" id="admobBanner">
        AdMob Test Banner
      </div>

      <div class="preview-container" id="previewContainer">
        <div class="preview-header">
          <h2>Live Preview</h2>
          <button class="icon-btn" id="closePreview" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <iframe class="preview-iframe" id="previewFrame" sandbox="allow-scripts allow-same-origin"></iframe>
      </div>

      ${this.settings.renderSettingsPage()}
      ${this.renderPrivacyPage()}
      ${this.renderTermsPage()}

      <div class="offline-indicator" id="offlineIndicator">
        You're offline - changes saved locally
      </div>

      <div class="custom-search-bar" id="customSearchBar">
        <div class="search-bar-content">
          <input type="text" id="searchInput" placeholder="Find..." autocomplete="off" />
          <div class="search-bar-actions">
            <button class="search-nav-btn" id="searchPrev" title="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </button>
            <button class="search-nav-btn" id="searchNext" title="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,6 15,12 9,18"></polyline>
              </svg>
            </button>
            <button class="search-close-btn" id="searchClose" title="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="custom-modal-overlay" id="projectModal">
        <div class="custom-modal">
          <div class="custom-modal-header">
            <h3 id="modalTitle">New Project</h3>
            <button class="modal-close-btn" id="modalClose">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="custom-modal-body">
            <label for="projectNameInput">Project name</label>
            <input type="text" id="projectNameInput" placeholder="Enter project name" autocomplete="off" />
            <span class="modal-hint">You can use extensions like .html, .css, .js, .ts</span>
          </div>
          <div class="custom-modal-footer">
            <button class="modal-btn modal-btn-cancel" id="modalCancel">Cancel</button>
            <button class="modal-btn modal-btn-confirm" id="modalConfirm">Create</button>
          </div>
        </div>
      </div>
    `;
  }

  private renderPrivacyPage(): string {
    return `
      <div class="page-container" id="privacyPage">
        <div class="page-header">
          <button class="icon-btn" id="closePrivacy" aria-label="Back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <h2>Privacy Policy</h2>
        </div>
        <div class="page-content">
          <p><strong>Effective Date:</strong> December 4, 2024</p>
          <p><strong>Last Updated:</strong> December 4, 2024</p>
          
          <h3>1. Information We Collect</h3>
          <p>HTML Live Editor is designed with your privacy in mind. We collect minimal information necessary to provide our services:</p>
          <ul>
            <li><strong>Local Storage Data:</strong> Your code (HTML, CSS, JavaScript) is stored locally on your device using browser localStorage. This data never leaves your device.</li>
            <li><strong>App Settings:</strong> Your preferences like dark mode settings are stored locally on your device.</li>
            <li><strong>Advertising Data:</strong> We use Google AdMob for displaying advertisements. AdMob may collect device identifiers and usage data according to Google's privacy policy.</li>
          </ul>

          <h3>2. How We Use Information</h3>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide and maintain the HTML Live Editor functionality</li>
            <li>Save your code and settings locally for your convenience</li>
            <li>Display relevant advertisements through AdMob</li>
            <li>Improve app performance and user experience</li>
          </ul>

          <h3>3. Data Storage and Security</h3>
          <p>All your code and settings are stored locally on your device. We do not have access to your code or personal data. We implement appropriate security measures to protect your local data.</p>

          <h3>4. Third-Party Services</h3>
          <p>Our app uses Google AdMob for advertising. Please review Google's Privacy Policy to understand how they collect and use data.</p>

          <h3>5. Children's Privacy</h3>
          <p>Our app is suitable for all ages. We do not knowingly collect personal information from children under 13. The app functions fully offline without requiring any personal data.</p>

          <h3>6. Your Rights</h3>
          <p>You have the right to:</p>
          <ul>
            <li>Clear your local data at any time through your browser settings</li>
            <li>Opt out of personalized advertising through your device settings</li>
            <li>Use the app without providing any personal information</li>
          </ul>

          <h3>7. Changes to This Policy</h3>
          <p>We may update this Privacy Policy periodically. We will notify you of any changes by updating the "Last Updated" date at the top of this policy.</p>

          <h3>8. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us through the app's support channels.</p>
        </div>
      </div>
    `;
  }

  private renderTermsPage(): string {
    return `
      <div class="page-container" id="termsPage">
        <div class="page-header">
          <button class="icon-btn" id="closeTerms" aria-label="Back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <h2>Terms of Service</h2>
        </div>
        <div class="page-content">
          <p><strong>Effective Date:</strong> December 4, 2024</p>
          <p><strong>Last Updated:</strong> December 4, 2024</p>

          <h3>1. Acceptance of Terms</h3>
          <p>By downloading, installing, or using HTML Live Editor, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.</p>

          <h3>2. Description of Service</h3>
          <p>HTML Live Editor is a mobile code editor that allows you to write and preview HTML, CSS, and JavaScript code. The app provides:</p>
          <ul>
            <li>Code editing with syntax highlighting</li>
            <li>Live preview functionality</li>
            <li>Offline capability</li>
            <li>Auto-save feature</li>
            <li>Dark and light theme options</li>
          </ul>

          <h3>3. User Responsibilities</h3>
          <p>You agree to:</p>
          <ul>
            <li>Use the app in accordance with all applicable laws and regulations</li>
            <li>Not use the app for any illegal or unauthorized purpose</li>
            <li>Not attempt to interfere with or disrupt the app's functionality</li>
            <li>Be responsible for any code you create using the app</li>
          </ul>

          <h3>4. Intellectual Property</h3>
          <p>The HTML Live Editor app, including its design, code, and features, is protected by intellectual property laws. You retain ownership of any code you create using the app.</p>

          <h3>5. Disclaimer of Warranties</h3>
          <p>The app is provided "as is" without warranties of any kind. We do not guarantee that the app will be error-free or uninterrupted. Use of the app is at your own risk.</p>

          <h3>6. Limitation of Liability</h3>
          <p>We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the app, including but not limited to loss of data or code.</p>

          <h3>7. Advertisements</h3>
          <p>The app displays advertisements through Google AdMob. By using the app, you agree to view advertisements as part of the service.</p>

          <h3>8. Updates and Changes</h3>
          <p>We may update the app and these terms periodically. Continued use of the app after changes constitutes acceptance of the new terms.</p>

          <h3>9. Termination</h3>
          <p>We reserve the right to terminate or suspend access to the app at any time, without notice, for conduct that we believe violates these terms.</p>

          <h3>10. Governing Law</h3>
          <p>These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.</p>

          <h3>11. Contact</h3>
          <p>For any questions regarding these Terms of Service, please contact us through the app's support channels.</p>
        </div>
      </div>
    `;
  }

  private initEditors(): void {
    const savedCode = this.storage.getCode();
    const isDark = this.settings.isDarkMode();

    const htmlPanel = document.getElementById('htmlEditor');
    const cssPanel = document.getElementById('cssEditor');
    const jsPanel = document.getElementById('jsEditor');

    if (htmlPanel) {
      const htmlEditor = this.createEditor(savedCode.html, 'html', isDark, htmlPanel);
      this.editors.set('html', htmlEditor);
    }

    if (cssPanel) {
      const cssEditor = this.createEditor(savedCode.css, 'css', isDark, cssPanel);
      this.editors.set('css', cssEditor);
    }

    if (jsPanel) {
      const jsEditor = this.createEditor(savedCode.js, 'js', isDark, jsPanel);
      this.editors.set('js', jsEditor);
    }
  }

  private createEditor(content: string, lang: string, isDark: boolean, parent: HTMLElement): EditorView {
    const customSearchKeymap = Prec.highest(keymap.of([
      {
        key: 'Mod-f',
        run: () => {
          this.openSearch();
          return true;
        },
        preventDefault: true
      },
      {
        key: 'Escape',
        run: () => {
          this.closeSearch();
          return false;
        }
      }
    ]));

    const extensions = [
      customSearchKeymap,
      basicSetup,
      EditorView.lineWrapping,
      highlightSelectionMatches(),
      search({ top: true }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          this.scheduleAutoSave();
        }
      })
    ];

    if (lang === 'html') {
      extensions.push(html());
    } else if (lang === 'css') {
      extensions.push(css());
    } else if (lang === 'js') {
      extensions.push(javascript());
    }

    if (isDark) {
      extensions.push(oneDark);
    }

    return new EditorView({
      parent,
      state: EditorState.create({
        doc: content,
        extensions
      })
    });
  }

  private bindEvents(): void {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const tabName = target.dataset.tab;
        if (tabName) this.switchTab(tabName);
      });
    });

    document.querySelectorAll('.file-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const tabName = target.dataset.tab;
        if (tabName) this.switchTab(tabName);
        document.querySelectorAll('.file-item').forEach(f => f.classList.remove('active'));
        target.classList.add('active');
      });
    });

    document.getElementById('projectSelectorBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('projectSelector')?.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      const selector = document.getElementById('projectSelector');
      if (selector && !selector.contains(e.target as Node)) {
        selector.classList.remove('open');
      }
    });

    document.getElementById('newProjectBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.createNewProject();
    });

    this.bindProjectListEvents();

    document.getElementById('runBtn')?.addEventListener('click', () => {
      this.showPreview();
      this.updateLivePreview();
    });

    document.getElementById('refreshPreview')?.addEventListener('click', () => {
      this.updateLivePreview();
    });

    document.getElementById('closePreview')?.addEventListener('click', () => {
      this.hidePreview();
    });

    document.getElementById('settingsBtn')?.addEventListener('click', () => {
      this.showSettings();
    });

    document.getElementById('closeSettings')?.addEventListener('click', () => {
      this.hideSettings();
    });

    document.getElementById('darkModeToggle')?.addEventListener('click', () => {
      this.toggleDarkMode();
    });

    document.getElementById('privacyLink')?.addEventListener('click', () => {
      this.showPrivacy();
    });

    document.getElementById('termsLink')?.addEventListener('click', () => {
      this.showTerms();
    });

    document.getElementById('closePrivacy')?.addEventListener('click', () => {
      this.hidePrivacy();
    });

    document.getElementById('closeTerms')?.addEventListener('click', () => {
      this.hideTerms();
    });

    document.getElementById('showDeleteListBtn')?.addEventListener('click', () => {
      this.toggleDeleteProjectList();
    });

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateOnlineStatus();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateOnlineStatus();
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.saveCode();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.showPreview();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        this.openSearch();
      }
    });

    document.getElementById('uploadBtn')?.addEventListener('click', () => {
      document.getElementById('fileInput')?.click();
    });

    document.getElementById('sidebarUpload')?.addEventListener('click', () => {
      document.getElementById('fileInput')?.click();
    });

    document.getElementById('fileInput')?.addEventListener('change', (e) => {
      this.handleFileUpload(e);
    });

    document.getElementById('downloadBtn')?.addEventListener('click', () => {
      this.downloadCurrentFile();
    });

    document.getElementById('sidebarDownload')?.addEventListener('click', () => {
      this.downloadCurrentFile();
    });

    document.getElementById('searchBtn')?.addEventListener('click', () => {
      this.openSearch();
    });

    document.getElementById('copyBtn')?.addEventListener('click', () => {
      this.copyCurrentCode();
    });

    document.getElementById('pasteBtn')?.addEventListener('click', () => {
      this.pasteToEditor();
    });

    document.getElementById('selectAllBtn')?.addEventListener('click', () => {
      this.selectAllCode();
    });

    document.querySelectorAll('.snippet-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const snippet = target.dataset.snippet;
        if (snippet) this.insertSnippet(snippet);
      });
    });

    document.getElementById('closeAdBtn')?.addEventListener('click', () => {
      this.hideInterstitialAd();
    });

    document.getElementById('searchInput')?.addEventListener('input', (e) => {
      this.handleSearchInput((e.target as HTMLInputElement).value);
    });

    document.getElementById('searchInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          this.searchPrevious();
        } else {
          this.searchNext();
        }
      } else if (e.key === 'Escape') {
        this.closeSearch();
      }
    });

    document.getElementById('searchNext')?.addEventListener('click', () => {
      this.searchNext();
    });

    document.getElementById('searchPrev')?.addEventListener('click', () => {
      this.searchPrevious();
    });

    document.getElementById('searchClose')?.addEventListener('click', () => {
      this.closeSearch();
    });

    document.getElementById('modalClose')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('modalCancel')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('modalConfirm')?.addEventListener('click', () => {
      this.confirmModal();
    });

    document.getElementById('projectNameInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.confirmModal();
      } else if (e.key === 'Escape') {
        this.closeModal();
      }
    });

    this.updateLivePreview();
  }

  private bindProjectListEvents(): void {
    document.querySelectorAll('.project-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const projectId = target.dataset.projectId;
        if (projectId && !(e.target as HTMLElement).closest('.project-action-btn')) {
          this.switchProject(projectId);
        }
      });
    });

    document.querySelectorAll('.rename-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = e.currentTarget as HTMLElement;
        const projectId = target.dataset.projectId;
        if (projectId) this.renameProject(projectId);
      });
    });

    document.querySelectorAll('.delete-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = e.currentTarget as HTMLElement;
        const projectId = target.dataset.projectId;
        if (projectId) this.deleteProject(projectId);
      });
    });
  }

  private createNewProject(): void {
    this.modalMode = 'create';
    this.renameProjectId = null;
    this.showModal('New Project', `Project ${this.storage.getProjects().length + 1}`, 'Create');
  }

  private switchProject(projectId: string): void {
    this.saveCode();
    this.storage.setActiveProject(projectId);
    this.refreshProjectUI();
    this.loadProjectCode();
    document.getElementById('projectSelector')?.classList.remove('open');
  }

  private renameProject(projectId: string): void {
    const project = this.storage.getProjects().find(p => p.id === projectId);
    if (!project) return;

    this.modalMode = 'rename';
    this.renameProjectId = projectId;
    this.showModal('Rename Project', project.name, 'Rename');
  }

  private deleteProject(projectId: string): void {
    const projects = this.storage.getProjects();
    if (projects.length <= 1) {
      this.showToast('Cannot delete the only project');
      return;
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    if (confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      this.storage.deleteProject(projectId);
      this.refreshProjectUI();
      this.loadProjectCode();
      this.showToast(`Deleted "${project.name}"`);
    }
  }

  private toggleDeleteProjectList(): void {
    const deleteList = document.getElementById('deleteProjectList');
    if (!deleteList) return;

    const isVisible = deleteList.style.display !== 'none';
    
    if (isVisible) {
      deleteList.style.display = 'none';
    } else {
      this.renderDeleteProjectList();
      deleteList.style.display = 'block';
    }
  }

  private renderDeleteProjectList(): void {
    const deleteList = document.getElementById('deleteProjectList');
    if (!deleteList) return;

    const projects = this.storage.getProjects();
    const activeId = this.storage.getActiveProjectId();

    if (projects.length <= 1) {
      deleteList.innerHTML = `
        <div class="delete-project-item">
          <div class="project-info">
            <span class="project-name">No projects to delete</span>
            <span class="project-status">Create more projects first</span>
          </div>
        </div>
      `;
      return;
    }

    deleteList.innerHTML = projects.map(p => `
      <div class="delete-project-item" data-project-id="${p.id}">
        <div class="project-info">
          <span class="project-name">${p.name}</span>
          <span class="project-status ${p.id === activeId ? 'active' : ''}">${p.id === activeId ? 'Active Project' : 'Tap to delete'}</span>
        </div>
        <button class="delete-btn delete-project-from-list" data-project-id="${p.id}" title="Delete ${p.name}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
          </svg>
        </button>
      </div>
    `).join('');

    this.bindDeleteListEvents();
  }

  private bindDeleteListEvents(): void {
    document.querySelectorAll('.delete-project-from-list').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = e.currentTarget as HTMLElement;
        const projectId = target.dataset.projectId;
        if (projectId) this.deleteProjectFromList(projectId);
      });
    });
  }

  private deleteProjectFromList(projectId: string): void {
    const projects = this.storage.getProjects();
    if (projects.length <= 1) {
      this.showToast('Cannot delete the only project');
      return;
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    if (confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      const wasActive = this.storage.getActiveProjectId() === projectId;
      this.storage.deleteProject(projectId);
      this.renderDeleteProjectList();
      this.refreshProjectUI();
      
      if (wasActive) {
        this.loadProjectCode();
        this.updateLivePreview();
      }
      
      this.showToast(`Deleted "${project.name}"`);
    }
  }

  private closeSearchPanel(): void {
    this.editors.forEach(editor => {
      const closeBtn = editor.dom.querySelector('.cm-panel button[name="close"]');
      if (closeBtn) {
        (closeBtn as HTMLElement).click();
      }
    });
  }

  private refreshProjectUI(): void {
    const projectList = document.getElementById('projectList');
    if (projectList) {
      projectList.innerHTML = this.renderProjectsList();
      this.bindProjectListEvents();
    }

    const activeProject = this.storage.getActiveProject();
    const nameEl = document.getElementById('currentProjectName');
    if (nameEl && activeProject) {
      nameEl.textContent = activeProject.name;
    }
  }

  private loadProjectCode(): void {
    const code = this.storage.getCode();
    
    this.editors.forEach(editor => editor.destroy());
    this.editors.clear();

    const isDark = this.settings.isDarkMode();

    const htmlPanel = document.getElementById('htmlEditor');
    const cssPanel = document.getElementById('cssEditor');
    const jsPanel = document.getElementById('jsEditor');

    if (htmlPanel) {
      htmlPanel.innerHTML = '';
      const htmlEditor = this.createEditor(code.html, 'html', isDark, htmlPanel);
      this.editors.set('html', htmlEditor);
    }

    if (cssPanel) {
      cssPanel.innerHTML = '';
      const cssEditor = this.createEditor(code.css, 'css', isDark, cssPanel);
      this.editors.set('css', cssEditor);
    }

    if (jsPanel) {
      jsPanel.innerHTML = '';
      const jsEditor = this.createEditor(code.js, 'js', isDark, jsPanel);
      this.editors.set('js', jsEditor);
    }

    this.updateLivePreview();
  }

  private updateLivePreview(): void {
    const html = this.editors.get('html')?.state.doc.toString() || '';
    const cssCode = this.editors.get('css')?.state.doc.toString() || '';
    const js = this.editors.get('js')?.state.doc.toString() || '';

    const previewContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${cssCode}</style>
</head>
<body>
  ${html}
  <script>${js}<\/script>
</body>
</html>`;

    const liveFrame = document.getElementById('livePreviewFrame') as HTMLIFrameElement;
    if (liveFrame) {
      liveFrame.srcdoc = previewContent;
    }
  }

  private switchTab(tabName: string): void {
    this.activeTab = tabName;

    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.editor-panel').forEach(panel => {
      const lang = panel.getAttribute('data-lang');
      panel.classList.toggle('active', lang === tabName);
    });

    const editor = this.editors.get(tabName);
    if (editor) {
      editor.focus();
    }
  }

  private scheduleAutoSave(): void {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    this.updateSaveIndicator('saving');

    this.autoSaveTimeout = window.setTimeout(() => {
      this.saveCode();
    }, 1000);
  }

  private saveCode(): void {
    const code = {
      html: this.editors.get('html')?.state.doc.toString() || '',
      css: this.editors.get('css')?.state.doc.toString() || '',
      js: this.editors.get('js')?.state.doc.toString() || ''
    };

    this.storage.saveCode(code);
    this.updateSaveIndicator('saved');
  }

  private updateSaveIndicator(status: 'saving' | 'saved'): void {
    const indicator = document.getElementById('saveIndicator');
    if (!indicator) return;

    indicator.className = `save-indicator ${status}`;
    indicator.innerHTML = status === 'saving' 
      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
        </svg><span>Saving...</span>`
      : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg><span>Saved</span>`;
  }

  private showPreview(): void {
    this.saveCode();
    this.closeSearchPanel();

    const html = this.editors.get('html')?.state.doc.toString() || '';
    const css = this.editors.get('css')?.state.doc.toString() || '';
    const js = this.editors.get('js')?.state.doc.toString() || '';

    const previewContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>${js}<\/script>
</body>
</html>`;

    const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
    if (iframe) {
      iframe.srcdoc = previewContent;
    }

    document.getElementById('previewContainer')?.classList.add('active');
  }

  private hidePreview(): void {
    document.getElementById('previewContainer')?.classList.remove('active');
  }

  private showSettings(): void {
    document.getElementById('settingsContainer')?.classList.add('active');
  }

  private hideSettings(): void {
    document.getElementById('settingsContainer')?.classList.remove('active');
  }

  private showPrivacy(): void {
    this.hideSettings();
    document.getElementById('privacyPage')?.classList.add('active');
  }

  private hidePrivacy(): void {
    document.getElementById('privacyPage')?.classList.remove('active');
  }

  private showTerms(): void {
    this.hideSettings();
    document.getElementById('termsPage')?.classList.add('active');
  }

  private hideTerms(): void {
    document.getElementById('termsPage')?.classList.remove('active');
  }

  private toggleDarkMode(): void {
    this.settings.toggleDarkMode();
    this.applyTheme();
    this.recreateEditors();
  }

  private applyTheme(): void {
    const isDark = this.settings.isDarkMode();
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
      toggle.classList.toggle('active', isDark);
    }
  }

  private recreateEditors(): void {
    const savedCode = {
      html: this.editors.get('html')?.state.doc.toString() || '',
      css: this.editors.get('css')?.state.doc.toString() || '',
      js: this.editors.get('js')?.state.doc.toString() || ''
    };

    this.editors.forEach(editor => editor.destroy());
    this.editors.clear();

    const isDark = this.settings.isDarkMode();

    ['html', 'css', 'js'].forEach(lang => {
      const panel = document.getElementById(`${lang}Editor`);
      if (panel) {
        panel.innerHTML = '';
        const editor = this.createEditor(savedCode[lang as keyof typeof savedCode], lang, isDark, panel);
        this.editors.set(lang, editor);
      }
    });
  }

  private updateOnlineStatus(): void {
    const indicator = document.getElementById('offlineIndicator');
    if (indicator) {
      indicator.classList.toggle('show', !this.isOnline);
    }
  }

  private openSearch(): void {
    const searchBar = document.getElementById('customSearchBar');
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchBar && searchInput) {
      searchBar.classList.add('active');
      searchInput.focus();
      searchInput.select();
    }
  }

  private closeSearch(): void {
    const searchBar = document.getElementById('customSearchBar');
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchBar) {
      searchBar.classList.remove('active');
    }
    if (searchInput) {
      searchInput.value = '';
    }
    this.currentSearchQuery = '';
    this.clearSearchHighlights();
  }

  private handleSearchInput(query: string): void {
    this.currentSearchQuery = query;
    const editor = this.editors.get(this.activeTab);
    if (!editor) return;

    if (query.trim()) {
      const searchQuery = new SearchQuery({
        search: query,
        caseSensitive: false,
        regexp: false,
        wholeWord: false
      });
      editor.dispatch({ effects: setSearchQuery.of(searchQuery) });
    } else {
      this.clearSearchHighlights();
    }
  }

  private searchNext(): void {
    const editor = this.editors.get(this.activeTab);
    if (editor && this.currentSearchQuery.trim()) {
      findNext(editor);
    }
  }

  private searchPrevious(): void {
    const editor = this.editors.get(this.activeTab);
    if (editor && this.currentSearchQuery.trim()) {
      findPrevious(editor);
    }
  }

  private clearSearchHighlights(): void {
    const editor = this.editors.get(this.activeTab);
    if (editor) {
      const emptyQuery = new SearchQuery({
        search: '',
        caseSensitive: false,
        regexp: false,
        wholeWord: false
      });
      editor.dispatch({ effects: setSearchQuery.of(emptyQuery) });
    }
  }

  private showModal(title: string, defaultValue: string, confirmText: string): void {
    const modal = document.getElementById('projectModal');
    const titleEl = document.getElementById('modalTitle');
    const input = document.getElementById('projectNameInput') as HTMLInputElement;
    const confirmBtn = document.getElementById('modalConfirm');

    if (modal && titleEl && input && confirmBtn) {
      titleEl.textContent = title;
      input.value = defaultValue;
      confirmBtn.textContent = confirmText;
      modal.classList.add('active');
      setTimeout(() => {
        input.focus();
        input.select();
      }, 50);
    }
  }

  private closeModal(): void {
    const modal = document.getElementById('projectModal');
    if (modal) {
      modal.classList.remove('active');
    }
    this.renameProjectId = null;
  }

  private confirmModal(): void {
    const input = document.getElementById('projectNameInput') as HTMLInputElement;
    const name = input?.value?.trim();

    if (!name) {
      this.showToast('Please enter a project name');
      return;
    }

    if (this.modalMode === 'create') {
      this.saveCode();
      const newProject = this.storage.createProject(name);
      this.refreshProjectUI();
      this.loadProjectCode();
      this.showToast(`Created "${newProject.name}"`);
    } else if (this.modalMode === 'rename' && this.renameProjectId) {
      const project = this.storage.getProjects().find(p => p.id === this.renameProjectId);
      if (project && name !== project.name) {
        this.storage.renameProject(this.renameProjectId, name);
        this.refreshProjectUI();
        this.showToast(`Renamed to "${name}"`);
      }
    }

    this.closeModal();
  }

  private handleFileUpload(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ext = file.name.split('.').pop()?.toLowerCase();
      
      let targetTab = 'html';
      if (ext === 'css') targetTab = 'css';
      else if (ext === 'js') targetTab = 'js';
      
      this.switchTab(targetTab);
      const editor = this.editors.get(targetTab);
      if (editor) {
        editor.dispatch({
          changes: { from: 0, to: editor.state.doc.length, insert: content }
        });
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  private downloadCurrentFile(): void {
    const editor = this.editors.get(this.activeTab);
    if (!editor) return;

    const content = editor.state.doc.toString();
    const extensions: Record<string, string> = { html: 'html', css: 'css', js: 'js' };
    const ext = extensions[this.activeTab] || 'txt';
    const filename = `code.${ext}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  private async copyCurrentCode(): Promise<void> {
    const editor = this.editors.get(this.activeTab);
    if (!editor) return;

    const content = editor.state.doc.toString();
    try {
      await navigator.clipboard.writeText(content);
      this.showToast('Code copied!');
    } catch {
      this.showToast('Copy failed');
    }
  }

  private async pasteToEditor(): Promise<void> {
    const editor = this.editors.get(this.activeTab);
    if (!editor) return;

    try {
      const text = await navigator.clipboard.readText();
      const pos = editor.state.selection.main.head;
      editor.dispatch({
        changes: { from: pos, insert: text }
      });
    } catch {
      this.showToast('Paste failed - check permissions');
    }
  }

  private selectAllCode(): void {
    const editor = this.editors.get(this.activeTab);
    if (!editor) return;

    editor.dispatch({
      selection: { anchor: 0, head: editor.state.doc.length }
    });
    editor.focus();
  }

  private insertSnippet(snippet: string): void {
    const editor = this.editors.get(this.activeTab);
    if (!editor) return;

    const pos = editor.state.selection.main.head;
    let insertText = snippet;
    let cursorOffset = snippet.length;

    if (snippet === '<>') {
      insertText = '<></>';
      cursorOffset = 1;
    } else if (snippet === '{}') {
      insertText = '{}';
      cursorOffset = 1;
    } else if (snippet === '()') {
      insertText = '()';
      cursorOffset = 1;
    } else if (snippet === '""') {
      insertText = '""';
      cursorOffset = 1;
    }

    editor.dispatch({
      changes: { from: pos, insert: insertText },
      selection: { anchor: pos + cursorOffset }
    });
    editor.focus();
  }

  private showToast(message: string): void {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  private checkAndShowAds(): void {
    const lastAdTime = localStorage.getItem('lastInterstitialAd');
    const lastViewTime = localStorage.getItem('lastViewAd');
    const now = Date.now();

    if (!lastAdTime || (now - parseInt(lastAdTime)) >= AD_INTERVAL_MS) {
      this.showInterstitialAd();
      localStorage.setItem('lastInterstitialAd', now.toString());
    }

    if (!lastViewTime || (now - parseInt(lastViewTime)) >= VIEW_AD_INTERVAL_MS) {
      localStorage.setItem('lastViewAd', now.toString());
    }
  }

  private setupAdIntervals(): void {
    setInterval(() => {
      this.showInterstitialAd();
      localStorage.setItem('lastInterstitialAd', Date.now().toString());
    }, AD_INTERVAL_MS);

    setInterval(() => {
      localStorage.setItem('lastViewAd', Date.now().toString());
    }, VIEW_AD_INTERVAL_MS);
  }

  private showInterstitialAd(): void {
    if (this.showingInterstitial) return;
    this.showingInterstitial = true;

    const ad = document.getElementById('interstitialAd');
    const closeBtn = document.getElementById('closeAdBtn') as HTMLButtonElement;
    const timer = document.getElementById('adTimer');

    if (!ad || !closeBtn || !timer) return;

    ad.classList.add('active');
    closeBtn.disabled = true;

    let countdown = 5;
    timer.textContent = `Close in ${countdown}s`;

    const interval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        timer.textContent = `Close in ${countdown}s`;
      } else {
        clearInterval(interval);
        timer.textContent = 'You can close now';
        closeBtn.disabled = false;
      }
    }, 1000);
  }

  private hideInterstitialAd(): void {
    const ad = document.getElementById('interstitialAd');
    if (ad) {
      ad.classList.remove('active');
      this.showingInterstitial = false;
    }
  }
}
