package com.iftechstudio.html_live_editor.ui

import android.graphics.Typeface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import io.github.rosemoe.sora.event.ContentChangeEvent
import io.github.rosemoe.sora.lang.EmptyLanguage
import io.github.rosemoe.sora.langs.textmate.TextMateColorScheme
import io.github.rosemoe.sora.langs.textmate.TextMateLanguage
import io.github.rosemoe.sora.langs.textmate.registry.ThemeRegistry
import io.github.rosemoe.sora.widget.CodeEditor
import io.github.rosemoe.sora.widget.schemes.EditorColorScheme
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
    val lastSetCode = remember { mutableStateOf(code) }

    AndroidView(
        factory = { ctx ->
            CodeEditor(ctx).apply {
                typefaceText = Typeface.MONOSPACE

                // Language — TextMate for all three; falls back to plain if grammars
                // haven't been downloaded yet (first cold build)
                setEditorLanguage(languageFor(language))

                setText(code)
                lastSetCode.value = code

                setTextSize(fontSize.toFloat())
                isWordwrap = wordWrap
                colorScheme = schemeFor(isDark)
                isOverScrollEnabled = false

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
            ed.setTextSize(fontSize.toFloat())
            if (ed.isWordwrap != wordWrap) ed.isWordwrap = wordWrap
            // Swap color scheme when dark/light preference changes
            val currentIsDark = ed.colorScheme is TextMateColorScheme &&
                    (ed.colorScheme as TextMateColorScheme).themeSource.let { true } // replaced below
            val needsSwap = run {
                val cs = ed.colorScheme
                if (cs is TextMateColorScheme) false  // re-check via theme name not possible; swap on every isDark toggle
                else true
            }
            // Simpler: always rebuild scheme when isDark toggle requires it.
            // We track with a stable key stored in the editor's tag.
            val tagDark = ed.tag as? Boolean
            if (tagDark != isDark) {
                ed.colorScheme = schemeFor(isDark)
                ed.tag = isDark
            }
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

/** Scope names registered in assets/textmate/languages.json */
private fun languageFor(lang: String): Any {
    val scopeName = when (lang) {
        "html" -> "text.html.basic"
        "js"   -> "source.js"
        "css"  -> "source.css"
        else   -> return EmptyLanguage()
    }
    return try {
        TextMateLanguage.create(scopeName, true /* async highlight */)
    } catch (_: Exception) {
        EmptyLanguage()
    }
}

private fun schemeFor(dark: Boolean): EditorColorScheme {
    val themeName = if (dark) "darcula" else "QuietLight"
    return try {
        val theme = ThemeRegistry.getInstance().getTheme(themeName)
        if (theme != null) TextMateColorScheme.create(theme)
        else fallbackScheme(dark)
    } catch (_: Exception) {
        fallbackScheme(dark)
    }
}

private fun fallbackScheme(dark: Boolean): EditorColorScheme =
    if (dark) EditorColorScheme().apply {
        setColor(EditorColorScheme.WHOLE_BACKGROUND,       0xFF282B2E.toInt())
        setColor(EditorColorScheme.LINE_NUMBER_BACKGROUND, 0xFF313438.toInt())
        setColor(EditorColorScheme.TEXT_NORMAL,            0xFFBABEC4.toInt())
        setColor(EditorColorScheme.CURRENT_LINE,           0xFF323844.toInt())
    } else EditorColorScheme().apply {
        setColor(EditorColorScheme.WHOLE_BACKGROUND,       0xFFFAFAFA.toInt())
        setColor(EditorColorScheme.LINE_NUMBER_BACKGROUND, 0xFFF0F0F0.toInt())
        setColor(EditorColorScheme.LINE_NUMBER,            0xFF999999.toInt())
        setColor(EditorColorScheme.TEXT_NORMAL,            0xFF383A42.toInt())
        setColor(EditorColorScheme.CURRENT_LINE,           0xFFEEEEFF.toInt())
        setColor(EditorColorScheme.SELECTION_HANDLE,       0xFF5B4FCF.toInt())
        setColor(EditorColorScheme.SELECTED_TEXT_BACKGROUND, 0xFFB3B3F0.toInt())
    }
