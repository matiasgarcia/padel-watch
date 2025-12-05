package com.padelscoretracker.data

import com.padelscoretracker.domain.model.MatchHistoryEntry
import kotlinx.coroutines.flow.Flow

/**
 * Repository for match history operations
 */
class MatchHistoryRepository(private val store: MatchHistoryStore) {
    /**
     * Get all matches as a Flow
     */
    fun getAllMatches(): Flow<List<MatchHistoryEntry>> = store.matches

    /**
     * Save a match to history
     */
    suspend fun saveMatch(match: MatchHistoryEntry) {
        store.saveMatch(match)
    }

    /**
     * Delete a match by ID
     */
    suspend fun deleteMatch(matchId: String) {
        store.deleteMatch(matchId)
    }

    /**
     * Clear all history
     */
    suspend fun clearHistory() {
        store.clearHistory()
    }
}

