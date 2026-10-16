import { DATABASE_KEY, seedDatabase, type DemoDatabase } from './fixtures';
export interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
export function readDatabase(storage: StorageLike): DemoDatabase {
    const raw = storage.getItem(DATABASE_KEY);
    if (raw) {
        try {
            const parsed = JSON.parse(raw) as DemoDatabase;
            if (Object.keys(seedDatabase()).every(key => Array.isArray(parsed[key as keyof DemoDatabase])))
                return parsed;
        }
        catch { /* Reset invalid or obsolete fixtures. */ }
    }
    const db = seedDatabase();
    storage.setItem(DATABASE_KEY, JSON.stringify(db));
    return db;
}
export function saveDatabase(storage: StorageLike, db: DemoDatabase) {
    // Persist before reporting success, so quota failures never look like successful edits.
    storage.setItem(DATABASE_KEY, JSON.stringify(db));
}
const field = (row: unknown, key: string): unknown => {
    const normalized = key.replace(/^user\./, '');
    return normalized.split('.').reduce<unknown>((value, part) => value && typeof value === 'object' ? (value as Record<string, unknown>)[part] : undefined, row);
};
export function paginate<T>(items: T[], params: Record<string, unknown> = {}) {
    let rows = [...items];
    const filter = String(params.filter || '');
    const search = String(params.keyword || /~~'\*((?:''|[^'])*)\*'/.exec(filter)?.[1] || '').replace(/''/g, "'").toLocaleLowerCase('vi');
    if (search)
        rows = rows.filter(row => ['fullName', 'email', 'phoneNumber', 'title', 'description', 'reporterName', 'reporterEmail'].some(key => String(field(row, key) || '').toLocaleLowerCase('vi').includes(search)));
    for (const match of filter.matchAll(/([\w.]+):'([^']*)'/g))
        rows = rows.filter(row => String(field(row, match[1])) === match[2]);
    const boolean = /hasCurrentStudents:(true|false)/.exec(filter);
    if (boolean)
        rows = rows.filter(row => field(row, 'hasCurrentStudents') === (boolean[1] === 'true'));
    const list = (key: string) => Array.isArray(params[key]) ? params[key] as string[] : params[key] ? String(params[key]).split(',') : [];
    for (const key of ['status', 'postTypes']) {
        const selected = list(key).filter(x => x !== 'ALL');
        if (selected.length)
            rows = rows.filter(row => selected.includes(String(field(row, key === 'postTypes' ? 'type' : 'status'))));
    }
    for (const [parameter, property, idKey] of [['trainingLevelIds', 'trainings', 'trainingLevelId'], ['districtIds', 'districts', 'districtId'], ['provinceIds', 'districts', 'provinceId']]) {
        const selected = list(parameter);
        if (selected.length)
            rows = rows.filter(row => ((field(row, property) || []) as Record<string, unknown>[]).some(value => selected.includes(String(value[idKey]))));
    }
    const sorts = Array.isArray(params.sort) ? params.sort as string[] : params.sort ? [String(params.sort)] : [];
    if (sorts.length)
        rows.sort((a, b) => {
            for (const sort of sorts) {
                const [rawKey, rawDirection] = sort.split(',');
                const key = rawKey.replace(/^[-+]/, '');
                const direction = rawKey.startsWith('-') ? 'desc' : rawDirection;
                const x = field(a, key), y = field(b, key);
                const result = typeof x === 'number' && typeof y === 'number' ? x - y : String(x ?? '').localeCompare(String(y ?? ''), 'vi');
                if (result)
                    return direction === 'desc' ? -result : result;
            }
            return 0;
        });
    const page = Math.max(0, Number(params.page) || 0), size = Math.max(1, Number(params.size) || 10);
    const totalElements = rows.length, totalPages = Math.ceil(totalElements / size);
    return { content: rows.slice(page * size, (page + 1) * size), page, number: page, size, totalElements, totalPages, first: page === 0, last: page >= totalPages - 1, empty: totalElements === 0 };
}
