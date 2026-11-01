# CheckPoint APK Downloads Folder

Place your compiled production Android APK file here with the filename:
`checkpoint-v1.0.apk`

The promotion website will serve this file directly when visitors tap **"Download Android APK"** or scan the on-page QR code with their mobile devices.

### How to build a release APK using Android Studio / CLI:
1. Open the Android project in Android Studio:
   `frontend/android`
2. Build APK:
   `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`
3. Copy the output APK (`app-debug.apk` or `app-release.apk`) to this directory:
   ```bash
   cp frontend/android/app/build/outputs/apk/debug/app-debug.apk promotion/downloads/checkpoint-v1.0.apk
   ```
