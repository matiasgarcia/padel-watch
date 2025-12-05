package com.padelscoretracker.ui.viewmodel

import androidx.lifecycle.ViewModel
import com.padelscoretracker.domain.ScoringEngine
import com.padelscoretracker.domain.model.MatchScoreV3
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class GameViewModel : ViewModel() {
    private val scoringEngine = ScoringEngine()

    private val _matchScore = MutableStateFlow<MatchScoreV3>(scoringEngine.matchScore)
    val matchScore: StateFlow<MatchScoreV3> = _matchScore.asStateFlow()

    /**
     * Add a point to the specified player (1 or 2)
     */
    fun addPoint(player: Int) {
        scoringEngine.addPoint(player)
        _matchScore.value = scoringEngine.matchScore
    }

    /**
     * Reset the match
     */
    fun resetMatch() {
        scoringEngine.resetMatch()
        _matchScore.value = scoringEngine.matchScore
    }

    /**
     * Undo the last point
     */
    fun undo() {
        scoringEngine.undo()
        _matchScore.value = scoringEngine.matchScore
    }

    /**
     * Check if undo is possible
     */
    fun canUndo(): Boolean {
        return scoringEngine.canUndo()
    }

    /**
     * Get sets won by each player
     */
    fun getSetsWon() = scoringEngine.getSetsWon()

    /**
     * Get current set number
     */
    fun getCurrentSetNumber() = scoringEngine.getCurrentSetNumber()
}

