# The Ova App

The Ova app is a personal agenda for turning messy thoughts into simple tasks, tags, follow-ups, mood notes, and a daily overview.

## Run Locally

Open this file in a browser:

```text
index.html
```

No install step is required for local mode.

## Account Mode

The app is prepared for Firebase sign-in and cloud sync. Until Firebase is configured, it stays in local mode.

To use it from any laptop:

1. Create a Firebase project.
2. Enable Email/Password sign-in.
3. Create a Firestore database.
4. Add the rules from `firestore.rules`.
5. Copy your web app config into `firebase-config.js`.
6. Host the static files with GitHub Pages, Firebase Hosting, or another static host.

## Current Features

- Add an entry from "What's in my mind..."
- Get a shorter editable title from the original entry.
- Set due date, due time, reminder type, tags, and urgent marker.
- Use one-time, daily, weekly, monthly, or continuously ongoing reminders.
- Add follow-ups with timestamps.
- Keep completed items at the bottom.
- View summary, suggested focus, ongoing items, calendar, tag bars, keyword cloud, and mood trajectory.
- Store locally by default, or sync to your account after Firebase setup.

## Hidden Notes

- Click the date/mood box three times to open a small moment journal.
- Click `Mood trajectory` three times to view the journal log.
- Click outside the journal log to hide it again.

## Data Privacy

In local mode, entries stay in the browser. In account mode, entries are stored under your signed-in user ID in Firestore.
