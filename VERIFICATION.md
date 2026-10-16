# Verification

Source UI snapshot: commit `98cb4d99e1a959215b811db99bc931210b60fbf0` from `Tidala_FE`. Other work changed that repository during extraction, so comparisons use this stable snapshot.

## Automated checks

- Independent `npm ci` installation from this project's lockfile.
- TypeScript compilation and production build.
- ESLint.
- Nine data-layer tests: OpenAPI metadata fixture compatibility, combined filters/pagination/sorting, invitation and profile persistence, duplicate invitations, account sanctions, report history, metadata CRUD, post actions/statistics, error/empty scenarios, corrupted storage, and failed persistence.
- Browser suite: 14 routes at 390px, 768px, and 1440px; additional dashboard captures at 767px, 1023px, and 1024px. Exercises search, invitations, teacher edits and reload, reviews panel, report dialog, logout, invalid credentials, login, empty state, and error recovery. Records browser exceptions and external API requests.

Results and screenshots are in `artifacts/`. Run the commands in README.md to reproduce against the current app.

## Visual comparison

An isolated reference app used the original UI components from the recorded commit and the same local data/authentication adapters. Compared 12 existing admin routes at 390px and 1440px, plus the dashboard at 767px, 768px, 1023px, and 1024px: **28 paired screenshots matched**.

The comparison uses identical seed data and browser viewport sizes. Screenshot animation capture required normal clock timing; freezing time stalled the source dashboard's animation transitions. The comparator allows a maximum per-channel difference of 12 when counting changed pixels. Per-image exact-match flags and pixel counts are in `artifacts/visual/comparison.json`.

This verifies the captured states and viewports, not every possible UI state. The new mobile profile page and repaired review destination have no corresponding source page to compare. Demo illustrations replace server-hosted user photos. The source's fonts and UI styling are retained.

The comparison scripts are `scripts/visual-compare.mjs` and `scripts/compare-images.py` (the latter requires Pillow). They expect the candidate at `ADMIN_URL` and a reference at `REFERENCE_URL`. The original project is not required to run or build this admin.

## Intentional differences

- Local seeded admin session and persistent mock services replace real authentication/backend access.
- Uploads and address suggestions stay local; OAuth buttons show demo login guidance.
- Missing mobile review/profile destinations are connected.
- Internal lint corrections preserve rendered behavior, including the report target component and desktop media-query subscription.
- Public-site navigation uses `VITE_PUBLIC_SITE_URL`.
- Original settings simulations and legacy mobile placeholders are retained, as described in README.md.
