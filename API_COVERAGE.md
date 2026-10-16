# API reference and demo boundary

The reference is the user-supplied `api-1 (5).json` (OpenAPI 3.1). `src/generated/api.ts` is generated from that exact file. Generated types describe the reference API; they do not imply that the demo connects to it.

The source admin uses older routes and view models. Its services retain those interfaces so the extracted screens and interactions stay consistent. The local adapter returns the response shape each service expects, with no network fallback.

| Area | Reference API | Demo implementation |
| --- | --- | --- |
| Tags | `/api/v1/tags`, CRUD and bulk creation | **Live** (via `liveAdapter`; the fixture note no longer applies). |
| Training levels | `/api/v1/training-levels`, CRUD and bulk creation | **Live** (via `liveAdapter`; the fixture note no longer applies). |
| Provinces and districts | `/api/v1/provinces`, `/api/v1/districts` | **Live** (via `liveAdapter`; the fixture note no longer applies). |
| Posts | Admin list/detail/status, post deletion | **Live.** List, search, category filter and detail use `/api/v1/admin/posts` (filtered and paged locally, since the admin list has no keyword/category filter); deletion uses the admin delete. Pinning has no endpoint and is refused. |
| Reports | Teacher/review reports and resolution | **Live.** Teacher and review reports, detail and per-user history. The backend returns only the reporter's id, so reporter names are placeholders. `DISMISSED` is shown as `REJECTED`; the post tab and the "reviewing" filter are always empty. Reasons map to the closest UI reason. Resolving records only an outcome and a note, so dismissing works, but warn/hide/ban actions are refused until the backend can carry them out. |
| Teachers and students | Public teacher profiles; no matching admin user-management API | **Teachers live, read-only.** List and detail come from the public directory (completed profiles only, no email/phone/account status; every listed teacher shows as active). Reviews and rating summary are live. Invite, profile edit and sanctions on teachers are refused. Students remain local demo records. |
| Dashboard | No matching admin statistics endpoints | Statistics are calculated from the local database, with period filters and updated counts after mutations. |
| Authentication | Login, current user, refresh, logout | **Live.** Email/password login, `/auth/me`, token refresh and logout against the backend; non-admin accounts are rejected. No OAuth. |
| Uploads | `/api/v1/image-uploads` | Still local. Its only consumer, teacher profile editing, has no admin endpoint. Backend images are shown from `VITE_IMAGE_URL_PREFIX` (default `https://cdn-dev.tidala.vn`). |
| Address autocomplete | No matching autocomplete API | Local driving-center suggestions and deterministic demo coordinates. |
| Settings | No matching settings API | Retains the existing simulated controls. |

**Update:** Authentication, tags, training levels, provinces/districts, posts, reports and teachers (read-only) now call the reference API through `src/config/liveAdapter.ts` and `src/config/live/`, which translates the screens' older request/response shapes. Tag bulk-create issues one POST per tag, since the reference API has no bulk tag endpoint. Students, dashboard user counts, address autocomplete, uploads and settings are still demo-only. For the rest, live integration is a separate task: implement adapters for the reference schemas and obtain missing admin APIs before connecting the legacy features. Do not simply replace the demo adapter with a network base URL.
