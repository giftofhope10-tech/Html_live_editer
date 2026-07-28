package com.iftechstudio.html_live_editor.data

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

@Entity(tableName = "projects")
data class Project(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val name: String = "New Project",
    val htmlCode: String = DEFAULT_HTML,
    val cssCode: String = DEFAULT_CSS,
    val jsCode: String = DEFAULT_JS,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)

const val DEFAULT_HTML = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Start editing to see the magic happen.</p>
</body>
</html>"""

const val DEFAULT_CSS = """body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

h1 {
    color: white;
    font-size: 2.5em;
    text-align: center;
}

p {
    color: rgba(255,255,255,0.9);
    text-align: center;
}"""

const val DEFAULT_JS = """// JavaScript goes here
console.log('Hello from JavaScript!');
"""
