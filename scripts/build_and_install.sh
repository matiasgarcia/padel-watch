set -e
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

./android/gradlew -p android assembleRelease
adb devices
adb install -r android/app/build/outputs/apk/release/app-release.apk