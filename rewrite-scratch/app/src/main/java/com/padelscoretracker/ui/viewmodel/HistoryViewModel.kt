package com.padelscoretracker.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.padelscoretracker.data.MatchHistoryRepository
import com.padelscoretracker.domain.model.MatchHistoryEntry
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class HistoryViewModel(
    private val repository: MatchHistoryRepository
) : ViewModel() {
    private val _matches = MutableStateFlow<List<MatchHistoryEntry>>(emptyList())
    val matches: StateFlow<List<MatchHistoryEntry>> = _matches.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    init {
        loadHistory()
    }

    /**
     * Load match history from repository
     */
    fun loadHistory() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                repository.getAllMatches().collect { matchList ->
                    _matches.value = matchList.sortedByDescending { it.date }
                    _isLoading.value = false
                }
            } catch (e: Exception) {
                _isLoading.value = false
            }
        }
    }

    /**
     * Delete a match by ID
     */
    fun deleteMatch(matchId: String) {
        viewModelScope.launch {
            repository.deleteMatch(matchId)
        }
    }

    /**
     * Clear all history
     */
    fun clearHistory() {
        viewModelScope.launch {
            repository.clearHistory()
        }
    }

    /**
     * Save a match to history
     */
    fun saveMatch(match: com.padelscoretracker.domain.model.MatchHistoryEntry) {
        viewModelScope.launch {
            repository.saveMatch(match)
        }
    }
}

