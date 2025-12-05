package com.padelscoretracker.domain.model

import kotlinx.serialization.Serializable

/**
 * Represents the score of a completed set
 */
@Serializable
data class SetScore(
    val player1: Int = 0,
    val player2: Int = 0
)

/**
 * Represents the complete match score state
 */
@Serializable
data class MatchScoreV3(
    val sets: List<SetScore> = emptyList(),
    val currentSetGames: SetScore = SetScore(),
    val currentGame: GameScore = GameScore(),
    val isTieBreak: Boolean = false,
    val tieBreakScore: SetScore? = null,
    val totalSets: Int = 3,
    val matchWinner: Int? = null  // 1 or 2, null if match not finished
)

