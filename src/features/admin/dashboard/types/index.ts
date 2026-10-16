export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
}

export interface TeacherStats {
  total: number;
  success: number;
  draft: number;
}

export interface ReportStats {
  total: number;
  teacher: number;
  post: number;
  comment: number;
  review: number;
}

export interface PostStats {
  total: number;
  knowledge: number;
  qAndA: number;
}
