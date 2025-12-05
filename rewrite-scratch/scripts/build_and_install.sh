#!/bin/bash

set -e

./gradlew assembleDebug 
adb install app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.padelscoretracker/.MainActivity
