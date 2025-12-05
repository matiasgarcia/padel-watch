package com.padelscoretracker.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.wear.compose.material.Button
import androidx.wear.compose.material.Text
import com.padelscoretracker.ui.theme.PadelScoreTheme

@Composable
fun HomeScreen(
    onStartGame: () -> Unit,
    onViewHistory: () -> Unit,
    modifier: Modifier = Modifier
) {
    PadelScoreTheme {
        Box(
            modifier = modifier
                .fillMaxSize()
                .padding(16.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = onStartGame,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Empezar",
                        textAlign = TextAlign.Center
                    )
                }
                
                Button(
                    onClick = onViewHistory,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Historial",
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

