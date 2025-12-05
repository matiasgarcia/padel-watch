package com.padelscoretracker.utils

import android.util.Log

/**
 * Centralized logging utility for the app
 * All logs use the tag "com.padelscoretracker" for easy filtering
 * 
 * Usage:
 * ```
 * private val logger = AppLogger("ScoringEngine")
 * logger.d("addPoint(player=$player) - BEFORE: ...")
 * ```
 */
class AppLogger(private val component: String) {
    companion object {
        private const val TAG = "com.padelscoretracker"
    }
    
    /**
     * Log a debug message
     * @param message The log message
     */
    fun d(message: String) {
        Log.d(TAG, "$component $message")
    }
    
    /**
     * Log an info message
     */
    fun i(message: String) {
        Log.i(TAG, "$component $message")
    }
    
    /**
     * Log a warning message
     */
    fun w(message: String) {
        Log.w(TAG, "$component $message")
    }
    
    /**
     * Log an error message
     */
    fun e(message: String, throwable: Throwable? = null) {
        if (throwable != null) {
            Log.e(TAG, "$component $message", throwable)
        } else {
            Log.e(TAG, "$component $message")
        }
    }
}

