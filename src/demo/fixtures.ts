import type { AdminUser } from '../features/account/types/type';
import type { AdminTeacherDetail } from '../features/admin/teacher-management-v2/types';
import type { AdminStudentDetail } from '../features/admin/student-management/types';
import type { ReportDetailData } from '../features/admin/report-management/types/report.type';
import type { TeacherDetail, DrivingCenter, ReviewResponse } from '../shared/types/common.type';
import type { Post } from '../shared/types/post.type';
import type { components } from '../generated/api';
export const DATABASE_KEY = 'tidala-admin-demo.database.v1';
export const SESSION_KEY = 'tidala-admin-demo.session.v1';
export const SCENARIO_KEY = 'tidala-admin-demo.scenario';
export const FIXED_NOW = '2026-10-02T08:00:00Z';
export const demoAdmin: AdminUser = { id: 'admin-demo', fullName: 'Quản trị viên Tidala', email: 'admin@tidala.demo', role: 'ADMIN', phoneNumber: '0901234567', avatarUrl: '/demo/avatar.svg', createdAt: FIXED_NOW };
export type DemoTeacher = TeacherDetail & AdminTeacherDetail;
export type ContractTag = Required<Pick<components['schemas']['TagResponse'], 'id' | 'name' | 'slug' | 'type'>>;
export type ContractTrainingLevel = Required<components['schemas']['TrainingLevelResponse']>;
export type ContractProvince = Required<Pick<components['schemas']['ProvinceResponse'], 'id' | 'name' | 'slug'>>;
export type ContractDistrict = Required<Pick<components['schemas']['DistrictResponse'], 'id' | 'name' | 'slug' | 'provinceId'>>;
export interface DemoDatabase {
    teachers: DemoTeacher[];
    students: AdminStudentDetail[];
    posts: Post[];
    reports: ReportDetailData[];
    tags: ContractTag[];
    levels: ContractTrainingLevel[];
    provinces: ContractProvince[];
    districts: ContractDistrict[];
    centers: DrivingCenter[];
    reviews: ReviewResponse[];
}
const uuid = (group: number, index: number) => `0198d1f5-1b44-7e08-${String(group).padStart(4, '0')}-${String(index).padStart(12, '0')}`;
const names = ['Nguyễn Văn An', 'Trần Minh Tuấn', 'Lê Thanh Hương', 'Phạm Quốc Bảo', 'Hoàng Thị Mai', 'Đặng Thành Đạt', 'Vũ Ngọc Lan', 'Bùi Đức Long', 'Đỗ Minh Châu', 'Ngô Anh Khoa', 'Dương Thu Hà', 'Lý Hoàng Nam'];
const created = (i: number) => new Date(Date.parse(FIXED_NOW) - i * 86400000).toISOString();
export function seedDatabase(): DemoDatabase {
    const provinces: ContractProvince[] = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng'].map((name, i) => ({ id: uuid(1, i + 1), name, slug: ['ho-chi-minh', 'ha-noi', 'da-nang'][i] }));
    const districts: ContractDistrict[] = ['Quận 1', 'Bình Thạnh', 'Cầu Giấy', 'Thanh Xuân', 'Hải Châu', 'Thanh Khê'].map((name, i) => ({ id: uuid(2, i + 1), name, slug: ['quan-1', 'binh-thanh', 'cau-giay', 'thanh-xuan', 'hai-chau', 'thanh-khe'][i], provinceId: provinces[Math.floor(i / 2)].id }));
    const levels: ContractTrainingLevel[] = ['B1', 'B2', 'C'].map((name, i) => ({ id: uuid(3, i + 1), name, slug: name.toLowerCase(), description: ['Xe ô tô số tự động', 'Xe ô tô số sàn', 'Xe tải'][i], orderPosition: i, progressTemplate: { templateVersion: 1, enforcement: 'WARN', stages: [] } }));
    const tags: ContractTag[] = ['Dạy tận tâm', 'Kiên nhẫn', 'Luyện sa hình', 'Lái xe đường trường'].map((name, i) => ({ id: uuid(4, i + 1), name, slug: `the-${i + 1}`, type: i < 2 ? 'STYLE' : 'SPECIALTY' }));
    const centers: DrivingCenter[] = [{ id: uuid(5, 1), name: 'Sân tập lái Bình Thạnh', address: '123 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh', type: 'PRACTICE_GROUND', placeId: uuid(5, 1) }, { id: uuid(5, 2), name: 'Trung tâm sát hạch Củ Chi', address: 'Củ Chi, TP. Hồ Chí Minh', type: 'TEST_CENTER', placeId: uuid(5, 2) }];
    const teachers: DemoTeacher[] = Array.from({ length: 32 }, (_, i) => {
        const id = uuid(6, i + 1), province = provinces[i % 3], district = districts[(i % 3) * 2];
        const status = (['ACTIVE', 'ACTIVE', 'ACTIVE', 'DRAFT', 'INACTIVE', 'BANNED'] as const)[i % 6];
        return { id, userId: id, email: `giaovien${i + 1}@example.com`, contactEmail: `giaovien${i + 1}@example.com`, fullName: names[i % names.length] + (i >= 12 ? ` ${Math.floor(i / 12) + 1}` : ''), phoneNumber: `090${String(1000000 + i)}`, phone: `090${String(1000000 + i)}`, contactPhoneNumber: `090${String(1000000 + i)}`, role: 'TEACHER', avatarUrl: '/demo/avatar.svg', coverImageUrl: '/demo/cover.svg', realPhotos: ['/demo/cover.svg', '/demo/car.svg', '/demo/cover.svg?photo=3'], status, bio: 'Đồng hành cùng học viên trên mọi hành trình', description: 'Giáo viên tận tâm, hướng dẫn thực hành từ cơ bản đến nâng cao. Lịch học linh hoạt và học phí rõ ràng.', experienceYears: (['ONE_TO_THREE', 'THREE_TO_FIVE', 'FIVE_TO_TEN', 'TEN_PLUS'] as const)[i % 4], studentsTrained: 'FROM_300', hasCurrentStudents: i % 2 === 0, totalReviews: 3, averageRating: 4.7, avgRating: 4.7, totalComments: 3, totalLikes: 24 + i, totalViews: 120 + i * 13, isLiked: false, createdAt: created(i), updatedAt: created(i), invitedAt: created(i), acceptedAt: status === 'DRAFT' ? undefined : created(i), zalo: `090${String(1000000 + i)}`, province, districts: [{ districtId: district.id, districtName: district.name, provinceId: province.id, provinceName: province.name }], trainings: levels.slice(0, 2).map(level => ({ teacherUserId: id, trainingLevelId: level.id, trainingLevelName: level.name, trainingLevelDescription: level.description, priceFrom: 8500000, priceTo: 12000000 })), tags: tags.slice(0, 3).map(tag => ({ ...tag, type: tag.type === 'STYLE' ? 'style' : 'specialty' })), drivingCenters: centers, teachingCars: [{ id: uuid(7, i + 1), teacherUserId: id, brand: 'Toyota', model: 'Vios', productionYear: 2023, type: 'automatic', description: 'Xe tập lái có phanh phụ', imageUrl: '/demo/car.svg', isActive: true, createdAt: created(i), updatedAt: created(i) }], reviewSummary: { teacherUserId: id, averageRating: 4.7, totalReviews: 3, stars: [{ star: 5, count: 2 }, { star: 4, count: 1 }, { star: 3, count: 0 }, { star: 2, count: 0 }, { star: 1, count: 0 }] }, suspension: status === 'BANNED' ? { sanctionId: uuid(8, i + 1), reason: 'Vi phạm quy định cộng đồng', startAt: created(i), endAt: '2026-12-31T00:00:00Z' } : null };
    });
    const students: AdminStudentDetail[] = Array.from({ length: 27 }, (_, i) => ({ id: uuid(9, i + 1), email: `hocvien${i + 1}@example.com`, fullName: names[(i + 3) % 12], phoneNumber: `091${String(1000000 + i)}`, role: 'STUDENT', avatarUrl: '/demo/avatar.svg', emailVerified: true, phoneVerified: i % 2 === 0, deleted: false, status: i % 7 === 0 ? 'INACTIVE' : 'ACTIVE', createdAt: created(i), updatedAt: created(i), createdBy: 'demo', updatedBy: 'demo', suspension: null }));
    const posts: Post[] = Array.from({ length: 24 }, (_, i) => ({ id: uuid(10, i + 1), owner: demoAdmin, title: ['Kinh nghiệm học lái xe an toàn', 'Chuẩn bị cho kỳ thi sát hạch', 'Hỏi đáp về học phí và lịch học', 'Những lưu ý khi lái xe đường dài'][i % 4] + ` ${i + 1}`, description: 'Thông tin hữu ích dành cho học viên và giáo viên Tidala.', contentSummary: ['Kinh nghiệm học lái xe an toàn', 'Chuẩn bị cho kỳ thi sát hạch', 'Hỏi đáp về học phí và lịch học', 'Những lưu ý khi lái xe đường dài'][i % 4] + ` ${i + 1}`, thumbnailUrl: '/demo/cover.svg', mediaUrls: [], content: 'Hãy kiểm tra gương, thắt dây an toàn và giữ khoảng cách với xe phía trước.\n\nLuyện tập đều đặn cùng giáo viên để tự tin hơn trên mỗi hành trình.', type: (['KNOWLEDGE', 'Q_AND_A', 'EXPERIENCE', 'NEWS'] as const)[i % 4], likeCount: 12 + i, commentCount: 0, saveCount: 5 + i, viewCount: 100 + i * 17, shareCount: 3 + i, pinnedAt: i === 0 ? FIXED_NOW : null, createdAt: created(i), updatedAt: created(i) }));
    const reports: ReportDetailData[] = Array.from({ length: 28 }, (_, i) => {
        const teacher = teachers[i % teachers.length], student = students[i % students.length], post = posts[i % posts.length];
        const targetType = (['TEACHER', 'POST', 'REVIEW', 'COMMENT'] as const)[i % 4];
        const target = targetType === 'TEACHER' ? { type: targetType, id: teacher.id, fullName: teacher.fullName, avatarUrl: teacher.avatarUrl, email: teacher.email } : targetType === 'POST' ? { type: targetType, id: post.id, title: post.title, content: post.description, author: { id: demoAdmin.id, fullName: demoAdmin.fullName } } : targetType === 'REVIEW' ? { type: targetType, id: uuid(12, i + 1), content: 'Nội dung cần kiểm tra', rating: 2, author: student, teacher: { id: teacher.id, fullName: teacher.fullName } } : { type: targetType, id: uuid(13, i + 1), content: 'Bình luận cần được xem xét', postId: post.id, author: student };
        return { id: uuid(11, i + 1), reporterUserId: student.id, reporterName: student.fullName, reporterEmail: student.email, reporterAvatarUrl: student.avatarUrl, targetType, targetId: target.id, target, reason: ['spam', 'offensive', 'fake', 'other'][i % 4], description: 'Vui lòng kiểm tra lại thông tin và xử lý theo quy định cộng đồng.', status: i % 5 === 0 ? 'RESOLVED' : 'PENDING', resolvedAt: i % 5 === 0 ? FIXED_NOW : null, createdAt: created(i), updatedAt: created(i), history: [] };
    });
    const reviews: ReviewResponse[] = teachers.flatMap((t, i) => Array.from({ length: 3 }, (_, j) => ({ id: uuid(12, i * 3 + j + 1), studentUserId: students[j].id, studentFullName: students[j].fullName, studentAvatarUrl: '/demo/avatar.svg', teacherUserId: t.id, rating: j === 0 ? 4 : 5, content: 'Giáo viên hướng dẫn rõ ràng, kiên nhẫn và rất tận tâm.', totalLikes: 2, isLiked: false, createdAt: created(j), updatedAt: created(j) })));
    return { teachers, students, posts, reports, tags, levels, provinces, districts, centers, reviews };
}
