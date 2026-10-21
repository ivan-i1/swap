# Swap — Android & iOS apps

The game ships to the Play Store and App Store with [Capacitor](https://capacitorjs.com/): the Vite build in
`dist/` is copied into a native shell (`android/`, `ios/`) that shows it in the system WebView (Chromium on
Android, WKWebView on iOS). WebGL, Web Audio and multi-touch work there as in a mobile browser, so the game
code is the same as on the web; nothing is translated between native and Phaser.

What the app adds on top of the web build:

| | |
|---|---|
| Touch controls | `src/input/touchControls.ts` — ◀ ▶ ↻ on the left, SELECT / SWAP / JUMP on the right. Each button holds the matching key (arrows, Space, S, X, R) in the shared key latch (`src/input/keyLatch.ts`) that the keyboard also feeds. Shown on touch devices during levels only. |
| Layout | Landscape only; safe-area aware (notches, home indicator); immersive full screen on Android, status bar hidden on iOS. |
| Android back | Level / end screen → title; title → close the app (`src/native.ts`). |
| Identity | `org.dinosaurriders.swap`, "Swap", version 1.0.0 (1). **The app id is permanent once uploaded.** |
| Icon / splash | Generated from `resources/icon.png` and `resources/splash.png` (`npm run mobile:assets`). The art is a placeholder built from Sarah's sprite — replace the two PNGs and re-run to change it. |
| Permissions | None. Everything is bundled; the app makes no network requests. |

## Prerequisites

- Node 22+, then `npm install` in `web/`.
- **Android:** Android SDK (API 36) and **JDK 21** — Capacitor 8 does not build with 17. Android Studio's
  bundled JDK works: `export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"`.
- **iOS:** Xcode 26+ (Swift Package Manager, no CocoaPods), an Apple Developer Program membership.

## Everyday commands

```sh
npm run mobile:sync     # build the game and copy it into both native projects
npm run android:apk     # debug APK → android/app/build/outputs/apk/debug/app-debug.apk
npx cap run android     # build, install and launch on a connected device/emulator
npm run ios:open        # open the Xcode project (run on a simulator/device from there)
```

## Play Store release

1. **Create the upload key once** and back it up somewhere safe (losing it means a key reset through Play
   support):

   ```sh
   keytool -genkeypair -v -keystore ~/keys/swap-upload.jks -alias upload \
     -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Create `android/keystore.properties` (gitignored, never commit it):

   ```properties
   storeFile=/Users/you/keys/swap-upload.jks
   storePassword=…
   keyAlias=upload
   keyPassword=…
   ```

3. `npm run android:bundle` → `android/app/build/outputs/bundle/release/app-release.aab`, signed with the
   upload key. Without `keystore.properties` the bundle is built unsigned and Play will reject it.
4. In Play Console: create the app, enable Play App Signing, upload the `.aab` to an internal testing track
   first. Data safety: no data collected or shared.
5. For every later upload bump `versionCode` (and `versionName`) in `android/app/build.gradle`.

## App Store release

1. `npm run ios:open`, select the **App** target → *Signing & Capabilities* → choose your Team (automatic
   signing creates the distribution certificate and profile). The bundle id is `org.dinosaurriders.swap`;
   register it in App Store Connect when creating the app record.
2. Choose *Any iOS Device (arm64)* → *Product ▸ Archive* → *Distribute App ▸ App Store Connect ▸ Upload*.
3. Export compliance is pre-answered (`ITSAppUsesNonExemptEncryption = NO`). Privacy: no data collected.
4. For every later upload bump *Version* / *Build* (`MARKETING_VERSION` / `CURRENT_PROJECT_VERSION`).

## Store listing still to prepare

Screenshots (landscape; Play phone + 7"/10" tablet, App Store 6.9" iPhone and 13" iPad), a 1024×500 Play
feature graphic, descriptions, a privacy policy URL (required by both stores even for "no data collected"),
and content rating questionnaires. The original game credits the Dinosaur Riders team — confirm you hold the
rights to publish the art, music and name before submitting.
