package com.padelscoretracker.domain

import android.util.Log
import com.padelscoretracker.domain.model.GamePoint
import com.padelscoretracker.domain.model.GameScore
import com.padelscoretracker.domain.model.MatchScoreV3
import com.padelscoretracker.domain.model.SetScore

/**
 * Engine for managing padel scoring logic
 * 
 * Rules implemented:
 * - Match is best of 3 sets (win 2 sets to win match)
 * - Set is won with 6 games and difference of 2, or 7-5, or 7-6 after tie-break
 * - Sets 1 and 2: tie-break at 6-6 (first to 7 with difference of 2)
 * - Set 3: NO tie-break, play until difference of 2 games
 * - Points: 0 → 15 → 30 → 40 → advantage → game won
 * - Deuce (40-40): requires advantage and then game point
 */
class ScoringEngine {
    private val history = mutableListOf<MatchScoreV3>()
    
    var matchScore: MatchScoreV3 = MatchScoreV3()
        private set

    init {
        resetMatch()
    }

    /**
     * Get current set number (1, 2, or 3)
     */
    fun getCurrentSetNumber(): Int {
        return matchScore.sets.size + 1
    }

    /**
     * Get number of sets won by each player
     */
    fun getSetsWon(): SetScore {
        return SetScore(
            player1 = matchScore.sets.count { it.player1 > it.player2 },
            player2 = matchScore.sets.count { it.player2 > it.player1 }
        )
    }

    /**
     * Check if tie-break should be played in current set
     * Rule: Sets 1 and 2 have tie-break at 6-6, Set 3 does NOT
     */
    private fun shouldPlayTieBreak(
        player1Games: Int,
        player2Games: Int
    ): Boolean {
        if (player1Games == 6 && player2Games == 6) {
            val currentSet = getCurrentSetNumber()
            // In set 3, NO tie-break
            if (currentSet == 3) {
                return false
            }
            return true
        }
        return false
    }

    /**
     * Check if a set is won
     * Rules:
     * - 6 games with minimum difference of 2
     * - 7-5 (if reaches 5-5)
     * - 7-6 if wins tie-break
     * - In set 3: play until difference of 2 (no tie-break)
     */
    private fun checkSetWin(
        player1Games: Int,
        player2Games: Int
    ): Pair<Boolean, Int?> { // (won, winner: 1 or 2, null if not won)
        val currentSet = getCurrentSetNumber()

        // In set 3, no tie-break, play until difference of 2
        if (currentSet == 3) {
            if (player1Games >= 6 && player1Games - player2Games >= 2) {
                return Pair(true, 1)
            }
            if (player2Games >= 6 && player2Games - player1Games >= 2) {
                return Pair(true, 2)
            }
            return Pair(false, null)
        }

        // Sets 1 and 2: win with 6 games and advantage of 2
        if (player1Games >= 6 && player1Games - player2Games >= 2) {
            return Pair(true, 1)
        }
        if (player2Games >= 6 && player2Games - player1Games >= 2) {
            return Pair(true, 2)
        }

        // Win with 7-5
        if (player1Games == 7 && player2Games == 5) {
            return Pair(true, 1)
        }
        if (player2Games == 7 && player1Games == 5) {
            return Pair(true, 2)
        }

        return Pair(false, null)
    }

    /**
     * Check if tie-break is won
     * Win with 7 points and minimum advantage of 2
     */
    private fun checkTieBreakWin(
        player1Points: Int,
        player2Points: Int
    ): Pair<Boolean, Int?> {
        if (player1Points >= 7 && player1Points - player2Points >= 2) {
            return Pair(true, 1)
        }
        if (player2Points >= 7 && player2Points - player1Points >= 2) {
            return Pair(true, 2)
        }
        return Pair(false, null)
    }

    /**
     * Check if match is won
     * Win by winning 2 sets out of 3
     */
    private fun checkMatchWin(sets: List<SetScore>): Int? {
        val setsWon = SetScore(
            player1 = sets.count { it.player1 > it.player2 },
            player2 = sets.count { it.player2 > it.player1 }
        )

        if (setsWon.player1 >= 2) return 1
        if (setsWon.player2 >= 2) return 2
        return null
    }

    /**
     * Get next point in game sequence
     */
    private fun getNextPoint(
        currentPoint: GamePoint,
        opponentPoint: GamePoint
    ): GamePoint? { // Returns null if game is won
        when (currentPoint) {
            is GamePoint.Zero -> return GamePoint.Fifteen
            is GamePoint.Fifteen -> return GamePoint.Thirty
            is GamePoint.Thirty -> return GamePoint.Forty
            
            is GamePoint.Forty -> {
                // If opponent is also at 40, go to advantage
                if (opponentPoint is GamePoint.Forty) {
                    return GamePoint.Advantage
                }
                // If opponent is below 40, win the game
                return null // WIN
            }
            
            is GamePoint.Advantage -> {
                // If has advantage, win the game
                return null // WIN
            }
        }
    }

    /**
     * Handle when a player wins a game
     */
    private fun handleGameWin(prev: MatchScoreV3, player: Int): MatchScoreV3 {
        val newPlayer1Games = if (player == 1) prev.currentSetGames.player1 + 1 else prev.currentSetGames.player1
        val newPlayer2Games = if (player == 2) prev.currentSetGames.player2 + 1 else prev.currentSetGames.player2

        val newCurrentSetGames = SetScore(
            player1 = newPlayer1Games,
            player2 = newPlayer2Games
        )

        // Check if tie-break should be played (6-6)
        if (shouldPlayTieBreak(newPlayer1Games, newPlayer2Games)) {
            return prev.copy(
                currentSetGames = newCurrentSetGames,
                currentGame = GameScore(),
                isTieBreak = true,
                tieBreakScore = SetScore()
            )
        }

        // Check if set is won
        val (setWon, setWinner) = checkSetWin(newPlayer1Games, newPlayer2Games)
        if (setWon && setWinner != null) {
            // Add completed set to history
            val completedSet = SetScore(
                player1 = newPlayer1Games,
                player2 = newPlayer2Games
            )
            val newSets = prev.sets + completedSet

            // Check if match is won
            val matchWinner = checkMatchWin(newSets)

            return prev.copy(
                sets = newSets,
                currentSetGames = SetScore(),
                currentGame = GameScore(),
                isTieBreak = false,
                tieBreakScore = null,
                matchWinner = matchWinner
            )
        }

        // Continue set (not won yet)
        return prev.copy(
            currentSetGames = newCurrentSetGames,
            currentGame = GameScore()
        )
    }

    /**
     * Handle when a player wins tie-break (and therefore the set)
     */
    private fun handleTieBreakWin(prev: MatchScoreV3, player: Int): MatchScoreV3 {
        // Winner of tie-break wins the set (7-6)
        val completedSet = if (player == 1) {
            SetScore(player1 = 7, player2 = 6)
        } else {
            SetScore(player1 = 6, player2 = 7)
        }

        val newSets = prev.sets + completedSet

        // Check if match is won
        val matchWinner = checkMatchWin(newSets)

        return prev.copy(
            sets = newSets,
            currentSetGames = SetScore(),
            currentGame = GameScore(),
            isTieBreak = false,
            tieBreakScore = null,
            matchWinner = matchWinner
        )
    }

    /**
     * Add a point to the specified player
     */
    fun addPoint(player: Int) {
        // If there's already a winner, do nothing
        if (matchScore.matchWinner != null) {
            return
        }

        // Log current state before saving
        val currentGameScore = "${matchScore.currentGame.player1}-${matchScore.currentGame.player2}"
        Log.d("ScoringEngine", "addPoint(player=$player) - BEFORE: game=$currentGameScore, history.size=${history.size}")
        
        // Save current state to history
        history.add(matchScore.copy())
        if (history.size > 50) {
            history.removeAt(0)
        }
        
        Log.d("ScoringEngine", "addPoint(player=$player) - SAVED to history: game=$currentGameScore, history.size=${history.size}")

        // If in tie-break
        val tieBreakScore = matchScore.tieBreakScore
        if (matchScore.isTieBreak && tieBreakScore != null) {
            val newTieBreakScore = if (player == 1) {
                tieBreakScore.copy(player1 = tieBreakScore.player1 + 1)
            } else {
                tieBreakScore.copy(player2 = tieBreakScore.player2 + 1)
            }

            // Check if tie-break is won
            val (tieBreakWon, tieBreakWinner) = checkTieBreakWin(
                newTieBreakScore.player1,
                newTieBreakScore.player2
            )

            if (tieBreakWon && tieBreakWinner != null) {
                matchScore = handleTieBreakWin(matchScore, tieBreakWinner)
                Log.d("ScoringEngine", "addPoint(player=$player) - AFTER: tie-break won by player $tieBreakWinner")
                return
            }

            // Continue tie-break
            matchScore = matchScore.copy(tieBreakScore = newTieBreakScore)
            Log.d("ScoringEngine", "addPoint(player=$player) - AFTER: tie-break score=${newTieBreakScore.player1}-${newTieBreakScore.player2}")
            return
        }

        // Normal game
        val currentGame = matchScore.currentGame
        val currentPoint = if (player == 1) currentGame.player1 else currentGame.player2
        val opponentPoint = if (player == 1) currentGame.player2 else currentGame.player1

        // Case: both at 40 (deuce)
        if (currentPoint is GamePoint.Forty && opponentPoint is GamePoint.Forty) {
            matchScore = matchScore.copy(
                currentGame = if (player == 1) {
                    currentGame.copy(player1 = GamePoint.Advantage)
                } else {
                    currentGame.copy(player2 = GamePoint.Advantage)
                }
            )
            val finalGameScore = "${matchScore.currentGame.player1}-${matchScore.currentGame.player2}"
            Log.d("ScoringEngine", "addPoint(player=$player) - AFTER: deuce -> advantage, game=$finalGameScore")
            return
        }

        // Case: player has advantage and opponent has 40
        if (currentPoint is GamePoint.Advantage && opponentPoint is GamePoint.Forty) {
            matchScore = handleGameWin(matchScore, player)
            Log.d("ScoringEngine", "addPoint(player=$player) - AFTER: game won from advantage")
            return
        }

        // Case: player has 40 and opponent has advantage (lose advantage)
        if (currentPoint is GamePoint.Forty && opponentPoint is GamePoint.Advantage) {
            matchScore = matchScore.copy(
                currentGame = GameScore(
                    player1 = GamePoint.Forty,
                    player2 = GamePoint.Forty
                )
            )
            val finalGameScore = "${matchScore.currentGame.player1}-${matchScore.currentGame.player2}"
            Log.d("ScoringEngine", "addPoint(player=$player) - AFTER: advantage lost, back to deuce, game=$finalGameScore")
            return
        }

        // Case: player has advantage and opponent is not at 40
        if (currentPoint is GamePoint.Advantage && opponentPoint !is GamePoint.Forty) {
            matchScore = handleGameWin(matchScore, player)
            Log.d("ScoringEngine", "addPoint(player=$player) - AFTER: game won from advantage (opponent not at 40)")
            return
        }

        // Normal case: increment point
        val nextPoint = getNextPoint(currentPoint, opponentPoint)
        if (nextPoint == null) {
            // Game won
            matchScore = handleGameWin(matchScore, player)
            Log.d("ScoringEngine", "addPoint(player=$player) - AFTER: game won (nextPoint is null)")
            return
        }

        matchScore = matchScore.copy(
            currentGame = if (player == 1) {
                currentGame.copy(player1 = nextPoint)
            } else {
                currentGame.copy(player2 = nextPoint)
            }
        )
        
        // Log final state after point added
        val finalGameScore = "${matchScore.currentGame.player1}-${matchScore.currentGame.player2}"
        Log.d("ScoringEngine", "addPoint(player=$player) - AFTER: game=$finalGameScore")
    }

    /**
     * Reset the complete match
     */
    fun resetMatch() {
        matchScore = MatchScoreV3()
        history.clear()
        history.add(matchScore.copy())
        Log.d("ScoringEngine", "resetMatch() - Match reset, history.size=${history.size}")
    }

    /**
     * Undo the last point
     */
    fun undo() {
        val currentGameScore = "${matchScore.currentGame.player1}-${matchScore.currentGame.player2}"
        Log.d("ScoringEngine", "undo() - BEFORE: game=$currentGameScore, history.size=${history.size}")
        
        if (history.size > 1) {
            // Log all history entries for debugging
            history.forEachIndexed { index, state ->
                val histGameScore = "${state.currentGame.player1}-${state.currentGame.player2}"
                Log.d("ScoringEngine", "undo() - history[$index]: game=$histGameScore")
            }
            
            history.removeAt(history.size - 1)
            matchScore = history.last().copy()
            
            val restoredGameScore = "${matchScore.currentGame.player1}-${matchScore.currentGame.player2}"
            Log.d("ScoringEngine", "undo() - AFTER: game=$restoredGameScore, history.size=${history.size}")
        } else {
            Log.d("ScoringEngine", "undo() - Cannot undo: history.size=${history.size}")
        }
    }

    /**
     * Check if undo is possible
     */
    fun canUndo(): Boolean {
        return history.size > 1
    }
}

