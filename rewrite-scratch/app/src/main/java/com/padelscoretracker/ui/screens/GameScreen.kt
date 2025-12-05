package com.padelscoretracker.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.wear.compose.material.Text
import com.padelscoretracker.domain.model.SetScore
import com.padelscoretracker.ui.theme.Player1Blue
import com.padelscoretracker.ui.theme.Player2Red
import com.padelscoretracker.ui.theme.PadelScoreTheme
import com.padelscoretracker.ui.theme.YellowAccent
import com.padelscoretracker.ui.viewmodel.GameViewModel

@Composable
fun GameScreen(
    viewModel: GameViewModel = viewModel(),
    onNavigateHome: () -> Unit,
    onMatchWon: (winner: Int, setsWon: SetScore, sets: List<com.padelscoretracker.domain.model.SetScore>) -> Unit = { _, _, _ -> },
    modifier: Modifier = Modifier
) {
    val matchScore by viewModel.matchScore.collectAsState()
    
    // Check for match winner and navigate
    LaunchedEffect(matchScore.matchWinner) {
        if (matchScore.matchWinner != null) {
            val setsWon = viewModel.getSetsWon()
            onMatchWon(matchScore.matchWinner!!, setsWon, matchScore.sets)
        }
    }

    PadelScoreTheme {
        var dragOffset by remember { mutableStateOf(0f) }
        
        Box(
            modifier = modifier
                .fillMaxSize()
                .pointerInput(Unit) {
                    detectDragGestures(
                        onDragEnd = {
                            // Swipe left to cancel (negative translationX)
                            if (dragOffset < -100f && kotlin.math.abs(dragOffset) > 50f) {
                                onNavigateHome()
                            }
                            dragOffset = 0f
                        }
                    ) { _, dragAmount ->
                        dragOffset += dragAmount.x
                    }
                }
        ) {
            Row(
                modifier = Modifier.fillMaxSize(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                // Left half - Player 1 (Blue)
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight()
                        .background(Player1Blue)
                        .pointerInput(Unit) {
                            detectTapGestures(
                                onTap = {
                                    viewModel.addPoint(1)
                                },
                                onLongPress = {
                                    if (viewModel.canUndo()) {
                                        viewModel.undo()
                                    }
                                }
                            )
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                        modifier = Modifier.padding(16.dp)
                    ) {
                        // Current game points (or tie-break score)
                        val tieBreakScore = matchScore.tieBreakScore
                        val displayScore = if (matchScore.isTieBreak && tieBreakScore != null) {
                            tieBreakScore.player1.toString()
                        } else {
                            matchScore.currentGame.player1.toString()
                        }
                        Text(
                            text = displayScore,
                            fontSize = 48.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            textAlign = TextAlign.Center
                        )
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        // Current set games
                        Text(
                            text = matchScore.currentSetGames.player1.toString(),
                            fontSize = 22.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color.White,
                            textAlign = TextAlign.Center
                        )
                        
                        Spacer(modifier = Modifier.height(4.dp))
                        
                        // Sets won
                        val setsWon = viewModel.getSetsWon()
                        Text(
                            text = setsWon.player1.toString(),
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = YellowAccent,
                            textAlign = TextAlign.Center
                        )
                    }
                }

                // Right half - Player 2 (Red)
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight()
                        .background(Player2Red)
                        .pointerInput(Unit) {
                            detectTapGestures(
                                onTap = {
                                    viewModel.addPoint(2)
                                },
                                onLongPress = {
                                    if (viewModel.canUndo()) {
                                        viewModel.undo()
                                    }
                                }
                            )
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                        modifier = Modifier.padding(16.dp)
                    ) {
                        // Current game points (or tie-break score)
                        val tieBreakScore = matchScore.tieBreakScore
                        val displayScore = if (matchScore.isTieBreak && tieBreakScore != null) {
                            tieBreakScore.player2.toString()
                        } else {
                            matchScore.currentGame.player2.toString()
                        }
                        Text(
                            text = displayScore,
                            fontSize = 48.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            textAlign = TextAlign.Center
                        )
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        // Current set games
                        Text(
                            text = matchScore.currentSetGames.player2.toString(),
                            fontSize = 22.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color.White,
                            textAlign = TextAlign.Center
                        )
                        
                        Spacer(modifier = Modifier.height(4.dp))
                        
                        // Sets won
                        val setsWon = viewModel.getSetsWon()
                        Text(
                            text = setsWon.player2.toString(),
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = YellowAccent,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        }
    }
}

