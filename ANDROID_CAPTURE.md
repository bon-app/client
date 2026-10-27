# Android recipe capture

The Android app is based on the recovered cookbook client. It retains the `life.bonapp.app` application ID and keeps the web layout unchanged. The bottom navigation, camera capture, and native microphone service are Android-only.

## Build a debug APK

Use Node.js 24, JDK 21, Android SDK platform 36, and Android build tools. From this directory:

```sh
npm ci
npm run build
npx cap sync android
cd android
./gradlew testDebugUnitTest assembleDebug
```

The output is `android/app/build/outputs/apk/debug/app-debug.apk`. This is a debug-signed test build, not a Play Store release.

The production build reads `src/environments/environment.prod.ts`. Point `apiBaseUrl` at the deployed test API before building if that API is not the existing `/dev/` endpoint. The capture feature needs the matching backend in `../api` and server-side OpenRouter credentials. Installing the APK alone does not deploy the backend.

On a physical Android device, verify camera capture and gallery selection, microphone and notification permission handling, recording while locked and while another app is open, the 4-minute warning, automatic stop at 5 minutes, playback, generation, and saving and deleting retained audio. Android can stop foreground services when the user force-stops an app; retry from the preserved draft after reopening.
