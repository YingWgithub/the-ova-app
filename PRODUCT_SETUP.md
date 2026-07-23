# The Ova App Product Setup

This app now has an account-ready structure:

- Local mode works with browser storage when `firebase-config.js` is not configured.
- Account mode uses Firebase Authentication for sign in.
- Synced agenda data is stored in Cloud Firestore at `users/{uid}/ova/state`.
- Firestore rules in `firestore.rules` restrict each user to their own data.

## Turn On Accounts

1. Create a Firebase project.
2. Register a web app in that Firebase project.
3. Enable Authentication with the Email/Password provider.
4. Create a Cloud Firestore database.
5. Publish the rules from `firestore.rules`.
6. Copy `firebase-config.example.js` into `firebase-config.js`.
7. Replace the placeholder values in `firebase-config.js` with your Firebase web app config.

After that, the account form appears in the app. When a user signs in, their entries, moods, and custom tags sync to their account.

## Data Model

Each user owns one document:

```text
users/{uid}/ova/state
```

That document stores:

- `items`
- `moods`
- `customTags`
- `schemaVersion`
- `updatedAt`

This is intentionally simple for the first real-product version. It can later be split into separate documents per agenda entry if you want collaboration, sharing, history, or large-scale querying.
