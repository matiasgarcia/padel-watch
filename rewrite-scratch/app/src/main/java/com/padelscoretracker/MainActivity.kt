package com.padelscoretracker

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import androidx.wear.compose.material.Scaffold
import com.padelscoretracker.data.MatchHistoryStore
import com.padelscoretracker.ui.navigation.NavGraph
import com.padelscoretracker.ui.theme.PadelScoreTheme

class MainActivity : ComponentActivity() {
    private lateinit var historyStore: MatchHistoryStore

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        historyStore = MatchHistoryStore(applicationContext)

        setContent {
            PadelScoreTheme {
                PadelScoreApp(historyStore = historyStore)
            }
        }
    }
}

@Composable
fun PadelScoreApp(historyStore: MatchHistoryStore) {
    val navController = rememberNavController()
    
    Scaffold(
        modifier = Modifier.fillMaxSize()
    ) {
        NavGraph(
            navController = navController,
            historyStore = historyStore
        )
    }
}

