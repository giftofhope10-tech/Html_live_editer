# HTML Live Editor ProGuard Rules
# SDK 35 Compatible Configuration

#-------------------------------------------------
# Keep application class
#-------------------------------------------------
-keep class com.htmleditor.app.** { *; }

#-------------------------------------------------
# Android Framework
#-------------------------------------------------
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.app.backup.BackupAgentHelper
-keep public class * extends android.preference.Preference

#-------------------------------------------------
# AndroidX
#-------------------------------------------------
-keep class androidx.** { *; }
-keep interface androidx.** { *; }
-dontwarn androidx.**

#-------------------------------------------------
# WebView
#-------------------------------------------------
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
}
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String);
}

#-------------------------------------------------
# JavaScript Interface
#-------------------------------------------------
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

#-------------------------------------------------
# Google AdMob
#-------------------------------------------------
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.ads.** { *; }
-dontwarn com.google.android.gms.ads.**

#-------------------------------------------------
# Google Play Core
#-------------------------------------------------
-keep class com.google.android.play.core.** { *; }
-dontwarn com.google.android.play.core.**

#-------------------------------------------------
# Material Design
#-------------------------------------------------
-keep class com.google.android.material.** { *; }
-dontwarn com.google.android.material.**

#-------------------------------------------------
# Kotlin
#-------------------------------------------------
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**
-keepclassmembers class **$WhenMappings {
    <fields>;
}
-keepclassmembers class kotlin.Metadata {
    public <methods>;
}

#-------------------------------------------------
# Coroutines
#-------------------------------------------------
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}
-dontwarn kotlinx.coroutines.**

#-------------------------------------------------
# R8 Full Mode Compatibility
#-------------------------------------------------
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes EnclosingMethod

#-------------------------------------------------
# Mapping File Output (Handled by Gradle)
#-------------------------------------------------
# Note: Mapping file output is now handled by AGP 8+
# Location: app/build/outputs/mapping/release/mapping.txt

#-------------------------------------------------
# Optimization
#-------------------------------------------------
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
-dontpreverify

#-------------------------------------------------
# Remove Logging in Release
#-------------------------------------------------
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}
