const SETTINGS_KEY = 'html_editor_settings';

interface SettingsData {
  darkMode: boolean;
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
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading settings:', e);
    }

    return {
      darkMode: true
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
                <div class="settings-item-desc">Version 1.1.0</div>
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
