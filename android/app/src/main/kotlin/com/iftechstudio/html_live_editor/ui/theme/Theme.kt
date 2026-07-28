package com.iftechstudio.html_live_editor.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable

private val DarkColors = darkColorScheme(
    primary          = DarkPrimary,
    onPrimary        = DarkOnPrimary,
    secondary        = DarkSecondary,
    onSecondary      = DarkOnPrimary,
    background       = DarkBackground,
    onBackground     = DarkOnBackground,
    surface          = DarkSurface,
    onSurface        = DarkOnSurface,
    surfaceVariant   = DarkSurfaceVar,
    onSurfaceVariant = DarkOnSurface,
    outline          = DarkOutline
)

private val LightColors = lightColorScheme(
    primary          = LightPrimary,
    onPrimary        = LightOnPrimary,
    secondary        = LightSecondary,
    onSecondary      = LightOnPrimary,
    background       = LightBackground,
    onBackground     = LightOnBackground,
    surface          = LightSurface,
    onSurface        = LightOnSurface,
    surfaceVariant   = LightSurfaceVar,
    onSurfaceVariant = LightOnSurface,
    outline          = LightOutline
)

@Composable
fun HtmlEditorTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColors else LightColors,
        typography  = Typography,
        content     = content
    )
}
