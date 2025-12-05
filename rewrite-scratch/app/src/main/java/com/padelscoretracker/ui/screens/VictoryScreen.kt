package com.padelscoretracker.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.Text
import com.padelscoretracker.domain.model.MatchHistoryEntry
import com.padelscoretracker.domain.model.SetScore
import com.padelscoretracker.ui.theme.Player1Blue
import com.padelscoretracker.ui.theme.Player2Red
import com.padelscoretracker.ui.theme.PadelScoreTheme

@Composable
fun VictoryScreen(
    winner: Int, // 1 or 2
    setsWon: SetScore,
    sets: List<SetScore>,
    onNavigateHome: () -> Unit,
    onSaveMatch: (MatchHistoryEntry) -> Unit = {},
    modifier: Modifier = Modifier
) {
    // Save match to history when screen is displayed
    LaunchedEffect(winner, sets, setsWon) {
        val matchEntry = MatchHistoryEntry(
            id = "${System.currentTimeMillis()}-${kotlin.random.Random.nextLong()}",
            date = System.currentTimeMillis(),
            winner = winner,
            sets = sets,
            setsWon = setsWon
        )
        onSaveMatch(matchEntry)
    }
    val backgroundColor = if (winner == 1) Player1Blue else Player2Red
    
    PadelScoreTheme {
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(backgroundColor)
                .clickable { onNavigateHome() },
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "¡Ganador!",
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Text(
                    text = "Equipo $winner",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Text(
                    text = "${setsWon.player1} - ${setsWon.player2}",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    text = "Toca para volver",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Normal,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

