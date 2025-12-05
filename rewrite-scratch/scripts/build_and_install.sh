#!/bin/bash

set -e

./gradlew assembleDebug
adb uninstall com.padelscoretracker 
adb install app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.padelscoretracker/.MainActivity

# Clear logcat and redirect to debug.log (recreate file if exists), also output to terminal
adb logcat -c
adb logcat -s "com.padelscoretracker" 2>&1 | tee debug.log
