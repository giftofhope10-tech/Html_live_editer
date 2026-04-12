const SETTINGS_KEY = 'html_editor_settings';

interface SettingsData {
  darkMode: boolean;
  editorFontSize: number;
  wordWrap: boolean;
}

export class Settings {
  private settings: SettingsData;

  constructor() {
    this.settings = this.loadSettings();
  }

  private loadSettings(): SettingsData {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          darkMode: parsed.darkMode ?? true,
          editorFontSize: parsed.editorFontSize ?? 14,
          wordWrap: parsed.wordWrap ?? true
        };
      }
    } catch (e) {
      console.error('Error loading settings:', e);
    }

    return {
      darkMode: true,
      editorFontSize: 14,
      wordWrap: true
    };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  }

  isDarkMode(): boolean {
    return this.settings.darkMode;
  }

  toggleDarkMode(): boolean {
    this.settings.darkMode = !this.settings.darkMode;
    this.saveSettings();
    return this.settings.darkMode;
  }

  getEditorFontSize(): number {
    return this.settings.editorFontSize;
  }

  changeEditorFontSize(delta: number): number {
    const min = 10;
    const max = 28;
    this.settings.editorFontSize = Math.min(max, Math.max(min, this.settings.editorFontSize + delta));
    this.saveSettings();
    return this.settings.editorFontSize;
  }

  isWordWrap(): boolean {
    return this.settings.wordWrap;
  }

  toggleWordWrap(): boolean {
    this.settings.wordWrap = !this.settings.wordWrap;
    this.saveSettings();
    return this.settings.wordWrap;
  }

  renderSettingsPage(): string {
    return `
      <div class="settings-container" id="settingsContainer">
        <div class="settings-header">
          <button class="icon-btn" id="closeSettings" aria-label="Back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <h2>Settings</h2>
        </div>
        <div class="settings-content">
          <div class="settings-section">
            <div class="settings-section-title">Appearance</div>
            <div class="settings-item">
              <div class="settings-item-info">
                <div class="settings-item-title">Dark Mode</div>
                <div class="settings-item-desc">Use dark theme for the editor</div>
              </div>
              <div class="toggle ${this.settings.darkMode ? 'active' : ''}" id="darkModeToggle"></div>
            </div>
            <div class="settings-item">
              <div class="settings-item-info">
                <div class="settings-item-title">Word Wrap</div>
                <div class="settings-item-desc">Wrap long lines in the editor</div>
              </div>
              <div class="toggle ${this.settings.wordWrap ? 'active' : ''}" id="wordWrapToggle"></div>
            </div>
          </div>

          <div class="settings-section">
            <div class="settings-section-title">Editor</div>
            <div class="settings-item">
              <div class="settings-item-info">
                <div class="settings-item-title">Font Size</div>
                <div class="settings-item-desc">Current: ${this.settings.editorFontSize}px (range 10–28px)</div>
              </div>
              <div class="font-size-controls">
                <button class="font-ctrl-btn" id="settingsFontDecrease" title="Decrease">A-</button>
                <span class="font-size-value" id="settingsFontValue">${this.settings.editorFontSize}px</span>
                <button class="font-ctrl-btn" id="settingsFontIncrease" title="Increase">A+</button>
              </div>
            </div>
          </div>

          <div class="settings-section">
            <div class="settings-section-title">Keyboard Shortcuts</div>
            <div class="shortcuts-grid">
              <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>S</kbd> <span>Save</span></div>
              <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>Enter</kbd> <span>Preview</span></div>
              <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>F</kbd> <span>Find</span></div>
              <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>=</kbd> <span>Font +</span></div>
              <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>-</kbd> <span>Font -</span></div>
              <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>Z</kbd> <span>Undo</span></div>
              <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>/</kbd> <span>Comment</span></div>
              <div class="shortcut-item"><kbd>Tab</kbd> <span>Indent</span></div>
            </div>
          </div>

          <div class="settings-section">
            <div class="settings-section-title">Project</div>
            <div class="settings-item" id="deleteProjectSection">
              <div class="settings-item-info">
                <div class="settings-item-title">Delete Project</div>
                <div class="settings-item-desc">Select a project to delete</div>
              </div>
              <button class="icon-btn delete-btn" id="showDeleteListBtn" aria-label="Show delete options">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                </svg>
              </button>
            </div>
            <div class="delete-project-list" id="deleteProjectList" style="display: none;"></div>
          </div>

          <div class="settings-section">
            <div class="settings-section-title">AI Assistant</div>

            <div class="ai-provider-label">Choose AI Provider</div>
            <div class="ai-provider-tabs">
              <button class="ai-provider-tab" data-provider="gemini" id="providerGemini">
                <span class="ai-provider-tab-name">Google Gemini</span>
                <span class="ai-provider-tab-badge free">15/min FREE</span>
              </button>
              <button class="ai-provider-tab" data-provider="groq" id="providerGroq">
                <span class="ai-provider-tab-name">Groq (Llama)</span>
                <span class="ai-provider-tab-badge fast">30/min FREE</span>
              </button>
              <button class="ai-provider-tab" data-provider="openai" id="providerOpenAI">
                <span class="ai-provider-tab-name">OpenAI</span>
                <span class="ai-provider-tab-badge">3/min free</span>
              </button>
            </div>

            <div class="settings-item ai-key-item">
              <div class="settings-item-info">
                <div class="settings-item-title" id="aiKeyTitle">API Key</div>
                <div class="settings-item-desc">Stored only on your device. Never shared with anyone.</div>
              </div>
            </div>
            <div class="ai-key-input-row">
              <div class="ai-key-field-wrap">
                <input type="password" id="aiApiKeyInput" class="ai-key-input" placeholder="AIza..." autocomplete="off" spellcheck="false" />
                <button class="ai-key-toggle" id="aiKeyToggle" title="Show/hide key">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
              <button class="ai-key-save-btn" id="aiKeySaveBtn">Save</button>
              <button class="ai-key-clear-btn" id="aiKeyClearBtn">Clear</button>
            </div>
            <div class="ai-key-status" id="aiKeyStatus"></div>
            <a class="ai-key-link" id="aiKeyLink" href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
              Get free API key → aistudio.google.com/app/apikey
            </a>
          </div>

          <div class="settings-section">
            <div class="settings-section-title">Legal</div>
            <a class="settings-link" id="privacyLink">
              <div class="settings-item-info">
                <div class="settings-item-title">Privacy Policy</div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </a>
            <a class="settings-link" id="termsLink">
              <div class="settings-item-info">
                <div class="settings-item-title">Terms of Service</div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </a>
          </div>

          <div class="settings-section">
            <div class="settings-section-title">About</div>
            <div class="settings-item">
              <div class="settings-item-info">
                <div class="settings-item-title">Html Live Editer</div>
                <div class="settings-item-desc">Version 1.2.0 — Ad-free</div>
              </div>
            </div>
          </div>

          <div class="version-info">
            Made with care for developers everywhere
          </div>
        </div>
      </div>
    `;
  }
}
