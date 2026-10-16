// src/constants/apiPaths.ts
export const API_PATHS = {
  AUTH: {
    GET_ACCOUNT_INFORMATION: "/v1/account",
    UPDATE_PROFILE: "/v1/account/profile",
    CHECK_EMAIL: "/v1/account/email/",
    LOGIN: "/v1/auth/login",
    REFRESH: "/v1/auth/refresh",
    REGISTER: "/v1/auth/register",
    SEND_OTP: "/v1/auth/send-otp",
    VERIFY_OTP: "/v1/auth/verify-otp",
    LOGIN_GOOGLE: "/oauth2/authorization/google",
    LOGIN_FACEBOOK: "/oauth2/authorization/facebook",
    SEND_FORGOT_PASSWORD_OTP: "/v1/auth/forgot-password",
    VERIFY_PASSWORD_RESET_OTP: "/v1/auth/verify-password-reset-otp",
    RESET_PASSWORD: "/v1/auth/reset-password",
  },
  LOCATION: {
    GET_PROVINCES: "/v1/provinces",
    GET_PROVINCE_DETAIL: (id: string) => `/v1/provinces/${id}`,
    GET_PROVINCES_V2: "/v2/provinces",
  },
  TRAING_LEVEL: {
    GET_TRANING_LEVELS: "/v1/training-levels",
    BULK_CREATE: "/v1/training-levels/bulk",
    UPDATE: (id: string | number) => `/v1/training-levels/${id}`,
    DELETE: (id: string | number) => `/v1/training-levels/${id}`,
  },
  PROFILE: {
    TEACHER_SETUP: "/v1/teachers",
    TEACHER_SETUP_V2: "/v2/teachers",
    GET_PROFILE: "/v1/account",
    UPDATE_MY_PROFILE: "/v1/account/profile",
  },
  STORAGE: {
    PRESIGNED_URL: "/v2/storage/upload",
    MULTI_PRESIGNED_URLS: "/v2/storage/upload/multi-presigned-urls",
  },
  TEACHER: {
    GET_TEACHERS: "/v1/teachers",
    GET_TEACHERS_V2: "/v2/teachers",
    GET_NEARBY_TEACHERS: "/v1/teachers/nearby",
    GET_TEACHER_DETAIL: (id: string) => `/v1/teachers/${id}`,
    GET_TOP_TEACHERS: "/v1/teachers/top",
    GET_SIMILAR_TEACHERS: (id: string) => `/v1/teachers/${id}/similar`,
    GET_TEACHER_CONTACT: (id: string) => `/v1/teachers/${id}/contact`,
    RECORD_TEACHER_CONTACT: (id: string) => `/v1/teachers/${id}/contacts`,
  },
  REVIEW: {
    REVIEWS: "/v1/reviews",
    TEACHER_REVIEWS: "/v1/reviews/teachers",
    REVIEW_TEACHER: (id: string) => `/v1/reviews/teachers/${id}`,
    GET_TEACHER_REVIEWS: (
      id: string,
      page: number,
      size: number,
      sort: string[],
    ) =>
      `/v1/reviews/teachers/${id}?page=${page}&size=${size}&sort=${sort.map((s) => encodeURIComponent(s)).join(",")}`,
    REVIEW_SUMMARY: (id: string) => `/v1/reviews/teachers/${id}/summary`,
    MY_REVIEWS: "/v1/reviews/my-reviews",
  },
  DRIVING_CENTER: {
    CREATE_BULK_DRIVING_CENTER: "/v1/driving-centers/bulk",
  },
  LIKE: {
    LIKE_TEACHER: (id: string) => `/v1/likes/teachers/${id}`,
    LIKE_REVIEW: (reviewId: string) => `/v1/likes/reviews/${reviewId}`,
    GET_STATUS: (id: string) => `/v1/likes/teachers/${id}/status`,
    GET_MY_LIKED_TEACHERS: "/v1/likes/teachers",
  },
  TAG: {
    GET_ALL: "/v1/tags",
    BULK_CREATE: "/v1/tags/bulk",
    UPDATE: (id: string | number) => `/v1/tags/${id}`,
    DELETE: (id: string | number) => `/v1/tags/${id}`,
  },
  ACCOUNT: {
    RECENT_VIEWERS: "/v1/teachers/my/recent-viewers",
    RECENT_CONTACTS: "/v1/teachers/my/recent-contacts",
  },
  ADMIN: {
    GET_TEACHERS: "/admin/teachers",
    GET_STUDENTS: "/admin/students",
    GET_TEACHER_DETAIL: (teacherId: string) => `/admin/teachers/${teacherId}`,
    UPDATE_TEACHER_PROFILE: (teacherId: string) =>
      `/admin/teachers/${teacherId}/profile`,
    INVITE_TEACHER: "/admin/teachers/invite",
    GET_REPORTS: "/admin/reports",
    GET_REPORT_DETAIL: (reportId: string) => `/admin/reports/${reportId}`,
    GET_USER_REPORTS_RECEIVED: (userId: string) =>
      `/admin/users/${userId}/received`,
    RESOLVE_REPORT: (reportId: string) => `/admin/reports/${reportId}/resolve`,
    ACCOUNT_MODERATION: {
      SANCTION: (userId: string) => `/v1/admin/accounts/${userId}/sanction`,
      REVOKE_SANCTION: (userId: string) =>
        `/v1/admin/accounts/${userId}/unsanction`,
    },
    STATS: {
      GET_USER_STATS: "/admin/stats/users",
      GET_TEACHER_STATS: "/admin/stats/teachers",
      GET_REPORT_STATS: "/admin/stats/reports",
      GET_POST_STATS: "/admin/stats/posts",
    },
  },
  POST: {
    CREATE_POST: "/v1/posts",
    GET_POSTS: "/v1/posts",
    GET_PINNED_POSTS: "/v1/posts/pinned",
    GET_TRENDING_POSTS: "/v1/posts/trending",
    GET_MY_POSTS: "/v1/posts/me",
    GET_SAVED_POSTS: "/v1/posts/saved",
    GET_SEARCH_POSTS: (keyword: string, postTypes: string) =>
      `/v1/posts/search?keyword=${encodeURIComponent(keyword)}&postTypes=${encodeURIComponent(postTypes)}`,
    GET_POST_DETAIL: (id: string) => `/v1/posts/${id}`,
    UPDATE_POST: (id: string) => `/v1/posts/${id}`,
    DELETE_POST: (id: string) => `/v1/posts/${id}`,
    SHARE_POST: (id: string) => `/v1/posts/${id}/share`,
    PIN_POST: (id: string) => `/v1/posts/${id}/pin`,
    UNPIN_POST: (id: string) => `/v1/posts/${id}/pin`,
    COMMENT: {
      CREATE_COMMENT: (postId: string) => `/v1/posts/${postId}/comments`,
      GET_COMMENTS: (postId: string) => `/v1/posts/${postId}/comments`,
      GET_COMMENT_REPLIES: (commentId: string) =>
        `/v1/posts/comments/${commentId}/replies`,
      LIKE_COMMENT: (commentId: string) => `/v1/likes/comments/${commentId}`,
      UNLIKE_COMMENT: (commentId: string) => `/v1/likes/comments/${commentId}`,
    },
  },
  NOTIFICATION: {
    GET_NOTIFICATIONS: "/v1/notifications",
    MARK_AS_READ: (id: string) => `/v1/notifications/${id}/read`,
    MARK_ALL_AS_READ: "/v1/notifications/read-all",
  },
  NOTEBOOK: {
    // Course APIs
    GET_COURSES: "/v1/notebook/courses",
    POST_COURSE: "/v1/notebook/courses",
    GET_COURSE_DETAIL: (courseId: string) => `/v1/notebook/courses/${courseId}`,
    UPDATE_COURSE: (courseId: string) => `/v1/notebook/courses/${courseId}`,
    DELETE_COURSE: (courseId: string) => `/v1/notebook/courses/${courseId}`,

    // Training Steps APIs
    GET_TRAINING_STEPS: "/v1/notebook/training-steps",
    // Admin APIs
    POST_TRAINING_STEP: "/v1/notebook/training-steps",
    DELETE_TRAINING_STEP: (trainingStepId: string) =>
      `/v1/notebook/training-steps/${trainingStepId}`,
    UPDATE_TRAINING_STEP: (trainingStepId: string) =>
      `/v1/notebook/training-steps/${trainingStepId}`,

    // Enrollment APIs
    GET_ENROLLMENTS: (courseId: string) =>
      `/v1/notebook/courses/${courseId}/enrollments`,
    POST_ENROLLMENT: (courseId: string) =>
      `/v1/notebook/courses/${courseId}/enrollments`,
    GET_ENROLLMENT_DETAIL: (courseId: string, enrollmentId: string) =>
      `/v1/notebook/courses/${courseId}/enrollments/${enrollmentId}`,
    UPDATE_ENROLLMENT: (courseId: string, enrollmentId: string) =>
      `/v1/notebook/courses/${courseId}/enrollments/${enrollmentId}`,
    GET_TUITION_PAYMENTS: (courseId: string, enrollmentId: string) =>
      `/v1/notebook/courses/${courseId}/enrollments/${enrollmentId}/payments`,
    RECORD_TUITION_PAYMENT: (courseId: string, enrollmentId: string) =>
      `/v1/notebook/courses/${courseId}/enrollments/${enrollmentId}/payments`,

    // Step Progress APIs
    LOG_STEP_PROGRESS_SESSION: (courseId: string, progressId: string) =>
      `/v1/notebook/courses/${courseId}/step-progresses/${progressId}/sessions`,
    COMPLETE_STEP_PROGRESS: (courseId: string, progressId: string) =>
      `/v1/notebook/courses/${courseId}/step-progresses/${progressId}/complete`,
    REVERT_STEP_PROGRESS: (courseId: string, progressId: string) =>
      `/v1/notebook/courses/${courseId}/step-progresses/${progressId}/revert`,
  },
};
