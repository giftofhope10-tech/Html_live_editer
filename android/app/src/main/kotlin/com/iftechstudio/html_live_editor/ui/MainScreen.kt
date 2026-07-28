package com.iftechstudio.html_live_editor.ui

import androidx.activity.compose.BackHandler
import androidx.compose.animation.*
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FolderOpen
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.iftechstudio.html_live_editor.viewmodel.EditorViewModel

private sealed class Screen {
    object Editor   : Screen()
    object Preview  : Screen()
    object Settings : Screen()
}

@Composable
fun MainScreen(viewModel: EditorViewModel) {
    var currentScreen by remember { mutableStateOf<Screen>(Screen.Editor) }
    var showProjects  by remember { mutableStateOf(false) }
    val activeProject by viewModel.activeProject.collectAsStateWithLifecycle()

    // Back press handling
    BackHandler(enabled = currentScreen != Screen.Editor) {
        currentScreen = Screen.Editor
    }

    Box(modifier = Modifier.fillMaxSize()) {
        AnimatedContent(
            targetState = currentScreen,
            transitionSpec = {
                when {
                    targetState == Screen.Editor ->
                        slideInHorizontally { -it } togetherWith slideOutHorizontally { it }
                    else ->
                        slideInHorizontally { it } togetherWith slideOutHorizontally { -it }
                }
            },
            modifier = Modifier.fillMaxSize()
        ) { screen ->
            when (screen) {
                is Screen.Editor -> EditorScreen(
                    viewModel    = viewModel,
                    onOpenPreview  = { currentScreen = Screen.Preview },
                    onOpenSettings = { currentScreen = Screen.Settings }
                )
                is Screen.Preview -> LivePreviewScreen(
                    viewModel = viewModel,
                    onBack    = { currentScreen = Screen.Editor }
                )
                is Screen.Settings -> SettingsScreen(
                    viewModel = viewModel,
                    onBack    = { currentScreen = Screen.Editor }
                )
            }
        }

        // Floating project switcher button (only on editor screen)
        if (currentScreen == Screen.Editor) {
            ExtendedFloatingActionButton(
                onClick = { showProjects = true },
                icon = { Icon(Icons.Default.FolderOpen, "Projects") },
                text  = { Text(activeProject?.name ?: "Project") },
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(16.dp)
            )
        }
    }

    // Projects bottom sheet
    if (showProjects) {
        ProjectsBottomSheet(
            viewModel = viewModel,
            onDismiss = { showProjects = false }
        )
    }
}
