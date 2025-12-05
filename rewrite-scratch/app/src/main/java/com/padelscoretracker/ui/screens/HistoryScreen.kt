package com.padelscoretracker.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.wear.compose.material.Text
import com.padelscoretracker.data.MatchHistoryRepository
import com.padelscoretracker.data.MatchHistoryStore
import com.padelscoretracker.domain.model.MatchHistoryEntry
import com.padelscoretracker.ui.theme.Player1Blue
import com.padelscoretracker.ui.theme.Player2Red
import com.padelscoretracker.ui.theme.PadelScoreTheme
import com.padelscoretracker.ui.viewmodel.HistoryViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun HistoryScreen(
    viewModel: HistoryViewModel,
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val matches by viewModel.matches.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    PadelScoreTheme {
        Column(
            modifier = modifier.fillMaxSize()
        ) {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "←",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Player1Blue,
                    modifier = Modifier.clickable { onNavigateBack() }
                )
                Text(
                    text = "Historial",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Spacer(modifier = Modifier.width(16.dp))
            }

            // Content
            if (isLoading) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Cargando…",
                        fontSize = 18.sp,
                        color = Color.Gray
                    )
                }
            } else if (matches.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(32.dp)
                    ) {
                        Text(
                            text = "No hay partidos guardados",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color.White,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Los partidos se guardarán automáticamente al finalizar",
                            fontSize = 14.sp,
                            color = Color.Gray,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(matches) { match ->
                        MatchHistoryItem(
                            match = match,
                            onDelete = { viewModel.deleteMatch(match.id) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun MatchHistoryItem(
    match: MatchHistoryEntry,
    onDelete: () -> Unit
) {
    val isPlayer1Winner = match.winner == 1
    val winnerColor = if (isPlayer1Winner) Player1Blue else Player2Red
    val winnerText = if (isPlayer1Winner) "Equipo 1" else "Equipo 2"
    val setScoreText = match.sets.joinToString(", ") { "${it.player1}-${it.player2}" }
    
    val dateFormat = SimpleDateFormat("d MMM yyyy, HH:mm", Locale("es", "ES"))
    val dateText = dateFormat.format(Date(match.date))

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFF1A1A1A))
            .padding(16.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "$winnerText:",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = winnerColor
                    )
                    Text(
                        text = "${match.setsWon.player1} - ${match.setsWon.player2}",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
                Text(
                    text = "🗑️",
                    fontSize = 18.sp,
                    modifier = Modifier.clickable { onDelete() }
                )
            }
            
            Spacer(modifier = Modifier.height(4.dp))
            
            Text(
                text = setScoreText,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color.White
            )
            
            Spacer(modifier = Modifier.height(4.dp))
            
            Text(
                text = dateText,
                fontSize = 10.sp,
                color = Color(0xFF999999)
            )
        }
    }
}

