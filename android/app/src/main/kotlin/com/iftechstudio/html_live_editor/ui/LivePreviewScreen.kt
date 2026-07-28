package com.iftechstudio.html_live_editor.ui

import android.annotation.SuppressLint
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.iftechstudio.html_live_editor.viewmodel.EditorViewModel

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun LivePreviewScreen(
    viewModel: EditorViewModel,
    onBack: () -> Unit
) {
    val htmlCode by viewModel.htmlCode.collectAsStateWithLifecycle()
    val cssCode  by viewModel.cssCode.collectAsStateWithLifecycle()
    val jsCode   by viewModel.jsCode.collectAsStateWithLifecycle()

    val previewHtml by remember {
        derivedStateOf { viewModel.buildPreviewHtml() }
    }

    var webViewRef by remember { mutableStateOf<WebView?>(null) }
    var deviceMode by remember { mutableStateOf("desktop") } // desktop | tablet | mobile

    // Re-load when code changes
    LaunchedEffect(htmlCode, cssCode, jsCode) {
        webViewRef?.loadDataWithBaseURL(
            "about:blank", viewModel.buildPreviewHtml(), "text/html", "UTF-8", null
        )
    }

    Column(modifier = Modifier.fillMaxSize()) {
        // ── Header ─────────────────────────────────────────────────────
        Surface(tonalElevation = 2.dp) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, "Back")
                }
                Text(
                    "Live Preview",
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.weight(1f)
                )
                // Device buttons
                DeviceButton("desktop", deviceMode, Icons.Default.DesktopWindows, "Desktop") {
                    deviceMode = "desktop"; applyDeviceWidth(webViewRef, "desktop")
                }
                DeviceButton("tablet", deviceMode, Icons.Default.TabletAndroid, "Tablet") {
                    deviceMode = "tablet"; applyDeviceWidth(webViewRef, "tablet")
                }
                DeviceButton("mobile", deviceMode, Icons.Default.PhoneAndroid, "Mobile") {
                    deviceMode = "mobile"; applyDeviceWidth(webViewRef, "mobile")
                }
                IconButton(onClick = { webViewRef?.reload() }) {
                    Icon(Icons.Default.Refresh, "Refresh")
                }
            }
        }

        // ── WebView ─────────────────────────────────────────────────────
        AndroidView(
            factory = { ctx ->
                WebView(ctx).apply {
                    webViewClient = WebViewClient()
                    settings.apply {
                        javaScriptEnabled = true
                        domStorageEnabled = true
                        cacheMode = WebSettings.LOAD_NO_CACHE
                        useWideViewPort = true
                        loadWithOverviewMode = true
                        setSupportZoom(true)
                        builtInZoomControls = true
                        displayZoomControls = false
                    }
                    webViewRef = this
                    loadDataWithBaseURL(
                        "about:blank", previewHtml, "text/html", "UTF-8", null
                    )
                }
            },
            modifier = Modifier.fillMaxSize()
        )
    }
}

@Composable
private fun DeviceButton(
    mode: String,
    activeMode: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    desc: String,
    onClick: () -> Unit
) {
    IconButton(onClick = onClick, modifier = Modifier.size(36.dp)) {
        Icon(
            icon, desc,
            tint = if (activeMode == mode) MaterialTheme.colorScheme.primary
                   else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
            modifier = Modifier.size(20.dp)
        )
    }
}

private fun applyDeviceWidth(webView: WebView?, mode: String) {
    val js = when (mode) {
        "mobile" -> "document.documentElement.style.maxWidth='375px';document.documentElement.style.margin='0 auto';"
        "tablet" -> "document.documentElement.style.maxWidth='768px';document.documentElement.style.margin='0 auto';"
        else     -> "document.documentElement.style.maxWidth='';document.documentElement.style.margin='';"
    }
    webView?.evaluateJavascript(js, null)
}
