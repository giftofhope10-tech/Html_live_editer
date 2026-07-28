package com.iftechstudio.html_live_editor.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.iftechstudio.html_live_editor.data.Project
import com.iftechstudio.html_live_editor.viewmodel.EditorViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProjectsBottomSheet(
    viewModel: EditorViewModel,
    onDismiss: () -> Unit
) {
    val projects       by viewModel.projects.collectAsStateWithLifecycle()
    val activeProjectId by viewModel.activeProjectId.collectAsStateWithLifecycle()

    var showCreateDialog by remember { mutableStateOf(false) }
    var renameTarget    by remember { mutableStateOf<Project?>(null) }
    var deleteTarget    by remember { mutableStateOf<Project?>(null) }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        dragHandle = { BottomSheetDefaults.DragHandle() }
    ) {
        Column(modifier = Modifier.padding(bottom = 24.dp)) {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "My Projects",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.weight(1f)
                )
                TextButton(onClick = { showCreateDialog = true }) {
                    Icon(Icons.Default.Add, "New", modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("New")
                }
            }

            HorizontalDivider()

            LazyColumn {
                items(projects) { project ->
                    ProjectItem(
                        project    = project,
                        isActive   = project.id == activeProjectId,
                        onSelect   = { viewModel.switchProject(project); onDismiss() },
                        onRename   = { renameTarget = project },
                        onDelete   = { deleteTarget = project }
                    )
                }
            }
        }
    }

    // Create project dialog
    if (showCreateDialog) {
        NameDialog(
            title = "New Project",
            initial = "Project ${projects.size + 1}",
            confirmLabel = "Create",
            onConfirm = { name -> viewModel.createProject(name); showCreateDialog = false; onDismiss() },
            onDismiss = { showCreateDialog = false }
        )
    }

    // Rename dialog
    renameTarget?.let { target ->
        NameDialog(
            title = "Rename Project",
            initial = target.name,
            confirmLabel = "Rename",
            onConfirm = { name -> viewModel.renameProject(target, name); renameTarget = null },
            onDismiss = { renameTarget = null }
        )
    }

    // Delete confirm dialog
    deleteTarget?.let { target ->
        AlertDialog(
            onDismissRequest = { deleteTarget = null },
            title = { Text("Delete \"${target.name}\"?") },
            text  = { Text("This cannot be undone.") },
            confirmButton = {
                TextButton(onClick = { viewModel.deleteProject(target); deleteTarget = null; onDismiss() }) {
                    Text("Delete", color = MaterialTheme.colorScheme.error)
                }
            },
            dismissButton = {
                TextButton(onClick = { deleteTarget = null }) { Text("Cancel") }
            }
        )
    }
}

@Composable
private fun ProjectItem(
    project: Project,
    isActive: Boolean,
    onSelect: () -> Unit,
    onRename: () -> Unit,
    onDelete: () -> Unit
) {
    val colors = MaterialTheme.colorScheme
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onSelect)
            .background(if (isActive) colors.primaryContainer.copy(alpha = 0.3f) else colors.surface)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (isActive) {
            Icon(Icons.Default.Check, "Active", tint = colors.primary, modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(10.dp))
        } else {
            Spacer(Modifier.width(28.dp))
        }
        Text(
            project.name,
            modifier = Modifier.weight(1f),
            color = if (isActive) colors.primary else colors.onSurface,
            fontWeight = if (isActive) FontWeight.SemiBold else FontWeight.Normal
        )
        IconButton(onClick = onRename, modifier = Modifier.size(32.dp)) {
            Icon(Icons.Default.Edit, "Rename", modifier = Modifier.size(16.dp), tint = colors.onSurface.copy(alpha = 0.6f))
        }
        IconButton(onClick = onDelete, modifier = Modifier.size(32.dp)) {
            Icon(Icons.Default.Delete, "Delete", modifier = Modifier.size(16.dp), tint = colors.error.copy(alpha = 0.7f))
        }
    }
}

@Composable
fun NameDialog(
    title: String,
    initial: String,
    confirmLabel: String,
    onConfirm: (String) -> Unit,
    onDismiss: () -> Unit
) {
    var name by remember { mutableStateOf(initial) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text  = {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Project name") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )
        },
        confirmButton = {
            TextButton(onClick = { if (name.isNotBlank()) onConfirm(name.trim()) }) {
                Text(confirmLabel)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}
