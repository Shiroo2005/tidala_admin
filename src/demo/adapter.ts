import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';
import { demoAdmin, SCENARIO_KEY, type DemoTeacher, type ContractTag } from './fixtures';
import { readDatabase, saveDatabase, paginate } from './store';
import type { TeacherProfileUpdatePayload } from '../features/admin/teacher-management-v2/types';
import type { ResolveReportRequest } from '../features/admin/report-management/types/report.type';
import type { DrivingCenter } from '../shared/types/common.type';
export function handleDemoRequest(config: InternalAxiosRequestConfig, storage: Storage = localStorage): unknown {
    const url = new URL(config.url || '/', 'http://demo.local');
    const path = url.pathname, method = (config.method || 'get').toLowerCase();
    const params: Record<string, unknown> = { ...Object.fromEntries(url.searchParams), ...config.params };
    const body = (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) || {};
    const db = readDatabase(storage);
    const fail = (message: string, status = 404): never => { throw new AxiosError(message, String(status), config, undefined, { data: { code: 'DEMO_ERROR', message }, status, statusText: message, headers: {}, config }); };
    const required = <T>(item: T | undefined): T => item ?? fail('Không tìm thấy dữ liệu');
    const scenario = storage.getItem(SCENARIO_KEY);
    if (scenario === 'error')
        fail('Lỗi mô phỏng. Xóa kịch bản để thử lại.', 503);
    const page = <T>(rows: T[]) => paginate(scenario === 'empty' ? [] : rows, params);
    const persist = (result: unknown) => { saveDatabase(storage, db); return result; };
    if (path === '/v1/account')
        return demoAdmin;
    if (path === '/admin/teachers' && method === 'get')
        return page(db.teachers);
    if (path === '/admin/students' && method === 'get')
        return page(db.students);
    if (path === '/admin/teachers/invite' && method === 'post') {
        if (db.teachers.some(t => t.email.toLowerCase() === String(body.email).toLowerCase()))
            fail('Email đã tồn tại', 409);
        const template = structuredClone(db.teachers[0]);
        const id = crypto.randomUUID();
        const teacher: DemoTeacher = { ...template, id, userId: id, email: body.email, contactEmail: body.email, fullName: body.fullName, status: 'DRAFT', suspension: null, phone: '', phoneNumber: '', contactPhoneNumber: '', bio: '', description: '', realPhotos: [], trainings: [], teachingCars: [], tags: [], districts: [], drivingCenters: [], totalReviews: 0, totalLikes: 0, totalViews: 0, averageRating: 0, avgRating: 0, invitedAt: new Date().toISOString(), acceptedAt: undefined, createdAt: new Date().toISOString(), reviewSummary: { teacherUserId: id, averageRating: 0, totalReviews: 0, stars: [] } };
        db.teachers.unshift(teacher);
        return persist({ userId: id, email: teacher.email, fullName: teacher.fullName });
    }
    const teacherMatch = /^\/admin\/teachers\/([^/]+)(\/profile)?$/.exec(path);
    if (teacherMatch) {
        const teacher = required(db.teachers.find(t => t.id === teacherMatch[1]));
        if (method === 'get')
            return teacher;
        if (method === 'put') {
            const update = body as TeacherProfileUpdatePayload;
            const { trainingLevels, districtIds, drivingCenterIds, tagIds, teachingCars, ...values } = update;
            Object.assign(teacher, values, { updatedAt: new Date().toISOString() });
            if (trainingLevels)
                teacher.trainings = trainingLevels.map(t => ({ ...t, teacherUserId: teacher.id, trainingLevelName: required(db.levels.find(l => l.id === t.trainingLevelId)).name }));
            if (districtIds)
                teacher.districts = districtIds.map(id => { const d = required(db.districts.find(d => d.id === id)); return { districtId: id, districtName: d.name, provinceId: d.provinceId, provinceName: required(db.provinces.find(p => p.id === d.provinceId)).name }; });
            if (teacher.districts[0])
                teacher.province = required(db.provinces.find(p => p.id === teacher.districts[0].provinceId));
            if (drivingCenterIds)
                teacher.drivingCenters = db.centers.filter(c => drivingCenterIds.includes(c.id));
            if (tagIds)
                teacher.tags = db.tags.filter(t => tagIds.includes(t.id)).map(t => ({ ...t, type: t.type === 'STYLE' ? 'style' : 'specialty' }));
            if (teachingCars)
                teacher.teachingCars = teachingCars.map(c => ({ ...c, id: crypto.randomUUID(), teacherUserId: teacher.id, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
            return persist(teacher);
        }
    }
    const sanction = /^\/v1\/admin\/accounts\/([^/]+)\/(sanction|unsanction)$/.exec(path);
    if (sanction && method === 'post') {
        const account = required([...db.teachers, ...db.students].find(t => t.id === sanction[1]));
        if (sanction[2] === 'unsanction') {
            account.status = 'ACTIVE';
            account.suspension = null;
        }
        else if (body.type !== 'WARNING') {
            account.status = body.type === 'BAN' ? 'BANNED' : 'INACTIVE';
            account.suspension = { sanctionId: crypto.randomUUID(), reason: typeof body.reason === 'string' ? body.reason : JSON.stringify(body.reason), startAt: new Date().toISOString(), endAt: body.type === 'BAN' ? '2099-12-31T00:00:00Z' : new Date(Date.now() + (body.durationDays || 7) * 86400000).toISOString() };
        }
        return persist(account);
    }
    if (path.startsWith('/admin/stats/')) {
        const period = String(params.period || 'ALL');
        const since = period === 'TODAY' ? 1 : period === 'WEEK' ? 7 : period === 'MONTH' ? 30 : Infinity;
        const recent = (item: {
            createdAt?: string;
        }) => since === Infinity || Date.parse(item.createdAt || '') >= Date.parse('2026-10-02T23:59:59Z') - since * 86400000;
        const teachers = db.teachers.filter(recent), posts = db.posts.filter(recent), reports = db.reports.filter(recent), users = [...teachers, ...db.students.filter(recent)];
        if (scenario === 'empty')
            return { total: 0, active: 0, inactive: 0, banned: 0, success: 0, draft: 0, teacher: 0, post: 0, comment: 0, review: 0, knowledge: 0, qAndA: 0 };
        if (path.endsWith('/users'))
            return { total: users.length, active: users.filter(x => x.status === 'ACTIVE').length, inactive: users.filter(x => x.status !== 'ACTIVE' && x.status !== 'BANNED').length, banned: users.filter(x => x.status === 'BANNED').length };
        if (path.endsWith('/teachers'))
            return { total: teachers.length, success: teachers.filter(t => t.status !== 'DRAFT').length, draft: teachers.filter(t => t.status === 'DRAFT').length };
        if (path.endsWith('/reports'))
            return { total: reports.length, teacher: reports.filter(r => r.targetType === 'TEACHER').length, post: reports.filter(r => r.targetType === 'POST').length, comment: reports.filter(r => r.targetType === 'COMMENT').length, review: reports.filter(r => r.targetType === 'REVIEW').length };
        if (path.endsWith('/posts'))
            return { total: posts.length, knowledge: posts.filter(p => p.type === 'KNOWLEDGE').length, qAndA: posts.filter(p => p.type === 'Q_AND_A').length };
    }
    if (path === '/admin/reports')
        return page(db.reports);
    const received = /^\/admin\/users\/([^/]+)\/received$/.exec(path);
    if (received)
        return page(db.reports.filter(r => r.targetId === received[1]));
    const reportMatch = /^\/admin\/reports\/([^/]+)(\/resolve)?$/.exec(path);
    if (reportMatch) {
        const report = required(db.reports.find(r => r.id === reportMatch[1]));
        if (method === 'get')
            return report;
        if (method === 'post') {
            const update = body as ResolveReportRequest;
            Object.assign(report, { status: update.status, resolvedAt: update.status === 'RESOLVED' || update.status === 'REJECTED' ? new Date().toISOString() : null, updatedAt: new Date().toISOString() });
            report.history.push({ id: crypto.randomUUID(), handler: demoAdmin, ...update, reason: update.reason || null, metadata: update.metadata || null, createdAt: new Date().toISOString() });
            return persist(report);
        }
    }
    if (['/v1/posts', '/v1/posts/search', '/v1/posts/pinned'].includes(path))
        return page(path.endsWith('/pinned') ? db.posts.filter(p => p.pinnedAt) : db.posts);
    const postMatch = /^\/v1\/posts\/([^/]+)(\/pin|\/comments)?$/.exec(path);
    if (postMatch) {
        const post = required(db.posts.find(p => p.id === postMatch[1]));
        if (postMatch[2] === '/comments')
            return page([]);
        if (postMatch[2] === '/pin') {
            post.pinnedAt = method === 'delete' ? null : new Date().toISOString();
            return persist(post);
        }
        if (method === 'delete') {
            db.posts = db.posts.filter(p => p.id !== post.id);
            return persist(null);
        }
        return post;
    }
    if (path === '/v1/tags' || path.startsWith('/v1/tags/')) {
        const id = path.split('/')[3];
        if (method === 'get')
            return (scenario === 'empty' ? [] : db.tags).filter(t => !params.type || t.type === String(params.type).toUpperCase()).map(t => ({ ...t, type: t.type.toLowerCase() }));
        if (method === 'post') {
            const input = (Array.isArray(body) ? body : body.tags || []) as ContractTag[];
            const added = input.map(t => ({ ...t, id: crypto.randomUUID(), slug: t.name.toLowerCase().replaceAll(' ', '-'), type: t.type.toUpperCase() as ContractTag['type'] }));
            db.tags.push(...added);
            return persist(added);
        }
        const tag = required(db.tags.find(t => t.id === id));
        if (method === 'put') {
            Object.assign(tag, body, { type: String(body.type || tag.type).toUpperCase() });
            db.teachers.forEach(t => { t.tags = t.tags.map(existing => existing.id === id ? { ...tag, type: tag.type === 'STYLE' ? 'style' : 'specialty' } : existing); });
        }
        if (method === 'delete') {
            db.tags = db.tags.filter(t => t.id !== id);
            db.teachers.forEach(t => { t.tags = t.tags.filter(tag => tag.id !== id); });
        }
        return persist(tag);
    }
    if (path === '/v1/training-levels' || path.startsWith('/v1/training-levels/')) {
        const id = path.split('/')[3];
        if (method === 'get')
            return page(db.levels);
        if (method === 'post') {
            const input = Array.isArray(body) ? body : body.trainingLevels || [];
            const added = input.map((l: {
                name: string;
                description: string;
            }, i: number) => ({ ...l, id: crypto.randomUUID(), slug: l.name.toLowerCase().replaceAll(' ', '-'), orderPosition: db.levels.length + i }));
            db.levels.push(...added);
            return persist(added);
        }
        const level = required(db.levels.find(l => l.id === id));
        if (method === 'put') {
            Object.assign(level, body);
            db.teachers.forEach(t => { t.trainings = t.trainings.map(existing => existing.trainingLevelId === id ? { ...existing, trainingLevelName: level.name, trainingLevelDescription: level.description } : existing); });
        }
        if (method === 'delete') {
            db.levels = db.levels.filter(l => l.id !== id);
            db.teachers.forEach(t => { t.trainings = t.trainings.filter(l => l.trainingLevelId !== id); });
        }
        return persist(level);
    }
    if (path === '/v1/provinces')
        return page(db.provinces);
    if (path === '/v2/provinces')
        return db.provinces;
    if (path.startsWith('/v1/provinces/')) {
        const p = required(db.provinces.find(p => p.id === path.split('/')[3]));
        return { ...p, districts: db.districts.filter(d => d.provinceId === p.id) };
    }
    if (path === '/v1/driving-centers/bulk' && method === 'post') {
        const added = (body as DrivingCenter[]).map(c => ({ ...c, id: crypto.randomUUID() }));
        db.centers.push(...added);
        return persist(added);
    }
    const reviewMatch = /^\/v1\/reviews\/teachers\/([^/]+)(\/summary)?$/.exec(path);
    if (reviewMatch) {
        const teacher = required(db.teachers.find(t => t.id === reviewMatch[1]));
        return reviewMatch[2] ? teacher.reviewSummary : page(db.reviews.filter(r => r.teacherUserId === teacher.id));
    }
    if (path === '/v1/notifications')
        return page([]);
    if (path.startsWith('/v1/notifications/') && method !== 'get')
        return null;
    return fail(`Demo chưa hỗ trợ: ${method.toUpperCase()} ${path}`, 501);
}
export const demoAdapter: AxiosAdapter = async (config) => {
    const scenario = localStorage.getItem(SCENARIO_KEY);
    await new Promise(resolve => setTimeout(resolve, scenario === 'loading' ? 15000 : 180));
    return { data: handleDemoRequest(config), status: 200, statusText: 'OK', headers: {}, config };
};
