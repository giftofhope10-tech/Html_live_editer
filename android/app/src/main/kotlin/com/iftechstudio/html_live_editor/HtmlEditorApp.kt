package com.iftechstudio.html_live_editor

import android.app.Application
import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore

val Context.settingsDataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

class HtmlEditorApp : Application() {
    override fun onCreate() {
        super.onCreate()
    }
}
