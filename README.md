# Tidala Admin

Standalone Vietnamese admin demo extracted from `Tidala_FE`. It keeps the existing desktop sidebar, mobile navigation, typography, colors, forms, tables, charts, dialogs, and responsive layouts. The original frontend and the separate lowercase `tidala-admin` project are not dependencies.

## Run

Requires Node.js 22.15+ (verified with Node 24) and npm.

```sh
npm ci
npm run dev
```

Open **http://localhost:3000**. Sign in with a backend admin account.

Sign in with a real **ADMIN** account from the backend (`VITE_API_BASE_URL`, default `https://dev-v2-api.tidala.vn`). Non-admin accounts are rejected. Copy `.env.example` to `.env.local` to change the backend or `VITE_PUBLIC_SITE_URL`.

**Live vs demo.** Login, session refresh, logout, tags, training levels, provinces/districts, posts, reports, teachers (read-only) and students call the real backend. Actions without a backend endpoint (post pinning, teacher invite/edit/sanctions, warn/hide/ban from a report) fail with an explicit "Backend chưa hỗ trợ" message. Uploads and settings still run on local demo data. See [API_COVERAGE.md](API_COVERAGE.md).

Smoke-test the live calls (read-only): `node --env-file-if-exists=.env.local scripts/live-check.mjs`. Set `TIDALA_ADMIN_EMAIL` and `TIDALA_ADMIN_PASSWORD` in `.env.local` to include the signed-in checks.

## Included screens

Dashboard; teachers; teacher detail, editing and invitations; students; mobile user management; tags and training levels; posts and post detail; report moderation; settings. The two formerly missing mobile destinations now open review moderation and the admin profile/logout page.

Existing `/quan-tri/...` paths are retained. `/` and `/quan-tri` open the dashboard. Desktop and mobile layouts use the source breakpoints at 768px and 1024px.

## Demo data

The Axios adapter in `src/demo/adapter.ts` handles all application API requests locally. Unsupported requests fail explicitly instead of falling through to a live server. Fixtures contain 32 teachers, 27 students, 24 posts, 28 reports, location data, tags, training levels, and reviews.

Teacher invitations/edits, account sanctions, tags/training levels, post pinning/deletion, and report resolution persist in browser storage. Uploaded images are read locally and stored with the demo data; browser storage capacity limits apply. Fixture photos are local illustrative assets. Google Fonts remains the source of the original Lexend/Inter fonts.

Reset the demo in the browser console:

```js
for (const key of Object.keys(localStorage)) {
  if (key.startsWith('tidala-admin-demo.')) localStorage.removeItem(key);
}
location.reload();
```

For reproducible UI states, set `tidala-admin-demo.scenario` to `empty`, `error`, or `loading`, then reload. `loading` delays responses by 15 seconds. Remove the key and reload to recover. These scenarios do not overwrite saved records.

The source's settings controls remain simulations. Its legacy mobile student-detail button and legacy mobile report-card actions remain placeholders; use the student management and report moderation screens for implemented management actions. The demo credentials and seeded session are exclusively for this demo.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Browser checks require a running dev server:

```sh
npx playwright install chromium
npm run test:e2e
```

To use an installed Chrome instead, set `CHROME_PATH=/path/to/chrome`. Set `ADMIN_URL` to test another local origin. Screenshots and results are written to `artifacts/`.

The OpenAPI reference is `references/openapi.json`, copied from `api-1 (6).json`. Run `npm run generate:api` after replacing that reference. See [API_COVERAGE.md](API_COVERAGE.md) for the differences between the existing admin UI and this contract, and [VERIFICATION.md](VERIFICATION.md) for checked behavior and visual comparison details.

## Build and deployment

`npm run build` creates `dist/`. Serve it as a static SPA, with unknown paths falling back to `index.html`. Vercel and Netlify-compatible rewrite files are included. `npm run preview -- --port 4174` previews the production build.

The build intentionally retains the original component libraries to preserve the UI. Vite reports a large initial JavaScript chunk; route splitting can be a later optimization. PWA/service-worker registration and the public site's social SDK were excluded from this standalone admin.
