package com.padelscoretracker.utils

import android.util.Log

/**
 * Centralized logging utility for the app
 * All logs use the tag "com.padelscoretracker" for easy filtering
 */
object AppLogger {
    private const val TAG = "com.padelscoretracker"
    
    /**
     * Log a debug message with the component name
     * @param component The component/class name (e.g., "ScoringEngine", "GameViewModel")
     * @param message The log message
     */
    fun d(component: String, message: String) {
        Log.d(TAG, "$component $message")
    }
    
    /**
     * Log an info message with the component name
     */
    fun i(component: String, message: String) {
        Log.i(TAG, "$component $message")
    }
    
    /**
     * Log a warning message with the component name
     */
    fun w(component: String, message: String) {
        Log.w(TAG, "$component $message")
    }
    
    /**
     * Log an error message with the component name
     */
    fun e(component: String, message: String, throwable: Throwable? = null) {
        if (throwable != null) {
            Log.e(TAG, "$component $message", throwable)
        } else {
            Log.e(TAG, "$component $message")
        }
    }
}

