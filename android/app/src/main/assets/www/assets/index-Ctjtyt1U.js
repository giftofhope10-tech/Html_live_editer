import{E as p,s as D,H as M,t as n,b as H,h as U,k as N,a as O,c as $,d as W,j as F,e as _,o as R}from"./codemirror-DnsGJnnT.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();const V="#e5c07b",y="#e06c75",q="#56b6c2",Y="#ffffff",g="#abb2bf",f="#7d8799",J="#61afef",K="#98c379",w="#d19a66",z="#c678dd",G="#21252b",b="#2c313a",j="#282c34",u="#353a42",Q="#3E4451",E="#528bff",X=p.theme({"&":{color:g,backgroundColor:j},".cm-content":{caretColor:E},".cm-cursor, .cm-dropCursor":{borderLeftColor:E},"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":{backgroundColor:Q},".cm-panels":{backgroundColor:G,color:g},".cm-panels.cm-panels-top":{borderBottom:"2px solid black"},".cm-panels.cm-panels-bottom":{borderTop:"2px solid black"},".cm-searchMatch":{backgroundColor:"#72a1ff59",outline:"1px solid #457dff"},".cm-searchMatch.cm-searchMatch-selected":{backgroundColor:"#6199ff2f"},".cm-activeLine":{backgroundColor:"#6699ff0b"},".cm-selectionMatch":{backgroundColor:"#aafe661a"},"&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bad0f847"},".cm-gutters":{backgroundColor:j,color:f,border:"none"},".cm-activeLineGutter":{backgroundColor:b},".cm-foldPlaceholder":{backgroundColor:"transparent",border:"none",color:"#ddd"},".cm-tooltip":{border:"none",backgroundColor:u},".cm-tooltip .cm-tooltip-arrow:before":{borderTopColor:"transparent",borderBottomColor:"transparent"},".cm-tooltip .cm-tooltip-arrow:after":{borderTopColor:u,borderBottomColor:u},".cm-tooltip-autocomplete":{"& > ul > li[aria-selected]":{backgroundColor:b,color:g}}},{dark:!0}),Z=M.define([{tag:n.keyword,color:z},{tag:[n.name,n.deleted,n.character,n.propertyName,n.macroName],color:y},{tag:[n.function(n.variableName),n.labelName],color:J},{tag:[n.color,n.constant(n.name),n.standard(n.name)],color:w},{tag:[n.definition(n.name),n.separator],color:g},{tag:[n.typeName,n.className,n.number,n.changed,n.annotation,n.modifier,n.self,n.namespace],color:V},{tag:[n.operator,n.operatorKeyword,n.url,n.escape,n.regexp,n.link,n.special(n.string)],color:q},{tag:[n.meta,n.comment],color:f},{tag:n.strong,fontWeight:"bold"},{tag:n.emphasis,fontStyle:"italic"},{tag:n.strikethrough,textDecoration:"line-through"},{tag:n.link,color:f,textDecoration:"underline"},{tag:n.heading,fontWeight:"bold",color:y},{tag:[n.atom,n.bool,n.special(n.variableName)],color:w},{tag:[n.processingInstruction,n.string,n.inserted],color:K},{tag:n.invalid,color:Y}]),ee=[X,D(Z)],P=`<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>Start editing to see the magic happen.</p>
</body>
</html>`,k=`body {
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
}`,S=`// Write your JavaScript here
console.log('Hello from JavaScript!');

// Example: Add interactivity
document.querySelector('h1')?.addEventListener('click', function() {
  this.style.color = '#' + Math.floor(Math.random()*16777215).toString(16);
});`,m="html_editor_projects",I="html_editor_code";class te{projectsData;constructor(){this.projectsData=this.loadProjects()}generateId(){return"proj_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}getDefaultCode(){return{html:P,css:k,js:S}}loadProjects(){try{const t=localStorage.getItem(m);if(t)return JSON.parse(t);const s=localStorage.getItem(I);if(s){const i=JSON.parse(s),o={id:this.generateId(),name:"Project 1",code:{html:i.html||P,css:i.css||k,js:i.js||S},createdAt:Date.now(),updatedAt:Date.now()};return{activeProjectId:o.id,projects:[o]}}}catch(t){console.error("Error loading projects:",t)}const e={id:this.generateId(),name:"Project 1",code:this.getDefaultCode(),createdAt:Date.now(),updatedAt:Date.now()};return{activeProjectId:e.id,projects:[e]}}saveProjects(){try{localStorage.setItem(m,JSON.stringify(this.projectsData))}catch(e){console.error("Error saving projects:",e)}}getProjects(){return this.projectsData.projects}getActiveProject(){return this.projectsData.projects.find(e=>e.id===this.projectsData.activeProjectId)}getActiveProjectId(){return this.projectsData.activeProjectId}setActiveProject(e){this.projectsData.projects.some(t=>t.id===e)&&(this.projectsData.activeProjectId=e,this.saveProjects())}createProject(e){const t=this.projectsData.projects.length+1,s={id:this.generateId(),name:e||`Project ${t}`,code:this.getDefaultCode(),createdAt:Date.now(),updatedAt:Date.now()};return this.projectsData.projects.push(s),this.projectsData.activeProjectId=s.id,this.saveProjects(),s}deleteProject(e){if(this.projectsData.projects.length<=1)return!1;const t=this.projectsData.projects.findIndex(s=>s.id===e);return t===-1?!1:(this.projectsData.projects.splice(t,1),this.projectsData.activeProjectId===e&&(this.projectsData.activeProjectId=this.projectsData.projects[0].id),this.saveProjects(),!0)}renameProject(e,t){const s=this.projectsData.projects.find(i=>i.id===e);return s?(s.name=t,s.updatedAt=Date.now(),this.saveProjects(),!0):!1}getCode(){const e=this.getActiveProject();return e?e.code:this.getDefaultCode()}saveCode(e){const t=this.getActiveProject();t&&(t.code=e,t.updatedAt=Date.now(),this.saveProjects())}clearCode(){const e=this.getActiveProject();e&&(e.code=this.getDefaultCode(),e.updatedAt=Date.now(),this.saveProjects())}clearAllData(){try{localStorage.removeItem(m),localStorage.removeItem(I),this.projectsData=this.loadProjects()}catch(e){console.error("Error clearing data:",e)}}}const L="html_editor_settings";class se{settings;constructor(){this.settings=this.loadSettings()}loadSettings(){try{const e=localStorage.getItem(L);if(e)return JSON.parse(e)}catch(e){console.error("Error loading settings:",e)}return{darkMode:!0}}saveSettings(){try{localStorage.setItem(L,JSON.stringify(this.settings))}catch(e){console.error("Error saving settings:",e)}}isDarkMode(){return this.settings.darkMode}toggleDarkMode(){return this.settings.darkMode=!this.settings.darkMode,this.saveSettings(),this.settings.darkMode}renderSettingsPage(){return`
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
            <div class="settings-item">
              <div class="settings-item-info">
                <div class="settings-item-title">Delete Current Project</div>
                <div class="settings-item-desc">Permanently delete the active project</div>
              </div>
              <button class="icon-btn delete-btn" id="deleteProjectBtn" aria-label="Delete project">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                </svg>
              </button>
            </div>
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
                <div class="settings-item-title">HTML Live Editor</div>
                <div class="settings-item-desc">Version 1.0.0</div>
              </div>
            </div>
          </div>

          <div class="version-info">
            Made with care for developers everywhere
          </div>
        </div>
      </div>
    `}}const C=2*60*60*1e3,B=3*60*60*1e3;class ie{storage;settings;editors=new Map;activeTab="html";autoSaveTimeout=null;isOnline=navigator.onLine;showingInterstitial=!1;constructor(){this.storage=new te,this.settings=new se}init(){this.render(),this.initEditors(),this.bindEvents(),this.updateOnlineStatus(),this.applyTheme(),this.checkAndShowAds(),this.setupAdIntervals()}renderProjectsList(){const e=this.storage.getProjects(),t=this.storage.getActiveProjectId();return e.map(s=>`
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16,18 22,12 16,6"></polyline>
              <polyline points="8,6 2,12 8,18"></polyline>
            </svg>
            <span class="logo-text">HTML Editor</span>
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
    `}initEditors(){const e=this.storage.getCode(),t=this.settings.isDarkMode(),s=document.getElementById("htmlEditor"),i=document.getElementById("cssEditor"),o=document.getElementById("jsEditor");if(s){const r=this.createEditor(e.html,"html",t,s);this.editors.set("html",r)}if(i){const r=this.createEditor(e.css,"css",t,i);this.editors.set("css",r)}if(o){const r=this.createEditor(e.js,"js",t,o);this.editors.set("js",r)}}createEditor(e,t,s,i){const o=[H,p.lineWrapping,U(),N.of(O),p.updateListener.of(r=>{r.docChanged&&this.scheduleAutoSave()})];return t==="html"?o.push($()):t==="css"?o.push(W()):t==="js"&&o.push(F()),s&&o.push(ee),new p({parent:i,state:_.create({doc:e,extensions:o})})}bindEvents(){document.querySelectorAll(".tab").forEach(e=>{e.addEventListener("click",t=>{const i=t.currentTarget.dataset.tab;i&&this.switchTab(i)})}),document.querySelectorAll(".file-item").forEach(e=>{e.addEventListener("click",t=>{const s=t.currentTarget,i=s.dataset.tab;i&&this.switchTab(i),document.querySelectorAll(".file-item").forEach(o=>o.classList.remove("active")),s.classList.add("active")})}),document.getElementById("projectSelectorBtn")?.addEventListener("click",e=>{e.stopPropagation(),document.getElementById("projectSelector")?.classList.toggle("open")}),document.addEventListener("click",e=>{const t=document.getElementById("projectSelector");t&&!t.contains(e.target)&&t.classList.remove("open")}),document.getElementById("newProjectBtn")?.addEventListener("click",e=>{e.stopPropagation(),this.createNewProject()}),this.bindProjectListEvents(),document.getElementById("runBtn")?.addEventListener("click",()=>{this.showPreview(),this.updateLivePreview()}),document.getElementById("refreshPreview")?.addEventListener("click",()=>{this.updateLivePreview()}),document.getElementById("closePreview")?.addEventListener("click",()=>{this.hidePreview()}),document.getElementById("settingsBtn")?.addEventListener("click",()=>{this.showSettings()}),document.getElementById("closeSettings")?.addEventListener("click",()=>{this.hideSettings()}),document.getElementById("darkModeToggle")?.addEventListener("click",()=>{this.toggleDarkMode()}),document.getElementById("privacyLink")?.addEventListener("click",()=>{this.showPrivacy()}),document.getElementById("termsLink")?.addEventListener("click",()=>{this.showTerms()}),document.getElementById("closePrivacy")?.addEventListener("click",()=>{this.hidePrivacy()}),document.getElementById("closeTerms")?.addEventListener("click",()=>{this.hideTerms()}),document.getElementById("deleteProjectBtn")?.addEventListener("click",()=>{this.deleteCurrentProjectFromSettings()}),window.addEventListener("online",()=>{this.isOnline=!0,this.updateOnlineStatus()}),window.addEventListener("offline",()=>{this.isOnline=!1,this.updateOnlineStatus()}),document.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="s"&&(e.preventDefault(),this.saveCode()),(e.ctrlKey||e.metaKey)&&e.key==="Enter"&&(e.preventDefault(),this.showPreview()),(e.ctrlKey||e.metaKey)&&e.key==="f"&&(e.preventDefault(),this.openSearch())}),document.getElementById("uploadBtn")?.addEventListener("click",()=>{document.getElementById("fileInput")?.click()}),document.getElementById("sidebarUpload")?.addEventListener("click",()=>{document.getElementById("fileInput")?.click()}),document.getElementById("fileInput")?.addEventListener("change",e=>{this.handleFileUpload(e)}),document.getElementById("downloadBtn")?.addEventListener("click",()=>{this.downloadCurrentFile()}),document.getElementById("sidebarDownload")?.addEventListener("click",()=>{this.downloadCurrentFile()}),document.getElementById("searchBtn")?.addEventListener("click",()=>{this.openSearch()}),document.getElementById("copyBtn")?.addEventListener("click",()=>{this.copyCurrentCode()}),document.getElementById("pasteBtn")?.addEventListener("click",()=>{this.pasteToEditor()}),document.getElementById("selectAllBtn")?.addEventListener("click",()=>{this.selectAllCode()}),document.querySelectorAll(".snippet-btn").forEach(e=>{e.addEventListener("click",t=>{const i=t.currentTarget.dataset.snippet;i&&this.insertSnippet(i)})}),document.getElementById("closeAdBtn")?.addEventListener("click",()=>{this.hideInterstitialAd()}),this.updateLivePreview()}bindProjectListEvents(){document.querySelectorAll(".project-item").forEach(e=>{e.addEventListener("click",t=>{const i=t.currentTarget.dataset.projectId;i&&!t.target.closest(".project-action-btn")&&this.switchProject(i)})}),document.querySelectorAll(".rename-project").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const i=t.currentTarget.dataset.projectId;i&&this.renameProject(i)})}),document.querySelectorAll(".delete-project").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const i=t.currentTarget.dataset.projectId;i&&this.deleteProject(i)})})}createNewProject(){const e=prompt("Enter project name (you can use extensions like .html, .css, .js, .ts):",`Project ${this.storage.getProjects().length+1}`);if(e&&e.trim()){this.saveCode();const t=this.storage.createProject(e.trim());this.refreshProjectUI(),this.loadProjectCode(),this.showToast(`Created "${t.name}"`)}}switchProject(e){this.saveCode(),this.storage.setActiveProject(e),this.refreshProjectUI(),this.loadProjectCode(),document.getElementById("projectSelector")?.classList.remove("open")}renameProject(e){const t=this.storage.getProjects().find(i=>i.id===e);if(!t)return;const s=prompt("Enter new project name (you can use extensions like .html, .css, .js, .ts):",t.name);if(s&&s.trim()&&s!==t.name){const i=s.trim();this.storage.renameProject(e,i),this.refreshProjectUI(),this.showToast(`Renamed to "${i}"`)}}deleteProject(e){const t=this.storage.getProjects();if(t.length<=1){this.showToast("Cannot delete the only project");return}const s=t.find(i=>i.id===e);s&&confirm(`Delete "${s.name}"? This cannot be undone.`)&&(this.storage.deleteProject(e),this.refreshProjectUI(),this.loadProjectCode(),this.showToast(`Deleted "${s.name}"`))}deleteCurrentProjectFromSettings(){const e=this.storage.getActiveProject();if(!e)return;if(this.storage.getProjects().length<=1){this.showToast("Cannot delete the only project. Create a new project first.");return}const s=e.name;confirm(`Delete "${s}"? This action cannot be undone.`)&&(this.storage.deleteProject(e.id)?(this.hideSettings(),this.refreshProjectUI(),this.loadProjectCode(),this.updateLivePreview(),this.showToast(`Deleted "${s}"`)):this.showToast("Failed to delete project"))}refreshProjectUI(){const e=document.getElementById("projectList");e&&(e.innerHTML=this.renderProjectsList(),this.bindProjectListEvents());const t=this.storage.getActiveProject(),s=document.getElementById("currentProjectName");s&&t&&(s.textContent=t.name)}loadProjectCode(){const e=this.storage.getCode();this.editors.forEach(r=>r.destroy()),this.editors.clear();const t=this.settings.isDarkMode(),s=document.getElementById("htmlEditor"),i=document.getElementById("cssEditor"),o=document.getElementById("jsEditor");if(s){s.innerHTML="";const r=this.createEditor(e.html,"html",t,s);this.editors.set("html",r)}if(i){i.innerHTML="";const r=this.createEditor(e.css,"css",t,i);this.editors.set("css",r)}if(o){o.innerHTML="";const r=this.createEditor(e.js,"js",t,o);this.editors.set("js",r)}this.updateLivePreview()}updateLivePreview(){const e=this.editors.get("html")?.state.doc.toString()||"",t=this.editors.get("css")?.state.doc.toString()||"",s=this.editors.get("js")?.state.doc.toString()||"",i=`
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
        </svg><span>Saved</span>`)}showPreview(){this.saveCode();const e=this.editors.get("html")?.state.doc.toString()||"",t=this.editors.get("css")?.state.doc.toString()||"",s=this.editors.get("js")?.state.doc.toString()||"",i=`
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
</html>`,o=document.getElementById("previewFrame");o&&(o.srcdoc=i),document.getElementById("previewContainer")?.classList.add("active")}hidePreview(){document.getElementById("previewContainer")?.classList.remove("active")}showSettings(){document.getElementById("settingsContainer")?.classList.add("active")}hideSettings(){document.getElementById("settingsContainer")?.classList.remove("active")}showPrivacy(){this.hideSettings(),document.getElementById("privacyPage")?.classList.add("active")}hidePrivacy(){document.getElementById("privacyPage")?.classList.remove("active")}showTerms(){this.hideSettings(),document.getElementById("termsPage")?.classList.add("active")}hideTerms(){document.getElementById("termsPage")?.classList.remove("active")}toggleDarkMode(){this.settings.toggleDarkMode(),this.applyTheme(),this.recreateEditors()}applyTheme(){const e=this.settings.isDarkMode();document.documentElement.setAttribute("data-theme",e?"dark":"light");const t=document.getElementById("darkModeToggle");t&&t.classList.toggle("active",e)}recreateEditors(){const e={html:this.editors.get("html")?.state.doc.toString()||"",css:this.editors.get("css")?.state.doc.toString()||"",js:this.editors.get("js")?.state.doc.toString()||""};this.editors.forEach(s=>s.destroy()),this.editors.clear();const t=this.settings.isDarkMode();["html","css","js"].forEach(s=>{const i=document.getElementById(`${s}Editor`);if(i){i.innerHTML="";const o=this.createEditor(e[s],s,t,i);this.editors.set(s,o)}})}updateOnlineStatus(){const e=document.getElementById("offlineIndicator");e&&e.classList.toggle("show",!this.isOnline)}openSearch(){const e=this.editors.get(this.activeTab);e&&R(e)}handleFileUpload(e){const t=e.target,s=t.files?.[0];if(!s)return;const i=new FileReader;i.onload=o=>{const r=o.target?.result,c=s.name.split(".").pop()?.toLowerCase();let l="html";c==="css"?l="css":c==="js"&&(l="js"),this.switchTab(l);const d=this.editors.get(l);d&&d.dispatch({changes:{from:0,to:d.state.doc.length,insert:r}})},i.readAsText(s),t.value=""}downloadCurrentFile(){const e=this.editors.get(this.activeTab);if(!e)return;const t=e.state.doc.toString(),o=`code.${{html:"html",css:"css",js:"js"}[this.activeTab]||"txt"}`,r=new Blob([t],{type:"text/plain"}),c=URL.createObjectURL(r),l=document.createElement("a");l.href=c,l.download=o,l.click(),URL.revokeObjectURL(c)}async copyCurrentCode(){const e=this.editors.get(this.activeTab);if(!e)return;const t=e.state.doc.toString();try{await navigator.clipboard.writeText(t),this.showToast("Code copied!")}catch{this.showToast("Copy failed")}}async pasteToEditor(){const e=this.editors.get(this.activeTab);if(e)try{const t=await navigator.clipboard.readText(),s=e.state.selection.main.head;e.dispatch({changes:{from:s,insert:t}})}catch{this.showToast("Paste failed - check permissions")}}selectAllCode(){const e=this.editors.get(this.activeTab);e&&(e.dispatch({selection:{anchor:0,head:e.state.doc.length}}),e.focus())}insertSnippet(e){const t=this.editors.get(this.activeTab);if(!t)return;const s=t.state.selection.main.head;let i=e,o=e.length;e==="<>"?(i="<></>",o=1):e==="{}"?(i="{}",o=1):e==="()"?(i="()",o=1):e==='""'&&(i='""',o=1),t.dispatch({changes:{from:s,insert:i},selection:{anchor:s+o}}),t.focus()}showToast(e){const t=document.querySelector(".toast");t&&t.remove();const s=document.createElement("div");s.className="toast",s.textContent=e,document.body.appendChild(s),setTimeout(()=>{s.classList.add("show")},10),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),300)},2e3)}checkAndShowAds(){const e=localStorage.getItem("lastInterstitialAd"),t=localStorage.getItem("lastViewAd"),s=Date.now();(!e||s-parseInt(e)>=C)&&(this.showInterstitialAd(),localStorage.setItem("lastInterstitialAd",s.toString())),(!t||s-parseInt(t)>=B)&&localStorage.setItem("lastViewAd",s.toString())}setupAdIntervals(){setInterval(()=>{this.showInterstitialAd(),localStorage.setItem("lastInterstitialAd",Date.now().toString())},C),setInterval(()=>{localStorage.setItem("lastViewAd",Date.now().toString())},B)}showInterstitialAd(){if(this.showingInterstitial)return;this.showingInterstitial=!0;const e=document.getElementById("interstitialAd"),t=document.getElementById("closeAdBtn"),s=document.getElementById("adTimer");if(!e||!t||!s)return;e.classList.add("active"),t.disabled=!0;let i=5;s.textContent=`Close in ${i}s`;const o=setInterval(()=>{i--,i>0?s.textContent=`Close in ${i}s`:(clearInterval(o),s.textContent="You can close now",t.disabled=!1)},1e3)}hideInterstitialAd(){const e=document.getElementById("interstitialAd");e&&(e.classList.remove("active"),this.showingInterstitial=!1)}}const oe="modulepreload",ne=function(h){return"/"+h},T={},re=function(e,t,s){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),c=r?.nonce||r?.getAttribute("nonce");i=Promise.allSettled(t.map(l=>{if(l=ne(l),l in T)return;T[l]=!0;const d=l.endsWith(".css"),v=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${v}`))return;const a=document.createElement("link");if(a.rel=d?"stylesheet":oe,d||(a.as="script"),a.crossOrigin="",a.href=l,c&&a.setAttribute("nonce",c),document.head.appendChild(a),d)return new Promise((x,A)=>{a.addEventListener("load",x),a.addEventListener("error",()=>A(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(r){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=r,window.dispatchEvent(c),!c.defaultPrevented)throw r}return i.then(r=>{for(const c of r||[])c.status==="rejected"&&o(c.reason);return e().catch(o)})};function ae(h={}){const{immediate:e=!1,onNeedRefresh:t,onOfflineReady:s,onRegistered:i,onRegisteredSW:o,onRegisterError:r}=h;let c,l;const d=async(a=!0)=>{await l};async function v(){if("serviceWorker"in navigator){if(c=await re(async()=>{const{Workbox:a}=await import("./workbox-window.prod.es5-vqzQaGvo.js");return{Workbox:a}},[]).then(({Workbox:a})=>new a("/sw.js",{scope:"/",type:"classic"})).catch(a=>{r?.(a)}),!c)return;c.addEventListener("activated",a=>{(a.isUpdate||a.isExternal)&&window.location.reload()}),c.addEventListener("installed",a=>{a.isUpdate||s?.()}),c.register({immediate:e}).then(a=>{o?o("/sw.js",a):i?.(a)}).catch(a=>{r?.(a)})}}return l=v(),d}const ce=new ie;ce.init();const le=ae({onNeedRefresh(){confirm("New version available. Update now?")&&le(!0)},onOfflineReady(){console.log("App ready to work offline")}});
