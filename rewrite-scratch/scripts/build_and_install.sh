#!/bin/bash

set -e

./gradlew assembleDebug
adb uninstall com.padelscoretracker 
adb install app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.padelscoretracker/.MainActivity
adb logcat -s "com.padelscoretracker"
