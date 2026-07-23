# The Ova App

The Ova app is a personal agenda and reminder tool for turning narrative thoughts into organized entries, summaries, tags, keyword clouds, mood tracking, and follow-ups.

## Run Locally

Open this file in a browser:

```text
index.html
```

No install step is required for local mode.

## Current Features

- Add agenda entries from a plain-language thought.
- Automatically create a shorter editable title.
- Add target due date, due time, reminder type, and urgent marker.
- Use built-in or custom colored tags.
- Add follow-up comments with timestamps.
- Keep completed items at the bottom of the agenda list.
- View automatic summary, suggested focus, ongoing items, calendar dots, tag counts, keyword cloud, and mood trajectory.
- Store local data in the browser.

## Account-Ready Mode

The app includes Firebase-ready account and cloud-sync code, but it runs in local mode until Firebase is configured.

To enable accounts:

1. Create a Firebase project.
2. Enable Email/Password Authentication.
3. Create a Cloud Firestore database.
4. Publish the rules in `firestore.rules`.
5. Copy values from your Firebase web app config into `firebase-config.js`.

The example shape is in:

```text
firebase-config.example.js
```

## Data Privacy

In local mode, each person's entries are stored only in their own browser. Sharing this project on GitHub does not share your personal agenda data.
