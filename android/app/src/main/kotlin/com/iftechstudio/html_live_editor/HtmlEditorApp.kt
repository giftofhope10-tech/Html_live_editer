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
        // Point the TextMate engine at our assets folder
        FileProviderRegistry.getInstance().addFileProvider(
            AssetsFileResolver(assets)
        )

        // Load dark theme (Darcula) and light theme (QuietLight)
        listOf("textmate/themes/darcula.json" to "darcula",
               "textmate/themes/QuietLight.json" to "QuietLight").forEach { (path, name) ->
            try {
                val stream = FileProviderRegistry.getInstance().tryGetInputStream(path)
                    ?: return@forEach
                ThemeRegistry.getInstance().loadTheme(
                    ThemeModel(IThemeSource.fromInputStream(stream, path, null), name)
                )
            } catch (_: Exception) { /* skip missing theme */ }
        }

        // Load grammar definitions listed in languages.json
        try {
            GrammarRegistry.getInstance().loadGrammars("textmate/languages.json")
        } catch (_: Exception) { /* grammars not yet downloaded; editor stays plain */ }
    }
}
