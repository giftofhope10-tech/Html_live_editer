package com.iftechstudio.html_live_editor.ui

import android.graphics.Typeface
import android.view.View
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import io.github.rosemoe.sora.event.ContentChangeEvent
import io.github.rosemoe.sora.lang.EmptyLanguage
import io.github.rosemoe.sora.langs.html.HtmlLanguage
import io.github.rosemoe.sora.langs.javascript.JavaScriptLanguage
import io.github.rosemoe.sora.widget.CodeEditor
import io.github.rosemoe.sora.widget.schemes.EditorColorScheme
import io.github.rosemoe.sora.widget.schemes.SchemeDarcula
import java.util.concurrent.atomic.AtomicBoolean

@Composable
fun SoraCodeEditor(
    code: String,
    language: String,
    isDark: Boolean,
    fontSize: Int,
    wordWrap: Boolean,
    onCodeChange: (String) -> Unit,
    onEditorCreated: ((CodeEditor) -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    val latestOnChange by rememberUpdatedState(onCodeChange)
    val settingProgrammatically = remember { AtomicBoolean(false) }
    // Keep a ref to check against external code changes
    val lastSetCode = remember { mutableStateOf(code) }

    AndroidView(
        factory = { ctx ->
            CodeEditor(ctx).apply {
                // Monospace font for code
                typefaceText = Typeface.MONOSPACE

                // Language
                setEditorLanguage(languageFor(language))

                // Initial content
                setText(code)
                lastSetCode.value = code

                // Appearance
                setTextSize(fontSize.toFloat())
                isWordwrap = wordWrap
                colorScheme = schemeFor(isDark)

                // Hide built-in search panel (we use our own)
                isOverScrollEnabled = false

                // Listen for text changes
                subscribeEvent(ContentChangeEvent::class.java) { _, _ ->
                    if (!settingProgrammatically.get()) {
                        val newCode = this.text.toString()
                        if (newCode != lastSetCode.value) {
                            lastSetCode.value = newCode
                            latestOnChange(newCode)
                        }
                    }
                }

                onEditorCreated?.invoke(this)
            }
        },
        update = { ed ->
            // Font size (always apply; setTextSize is idempotent)
            ed.setTextSize(fontSize.toFloat())
            // Word wrap
            if (ed.isWordwrap != wordWrap) ed.isWordwrap = wordWrap
            // Color scheme
            val wantDarcula = isDark
            val hasDarcula  = ed.colorScheme is SchemeDarcula
            if (wantDarcula != hasDarcula) ed.colorScheme = schemeFor(isDark)
            // External code change (e.g. project switch)
            if (code != lastSetCode.value) {
                settingProgrammatically.set(true)
                ed.setText(code)
                lastSetCode.value = code
                settingProgrammatically.set(false)
            }
        },
        modifier = modifier
    )
}

private fun languageFor(lang: String) = when (lang) {
    "html" -> HtmlLanguage()
    "js"   -> JavaScriptLanguage()
    else   -> EmptyLanguage()   // CSS: no dedicated package; still editable
}

private fun schemeFor(dark: Boolean): EditorColorScheme =
    if (dark) SchemeDarcula() else EditorColorScheme().apply {
        // Override defaults for a clean light theme
        setColor(EditorColorScheme.WHOLE_BACKGROUND,     0xFFFAFAFA.toInt())
        setColor(EditorColorScheme.LINE_NUMBER_BACKGROUND, 0xFFF0F0F0.toInt())
        setColor(EditorColorScheme.LINE_NUMBER,           0xFF999999.toInt())
        setColor(EditorColorScheme.TEXT_NORMAL,           0xFF383A42.toInt())
        setColor(EditorColorScheme.CURRENT_LINE,          0xFFEEEEFF.toInt())
        setColor(EditorColorScheme.SELECTION_HANDLE,      0xFF5B4FCF.toInt())
        setColor(EditorColorScheme.SELECTED_TEXT_BACKGROUND, 0xFFB3B3F0.toInt())
    }
