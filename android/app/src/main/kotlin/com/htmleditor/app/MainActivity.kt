package com.htmleditor.app

import android.annotation.SuppressLint
import android.app.Activity
import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.content.IntentSender
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.util.Base64
import android.util.Log
import android.provider.MediaStore
import android.content.ContentValues
import android.view.View
import android.webkit.DownloadListener
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.core.view.updatePadding
import com.google.android.play.core.appupdate.AppUpdateInfo
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.InstallStateUpdatedListener
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.InstallStatus
import com.google.android.play.core.install.model.UpdateAvailability
import com.google.android.gms.ads.MobileAds
import com.iftechstudio.html_live_editor.R
import java.io.File
import java.io.FileOutputStream

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var container: FrameLayout
    private val LOCAL_URL = "file:///android_asset/www/index.html"
    
    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null
    private lateinit var fileChooserLauncher: ActivityResultLauncher<Intent>
    
    private lateinit var appUpdateManager: AppUpdateManager
    private val UPDATE_REQUEST_CODE = 100
    
    private val installStateUpdatedListener = InstallStateUpdatedListener { state ->
        if (state.installStatus() == InstallStatus.DOWNLOADED) {
            showUpdateSnackbar()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(R.style.Theme_HTMLEditor)
        super.onCreate(savedInstanceState)
        
        setupFileChooserLauncher()
        
        appUpdateManager = AppUpdateManagerFactory.create(this)
        appUpdateManager.registerListener(installStateUpdatedListener)
        checkForAppUpdate()
        
        MobileAds.initialize(this) { initializationStatus ->
            Log.d("AdMob", "AdMob initialized: $initializationStatus")
        }
        
        container = FrameLayout(this).apply {
            setBackgroundColor(Color.parseColor("#1a1a2e"))
        }
        
        webView = WebView(this).apply {
            id = View.generateViewId()
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }
        
        container.addView(webView)
        setContentView(container)
        
        setupEdgeToEdge()
        setupWebView()
        
        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            webView.loadUrl(LOCAL_URL)
        }
    }
    
    private fun checkForAppUpdate() {
        val appUpdateInfoTask = appUpdateManager.appUpdateInfo
        
        appUpdateInfoTask.addOnSuccessListener { appUpdateInfo ->
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE) {
                if (appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {
                    startFlexibleUpdate(appUpdateInfo)
                } else if (appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                    startImmediateUpdate(appUpdateInfo)
                }
            } else if (appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED) {
                showUpdateSnackbar()
            }
        }.addOnFailureListener { e ->
            Log.e("AppUpdate", "Update check failed", e)
        }
    }
    
    private fun startFlexibleUpdate(appUpdateInfo: AppUpdateInfo) {
        try {
            appUpdateManager.startUpdateFlowForResult(
                appUpdateInfo,
                this,
                AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build(),
                UPDATE_REQUEST_CODE
            )
        } catch (e: IntentSender.SendIntentException) {
            Log.e("AppUpdate", "Flexible update failed", e)
        }
    }
    
    private fun startImmediateUpdate(appUpdateInfo: AppUpdateInfo) {
        try {
            appUpdateManager.startUpdateFlowForResult(
                appUpdateInfo,
                this,
                AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build(),
                UPDATE_REQUEST_CODE
            )
        } catch (e: IntentSender.SendIntentException) {
            Log.e("AppUpdate", "Immediate update failed", e)
        }
    }
    
    private fun showUpdateSnackbar() {
        Toast.makeText(
            this,
            "Update downloaded. Restart to apply.",
            Toast.LENGTH_LONG
        ).show()
        
        appUpdateManager.completeUpdate()
    }

    private fun setupFileChooserLauncher() {
        fileChooserLauncher = registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) { result ->
            val callback = fileUploadCallback
            fileUploadCallback = null
            
            if (result.resultCode == Activity.RESULT_OK) {
                val data = result.data
                val uris = mutableListOf<Uri>()
                
                data?.data?.let { uris.add(it) }
                
                data?.clipData?.let { clipData ->
                    for (i in 0 until clipData.itemCount) {
                        clipData.getItemAt(i).uri?.let { uris.add(it) }
                    }
                }
                
                callback?.onReceiveValue(uris.toTypedArray())
            } else {
                callback?.onReceiveValue(null)
            }
        }
    }

    private fun setupEdgeToEdge() {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        
        window.statusBarColor = Color.parseColor("#1a1a2e")
        window.navigationBarColor = Color.parseColor("#1a1a2e")
        
        val windowInsetsController = WindowInsetsControllerCompat(window, container)
        windowInsetsController.isAppearanceLightStatusBars = false
        windowInsetsController.isAppearanceLightNavigationBars = false
        
        ViewCompat.setOnApplyWindowInsetsListener(container) { view, windowInsets ->
            val insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars())
            view.updatePadding(
                left = insets.left,
                top = insets.top,
                right = insets.right,
                bottom = insets.bottom
            )
            WindowInsetsCompat.CONSUMED
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            allowFileAccess = true
            allowContentAccess = true
            @Suppress("DEPRECATION")
            allowFileAccessFromFileURLs = false
            @Suppress("DEPRECATION")
            allowUniversalAccessFromFileURLs = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            setSupportZoom(true)
            builtInZoomControls = true
            displayZoomControls = false
            loadWithOverviewMode = true
            useWideViewPort = true
            mediaPlaybackRequiresUserGesture = true
        }

        webView.setBackgroundColor(Color.parseColor("#1a1a2e"))

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url?.toString() ?: return false
                
                return if (url.startsWith("file://") || url.startsWith("javascript:")) {
                    false
                } else {
                    try {
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                    true
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback
                
                try {
                    val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
                        addCategory(Intent.CATEGORY_OPENABLE)
                        type = "*/*"
                        putExtra(Intent.EXTRA_MIME_TYPES, arrayOf(
                            "text/html",
                            "text/css",
                            "text/javascript",
                            "application/javascript",
                            "text/plain"
                        ))
                    }
                    
                    fileChooserLauncher.launch(Intent.createChooser(intent, "Select File"))
                    return true
                } catch (e: Exception) {
                    fileUploadCallback = null
                    e.printStackTrace()
                    return false
                }
            }
        }

        webView.setDownloadListener { url, userAgent, contentDisposition, mimeType, contentLength ->
            try {
                if (url.startsWith("blob:") || url.startsWith("data:")) {
                    val fileName = getFileNameFromDisposition(contentDisposition) ?: "download.txt"
                    handleBlobDownload(url, fileName)
                } else {
                    val fileName = getFileNameFromDisposition(contentDisposition) ?: "download"
                    streamDownloadToMediaStore(url, fileName, mimeType ?: "application/octet-stream", userAgent)
                }
            } catch (e: Exception) {
                e.printStackTrace()
                Toast.makeText(this, "Download failed", Toast.LENGTH_SHORT).show()
            }
        }
    }
    
    private fun handleBlobDownload(url: String, fileName: String) {
        val escapedFileName = fileName.replace("'", "\\'")
        val script = """
            (function() {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '$url', true);
                xhr.responseType = 'blob';
                xhr.onload = function() {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        var base64data = reader.result.split(',')[1] || reader.result;
                        Android.saveBase64File(base64data, '$escapedFileName', xhr.response.type || 'text/plain');
                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.send();
            })();
        """.trimIndent()
        
        webView.addJavascriptInterface(object {
            @android.webkit.JavascriptInterface
            fun saveBase64File(base64Data: String, name: String, mimeType: String) {
                try {
                    val bytes = Base64.decode(base64Data, Base64.DEFAULT)
                    saveToDownloads(bytes, name, mimeType)
                } catch (e: Exception) {
                    e.printStackTrace()
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "Save failed", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }, "Android")
        
        webView.evaluateJavascript(script, null)
    }
    
    private fun saveToDownloads(bytes: ByteArray, fileName: String, mimeType: String) {
        try {
            val sanitizedName = fileName.replace(Regex("[^a-zA-Z0-9._-]"), "_")
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val values = ContentValues().apply {
                    put(MediaStore.Downloads.DISPLAY_NAME, sanitizedName)
                    put(MediaStore.Downloads.MIME_TYPE, mimeType)
                    put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                    put(MediaStore.Downloads.IS_PENDING, 1)
                }
                
                val uri = contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
                uri?.let {
                    contentResolver.openOutputStream(it)?.use { outputStream ->
                        outputStream.write(bytes)
                    }
                    
                    values.clear()
                    values.put(MediaStore.Downloads.IS_PENDING, 0)
                    contentResolver.update(it, values, null, null)
                    
                    runOnUiThread {
                        Toast.makeText(this, "Saved to Downloads: $sanitizedName", Toast.LENGTH_SHORT).show()
                    }
                }
            } else {
                val downloadsDir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS)
                val file = File(downloadsDir, sanitizedName)
                FileOutputStream(file).use { it.write(bytes) }
                
                runOnUiThread {
                    Toast.makeText(this, "Saved to Downloads: $sanitizedName", Toast.LENGTH_SHORT).show()
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            runOnUiThread {
                Toast.makeText(this, "Save failed", Toast.LENGTH_SHORT).show()
            }
        }
    }
    
    private fun streamDownloadToMediaStore(url: String, fileName: String, mimeType: String, userAgent: String) {
        Thread {
            try {
                val sanitizedName = fileName.replace(Regex("[^a-zA-Z0-9._-]"), "_")
                
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val values = ContentValues().apply {
                        put(MediaStore.Downloads.DISPLAY_NAME, sanitizedName)
                        put(MediaStore.Downloads.MIME_TYPE, mimeType)
                        put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                        put(MediaStore.Downloads.IS_PENDING, 1)
                    }
                    
                    val uri = contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
                    uri?.let {
                        val connection = java.net.URL(url).openConnection()
                        connection.setRequestProperty("User-Agent", userAgent)
                        connection.connect()
                        
                        connection.getInputStream().use { inputStream ->
                            contentResolver.openOutputStream(it)?.use { outputStream ->
                                inputStream.copyTo(outputStream)
                            }
                        }
                        
                        values.clear()
                        values.put(MediaStore.Downloads.IS_PENDING, 0)
                        contentResolver.update(it, values, null, null)
                        
                        runOnUiThread {
                            Toast.makeText(this, "Downloaded: $sanitizedName", Toast.LENGTH_SHORT).show()
                        }
                    }
                } else {
                    val request = DownloadManager.Request(Uri.parse(url)).apply {
                        setMimeType(mimeType)
                        addRequestHeader("User-Agent", userAgent)
                        setDescription("Downloading file...")
                        setTitle(sanitizedName)
                        setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                        setDestinationInExternalFilesDir(this@MainActivity, Environment.DIRECTORY_DOWNLOADS, sanitizedName)
                    }
                    
                    val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                    dm.enqueue(request)
                    runOnUiThread {
                        Toast.makeText(this, "Download started", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
                runOnUiThread {
                    Toast.makeText(this, "Download failed", Toast.LENGTH_SHORT).show()
                }
            }
        }.start()
    }
    
    private fun getFileNameFromDisposition(contentDisposition: String?): String? {
        if (contentDisposition == null) return null
        val pattern = Regex("filename=[\"']?([^\"';]+)[\"']?")
        return pattern.find(contentDisposition)?.groupValues?.get(1)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            @Suppress("DEPRECATION")
            super.onBackPressed()
        }
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
        
        appUpdateManager.appUpdateInfo.addOnSuccessListener { appUpdateInfo ->
            if (appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED) {
                showUpdateSnackbar()
            }
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS) {
                startImmediateUpdate(appUpdateInfo)
            }
        }
    }

    override fun onPause() {
        webView.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        appUpdateManager.unregisterListener(installStateUpdatedListener)
        webView.destroy()
        super.onDestroy()
    }
    
    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == UPDATE_REQUEST_CODE) {
            if (resultCode != RESULT_OK) {
                Log.e("AppUpdate", "Update flow failed! Result code: $resultCode")
                checkForAppUpdate()
            }
        }
    }
}
