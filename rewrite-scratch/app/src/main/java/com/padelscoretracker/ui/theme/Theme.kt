package com.padelscoretracker.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.wear.compose.material.MaterialTheme

// Color palette
val Player1Blue = Color(0xFF2196F3)
val Player2Red = Color(0xFFF44336)
val BackgroundBlack = Color(0xFF000000)
val YellowAccent = Color(0xFFFFEB3B)

private val darkColorPalette = androidx.wear.compose.material.darkColors(
    primary = Player1Blue,
    secondary = Player2Red,
    background = BackgroundBlack,
    surface = BackgroundBlack,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onBackground = Color.White,
    onSurface = Color.White,
)

@Composable
fun PadelScoreTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colors = darkColorPalette,
        typography = Typography,
        content = content
    )
}

