import{E as m,s as U,H as $,t as n,P as O,k as R,b as W,h as F,a as _,c as V,d as q,j as Y,e as K,S as E,f as P,g as J,i as Q}from"./codemirror-3t5lAjMO.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();const z="#e5c07b",k="#e06c75",G="#56b6c2",X="#ffffff",f="#abb2bf",w="#7d8799",Z="#61afef",ee="#98c379",I="#d19a66",te="#c678dd",se="#21252b",S="#2c313a",L="#282c34",y="#353a42",ie="#3E4451",B="#528bff",oe=m.theme({"&":{color:f,backgroundColor:L},".cm-content":{caretColor:B},".cm-cursor, .cm-dropCursor":{borderLeftColor:B},"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":{backgroundColor:ie},".cm-panels":{backgroundColor:se,color:f},".cm-panels.cm-panels-top":{borderBottom:"2px solid black"},".cm-panels.cm-panels-bottom":{borderTop:"2px solid black"},".cm-searchMatch":{backgroundColor:"#72a1ff59",outline:"1px solid #457dff"},".cm-searchMatch.cm-searchMatch-selected":{backgroundColor:"#6199ff2f"},".cm-activeLine":{backgroundColor:"#6699ff0b"},".cm-selectionMatch":{backgroundColor:"#aafe661a"},"&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bad0f847"},".cm-gutters":{backgroundColor:L,color:w,border:"none"},".cm-activeLineGutter":{backgroundColor:S},".cm-foldPlaceholder":{backgroundColor:"transparent",border:"none",color:"#ddd"},".cm-tooltip":{border:"none",backgroundColor:y},".cm-tooltip .cm-tooltip-arrow:before":{borderTopColor:"transparent",borderBottomColor:"transparent"},".cm-tooltip .cm-tooltip-arrow:after":{borderTopColor:y,borderBottomColor:y},".cm-tooltip-autocomplete":{"& > ul > li[aria-selected]":{backgroundColor:S,color:f}}},{dark:!0}),ne=$.define([{tag:n.keyword,color:te},{tag:[n.name,n.deleted,n.character,n.propertyName,n.macroName],color:k},{tag:[n.function(n.variableName),n.labelName],color:Z},{tag:[n.color,n.constant(n.name),n.standard(n.name)],color:I},{tag:[n.definition(n.name),n.separator],color:f},{tag:[n.typeName,n.className,n.number,n.changed,n.annotation,n.modifier,n.self,n.namespace],color:z},{tag:[n.operator,n.operatorKeyword,n.url,n.escape,n.regexp,n.link,n.special(n.string)],color:G},{tag:[n.meta,n.comment],color:w},{tag:n.strong,fontWeight:"bold"},{tag:n.emphasis,fontStyle:"italic"},{tag:n.strikethrough,textDecoration:"line-through"},{tag:n.link,color:w,textDecoration:"underline"},{tag:n.heading,fontWeight:"bold",color:k},{tag:[n.atom,n.bool,n.special(n.variableName)],color:I},{tag:[n.processingInstruction,n.string,n.inserted],color:ee},{tag:n.invalid,color:X}]),re=[oe,U(ne)],C=`<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>Start editing to see the magic happen.</p>
</body>
</html>`,x=`body {
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
}`,T=`// Write your JavaScript here
console.log('Hello from JavaScript!');

// Example: Add interactivity
document.querySelector('h1')?.addEventListener('click', function() {
  this.style.color = '#' + Math.floor(Math.random()*16777215).toString(16);
});`,b="html_editor_projects",D="html_editor_code";class ae{projectsData;constructor(){this.projectsData=this.loadProjects()}generateId(){return"proj_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}getDefaultCode(){return{html:C,css:x,js:T}}loadProjects(){try{const t=localStorage.getItem(b);if(t)return JSON.parse(t);const s=localStorage.getItem(D);if(s){const i=JSON.parse(s),o={id:this.generateId(),name:"Project 1",code:{html:i.html||C,css:i.css||x,js:i.js||T},createdAt:Date.now(),updatedAt:Date.now()};return{activeProjectId:o.id,projects:[o]}}}catch(t){console.error("Error loading projects:",t)}const e={id:this.generateId(),name:"Project 1",code:this.getDefaultCode(),createdAt:Date.now(),updatedAt:Date.now()};return{activeProjectId:e.id,projects:[e]}}saveProjects(){try{localStorage.setItem(b,JSON.stringify(this.projectsData))}catch(e){console.error("Error saving projects:",e)}}getProjects(){return this.projectsData.projects}getActiveProject(){return this.projectsData.projects.find(e=>e.id===this.projectsData.activeProjectId)}getActiveProjectId(){return this.projectsData.activeProjectId}setActiveProject(e){this.projectsData.projects.some(t=>t.id===e)&&(this.projectsData.activeProjectId=e,this.saveProjects())}createProject(e){const t=this.projectsData.projects.length+1,s={id:this.generateId(),name:e||`Project ${t}`,code:this.getDefaultCode(),createdAt:Date.now(),updatedAt:Date.now()};return this.projectsData.projects.push(s),this.projectsData.activeProjectId=s.id,this.saveProjects(),s}deleteProject(e){if(this.projectsData.projects.length<=1)return!1;const t=this.projectsData.projects.findIndex(s=>s.id===e);return t===-1?!1:(this.projectsData.projects.splice(t,1),this.projectsData.activeProjectId===e&&(this.projectsData.activeProjectId=this.projectsData.projects[0].id),this.saveProjects(),!0)}renameProject(e,t){const s=this.projectsData.projects.find(i=>i.id===e);return s?(s.name=t,s.updatedAt=Date.now(),this.saveProjects(),!0):!1}getCode(){const e=this.getActiveProject();return e?e.code:this.getDefaultCode()}saveCode(e){const t=this.getActiveProject();t&&(t.code=e,t.updatedAt=Date.now(),this.saveProjects())}clearCode(){const e=this.getActiveProject();e&&(e.code=this.getDefaultCode(),e.updatedAt=Date.now(),this.saveProjects())}clearAllData(){try{localStorage.removeItem(b),localStorage.removeItem(D),this.projectsData=this.loadProjects()}catch(e){console.error("Error clearing data:",e)}}}const A="html_editor_settings";class ce{settings;constructor(){this.settings=this.loadSettings()}loadSettings(){try{const e=localStorage.getItem(A);if(e)return JSON.parse(e)}catch(e){console.error("Error loading settings:",e)}return{darkMode:!0}}saveSettings(){try{localStorage.setItem(A,JSON.stringify(this.settings))}catch(e){console.error("Error saving settings:",e)}}isDarkMode(){return this.settings.darkMode}toggleDarkMode(){return this.settings.darkMode=!this.settings.darkMode,this.saveSettings(),this.settings.darkMode}renderSettingsPage(){return`
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
              <div class="toggle ${this.settings.darkMode?"active":""}" id="darkModeToggle"></div>
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
    `}}const M=2*60*60*1e3,N=3*60*60*1e3;class le{storage;settings;editors=new Map;activeTab="html";autoSaveTimeout=null;isOnline=navigator.onLine;showingInterstitial=!1;modalMode="create";renameProjectId=null;currentSearchQuery="";constructor(){this.storage=new ae,this.settings=new ce}init(){this.render(),this.initEditors(),this.bindEvents(),this.updateOnlineStatus(),this.applyTheme(),this.checkAndShowAds(),this.setupAdIntervals()}renderProjectsList(){const e=this.storage.getProjects(),t=this.storage.getActiveProjectId();return e.map(s=>`
      <div class="project-item ${s.id===t?"active":""}" data-project-id="${s.id}">
        <span class="project-name">${s.name}</span>
        <div class="project-actions">
          <button class="project-action-btn rename-project" data-project-id="${s.id}" title="Rename">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="project-action-btn delete-project" data-project-id="${s.id}" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `).join("")}render(){const e=document.getElementById("app");if(!e)return;const t=this.storage.getActiveProject(),s=t?t.name:"Project 1";e.innerHTML=`
      <header class="header">
        <div class="header-left">
          <div class="logo">
            <img src="icons/app-logo.png" alt="Html Live Editer" class="logo-image">
            <span class="logo-text">Html Live Editer</span>
          </div>
          <div class="project-selector" id="projectSelector">
            <button class="project-selector-btn" id="projectSelectorBtn">
              <span id="currentProjectName">${s}</span>
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
    `}renderPrivacyPage(){return`
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
    `}renderTermsPage(){return`
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
    `}initEditors(){const e=this.storage.getCode(),t=this.settings.isDarkMode(),s=document.getElementById("htmlEditor"),i=document.getElementById("cssEditor"),o=document.getElementById("jsEditor");if(s){const r=this.createEditor(e.html,"html",t,s);this.editors.set("html",r)}if(i){const r=this.createEditor(e.css,"css",t,i);this.editors.set("css",r)}if(o){const r=this.createEditor(e.js,"js",t,o);this.editors.set("js",r)}}createEditor(e,t,s,i){const r=[O.highest(R.of([{key:"Mod-f",run:()=>(this.openSearch(),!0),preventDefault:!0},{key:"Escape",run:()=>(this.closeSearch(),!1)}])),W,m.lineWrapping,F(),_({top:!0}),m.updateListener.of(a=>{a.docChanged&&this.scheduleAutoSave()})];return t==="html"?r.push(V()):t==="css"?r.push(q()):t==="js"&&r.push(Y()),s&&r.push(re),new m({parent:i,state:K.create({doc:e,extensions:r})})}bindEvents(){document.querySelectorAll(".tab").forEach(e=>{e.addEventListener("click",t=>{const i=t.currentTarget.dataset.tab;i&&this.switchTab(i)})}),document.querySelectorAll(".file-item").forEach(e=>{e.addEventListener("click",t=>{const s=t.currentTarget,i=s.dataset.tab;i&&this.switchTab(i),document.querySelectorAll(".file-item").forEach(o=>o.classList.remove("active")),s.classList.add("active")})}),document.getElementById("projectSelectorBtn")?.addEventListener("click",e=>{e.stopPropagation(),document.getElementById("projectSelector")?.classList.toggle("open")}),document.addEventListener("click",e=>{const t=document.getElementById("projectSelector");t&&!t.contains(e.target)&&t.classList.remove("open")}),document.getElementById("newProjectBtn")?.addEventListener("click",e=>{e.stopPropagation(),this.createNewProject()}),this.bindProjectListEvents(),document.getElementById("runBtn")?.addEventListener("click",()=>{this.showPreview(),this.updateLivePreview()}),document.getElementById("refreshPreview")?.addEventListener("click",()=>{this.updateLivePreview()}),document.getElementById("closePreview")?.addEventListener("click",()=>{this.hidePreview()}),document.getElementById("settingsBtn")?.addEventListener("click",()=>{this.showSettings()}),document.getElementById("closeSettings")?.addEventListener("click",()=>{this.hideSettings()}),document.getElementById("darkModeToggle")?.addEventListener("click",()=>{this.toggleDarkMode()}),document.getElementById("privacyLink")?.addEventListener("click",()=>{this.showPrivacy()}),document.getElementById("termsLink")?.addEventListener("click",()=>{this.showTerms()}),document.getElementById("closePrivacy")?.addEventListener("click",()=>{this.hidePrivacy()}),document.getElementById("closeTerms")?.addEventListener("click",()=>{this.hideTerms()}),document.getElementById("showDeleteListBtn")?.addEventListener("click",()=>{this.toggleDeleteProjectList()}),window.addEventListener("online",()=>{this.isOnline=!0,this.updateOnlineStatus()}),window.addEventListener("offline",()=>{this.isOnline=!1,this.updateOnlineStatus()}),document.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="s"&&(e.preventDefault(),this.saveCode()),(e.ctrlKey||e.metaKey)&&e.key==="Enter"&&(e.preventDefault(),this.showPreview()),(e.ctrlKey||e.metaKey)&&e.key==="f"&&(e.preventDefault(),this.openSearch())}),document.getElementById("uploadBtn")?.addEventListener("click",()=>{document.getElementById("fileInput")?.click()}),document.getElementById("sidebarUpload")?.addEventListener("click",()=>{document.getElementById("fileInput")?.click()}),document.getElementById("fileInput")?.addEventListener("change",e=>{this.handleFileUpload(e)}),document.getElementById("downloadBtn")?.addEventListener("click",()=>{this.downloadCurrentFile()}),document.getElementById("sidebarDownload")?.addEventListener("click",()=>{this.downloadCurrentFile()}),document.getElementById("searchBtn")?.addEventListener("click",()=>{this.openSearch()}),document.getElementById("copyBtn")?.addEventListener("click",()=>{this.copyCurrentCode()}),document.getElementById("pasteBtn")?.addEventListener("click",()=>{this.pasteToEditor()}),document.getElementById("selectAllBtn")?.addEventListener("click",()=>{this.selectAllCode()}),document.querySelectorAll(".snippet-btn").forEach(e=>{e.addEventListener("click",t=>{const i=t.currentTarget.dataset.snippet;i&&this.insertSnippet(i)})}),document.getElementById("closeAdBtn")?.addEventListener("click",()=>{this.hideInterstitialAd()}),document.getElementById("searchInput")?.addEventListener("input",e=>{this.handleSearchInput(e.target.value)}),document.getElementById("searchInput")?.addEventListener("keydown",e=>{e.key==="Enter"?(e.preventDefault(),e.shiftKey?this.searchPrevious():this.searchNext()):e.key==="Escape"&&this.closeSearch()}),document.getElementById("searchNext")?.addEventListener("click",()=>{this.searchNext()}),document.getElementById("searchPrev")?.addEventListener("click",()=>{this.searchPrevious()}),document.getElementById("searchClose")?.addEventListener("click",()=>{this.closeSearch()}),document.getElementById("modalClose")?.addEventListener("click",()=>{this.closeModal()}),document.getElementById("modalCancel")?.addEventListener("click",()=>{this.closeModal()}),document.getElementById("modalConfirm")?.addEventListener("click",()=>{this.confirmModal()}),document.getElementById("projectNameInput")?.addEventListener("keydown",e=>{e.key==="Enter"?(e.preventDefault(),this.confirmModal()):e.key==="Escape"&&this.closeModal()}),this.updateLivePreview()}bindProjectListEvents(){document.querySelectorAll(".project-item").forEach(e=>{e.addEventListener("click",t=>{const i=t.currentTarget.dataset.projectId;i&&!t.target.closest(".project-action-btn")&&this.switchProject(i)})}),document.querySelectorAll(".rename-project").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const i=t.currentTarget.dataset.projectId;i&&this.renameProject(i)})}),document.querySelectorAll(".delete-project").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const i=t.currentTarget.dataset.projectId;i&&this.deleteProject(i)})})}createNewProject(){this.modalMode="create",this.renameProjectId=null,this.showModal("New Project",`Project ${this.storage.getProjects().length+1}`,"Create")}switchProject(e){this.saveCode(),this.storage.setActiveProject(e),this.refreshProjectUI(),this.loadProjectCode(),document.getElementById("projectSelector")?.classList.remove("open")}renameProject(e){const t=this.storage.getProjects().find(s=>s.id===e);t&&(this.modalMode="rename",this.renameProjectId=e,this.showModal("Rename Project",t.name,"Rename"))}deleteProject(e){const t=this.storage.getProjects();if(t.length<=1){this.showToast("Cannot delete the only project");return}const s=t.find(i=>i.id===e);s&&confirm(`Delete "${s.name}"? This cannot be undone.`)&&(this.storage.deleteProject(e),this.refreshProjectUI(),this.loadProjectCode(),this.showToast(`Deleted "${s.name}"`))}toggleDeleteProjectList(){const e=document.getElementById("deleteProjectList");if(!e)return;e.style.display!=="none"?e.style.display="none":(this.renderDeleteProjectList(),e.style.display="block")}renderDeleteProjectList(){const e=document.getElementById("deleteProjectList");if(!e)return;const t=this.storage.getProjects(),s=this.storage.getActiveProjectId();if(t.length<=1){e.innerHTML=`
        <div class="delete-project-item">
          <div class="project-info">
            <span class="project-name">No projects to delete</span>
            <span class="project-status">Create more projects first</span>
          </div>
        </div>
      `;return}e.innerHTML=t.map(i=>`
      <div class="delete-project-item" data-project-id="${i.id}">
        <div class="project-info">
          <span class="project-name">${i.name}</span>
          <span class="project-status ${i.id===s?"active":""}">${i.id===s?"Active Project":"Tap to delete"}</span>
        </div>
        <button class="delete-btn delete-project-from-list" data-project-id="${i.id}" title="Delete ${i.name}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
          </svg>
        </button>
      </div>
    `).join(""),this.bindDeleteListEvents()}bindDeleteListEvents(){document.querySelectorAll(".delete-project-from-list").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const i=t.currentTarget.dataset.projectId;i&&this.deleteProjectFromList(i)})})}deleteProjectFromList(e){const t=this.storage.getProjects();if(t.length<=1){this.showToast("Cannot delete the only project");return}const s=t.find(i=>i.id===e);if(s&&confirm(`Delete "${s.name}"? This cannot be undone.`)){const i=this.storage.getActiveProjectId()===e;this.storage.deleteProject(e),this.renderDeleteProjectList(),this.refreshProjectUI(),i&&(this.loadProjectCode(),this.updateLivePreview()),this.showToast(`Deleted "${s.name}"`)}}closeSearchPanel(){this.editors.forEach(e=>{const t=e.dom.querySelector('.cm-panel button[name="close"]');t&&t.click()})}refreshProjectUI(){const e=document.getElementById("projectList");e&&(e.innerHTML=this.renderProjectsList(),this.bindProjectListEvents());const t=this.storage.getActiveProject(),s=document.getElementById("currentProjectName");s&&t&&(s.textContent=t.name)}loadProjectCode(){const e=this.storage.getCode();this.editors.forEach(r=>r.destroy()),this.editors.clear();const t=this.settings.isDarkMode(),s=document.getElementById("htmlEditor"),i=document.getElementById("cssEditor"),o=document.getElementById("jsEditor");if(s){s.innerHTML="";const r=this.createEditor(e.html,"html",t,s);this.editors.set("html",r)}if(i){i.innerHTML="";const r=this.createEditor(e.css,"css",t,i);this.editors.set("css",r)}if(o){o.innerHTML="";const r=this.createEditor(e.js,"js",t,o);this.editors.set("js",r)}this.updateLivePreview()}updateLivePreview(){const e=this.editors.get("html")?.state.doc.toString()||"",t=this.editors.get("css")?.state.doc.toString()||"",s=this.editors.get("js")?.state.doc.toString()||"",i=`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${t}</style>
</head>
<body>
  ${e}
  <script>${s}<\/script>
</body>
</html>`,o=document.getElementById("livePreviewFrame");o&&(o.srcdoc=i)}switchTab(e){this.activeTab=e,document.querySelectorAll(".tab").forEach(s=>{s.classList.toggle("active",s.getAttribute("data-tab")===e)}),document.querySelectorAll(".editor-panel").forEach(s=>{const i=s.getAttribute("data-lang");s.classList.toggle("active",i===e)});const t=this.editors.get(e);t&&t.focus()}scheduleAutoSave(){this.autoSaveTimeout&&clearTimeout(this.autoSaveTimeout),this.updateSaveIndicator("saving"),this.autoSaveTimeout=window.setTimeout(()=>{this.saveCode()},1e3)}saveCode(){const e={html:this.editors.get("html")?.state.doc.toString()||"",css:this.editors.get("css")?.state.doc.toString()||"",js:this.editors.get("js")?.state.doc.toString()||""};this.storage.saveCode(e),this.updateSaveIndicator("saved")}updateSaveIndicator(e){const t=document.getElementById("saveIndicator");t&&(t.className=`save-indicator ${e}`,t.innerHTML=e==="saving"?`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
        </svg><span>Saving...</span>`:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg><span>Saved</span>`)}showPreview(){this.saveCode(),this.closeSearchPanel();const e=this.editors.get("html")?.state.doc.toString()||"",t=this.editors.get("css")?.state.doc.toString()||"",s=this.editors.get("js")?.state.doc.toString()||"",i=`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${t}</style>
</head>
<body>
  ${e}
  <script>${s}<\/script>
</body>
</html>`,o=document.getElementById("previewFrame");o&&(o.srcdoc=i),document.getElementById("previewContainer")?.classList.add("active")}hidePreview(){document.getElementById("previewContainer")?.classList.remove("active")}showSettings(){document.getElementById("settingsContainer")?.classList.add("active")}hideSettings(){document.getElementById("settingsContainer")?.classList.remove("active")}showPrivacy(){this.hideSettings(),document.getElementById("privacyPage")?.classList.add("active")}hidePrivacy(){document.getElementById("privacyPage")?.classList.remove("active")}showTerms(){this.hideSettings(),document.getElementById("termsPage")?.classList.add("active")}hideTerms(){document.getElementById("termsPage")?.classList.remove("active")}toggleDarkMode(){this.settings.toggleDarkMode(),this.applyTheme(),this.recreateEditors()}applyTheme(){const e=this.settings.isDarkMode();document.documentElement.setAttribute("data-theme",e?"dark":"light");const t=document.getElementById("darkModeToggle");t&&t.classList.toggle("active",e)}recreateEditors(){const e={html:this.editors.get("html")?.state.doc.toString()||"",css:this.editors.get("css")?.state.doc.toString()||"",js:this.editors.get("js")?.state.doc.toString()||""};this.editors.forEach(s=>s.destroy()),this.editors.clear();const t=this.settings.isDarkMode();["html","css","js"].forEach(s=>{const i=document.getElementById(`${s}Editor`);if(i){i.innerHTML="";const o=this.createEditor(e[s],s,t,i);this.editors.set(s,o)}})}updateOnlineStatus(){const e=document.getElementById("offlineIndicator");e&&e.classList.toggle("show",!this.isOnline)}openSearch(){const e=document.getElementById("customSearchBar"),t=document.getElementById("searchInput");e&&t&&(e.classList.add("active"),t.focus(),t.select())}closeSearch(){const e=document.getElementById("customSearchBar"),t=document.getElementById("searchInput");e&&e.classList.remove("active"),t&&(t.value=""),this.currentSearchQuery="",this.clearSearchHighlights()}handleSearchInput(e){this.currentSearchQuery=e;const t=this.editors.get(this.activeTab);if(t)if(e.trim()){const s=new E({search:e,caseSensitive:!1,regexp:!1,wholeWord:!1});t.dispatch({effects:P.of(s)})}else this.clearSearchHighlights()}searchNext(){const e=this.editors.get(this.activeTab);e&&this.currentSearchQuery.trim()&&J(e)}searchPrevious(){const e=this.editors.get(this.activeTab);e&&this.currentSearchQuery.trim()&&Q(e)}clearSearchHighlights(){const e=this.editors.get(this.activeTab);if(e){const t=new E({search:"",caseSensitive:!1,regexp:!1,wholeWord:!1});e.dispatch({effects:P.of(t)})}}showModal(e,t,s){const i=document.getElementById("projectModal"),o=document.getElementById("modalTitle"),r=document.getElementById("projectNameInput"),a=document.getElementById("modalConfirm");i&&o&&r&&a&&(o.textContent=e,r.value=t,a.textContent=s,i.classList.add("active"),setTimeout(()=>{r.focus(),r.select()},50))}closeModal(){const e=document.getElementById("projectModal");e&&e.classList.remove("active"),this.renameProjectId=null}confirmModal(){const t=document.getElementById("projectNameInput")?.value?.trim();if(!t){this.showToast("Please enter a project name");return}if(this.modalMode==="create"){this.saveCode();const s=this.storage.createProject(t);this.refreshProjectUI(),this.loadProjectCode(),this.showToast(`Created "${s.name}"`)}else if(this.modalMode==="rename"&&this.renameProjectId){const s=this.storage.getProjects().find(i=>i.id===this.renameProjectId);s&&t!==s.name&&(this.storage.renameProject(this.renameProjectId,t),this.refreshProjectUI(),this.showToast(`Renamed to "${t}"`))}this.closeModal()}handleFileUpload(e){const t=e.target,s=t.files?.[0];if(!s)return;const i=new FileReader;i.onload=o=>{const r=o.target?.result,a=s.name.split(".").pop()?.toLowerCase();let h="html";a==="css"?h="css":a==="js"&&(h="js"),this.switchTab(h);const d=this.editors.get(h);d&&d.dispatch({changes:{from:0,to:d.state.doc.length,insert:r}})},i.readAsText(s),t.value=""}downloadCurrentFile(){const e=this.editors.get(this.activeTab);if(!e)return;const t=e.state.doc.toString(),o=`code.${{html:"html",css:"css",js:"js"}[this.activeTab]||"txt"}`,r=new Blob([t],{type:"text/plain"}),a=URL.createObjectURL(r),h=document.createElement("a");h.href=a,h.download=o,h.click(),URL.revokeObjectURL(a)}async copyCurrentCode(){const e=this.editors.get(this.activeTab);if(!e)return;const t=e.state.doc.toString();try{await navigator.clipboard.writeText(t),this.showToast("Code copied!")}catch{this.showToast("Copy failed")}}async pasteToEditor(){const e=this.editors.get(this.activeTab);if(e)try{const t=await navigator.clipboard.readText(),s=e.state.selection.main.head;e.dispatch({changes:{from:s,insert:t}})}catch{this.showToast("Paste failed - check permissions")}}selectAllCode(){const e=this.editors.get(this.activeTab);e&&(e.dispatch({selection:{anchor:0,head:e.state.doc.length}}),e.focus())}insertSnippet(e){const t=this.editors.get(this.activeTab);if(!t)return;const s=t.state.selection.main.head;let i=e,o=e.length;e==="<>"?(i="<></>",o=1):e==="{}"?(i="{}",o=1):e==="()"?(i="()",o=1):e==='""'&&(i='""',o=1),t.dispatch({changes:{from:s,insert:i},selection:{anchor:s+o}}),t.focus()}showToast(e){const t=document.querySelector(".toast");t&&t.remove();const s=document.createElement("div");s.className="toast",s.textContent=e,document.body.appendChild(s),setTimeout(()=>{s.classList.add("show")},10),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),300)},2e3)}checkAndShowAds(){const e=localStorage.getItem("lastInterstitialAd"),t=localStorage.getItem("lastViewAd"),s=Date.now();(!e||s-parseInt(e)>=M)&&(this.showInterstitialAd(),localStorage.setItem("lastInterstitialAd",s.toString())),(!t||s-parseInt(t)>=N)&&localStorage.setItem("lastViewAd",s.toString())}setupAdIntervals(){setInterval(()=>{this.showInterstitialAd(),localStorage.setItem("lastInterstitialAd",Date.now().toString())},M),setInterval(()=>{localStorage.setItem("lastViewAd",Date.now().toString())},N)}showInterstitialAd(){if(this.showingInterstitial)return;this.showingInterstitial=!0;const e=document.getElementById("interstitialAd"),t=document.getElementById("closeAdBtn"),s=document.getElementById("adTimer");if(!e||!t||!s)return;e.classList.add("active"),t.disabled=!0;let i=5;s.textContent=`Close in ${i}s`;const o=setInterval(()=>{i--,i>0?s.textContent=`Close in ${i}s`:(clearInterval(o),s.textContent="You can close now",t.disabled=!1)},1e3)}hideInterstitialAd(){const e=document.getElementById("interstitialAd");e&&(e.classList.remove("active"),this.showingInterstitial=!1)}}const de="modulepreload",he=function(l,e){return new URL(l,e).href},H={},pe=function(e,t,s){let i=Promise.resolve();if(t&&t.length>0){const r=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),h=a?.nonce||a?.getAttribute("nonce");i=Promise.allSettled(t.map(d=>{if(d=he(d,s),d in H)return;H[d]=!0;const u=d.endsWith(".css"),c=u?'[rel="stylesheet"]':"";if(!!s)for(let v=r.length-1;v>=0;v--){const g=r[v];if(g.href===d&&(!u||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${c}`))return;const p=document.createElement("link");if(p.rel=u?"stylesheet":de,u||(p.as="script"),p.crossOrigin="",p.href=d,h&&p.setAttribute("nonce",h),document.head.appendChild(p),u)return new Promise((v,g)=>{p.addEventListener("load",v),p.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${d}`)))})}))}function o(r){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=r,window.dispatchEvent(a),!a.defaultPrevented)throw r}return i.then(r=>{for(const a of r||[])a.status==="rejected"&&o(a.reason);return e().catch(o)})};function ue(l={}){const{immediate:e=!1,onNeedRefresh:t,onOfflineReady:s,onRegistered:i,onRegisteredSW:o,onRegisterError:r}=l;let a,h;const d=async(c=!0)=>{await h};async function u(){if("serviceWorker"in navigator){if(a=await pe(async()=>{const{Workbox:c}=await import("./workbox-window.prod.es5-vqzQaGvo.js");return{Workbox:c}},[],import.meta.url).then(({Workbox:c})=>new c("./sw.js",{scope:"./",type:"classic"})).catch(c=>{r?.(c)}),!a)return;a.addEventListener("activated",c=>{(c.isUpdate||c.isExternal)&&window.location.reload()}),a.addEventListener("installed",c=>{c.isUpdate||s?.()}),a.register({immediate:e}).then(c=>{o?o("./sw.js",c):i?.(c)}).catch(c=>{r?.(c)})}}return h=u(),d}const ve=new le;ve.init();let j;const ge=()=>{const l=document.createElement("div");l.className="update-banner",l.innerHTML=`
    <div class="update-content">
      <span>New version available!</span>
      <button id="updateNowBtn">Update Now</button>
      <button id="updateLaterBtn">Later</button>
    </div>
  `,document.body.appendChild(l),document.getElementById("updateNowBtn")?.addEventListener("click",async()=>{l.remove(),j&&await j(!0)}),document.getElementById("updateLaterBtn")?.addEventListener("click",()=>{l.remove()})};j=ue({immediate:!0,onNeedRefresh(){ge()},onOfflineReady(){console.log("App ready to work offline")},onRegistered(l){l&&setInterval(()=>{l.update()},60*60*1e3)}});
