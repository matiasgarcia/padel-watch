# Padel Score Tracker - Native WearOS

Native Android/WearOS application for tracking padel match scores, rewritten from React Native using Kotlin and Jetpack Compose for Wear OS.

## Features

- Complete padel scoring system:
  - Points: 0 → 15 → 30 → 40 → advantage → game won
  - Deuce (40-40) handling
  - Tie-break in sets 1 and 2 (first to 7 with difference of 2)
  - No tie-break in set 3 (play until difference of 2 games)
  - Best of 3 sets match format
- Split-screen game interface (blue for player 1, red for player 2)
- Long press to undo last point
- Swipe left to cancel match
- Match history with automatic saving
- Haptic feedback on interactions
- Optimized for Wear OS round screens

## Architecture

- **Language**: Kotlin
- **UI Framework**: Jetpack Compose for Wear OS
- **Architecture**: MVVM (Model-View-ViewModel)
- **Storage**: DataStore (Preferences)
- **Navigation**: Navigation Compose for Wear OS
- **State Management**: StateFlow

## Project Structure

```
app/src/main/java/com/padelscoretracker/
├── data/
│   ├── MatchHistoryStore.kt       # DataStore implementation
│   └── MatchHistoryRepository.kt   # Repository pattern
├── domain/
│   ├── model/
│   │   ├── GameScore.kt           # Game point types
│   │   ├── MatchScore.kt          # Match score data classes
│   │   └── MatchHistoryEntry.kt   # History entry model
│   └── ScoringEngine.kt           # Core scoring logic
├── ui/
│   ├── navigation/
│   │   └── NavGraph.kt            # Navigation setup
│   ├── screens/
│   │   ├── HomeScreen.kt          # Home screen
│   │   ├── GameScreen.kt           # Game screen (split view)
│   │   ├── VictoryScreen.kt       # Victory screen
│   │   └── HistoryScreen.kt       # History screen
│   ├── theme/
│   │   ├── Theme.kt                # Material theme
│   │   └── Type.kt                # Typography
│   └── viewmodel/
│       ├── GameViewModel.kt       # Game state management
│       └── HistoryViewModel.kt     # History state management
└── MainActivity.kt                  # Main activity
```

## Building

1. Open the project in Android Studio
2. Ensure you have:
   - Android SDK with API 28+ (Wear OS 3.0+)
   - Gradle 8.2+
   - Kotlin 1.9.20+

3. Build and run:
   ```bash
   ./gradlew assembleDebug
   ```

4. Install on Wear OS device or emulator:
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

## Requirements

- **minSdkVersion**: 28 (Wear OS 3.0+)
- **targetSdkVersion**: 34 (Wear OS 5.0)
- **Wear OS device** or **Wear OS emulator**

## Usage

1. Launch the app on your Wear OS device
2. Tap "Empezar" to start a new match
3. Tap left side (blue) to add point to Player 1
4. Tap right side (red) to add point to Player 2
5. Long press either side to undo last point
6. Swipe left to cancel match and return home
7. View match history by tapping "Historial" on home screen

## Scoring Rules

- **Points**: 0 → 15 → 30 → 40 → advantage → game won
- **Deuce**: When both players reach 40, next point gives advantage
- **Game Win**: Win with 2 points after 40 (or advantage)
- **Set Win**: 
  - Sets 1-2: Win with 6 games and difference of 2, or 7-5, or 7-6 (tie-break)
  - Set 3: Win with 6+ games and difference of 2 (no tie-break)
- **Tie-break**: First to 7 points with difference of 2 (sets 1-2 only)
- **Match Win**: First to win 2 sets

## Notes

- This is a fresh rewrite with a new data format (no migration from React Native app)
- All match history is stored locally using DataStore
- The app is optimized for round Wear OS screens
- Haptic feedback is provided for better user experience

