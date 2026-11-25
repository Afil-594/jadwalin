# Jadwalin 2.0

A lightweight offline-first personal daily routine tracker. HTML, CSS and vanilla JavaScript; no npm install or build step required.

## Run locally

Open this folder in VS Code and use Live Server (Open with Live Server on index.html). Alternatively, if Python is installed, run `python -m http.server 8000` and open `http://localhost:8000`. Do not open index.html directly via file:// because JavaScript modules and service workers need a server.

## Deploy / update

Deploy the contents of this folder to the existing Cloudflare Pages project (or any HTTPS static host). No build command; output directory is the project root. Keep the same site origin to retain the original localStorage data. Before updating, export a backup from the old app. On first launch, the old `daily-routine-data-v1` key is migrated in place, preserving schedules, workouts and Notion URL. If a different site URL is used, import the old JSON backup in Settings. Refresh twice if the previous service worker still serves the old UI; do not clear site data before backing up. Home-screen icon updates may require removing the old shortcut and reinstalling from the same website (avoid clearing site data).

## Features

- Home: live local time, current/next scheduled activity, manual completion, daily progress, workout information and Notion link.
- Schedule: weekly recurring routines, edit/add/remove/reorder/copy/reset a day, and edit workout information. Changes are applied with Save routine (not autosave). History tab shows recorded days of the current Monday–Sunday week; use Edit to correct completion. Dates that were never opened/recorded show no history. Overnight activities are attributed to their start date in the checklist; current activity can show a previous night's routine.
- Settings: time format, Notion URL, JSON backup/restore, persistent storage request, reset to defaults.
- Tracking is local, resets daily and is pruned at Monday 00:00 in device local time when running or on next launch/resume. Previous days' recorded snapshots are unaffected by recurring schedule edits. Today follows the edited schedule; deleted activities are removed from today's progress. Backup includes only currently retained history. No background execution guarantee when closed. No cloud sync.
- PWA manifest, new J icons and offline app shell. Initial online visit required. Notion is an external online link.

## Logic tests

Run `node tests/tracking.test.mjs` using Node 22+ (or add `--experimental-default-type=module` for compatible older versions). Tests cover migration, tracking, snapshots, rollover, Monday reset, overnight activities, and backup validation. Browser integration and physical Android testing should be performed after deployment.
