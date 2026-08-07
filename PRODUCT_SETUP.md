# The Ova App Product Setup

This app can run in two modes:

- Local mode: open `index.html`; data stays in browser storage.
- Account mode: sign in with Firebase; data syncs through Firestore.

## Turn On Account Mode

1. Create a Firebase project.
2. Enable Authentication with Email/Password.
3. Create a Cloud Firestore database.
4. Publish the rules in `firestore.rules`.
5. Copy the values from your Firebase web app config into `firebase-config.js`.
6. Host `index.html`, `app.js`, `styles.css`, and `firebase-config.js` on a static host.

## Data Model

The app stores:

- `items`
- `moods`
- `journals`
- `customTags`

In account mode, those fields live at:

```text
users/{uid}/ova/state
```
