import { paginate } from "@/demo/store";
import type { components } from "@/generated/api";
import { realRequest } from "../realApi";
import { cached, DEMO, fetchAll, media, notFound, pageParams, unsupported, type Route } from "./shared";
import { findStudent, sanctionStudent } from "./students";

type Summary = components["schemas"]["TeacherProfileSummary"];
type Profile = components["schemas"]["PublicTeacherProfileResponse"];
type Review = components["schemas"]["ReviewSummary"];
type Areas = Summary["provinces"];
type Levels = Summary["trainingLevels"];

// Only the two ranges that match the screens' buckets are translated; the others keep the backend value
// (formatExperience labels them).
const EXPERIENCE: Record<string, string> = {
  ONE_TO_THREE_YEARS: "ONE_TO_THREE",
  THREE_TO_FIVE_YEARS: "THREE_TO_FIVE",
};
const experience = (range?: string) => (range ? EXPERIENCE[range] ?? range : "");

const districts = (areas: Areas = []) =>
  areas.flatMap((province) =>
    (province.districts ?? []).map((district) => ({
      districtId: district.districtId,
      districtName: district.name,
      provinceId: province.provinceId,
      provinceName: province.provinceName,
    })),
  );

const trainings = (teacherUserId: string, levels: Levels = []) =>
  levels.map((level) => ({
    teacherUserId,
    trainingLevelId: level.trainingLevelId,
    trainingLevelName: level.name,
    trainingLevelDescription: level.description,
    priceFrom: level.priceFrom ?? undefined,
    priceTo: level.priceTo ?? undefined,
  }));

// The public directory is the only teacher listing: it holds completed profiles and no contact details
// (email, phone) or account status, so every listed teacher is shown as active.
const uiTeacherRow = (teacher: Summary) => ({
  id: teacher.userId,
  userId: teacher.userId,
  slug: teacher.slug,
  email: "",
  phoneNumber: "",
  role: "TEACHER",
  fullName: teacher.fullName,
  avatarUrl: media(teacher.avatarUrl),
  status: "ACTIVE",
  experienceYears: experience(teacher.experienceRange),
  hasCurrentStudents: teacher.hasCurrentStudents,
  totalReviews: teacher.reviewCount ?? 0,
  averageRating: teacher.averageRating ?? 0,
  totalLikes: 0,
  totalViews: 0,
  createdAt: "",
  updatedAt: "",
  suspension: null,
  trainings: trainings(teacher.userId!, teacher.trainingLevels),
  districts: districts(teacher.provinces),
});

export const allTeachers = cached(async () => (await fetchAll<Summary>("/api/v1/teacher-profiles")).map(uiTeacherRow));

/** Profiles are fetched by slug; the screens address teachers by user id. */
const getProfile = async (userId: string): Promise<Profile> => {
  const row = (await allTeachers()).find((teacher) => teacher.userId === userId);
  if (!row?.slug) return notFound();
  return realRequest<Profile>({ method: "get", url: `/api/v1/teacher-profiles/${row.slug}` });
};

const reviewSummary = (profile: Profile) => ({
  teacherUserId: profile.userId,
  averageRating: profile.averageRating ?? 0,
  totalReviews: profile.reviewCount ?? 0,
  stars: [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: Number((profile.ratingBreakdown as Record<string, number> | undefined)?.[star] ?? 0),
  })),
});

const uiTeacherDetail = (profile: Profile) => {
  const area = districts(profile.provinces);
  return {
    id: profile.userId,
    userId: profile.userId,
    fullName: profile.fullName,
    avatarUrl: media(profile.avatarUrl),
    coverImageUrl: media(profile.coverImageObjectKey),
    email: "",
    contactEmail: "",
    phone: "",
    phoneNumber: "",
    contactPhoneNumber: "",
    zalo: "",
    bio: profile.bio ?? "",
    description: profile.description ?? "",
    experienceYears: experience(profile.experienceRange),
    studentsTrained: profile.studentsTrainedRange,
    hasCurrentStudents: profile.hasCurrentStudents,
    status: profile.status === "COMPLETED" ? "ACTIVE" : "DRAFT",
    suspension: null,
    trainings: trainings(profile.userId!, profile.trainingLevels),
    province: area[0] ? { id: area[0].provinceId, name: area[0].provinceName } : undefined,
    districts: area,
    drivingCenters: profile.drivingCenters ?? [],
    realPhotos: [...(profile.teacherPhotos ?? [])]
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map((photo) => media(photo.imageObjectKey)),
    teachingCars: (profile.teachingCars ?? []).map((car) => ({
      ...car,
      teacherUserId: profile.userId,
      type: car.type?.toLowerCase(),
      imageUrl: media(car.imageObjectKey),
      isActive: true,
      createdAt: "",
      updatedAt: "",
    })),
    tags: (profile.tags ?? []).map((tag) => ({ ...tag, id: tag.tagId, type: tag.type?.toLowerCase() })),
    averageRating: profile.averageRating ?? 0,
    avgRating: profile.averageRating ?? 0,
    totalReviews: profile.reviewCount ?? 0,
    reviewSummary: reviewSummary(profile),
    totalLikes: 0,
    totalViews: 0,
    isLiked: false,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
};

const uiReview = (review: Review) => ({
  id: review.id,
  studentUserId: review.studentUserId,
  studentFullName: review.studentFullName,
  studentAvatarUrl: media(review.studentAvatarUrl),
  teacherUserId: review.teacherUserId,
  rating: review.rating,
  content: review.comment ?? "",
  totalLikes: 0,
  isLiked: false,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
});

export const teacherRoutes: Route[] = [
  {
    // Filters (search, experience, level, area, status) are applied locally: the directory filters by slug, not id.
    pattern: /^\/admin\/teachers$/,
    handle: async ({ params }) => paginate(await allTeachers(), params),
  },
  { pattern: /^\/admin\/teachers\/invite$/, handle: () => unsupported("mời giáo viên") },
  { pattern: /^\/admin\/teachers\/([^/]+)\/profile$/, handle: () => unsupported("chỉnh sửa hồ sơ giáo viên") },
  {
    pattern: /^\/admin\/teachers\/([^/]+)$/,
    handle: async ({ id }) => uiTeacherDetail(await getProfile(id!)),
  },
  {
    // Teachers have no admin sanction endpoint yet, so theirs are refused. Students are
    // real accounts: their sanctions go to the admin ban/unban endpoints (see students.ts).
    // Anything else (demo records) falls through to the demo adapter.
    pattern: /^\/v1\/admin\/accounts\/([^/]+)\/(?:sanction|unsanction)$/,
    handle: async ({ id, params, body }) => {
      const teachers = await allTeachers().catch(() => []);
      if (teachers.some((teacher) => teacher.userId === id)) return unsupported("cảnh báo hoặc khóa tài khoản");
      const student = await findStudent(id!).catch(() => undefined);
      return student ? sanctionStudent(id!, { params, body }) : DEMO;
    },
  },
  {
    pattern: /^\/v1\/reviews\/teachers\/([^/]+)\/summary$/,
    handle: async ({ id }) => reviewSummary(await getProfile(id!)),
  },
  {
    pattern: /^\/v1\/reviews\/teachers\/([^/]+)$/,
    handle: async ({ id, params }) => {
      // The screens put `sort` in the URL as one comma-joined string, e.g. "createdAt,desc".
      const sort = typeof params.sort === "string" && params.sort ? [params.sort] : params.sort;
      const page = await realRequest<{ content: Review[] }>({
        method: "get",
        url: "/api/v1/reviews",
        params: pageParams({ ...params, sort, teacherUserId: id }),
      });
      return { ...page, content: page.content.map(uiReview) };
    },
  },
];
