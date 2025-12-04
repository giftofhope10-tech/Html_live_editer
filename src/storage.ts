export interface CodeData {
  html: string;
  css: string;
  js: string;
}

export interface Project {
  id: string;
  name: string;
  code: CodeData;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectsData {
  activeProjectId: string;
  projects: Project[];
}

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>Start editing to see the magic happen.</p>
</body>
</html>`;

const DEFAULT_CSS = `body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  font-size: 2.5rem;
  margin-bottom: 10px;
}

p {
  color: rgba(255,255,255,0.9);
  font-size: 1.2rem;
}`;

const DEFAULT_JS = `// Write your JavaScript here
console.log('Hello from JavaScript!');

// Example: Add interactivity
document.querySelector('h1')?.addEventListener('click', function() {
  this.style.color = '#' + Math.floor(Math.random()*16777215).toString(16);
});`;

const PROJECTS_KEY = 'html_editor_projects';
const LEGACY_KEY = 'html_editor_code';

export class Storage {
  private projectsData: ProjectsData;

  constructor() {
    this.projectsData = this.loadProjects();
  }

  private generateId(): string {
    return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getDefaultCode(): CodeData {
    return {
      html: DEFAULT_HTML,
      css: DEFAULT_CSS,
      js: DEFAULT_JS
    };
  }

  private loadProjects(): ProjectsData {
    try {
      const saved = localStorage.getItem(PROJECTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }

      const legacyCode = localStorage.getItem(LEGACY_KEY);
      if (legacyCode) {
        const parsed = JSON.parse(legacyCode);
        const defaultProject: Project = {
          id: this.generateId(),
          name: 'Project 1',
          code: {
            html: parsed.html || DEFAULT_HTML,
            css: parsed.css || DEFAULT_CSS,
            js: parsed.js || DEFAULT_JS
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        return {
          activeProjectId: defaultProject.id,
          projects: [defaultProject]
        };
      }
    } catch (e) {
      console.error('Error loading projects:', e);
    }

    const defaultProject: Project = {
      id: this.generateId(),
      name: 'Project 1',
      code: this.getDefaultCode(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return {
      activeProjectId: defaultProject.id,
      projects: [defaultProject]
    };
  }

  private saveProjects(): void {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(this.projectsData));
    } catch (e) {
      console.error('Error saving projects:', e);
    }
  }

  getProjects(): Project[] {
    return this.projectsData.projects;
  }

  getActiveProject(): Project | undefined {
    return this.projectsData.projects.find(p => p.id === this.projectsData.activeProjectId);
  }

  getActiveProjectId(): string {
    return this.projectsData.activeProjectId;
  }

  setActiveProject(projectId: string): void {
    if (this.projectsData.projects.some(p => p.id === projectId)) {
      this.projectsData.activeProjectId = projectId;
      this.saveProjects();
    }
  }

  createProject(name?: string): Project {
    const projectNumber = this.projectsData.projects.length + 1;
    const newProject: Project = {
      id: this.generateId(),
      name: name || `Project ${projectNumber}`,
      code: this.getDefaultCode(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.projectsData.projects.push(newProject);
    this.projectsData.activeProjectId = newProject.id;
    this.saveProjects();

    return newProject;
  }

  deleteProject(projectId: string): boolean {
    if (this.projectsData.projects.length <= 1) {
      return false;
    }

    const index = this.projectsData.projects.findIndex(p => p.id === projectId);
    if (index === -1) return false;

    this.projectsData.projects.splice(index, 1);

    if (this.projectsData.activeProjectId === projectId) {
      this.projectsData.activeProjectId = this.projectsData.projects[0].id;
    }

    this.saveProjects();
    return true;
  }

  renameProject(projectId: string, newName: string): boolean {
    const project = this.projectsData.projects.find(p => p.id === projectId);
    if (!project) return false;

    project.name = newName;
    project.updatedAt = Date.now();
    this.saveProjects();
    return true;
  }

  getCode(): CodeData {
    const activeProject = this.getActiveProject();
    if (activeProject) {
      return activeProject.code;
    }
    return this.getDefaultCode();
  }

  saveCode(code: CodeData): void {
    const activeProject = this.getActiveProject();
    if (activeProject) {
      activeProject.code = code;
      activeProject.updatedAt = Date.now();
      this.saveProjects();
    }
  }

  clearCode(): void {
    const activeProject = this.getActiveProject();
    if (activeProject) {
      activeProject.code = this.getDefaultCode();
      activeProject.updatedAt = Date.now();
      this.saveProjects();
    }
  }

  clearAllData(): void {
    try {
      localStorage.removeItem(PROJECTS_KEY);
      localStorage.removeItem(LEGACY_KEY);
      this.projectsData = this.loadProjects();
    } catch (e) {
      console.error('Error clearing data:', e);
    }
  }
}
