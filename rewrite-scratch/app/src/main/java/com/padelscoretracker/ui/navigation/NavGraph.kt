package com.padelscoretracker.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.navOptions
import androidx.wear.compose.navigation.SwipeDismissableNavHost
import androidx.wear.compose.navigation.composable
import androidx.wear.compose.navigation.rememberSwipeDismissableNavController
import com.padelscoretracker.data.MatchHistoryRepository
import com.padelscoretracker.data.MatchHistoryStore
import com.padelscoretracker.domain.model.SetScore
import com.padelscoretracker.ui.screens.GameScreen
import com.padelscoretracker.ui.screens.HistoryScreen
import com.padelscoretracker.ui.screens.HomeScreen
import com.padelscoretracker.ui.screens.VictoryScreen
import com.padelscoretracker.ui.viewmodel.GameViewModel
import com.padelscoretracker.ui.viewmodel.HistoryViewModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Game : Screen("game")
    object Victory : Screen("victory/{winner}/{player1Sets}/{player2Sets}/{sets}") {
        fun createRoute(winner: Int, setsWon: SetScore, sets: List<SetScore>): String {
            val setsString = sets.joinToString(";") { "${it.player1},${it.player2}" }
            return "victory/$winner/${setsWon.player1}/${setsWon.player2}/$setsString"
        }
    }
    object History : Screen("history")
}

@Composable
fun NavGraph(
    navController: NavHostController,
    historyStore: MatchHistoryStore
) {
    val repository = MatchHistoryRepository(historyStore)
    
    SwipeDismissableNavHost(
        navController = navController,
        startDestination = Screen.Home.route
    ) {
        composable(Screen.Home.route) {
            HomeScreen(
                onStartGame = {
                    navController.navigate(Screen.Game.route)
                },
                onViewHistory = {
                    navController.navigate(Screen.History.route)
                }
            )
        }
        
        composable(Screen.Game.route) {
            val gameViewModel: GameViewModel = viewModel()
            
            GameScreen(
                viewModel = gameViewModel,
                onNavigateHome = {
                    navController.popBackStack()
                    navController.navigate(Screen.Home.route)
                },
                onMatchWon = { winner, setsWon, sets ->
                    // Clear back stack to prevent going back to game
                    navController.popBackStack(Screen.Home.route, inclusive = false)
                    navController.navigate(Screen.Victory.createRoute(winner, setsWon, sets))
                }
            )
        }
        
        composable(Screen.Victory.route) { backStackEntry ->
            val winner = backStackEntry.arguments?.getString("winner")?.toIntOrNull() ?: 1
            val player1Sets = backStackEntry.arguments?.getString("player1Sets")?.toIntOrNull() ?: 0
            val player2Sets = backStackEntry.arguments?.getString("player2Sets")?.toIntOrNull() ?: 0
            val setsString = backStackEntry.arguments?.getString("sets") ?: ""
            
            val sets = if (setsString.isNotEmpty()) {
                setsString.split(";").mapNotNull { setStr ->
                    val parts = setStr.split(",")
                    if (parts.size == 2) {
                        SetScore(
                            player1 = parts[0].toIntOrNull() ?: 0,
                            player2 = parts[1].toIntOrNull() ?: 0
                        )
                    } else null
                }
            } else emptyList()
            
            val setsWon = SetScore(player1 = player1Sets, player2 = player2Sets)
            
            VictoryScreen(
                winner = winner,
                setsWon = setsWon,
                sets = sets,
                onNavigateHome = {
                    navController.popBackStack()
                    navController.navigate(Screen.Home.route)
                },
                onSaveMatch = { match ->
                    // Save match to history using repository directly
                    CoroutineScope(Dispatchers.IO).launch {
                        repository.saveMatch(match)
                    }
                }
            )
        }
        
        composable(Screen.History.route) {
            val historyViewModel: HistoryViewModel = viewModel(
                factory = HistoryViewModelFactory(repository)
            )
            
            HistoryScreen(
                viewModel = historyViewModel,
                onNavigateBack = {
                    navController.popBackStack()
                }
            )
        }
    }
}

// Factory for HistoryViewModel
class HistoryViewModelFactory(
    private val repository: MatchHistoryRepository
) : androidx.lifecycle.ViewModelProvider.Factory {
    override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(HistoryViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return HistoryViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}

