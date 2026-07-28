package com.iftechstudio.html_live_editor.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.iftechstudio.html_live_editor.data.*
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

class EditorViewModel(application: Application) : AndroidViewModel(application) {

    private val db = AppDatabase.getInstance(application)
    private val dao = db.projectDao()
    private val settings = SettingsRepository(application)

    // ── Settings ──────────────────────────────────────────────────────────
    val isDarkMode: StateFlow<Boolean> = settings.darkMode
        .stateIn(viewModelScope, SharingStarted.Eagerly, true)

    val fontSize: StateFlow<Int> = settings.fontSize
        .stateIn(viewModelScope, SharingStarted.Eagerly, 14)

    val wordWrap: StateFlow<Boolean> = settings.wordWrap
        .stateIn(viewModelScope, SharingStarted.Eagerly, true)

    // ── Projects ──────────────────────────────────────────────────────────
    val projects: StateFlow<List<Project>> = dao.getAllProjects()
        .stateIn(viewModelScope, SharingStarted.Eagerly, emptyList())

    private val _activeProjectId = MutableStateFlow("")
    val activeProjectId: StateFlow<String> = _activeProjectId.asStateFlow()

    val activeProject: StateFlow<Project?> = combine(projects, _activeProjectId) { list, id ->
        list.firstOrNull { it.id == id } ?: list.firstOrNull()
    }.stateIn(viewModelScope, SharingStarted.Eagerly, null)

    // ── Editor state ──────────────────────────────────────────────────────
    private val _activeTab = MutableStateFlow("html")
    val activeTab: StateFlow<String> = _activeTab.asStateFlow()

    private val _htmlCode = MutableStateFlow(DEFAULT_HTML)
    val htmlCode: StateFlow<String> = _htmlCode.asStateFlow()

    private val _cssCode = MutableStateFlow(DEFAULT_CSS)
    val cssCode: StateFlow<String> = _cssCode.asStateFlow()

    private val _jsCode = MutableStateFlow(DEFAULT_JS)
    val jsCode: StateFlow<String> = _jsCode.asStateFlow()

    // ── UI state ──────────────────────────────────────────────────────────
    private val _isSaved = MutableStateFlow(true)
    val isSaved: StateFlow<Boolean> = _isSaved.asStateFlow()

    private val _showFindBar = MutableStateFlow(false)
    val showFindBar: StateFlow<Boolean> = _showFindBar.asStateFlow()

    private val _findQuery = MutableStateFlow("")
    val findQuery: StateFlow<String> = _findQuery.asStateFlow()

    private var saveJob: Job? = null
    private var projectLoaded = false

    init {
        viewModelScope.launch {
            // Wait for projects to load, then activate the saved project
            val savedId = settings.activeProjectId.first()
            projects.filter { it.isNotEmpty() }.first().let { list ->
                val target = list.firstOrNull { it.id == savedId } ?: list.first()
                loadProject(target)
            }
        }
    }

    // ── Project operations ────────────────────────────────────────────────

    fun switchProject(project: Project) {
        viewModelScope.launch {
            saveCurrentProject(immediate = true)
            loadProject(project)
        }
    }

    fun createProject(name: String) {
        viewModelScope.launch {
            saveCurrentProject(immediate = true)
            val p = Project(name = name.ifBlank { "New Project" })
            dao.insert(p)
            loadProject(p)
        }
    }

    fun renameProject(project: Project, newName: String) {
        viewModelScope.launch {
            dao.update(project.copy(name = newName, updatedAt = System.currentTimeMillis()))
        }
    }

    fun deleteProject(project: Project) {
        viewModelScope.launch {
            val list = projects.value
            if (list.size <= 1) {
                // Replace with fresh project
                val fresh = Project(name = "Project 1")
                dao.insert(fresh)
                loadProject(fresh)
            } else {
                val next = list.firstOrNull { it.id != project.id }!!
                if (project.id == _activeProjectId.value) loadProject(next)
            }
            dao.delete(project)
        }
    }

    private fun loadProject(project: Project) {
        _activeProjectId.value = project.id
        _htmlCode.value = project.htmlCode
        _cssCode.value = project.cssCode
        _jsCode.value = project.jsCode
        _isSaved.value = true
        viewModelScope.launch { settings.setActiveProjectId(project.id) }
    }

    // ── Code editing ──────────────────────────────────────────────────────

    fun onCodeChange(lang: String, code: String) {
        when (lang) {
            "html" -> _htmlCode.value = code
            "css"  -> _cssCode.value = code
            "js"   -> _jsCode.value = code
        }
        _isSaved.value = false
        scheduleAutoSave()
    }

    private fun scheduleAutoSave() {
        saveJob?.cancel()
        saveJob = viewModelScope.launch {
            delay(1000)
            saveCurrentProject()
        }
    }

    suspend fun saveCurrentProject(immediate: Boolean = false) {
        if (immediate) saveJob?.cancelAndJoin()
        val id = _activeProjectId.value.ifEmpty { return }
        val existing = dao.getById(id) ?: return
        dao.update(
            existing.copy(
                htmlCode = _htmlCode.value,
                cssCode = _cssCode.value,
                jsCode = _jsCode.value,
                updatedAt = System.currentTimeMillis()
            )
        )
        _isSaved.value = true
    }

    fun setActiveTab(tab: String) { _activeTab.value = tab }

    // ── Find/Replace ──────────────────────────────────────────────────────

    fun openFindBar() { _showFindBar.value = true }
    fun closeFindBar() { _showFindBar.value = false; _findQuery.value = "" }
    fun setFindQuery(q: String) { _findQuery.value = q }

    // ── Settings mutations ────────────────────────────────────────────────

    fun toggleDarkMode() {
        viewModelScope.launch { settings.setDarkMode(!isDarkMode.value) }
    }

    fun changeFontSize(delta: Int) {
        viewModelScope.launch { settings.setFontSize(fontSize.value + delta) }
    }

    fun toggleWordWrap() {
        viewModelScope.launch { settings.setWordWrap(!wordWrap.value) }
    }

    // ── Live preview content ──────────────────────────────────────────────

    fun buildPreviewHtml(): String {
        return """<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${_cssCode.value}</style>
</head>
<body>
  ${_htmlCode.value}
  <script>${_jsCode.value}<\/script>
</body>
</html>"""
    }
}
