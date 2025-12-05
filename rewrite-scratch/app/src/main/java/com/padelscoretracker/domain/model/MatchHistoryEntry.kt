package com.padelscoretracker.domain.model

import kotlinx.serialization.Serializable

/**
 * Represents a completed match in the history
 */
@Serializable
data class MatchHistoryEntry(
    val id: String,
    val date: Long, // timestamp
    val winner: Int, // 1 or 2
    val sets: List<SetScore>,
    val setsWon: SetScore
)

