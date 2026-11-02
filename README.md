# F5L ALTIMETER DASHBOARD

The dashboard is installable as a Progressive Web App when served over HTTPS. It caches the app shell for offline startup. The installed version stays in use until the user taps the top-right **Update** button, which enables when a newer Railway deployment is available.

Use **All flights** in the flight selector to display every flight graph. For a `.vlo` import the data is already available; with Bluetooth, uncached flights are downloaded sequentially from the board with progress shown in the app.

When publishing a release, update `WEB_VERSION` in `index.html` and the matching cache version in `sw.js`. A new service worker waits in the background; the Update button activates it and reloads the app.
