# The Ova App Product Setup

This app is currently local-only:

- It runs by opening `index.html` in a browser.
- It stores agenda entries, moods, journal notes, follow-ups, and custom tags in that browser's local storage.
- No server, account, install step, or cloud database is required.

## Sharing With Friends

Friends can clone or download the GitHub repo and open `index.html` locally. Their data will be separate from yours because browser local storage is device/browser-specific.

## Data Model

Local storage keeps:

- `items`
- `moods`
- `journals`
- `customTags`

This can later be moved to a real account system when you are ready for access across devices, collaboration, sharing, history, or larger-scale querying.
