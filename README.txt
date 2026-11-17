RECALLFLOW — OFFLINE-FIRST PWA

Included:
- Add study sessions with subject, topic, date and optional note
- Automatically schedules revisions using editable day intervals
- Default intervals: 1, 2, 4, 7, 14, 30 (counted from study date)
- Due, overdue and completed revision views
- Local IndexedDB storage; no account, cloud database or analytics
- JSON backup and restore
- Installable PWA with service-worker cache

IMPORTANT LIMITATIONS:
1. PWA installation/service workers require HTTPS or localhost. Opening index.html directly as a file will let you inspect the page, but install/offline caching won't work correctly.
2. This version checks due revisions when the app is opened. Browser notifications are best-effort and are NOT guaranteed to fire at a chosen time while the app is closed. Android browser/PWA background scheduling varies.
3. Data is stored only in this browser on this device. Export a JSON backup regularly. Clearing site data can erase the database.

QUICK START:
- Serve this folder from localhost or an HTTPS static host.
- Open the URL in Chrome on Android.
- Chrome menu > Install app / Add to Home screen.
- Open Settings in RecallFlow and optionally enable notifications.

No Cloudflare, Supabase, login, or ongoing server database is used by the app itself.
