package com.iftechstudio.html_live_editor.ui

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Environment
import android.provider.MediaStore
import android.content.ContentValues
import android.os.Build
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.iftechstudio.html_live_editor.viewmodel.EditorViewModel
import io.github.rosemoe.sora.widget.CodeEditor
import kotlinx.coroutines.launch

private val SNIPPETS = listOf("<>", "{}", "()", "\"\"", "[]", ";", "=", "=>", "//", "/**/")

@Composable
fun EditorScreen(
    viewModel: EditorViewModel,
    onOpenPreview: () -> Unit,
    onOpenSettings: () -> Unit
) {
    val activeTab     by viewModel.activeTab.collectAsStateWithLifecycle()
    val htmlCode      by viewModel.htmlCode.collectAsStateWithLifecycle()
    val cssCode       by viewModel.cssCode.collectAsStateWithLifecycle()
    val jsCode        by viewModel.jsCode.collectAsStateWithLifecycle()
    val isDark        by viewModel.isDarkMode.collectAsStateWithLifecycle()
    val fontSize      by viewModel.fontSize.collectAsStateWithLifecycle()
    val wordWrap      by viewModel.wordWrap.collectAsStateWithLifecycle()
    val isSaved       by viewModel.isSaved.collectAsStateWithLifecycle()
    val showFind      by viewModel.showFindBar.collectAsStateWithLifecycle()
    val findQuery     by viewModel.findQuery.collectAsStateWithLifecycle()
    val activeProject by viewModel.activeProject.collectAsStateWithLifecycle()

    val scope   = rememberCoroutineScope()
    val context = LocalContext.current

    // Keep a reference to the active CodeEditor so we can drive find/replace
    var editorRef by remember { mutableStateOf<CodeEditor?>(null) }

    // File picker for upload
    val filePicker = rememberLauncherForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri ?: return@rememberLauncherForActivityResult
        try {
            val text = context.contentResolver.openInputStream(uri)
                ?.bufferedReader()?.readText() ?: return@rememberLauncherForActivityResult
            val ext  = context.contentResolver.getType(uri)?.substringAfterLast('/') ?: ""
            val lang = when {
                ext.contains("html") || ext.contains("htm") -> "html"
                ext.contains("css")                         -> "css"
                ext.contains("javascript") || ext.contains("js") -> "js"
                else -> activeTab
            }
            viewModel.onCodeChange(lang, text)
            if (lang != activeTab) viewModel.setActiveTab(lang)
        } catch (e: Exception) {
            Toast.makeText(context, "Upload failed", Toast.LENGTH_SHORT).show()
        }
    }

    Column(modifier = Modifier.fillMaxSize()) {

        // ── Top bar ──────────────────────────────────────────────────────
        EditorTopBar(
            projectName = activeProject?.name ?: "Project",
            isSaved = isSaved,
            onPreview = onOpenPreview,
            onSettings = onOpenSettings,
            onUpload = { filePicker.launch("*/*") },
            onDownload = { downloadCode(context, activeTab, htmlCode, cssCode, jsCode, activeProject?.name) }
        )

        // ── Tab row ──────────────────────────────────────────────────────
        EditorTabRow(activeTab = activeTab, onTabSelected = { viewModel.setActiveTab(it) })

        // ── Editor (fills remaining space) ───────────────────────────────
        Box(modifier = Modifier.weight(1f)) {
            when (activeTab) {
                "html" -> SoraCodeEditor(
                    code = htmlCode, language = "html",
                    isDark = isDark, fontSize = fontSize, wordWrap = wordWrap,
                    onCodeChange = { viewModel.onCodeChange("html", it) },
                    onEditorCreated = { editorRef = it },
                    modifier = Modifier.fillMaxSize()
                )
                "css" -> SoraCodeEditor(
                    code = cssCode, language = "css",
                    isDark = isDark, fontSize = fontSize, wordWrap = wordWrap,
                    onCodeChange = { viewModel.onCodeChange("css", it) },
                    onEditorCreated = { editorRef = it },
                    modifier = Modifier.fillMaxSize()
                )
                "js" -> SoraCodeEditor(
                    code = jsCode, language = "js",
                    isDark = isDark, fontSize = fontSize, wordWrap = wordWrap,
                    onCodeChange = { viewModel.onCodeChange("js", it) },
                    onEditorCreated = { editorRef = it },
                    modifier = Modifier.fillMaxSize()
                )
            }

            // Find bar overlay — inner Box breaks the outer ColumnScope so
            // the top-level AnimatedVisibility overload is resolved correctly.
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
            ) {
                androidx.compose.animation.AnimatedVisibility(
                    visible = showFind,
                    enter = slideInVertically { it },
                    exit  = slideOutVertically { it }
                ) {
                    FindBar(
                        query = findQuery,
                        onQueryChange = { viewModel.setFindQuery(it) },
                        onNext  = { editorRef?.searcher?.gotoNext() },
                        onPrev  = { editorRef?.searcher?.gotoNext() }, // gotoPrev not in API
                        onClose = {
                            editorRef?.searcher?.stopSearch()
                            viewModel.closeFindBar()
                        }
                    )
                }
            }
        }

        // Sync search text to editor searcher when query or visibility changes
        LaunchedEffect(findQuery, showFind) {
            val ed = editorRef ?: return@LaunchedEffect
            if (showFind && findQuery.isNotEmpty()) {
                try {
                    // SearchOptions constructor: (caseSensitive, useRegex)
                    val optClass = Class.forName(
                        "io.github.rosemoe.sora.widget.component.EditorSearcher\$SearchOptions"
                    )
                    val opts = optClass
                        .getDeclaredConstructor(Boolean::class.java, Boolean::class.java)
                        .newInstance(false, false)
                    ed.searcher.javaClass
                        .getMethod("search", String::class.java, optClass)
                        .invoke(ed.searcher, findQuery, opts)
                } catch (_: Exception) {
                    // searcher API unavailable — navigation still works via gotoNext
                }
            } else if (!showFind) {
                try { ed.searcher.stopSearch() } catch (_: Exception) {}
            }
        }

        // ── Snippets toolbar ─────────────────────────────────────────────
        SnippetsToolbar(
            isDark = isDark,
            onSnippet = { snippet ->
                editorRef?.let { ed ->
                    val cursor = ed.cursor
                    ed.text.insert(cursor.leftLine, cursor.leftColumn, snippet)
                }
            }
        )

        // ── Status bar ───────────────────────────────────────────────────
        StatusBar(
            activeTab = activeTab,
            fontSize = fontSize,
            editor = editorRef
        )
    }
}

// ── Sub-composables ───────────────────────────────────────────────────────────

@Composable
private fun EditorTopBar(
    projectName: String,
    isSaved: Boolean,
    onPreview: () -> Unit,
    onSettings: () -> Unit,
    onUpload: () -> Unit,
    onDownload: () -> Unit
) {
    val colors = MaterialTheme.colorScheme
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(colors.surface)
            .padding(horizontal = 12.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // App logo text
        Text(
            text = "Html Live Editor",
            style = MaterialTheme.typography.titleMedium,
            color = colors.primary,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.weight(1f)
        )
        // Saved indicator
        if (isSaved) {
            Icon(
                Icons.Default.Check,
                contentDescription = "Saved",
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(16.dp)
            )
            Spacer(Modifier.width(4.dp))
        }
        // Upload
        IconButton(onClick = onUpload, modifier = Modifier.size(36.dp)) {
            Icon(Icons.Default.Upload, "Upload", tint = colors.onSurface)
        }
        // Download
        IconButton(onClick = onDownload, modifier = Modifier.size(36.dp)) {
            Icon(Icons.Default.Download, "Download", tint = colors.onSurface)
        }
        // Preview button
        Button(
            onClick = onPreview,
            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
            modifier = Modifier.height(32.dp)
        ) {
            Icon(Icons.Default.PlayArrow, "Preview", modifier = Modifier.size(16.dp))
            Spacer(Modifier.width(4.dp))
            Text("Preview", fontSize = 13.sp)
        }
        Spacer(Modifier.width(4.dp))
        // Settings
        IconButton(onClick = onSettings, modifier = Modifier.size(36.dp)) {
            Icon(Icons.Default.Settings, "Settings", tint = colors.onSurface)
        }
    }
    HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.4f))
}

@Composable
private fun EditorTabRow(activeTab: String, onTabSelected: (String) -> Unit) {
    val tabs = listOf("html" to "HTML", "css" to "CSS", "js" to "JavaScript")
    val colors = MaterialTheme.colorScheme
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(colors.surface)
            .padding(horizontal = 8.dp, vertical = 4.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        tabs.forEach { (key, label) ->
            val selected = activeTab == key
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(
                        if (selected) colors.primary else Color.Transparent
                    )
                    .clickable { onTabSelected(key) }
                    .padding(horizontal = 16.dp, vertical = 6.dp)
            ) {
                Text(
                    text = label,
                    color = if (selected) colors.onPrimary else colors.onSurface.copy(alpha = 0.7f),
                    fontSize = 13.sp,
                    fontFamily = FontFamily.SansSerif
                )
            }
        }
    }
    HorizontalDivider(color = colors.outline.copy(alpha = 0.4f))
}

@Composable
private fun FindBar(
    query: String,
    onQueryChange: (String) -> Unit,
    onNext: () -> Unit,
    onPrev: () -> Unit,
    onClose: () -> Unit
) {
    val colors = MaterialTheme.colorScheme
    Surface(
        color = colors.surfaceVariant,
        tonalElevation = 4.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = query,
                onValueChange = onQueryChange,
                placeholder = { Text("Find…", fontSize = 13.sp) },
                singleLine = true,
                modifier = Modifier.weight(1f).height(48.dp),
                textStyle = androidx.compose.ui.text.TextStyle(fontSize = 13.sp)
            )
            IconButton(onClick = onPrev) {
                Icon(Icons.Default.KeyboardArrowUp, "Previous")
            }
            IconButton(onClick = onNext) {
                Icon(Icons.Default.KeyboardArrowDown, "Next")
            }
            IconButton(onClick = onClose) {
                Icon(Icons.Default.Close, "Close")
            }
        }
    }
}

@Composable
private fun SnippetsToolbar(isDark: Boolean, onSnippet: (String) -> Unit) {
    val colors = MaterialTheme.colorScheme
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(colors.surface)
            .horizontalScroll(rememberScrollState())
            .padding(horizontal = 8.dp, vertical = 4.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        SNIPPETS.forEach { snippet ->
            OutlinedButton(
                onClick = { onSnippet(snippet) },
                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                modifier = Modifier.height(32.dp),
                border = BorderStroke(1.dp, colors.outline.copy(alpha = 0.5f))
            ) {
                Text(snippet, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
            }
        }
    }
}

@Composable
private fun StatusBar(activeTab: String, fontSize: Int, editor: CodeEditor?) {
    val colors = MaterialTheme.colorScheme
    val langLabel = when (activeTab) { "html" -> "HTML"; "css" -> "CSS"; else -> "JavaScript" }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(colors.surfaceVariant)
            .padding(horizontal = 12.dp, vertical = 3.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text("Ln 1, Col 1", fontSize = 11.sp, color = colors.onSurfaceVariant, fontFamily = FontFamily.Monospace)
        Spacer(Modifier.width(8.dp))
        Text("|", fontSize = 11.sp, color = colors.outline)
        Spacer(Modifier.width(8.dp))
        Text(langLabel, fontSize = 11.sp, color = colors.onSurfaceVariant, fontFamily = FontFamily.Monospace)
        Spacer(Modifier.weight(1f))
        Text("Font: ${fontSize}sp", fontSize = 11.sp, color = colors.onSurfaceVariant, fontFamily = FontFamily.Monospace)
    }
}

// ── File download helper ───────────────────────────────────────────────────────

private fun downloadCode(
    context: Context,
    activeTab: String,
    html: String,
    css: String,
    js: String,
    projectName: String?
) {
    val (ext, content, mimeType) = when (activeTab) {
        "css" -> Triple("css", css, "text/css")
        "js"  -> Triple("js",  js,  "text/javascript")
        else  -> Triple("html", html, "text/html")
    }
    val safeName = (projectName ?: "code").replace(Regex("[^a-zA-Z0-9._-]"), "_")
    val fileName = "$safeName.$ext"
    try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val values = ContentValues().apply {
                put(MediaStore.Downloads.DISPLAY_NAME, fileName)
                put(MediaStore.Downloads.MIME_TYPE, mimeType)
                put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                put(MediaStore.Downloads.IS_PENDING, 1)
            }
            val uri = context.contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
            uri?.let {
                context.contentResolver.openOutputStream(it)?.use { out -> out.write(content.toByteArray()) }
                values.clear()
                values.put(MediaStore.Downloads.IS_PENDING, 0)
                context.contentResolver.update(it, values, null, null)
                Toast.makeText(context, "Saved: $fileName", Toast.LENGTH_SHORT).show()
            }
        } else {
            val dir  = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS)
            val file = java.io.File(dir, fileName)
            file.writeText(content)
            Toast.makeText(context, "Saved: $fileName", Toast.LENGTH_SHORT).show()
        }
    } catch (e: Exception) {
        Toast.makeText(context, "Download failed", Toast.LENGTH_SHORT).show()
    }
}
