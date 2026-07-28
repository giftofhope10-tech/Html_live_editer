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
        // Step 1: register the assets folder as the file provider
        val provider = AssetsFileResolver(assets)
        FileProviderRegistry.getInstance().addFileProvider(provider)

        // Step 2: load color themes
        listOf(
            "darcula"    to "textmate/themes/darcula.json",
            "QuietLight" to "textmate/themes/QuietLight.json"
        ).forEach { (name, path) ->
            try {
                val stream = provider.tryGetInputStream(path) ?: return@forEach
                ThemeRegistry.getInstance().loadTheme(
                    ThemeModel(
                        IThemeSource.fromInputStream(stream, path, provider),
                        name
                    )
                )
            } catch (e: Exception) {
                // theme unavailable – editor will still work without colours
            }
        }

        // Step 3: load grammar definitions (references html/js/css grammar files)
        try {
            GrammarRegistry.getInstance().loadGrammars("textmate/languages.json")
        } catch (e: Exception) {
            // grammars unavailable – editor falls back to EmptyLanguage
        }
    }
}
