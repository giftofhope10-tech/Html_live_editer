package com.iftechstudio.html_live_editor.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.iftechstudio.html_live_editor.viewmodel.EditorViewModel

@Composable
fun SettingsScreen(
    viewModel: EditorViewModel,
    onBack: () -> Unit
) {
    val isDark   by viewModel.isDarkMode.collectAsStateWithLifecycle()
    val fontSize by viewModel.fontSize.collectAsStateWithLifecycle()
    val wordWrap by viewModel.wordWrap.collectAsStateWithLifecycle()

    Column(modifier = Modifier.fillMaxSize()) {
        // ── Top bar ──────────────────────────────────────────────────────
        Surface(tonalElevation = 2.dp) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 4.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, "Back")
                }
                Text(
                    "Settings",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // ── Appearance section ────────────────────────────────────────
            SectionTitle("Appearance")

            SettingsToggleRow(
                title = "Dark Mode",
                desc  = "Use dark theme for the editor",
                checked = isDark,
                onToggle = { viewModel.toggleDarkMode() }
            )

            SettingsToggleRow(
                title = "Word Wrap",
                desc  = "Wrap long lines in the editor",
                checked = wordWrap,
                onToggle = { viewModel.toggleWordWrap() }
            )

            // ── Editor section ────────────────────────────────────────────
            SectionTitle("Editor")

            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Font Size", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
                    Text(
                        "Current: ${fontSize}sp  (range 10–28sp)",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(Modifier.height(12.dp))
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedButton(
                            onClick = { viewModel.changeFontSize(-1) },
                            modifier = Modifier.weight(1f)
                        ) { Text("A−", fontSize = 14.sp) }
                        Text(
                            "${fontSize}sp",
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.width(48.dp),
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                        OutlinedButton(
                            onClick = { viewModel.changeFontSize(+1) },
                            modifier = Modifier.weight(1f)
                        ) { Text("A+", fontSize = 14.sp) }
                    }
                }
            }

            // ── Keyboard shortcuts ─────────────────────────────────────────
            SectionTitle("Keyboard Shortcuts")
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    ShortcutRow("Ctrl + S", "Save")
                    ShortcutRow("Ctrl + Z", "Undo")
                    ShortcutRow("Ctrl + /", "Toggle comment")
                    ShortcutRow("Tab",      "Indent")
                }
            }

            // ── About ─────────────────────────────────────────────────────
            SectionTitle("About")
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Html Live Editor", fontWeight = FontWeight.SemiBold)
                    Text(
                        "Version 2.0.0 — Native Android • Ad-free",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun SectionTitle(text: String) {
    Text(
        text = text,
        style = MaterialTheme.typography.labelSmall,
        color = MaterialTheme.colorScheme.primary,
        fontWeight = FontWeight.Bold,
        modifier = Modifier.padding(top = 8.dp)
    )
}

@Composable
private fun SettingsToggleRow(
    title: String,
    desc: String,
    checked: Boolean,
    onToggle: () -> Unit
) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(title, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
                Text(desc, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Switch(checked = checked, onCheckedChange = { onToggle() })
        }
    }
}

@Composable
private fun ShortcutRow(keys: String, action: String) {
    Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Surface(
            shape = MaterialTheme.shapes.small,
            color = MaterialTheme.colorScheme.surfaceVariant,
            modifier = Modifier.width(100.dp)
        ) {
            Text(
                keys,
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                fontSize = 12.sp
            )
        }
        Spacer(Modifier.width(12.dp))
        Text(action, style = MaterialTheme.typography.bodySmall)
    }
}
