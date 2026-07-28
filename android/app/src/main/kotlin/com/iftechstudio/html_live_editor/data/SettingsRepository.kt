package com.iftechstudio.html_live_editor.data

import android.content.Context
import androidx.datastore.preferences.core.*
import com.iftechstudio.html_live_editor.settingsDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

object SettingsKeys {
    val DARK_MODE = booleanPreferencesKey("dark_mode")
    val FONT_SIZE = intPreferencesKey("font_size")
    val WORD_WRAP = booleanPreferencesKey("word_wrap")
    val ACTIVE_PROJECT_ID = stringPreferencesKey("active_project_id")
}

class SettingsRepository(private val context: Context) {

    val darkMode: Flow<Boolean> = context.settingsDataStore.data
        .map { it[SettingsKeys.DARK_MODE] ?: true }

    val fontSize: Flow<Int> = context.settingsDataStore.data
        .map { it[SettingsKeys.FONT_SIZE] ?: 14 }

    val wordWrap: Flow<Boolean> = context.settingsDataStore.data
        .map { it[SettingsKeys.WORD_WRAP] ?: true }

    val activeProjectId: Flow<String> = context.settingsDataStore.data
        .map { it[SettingsKeys.ACTIVE_PROJECT_ID] ?: "" }

    suspend fun setDarkMode(value: Boolean) {
        context.settingsDataStore.edit { it[SettingsKeys.DARK_MODE] = value }
    }

    suspend fun setFontSize(value: Int) {
        context.settingsDataStore.edit { it[SettingsKeys.FONT_SIZE] = value.coerceIn(10, 28) }
    }

    suspend fun setWordWrap(value: Boolean) {
        context.settingsDataStore.edit { it[SettingsKeys.WORD_WRAP] = value }
    }

    suspend fun setActiveProjectId(id: String) {
        context.settingsDataStore.edit { it[SettingsKeys.ACTIVE_PROJECT_ID] = id }
    }
}
