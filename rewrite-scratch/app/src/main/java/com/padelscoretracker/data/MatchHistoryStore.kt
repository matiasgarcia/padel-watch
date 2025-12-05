package com.padelscoretracker.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.padelscoretracker.domain.model.MatchHistoryEntry
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.encodeToString
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "match_history")

private val MATCH_HISTORY_KEY = stringPreferencesKey("match_history")

class MatchHistoryStore(private val context: Context) {
    private val json = Json {
        ignoreUnknownKeys = true
        encodeDefaults = true
    }

    /**
     * Get all matches from storage
     */
    val matches: Flow<List<MatchHistoryEntry>> = context.dataStore.data.map { preferences ->
        val jsonString = preferences[MATCH_HISTORY_KEY] ?: "[]"
        try {
            json.decodeFromString<List<MatchHistoryEntry>>(jsonString)
        } catch (e: Exception) {
            emptyList()
        }
    }

    /**
     * Save a match to history
     */
    suspend fun saveMatch(match: MatchHistoryEntry) {
        context.dataStore.edit { preferences ->
            val currentMatches = try {
                val jsonString = preferences[MATCH_HISTORY_KEY] ?: "[]"
                json.decodeFromString<List<MatchHistoryEntry>>(jsonString)
            } catch (e: Exception) {
                emptyList()
            }
            val updatedMatches = listOf(match) + currentMatches
            preferences[MATCH_HISTORY_KEY] = json.encodeToString(updatedMatches)
        }
    }

    /**
     * Delete a match by ID
     */
    suspend fun deleteMatch(matchId: String) {
        context.dataStore.edit { preferences ->
            val currentMatches = try {
                val jsonString = preferences[MATCH_HISTORY_KEY] ?: "[]"
                json.decodeFromString<List<MatchHistoryEntry>>(jsonString)
            } catch (e: Exception) {
                emptyList()
            }
            val updatedMatches = currentMatches.filter { it.id != matchId }
            preferences[MATCH_HISTORY_KEY] = json.encodeToString(updatedMatches)
        }
    }

    /**
     * Clear all match history
     */
    suspend fun clearHistory() {
        context.dataStore.edit { preferences ->
            preferences.remove(MATCH_HISTORY_KEY)
        }
    }
}

