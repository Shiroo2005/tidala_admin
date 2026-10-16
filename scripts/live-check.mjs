// Read-only smoke test of the real-API adapter against the backend (no create/update/delete).
// Admin checks run only when TIDALA_ADMIN_EMAIL / TIDALA_ADMIN_PASSWORD are set, e.g.
//   node --env-file-if-exists=.env.local scripts/live-check.mjs
import { build } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const out = path.resolve('tests/.compiled/live-check.bundle.mjs');
await mkdir(path.dirname(out), { recursive: true });
const store = new Map();
globalThis.localStorage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) };
globalThis.window = { dispatchEvent() {}, addEventListener() {}, removeEventListener() {} };
globalThis.CustomEvent = class { constructor(type) { this.type = type; } };
const entry = path.resolve('tests/.compiled/live-check.entry.ts');
await writeFile(entry, "export { axiosInstance } from '@/config/axios';\nexport { authService } from '@/services/auth/auth.service';\n");
await build({
  configFile: false, logLevel: 'error', root: path.resolve('.'),
  resolve: { alias: { '@': path.resolve('src') } },
  define: { 'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL ?? '') },
  build: { ssr: entry, outDir: path.dirname(out), emptyOutDir: false, minify: false, rollupOptions: { output: { entryFileNames: path.basename(out), format: 'es' } } },
  ssr: { noExternal: true },
});
const { axiosInstance, authService } = await import(pathToFileURL(out));

let failed = 0;
const check = async (name, fn) => {
  try { await fn(); console.log(`ok   ${name}`); }
  catch (e) { failed++; console.log(`FAIL ${name}: ${e.message ?? JSON.stringify(e)}`); }
};
const expect = (cond, msg) => { if (!cond) throw new Error(msg); return true; };

await check('login with unknown account maps to INVALID_CREDENTIALS', async () => {
  try { await authService.login('no-such-user@tidala-check.invalid', 'wrong-password-123'); }
  catch (e) { return expect(e.code === 'INVALID_CREDENTIALS', `got ${JSON.stringify(e).slice(0, 200)}`); }
  throw new Error('login unexpectedly succeeded');
});

await check('teachers: directory list, detail by id, reviews and summary (public)', async () => {
  const page = await axiosInstance.get('/admin/teachers', { params: { page: 0, size: 5 } });
  expect(Array.isArray(page.content) && page.totalElements > 0, `list: ${JSON.stringify(page).slice(0, 200)}`);
  const id = page.content[0].id;
  const detail = await axiosInstance.get(`/admin/teachers/${id}`);
  expect(detail.userId === id && Array.isArray(detail.trainings) && Array.isArray(detail.realPhotos), 'detail shape');
  expect(!detail.avatarUrl || detail.avatarUrl.startsWith('http'), `avatar not a URL: ${detail.avatarUrl}`);
  const reviews = await axiosInstance.get(`/v1/reviews/teachers/${id}?page=0&size=5&sort=createdAt%2Cdesc`);
  const summary = await axiosInstance.get(`/v1/reviews/teachers/${id}/summary`);
  expect(Array.isArray(reviews.content) && summary.stars.length === 5, 'reviews shape');
  console.log(`     ${page.totalElements} teachers; ${detail.fullName}: ${summary.totalReviews} reviews`);
});

await check('teacher edits are refused, not faked', async () => {
  const { content } = await axiosInstance.get('/admin/teachers', { params: { page: 0, size: 1 } });
  try { await axiosInstance.put(`/admin/teachers/${content[0].id}/profile`, {}); }
  catch (e) { return expect(e.response?.status === 501, `status ${e.response?.status}`); }
  throw new Error('edit unexpectedly succeeded');
});

const email = process.env.TIDALA_ADMIN_EMAIL, password = process.env.TIDALA_ADMIN_PASSWORD;
if (!email || !password) console.log('skip authenticated checks: TIDALA_ADMIN_EMAIL / TIDALA_ADMIN_PASSWORD not set');
else {
  await check('admin login', async () => expect((await authService.login(email, password)).role === 'ADMIN', 'role'));
  await check('/v1/account returns the admin', async () => expect((await axiosInstance.get('/v1/account')).role === 'ADMIN', 'role'));
  await check('tags list is a lowercase-typed array', async () => {
    const tags = await axiosInstance.get('/v1/tags');
    return expect(Array.isArray(tags) && tags.every(t => ['style', 'specialty'].includes(t.type)), `bad shape: ${JSON.stringify(tags).slice(0, 200)}`);
  });
  await check('training levels page (junk sort param dropped)', async () => {
    const page = await axiosInstance.get('/v1/training-levels', { params: { page: 0, size: 200, sort: ['string'] } });
    return expect(Array.isArray(page.content), JSON.stringify(page).slice(0, 200));
  });
  await check('provinces: page, v2 list, detail with districts', async () => {
    const page = await axiosInstance.get('/v1/provinces', { params: { page: 0, size: 200, sort: ['string'] } });
    const all = await axiosInstance.get('/v2/provinces');
    expect(Array.isArray(page.content) && Array.isArray(all), 'list shape');
    if (!all.length) return true;
    const detail = await axiosInstance.get(`/v1/provinces/${all[0].id}`);
    return expect(detail.id === all[0].id && Array.isArray(detail.districts), 'detail shape');
  });
  await check('dashboard stats derive from real lists', async () => {
    for (const period of ['ALL', 'WEEK']) {
      const [teachers, reports, posts] = await Promise.all(['teachers', 'reports', 'posts'].map(k => axiosInstance.get(`/admin/stats/${k}`, { params: { period } })));
      expect(Number.isInteger(teachers.total) && Number.isInteger(reports.total) && Number.isInteger(posts.total), 'counts');
      expect(reports.teacher + reports.review === reports.total, 'report split');
      console.log(`     ${period}: teachers ${teachers.total}, reports ${reports.total}, posts ${posts.total}`);
    }
  });
  await check('posts: admin list, search, category filter, detail', async () => {
    const page = await axiosInstance.get('/v1/posts/search?keyword=&postTypes=', { params: { page: 0, size: 5 } });
    expect(Array.isArray(page.content), JSON.stringify(page).slice(0, 200));
    const knowledge = await axiosInstance.get('/v1/posts/search?keyword=&postTypes=KNOWLEDGE', { params: { page: 0, size: 50 } });
    expect(knowledge.content.every(p => p.type === 'KNOWLEDGE'), 'category filter');
    console.log(`     ${page.totalElements} posts, ${knowledge.totalElements} knowledge`);
    if (!page.content.length) return true;
    const detail = await axiosInstance.get(`/v1/posts/${page.content[0].id}`);
    return expect(detail.id === page.content[0].id && typeof detail.content === 'string' && detail.owner?.fullName, 'detail shape');
  });
  await check('reports: per-type lists, status filter, detail', async () => {
    for (const type of ['TEACHER', 'REVIEW']) {
      const page = await axiosInstance.get('/admin/reports', { params: { filter: `targetType:'${type}'`, page: 0, size: 20 } });
      expect(page.content.every(r => r.targetType === type && r.target), `${type} shape`);
      console.log(`     ${type}: ${page.totalElements} reports`);
      if (page.content[0]) expect((await axiosInstance.get(`/admin/reports/${page.content[0].id}`)).id === page.content[0].id, 'detail');
    }
    const posts = await axiosInstance.get('/admin/reports', { params: { filter: "targetType:'POST'", page: 0, size: 20 } });
    return expect(posts.totalElements === 0, 'post reports should be empty');
  });
  await check('demo-only route still served locally', async () => expect(Array.isArray((await axiosInstance.get('/admin/students')).content), 'students'));
  await check('logout clears tokens', async () => { await authService.logout(); return expect(!localStorage.getItem('access_token'), 'token left'); });
}
process.exit(failed ? 1 : 0);
