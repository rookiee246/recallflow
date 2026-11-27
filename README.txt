RECALLFLOW 3.1  (PWA + Android app build)

YOUR WORKFLOW
Study -> give material to ChatGPT -> copy the JSON it returns -> RecallFlow > AI Import > paste > Preview > Import -> revise when reminded.

FIRST-TIME SETUP IN CHATGPT
1. Open RecallFlow > AI Import > "Copy ChatGPT prompt". Paste it as the first message of your study conversation (also saved here as STUDY_PROCESSOR_PROMPT.txt).
2. Before sending new material, tap "Copy my topic list" and paste it into ChatGPT. This keeps topic names identical, which prevents duplicates.
3. Paste the JSON ChatGPT returns into AI Import. If ChatGPT's JSON is broken, the error tells you what to ask it.

UPLOADING TO GITHUB (replace the old files)
Use a laptop/desktop browser if you can (phone browsers handle folder uploads badly).
1. Unzip this file.
2. Open github.com/rookiee246/recallflow > Add file > Upload files.
3. Drag in index.html, app.js, styles.css, sw.js, manifest.webmanifest, README.txt, SCHEMA.md, STUDY_PROCESSOR_PROMPT.txt, sample-import.json and the folder android-build (skip it if you are on a phone; the build then makes its own key, so a later rebuilt APK needs the old app uninstalled first, so export a backup before that). The icons folder is unchanged. Same names replace the old ones. Commit changes.
4. The Android build file lives in a hidden folder, so add it separately: Add file > Create new file > type  .github/workflows/build-android.yml  as the name (typing the slashes creates the folders) > paste the contents of that file from the ZIP > Commit.
5. Settings > Pages must still be: Deploy from a branch > main > / (root). Wait about a minute, open the site, and refresh once. The PWA updates itself from then on.

INSTALL THE PWA
Android Chrome: open https://rookiee246.github.io/recallflow/ > menu (three dots) > Install app / Add to Home screen.
Browser notifications only appear while the app is open. A web app cannot schedule notifications for a closed app. That is a browser limit, not something that can be fixed in code.

ANDROID APP (reminders that work when the app is closed)
1. GitHub repo > Actions tab > "Build Android APK" > Run workflow. If GitHub asks, click the green button to enable Actions first.
2. Wait about 5 to 10 minutes. Open the repo's Releases section (right side of the main page) and download RecallFlow.apk on your phone.
3. Open the file and allow installing from your browser or Files app when Android asks. No app builder is installed on your phone, and the build happens on GitHub's servers.
4. Open RecallFlow > Settings > set the reminder time > Enable reminders > allow notifications.
Permissions used: notifications and "run after restart" only. No storage, camera, contacts or location. Photos are added through Android's built-in picker.
Android tips: set RecallFlow battery use to Unrestricted, and turn off "Remove permissions if app isn't used" in the app's settings, otherwise Android may silence reminders. Reminders are scheduled 45 days ahead and refreshed every time you open the app.
Your data is stored per app: the web version and the Android app do not share topics. Use Settings > Export backup, then Import backup, to move data between them.
Later builds install over the old app and keep your data (the signing key is included).

PHOTOS
Add images from the topic editor (Edit). Pasting an image while typing in the topic form also works where the browser allows it. Images are stored on the device in IndexedDB and are included in backups.

REVISION SCHEDULE (unchanged)
Day 1, 2, 4, 7, 14, 21, 28. After a confident Day 28: 1, 2, 3, 4, then 6 months. Red retries in 2 days, orange in 14 days. Studying or importing a topic never marks it as mastered; "In long-term review" only counts topics you have rated confident through the whole first cycle.

DATA
Everything stays on this device. No account, cloud backup or AI service. Export a backup now and then (Settings). Deleting browser data or uninstalling the app erases topics.
