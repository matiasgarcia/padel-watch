package com.padelscoretracker.domain.model

import kotlinx.serialization.Serializable

/**
 * Represents a single point in a game
 */
@Serializable
sealed class GamePoint {
    @Serializable
    data object Zero : GamePoint() {
        override fun toString() = "0"
    }
    
    @Serializable
    data object Fifteen : GamePoint() {
        override fun toString() = "15"
    }
    
    @Serializable
    data object Thirty : GamePoint() {
        override fun toString() = "30"
    }
    
    @Serializable
    data object Forty : GamePoint() {
        override fun toString() = "40"
    }
    
    @Serializable
    data object Advantage : GamePoint() {
        override fun toString() = "V"
    }
}

/**
 * Represents the current score of a game
 */
@Serializable
data class GameScore(
    val player1: GamePoint = GamePoint.Zero,
    val player2: GamePoint = GamePoint.Zero
)

