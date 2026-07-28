package com.iftechstudio.html_live_editor

import android.app.Application
import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore
import io.github.rosemoe.sora.langs.textmate.registry.FileProviderRegistry
import io.github.rosemoe.sora.langs.textmate.registry.GrammarRegistry
import io.github.rosemoe.sora.langs.textmate.registry.ThemeRegistry
import io.github.rosemoe.sora.langs.textmate.registry.model.ThemeModel
import io.github.rosemoe.sora.langs.textmate.registry.provider.AssetsFileResolver
import org.eclipse.tm4e.core.registry.IThemeSource

val Context.settingsDataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

class HtmlEditorApp : Application() {
    override fun onCreate() {
        super.onCreate()
        initTextMate()
    }

    private fun initTextMate() {
        // Step 1: register assets as the file provider
        FileProviderRegistry.getInstance().addFileProvider(AssetsFileResolver(assets))

        // Step 2: load dark + light themes directly from assets
        listOf(
            "darcula"    to "textmate/themes/darcula.json",
            "QuietLight" to "textmate/themes/QuietLight.json"
        ).forEach { (name, path) ->
            try {
                assets.open(path).use { stream ->
                    ThemeRegistry.getInstance().loadTheme(
                        ThemeModel(
                            IThemeSource.fromInputStream(stream, path, null),
                            name
                        )
                    )
                }
            } catch (e: Exception) {
                // theme file missing — editor still works without colour
            }
        }

        // Step 3: register grammar definitions (html / js / css)
        try {
            GrammarRegistry.getInstance().loadGrammars("textmate/languages.json")
        } catch (e: Exception) {
            // grammars unavailable — editor falls back to plain text
        }
    }
}
