import type { ReportReasonId } from "../constants/report-reasons";

interface BaseReport {
  id: string;
  reason: ReportReasonId;
  description: string;
  createdAt: string;
  status: "pending" | "resolved" | "dismissed";
  reporter: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    role: "student" | "teacher";
  };
}

export interface TeacherReport extends BaseReport {
  type: "teacher";
  reportedTeacher: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

export interface PostReport extends BaseReport {
  type: "post";
  reportedPost: {
    id: string;
    title: string;
    content: string;
    owner: {
      id: string;
      fullName: string;
      avatarUrl: string | null;
    };
  };
}

export type MockReport = TeacherReport | PostReport;

export const MOCK_REPORTS: MockReport[] = [
  // TEACHER REPORTS
  {
    id: "rpt-001",
    type: "teacher",
    reason: "fake",
    description:
      "Giáo viên tự nhận có 10 năm kinh nghiệm nhưng thực tế mới bắt đầu dạy. Giấy phép lái xe hạng C nhưng chỉ dạy hạng B1.",
    createdAt: "2026-04-20T14:30:00Z",
    status: "pending",
    reporter: {
      id: "u-101",
      fullName: "Nguyễn Văn An",
      avatarUrl: null,
      role: "student",
    },
    reportedTeacher: {
      id: "t-201",
      fullName: "Trần Minh Tuấn",
      avatarUrl: null,
    },
  },
  {
    id: "rpt-002",
    type: "teacher",
    reason: "scam",
    description:
      "Yêu cầu chuyển khoản 2 triệu trước buổi học đầu tiên nhưng không có xác nhận hay hợp đồng gì. Sau khi chuyển tiền thì không liên lạc được.",
    createdAt: "2026-04-19T09:15:00Z",
    status: "pending",
    reporter: {
      id: "u-102",
      fullName: "Lê Thị Hương",
      avatarUrl: null,
      role: "student",
    },
    reportedTeacher: {
      id: "t-202",
      fullName: "Phạm Đức Hải",
      avatarUrl: null,
    },
  },
  {
    id: "rpt-003",
    type: "teacher",
    reason: "inappropriate",
    description:
      "Giáo viên thường xuyên đến muộn 20-30 phút, thái độ thiếu tôn trọng học viên, nói chuyện điện thoại trong giờ dạy.",
    createdAt: "2026-04-18T16:45:00Z",
    status: "resolved",
    reporter: {
      id: "u-103",
      fullName: "Hoàng Anh Dũng",
      avatarUrl: null,
      role: "student",
    },
    reportedTeacher: {
      id: "t-203",
      fullName: "Vũ Thanh Sơn",
      avatarUrl: null,
    },
  },
  {
    id: "rpt-004",
    type: "teacher",
    reason: "price",
    description:
      "Hồ sơ ghi 3-5 triệu/khóa nhưng thực tế yêu cầu 8 triệu khi đăng ký, chưa kể phí phát sinh không rõ ràng.",
    createdAt: "2026-04-17T11:20:00Z",
    status: "pending",
    reporter: {
      id: "u-104",
      fullName: "Đặng Thùy Linh",
      avatarUrl: null,
      role: "student",
    },
    reportedTeacher: {
      id: "t-204",
      fullName: "Ngô Quang Vinh",
      avatarUrl: null,
    },
  },
  {
    id: "rpt-005",
    type: "teacher",
    reason: "other",
    description:
      "Giáo viên sử dụng xe tập lái không đúng loại, xe cũ và không có bảo hiểm. Lo ngại về an toàn khi học.",
    createdAt: "2026-04-16T08:00:00Z",
    status: "dismissed",
    reporter: {
      id: "u-105",
      fullName: "Bùi Minh Khoa",
      avatarUrl: null,
      role: "teacher",
    },
    reportedTeacher: {
      id: "t-205",
      fullName: "Lý Hoàng Nam",
      avatarUrl: null,
    },
  },
  {
    id: "rpt-006",
    type: "teacher",
    reason: "scam",
    description:
      "Giáo viên hứa đảm bảo đậu 100% nhưng sau khi thu tiền thì hủy lớp. Nhiều học viên khác cũng bị tương tự.",
    createdAt: "2026-04-15T13:10:00Z",
    status: "pending",
    reporter: {
      id: "u-106",
      fullName: "Phan Ngọc Trâm",
      avatarUrl: null,
      role: "student",
    },
    reportedTeacher: {
      id: "t-206",
      fullName: "Đinh Văn Bảo",
      avatarUrl: null,
    },
  },

  // POST REPORTS
  {
    id: "rpt-post-001",
    type: "post",
    reason: "fake",
    description:
      "Bài viết chứa thông tin sai lệch về kỹ năng lái xe, có thể gây nhầm lẫn cho người học.",
    createdAt: "2026-04-21T10:00:00Z",
    status: "pending",
    reporter: {
      id: "u-201",
      fullName: "Trần Hùng Anh",
      avatarUrl: null,
      role: "student",
    },
    reportedPost: {
      id: "p-101",
      title: "Mẹo lái xe an toàn trong điều kiện mưa bão",
      content:
        "Để lái xe an toàn trong mưa bão, bạn nên tăng tốc độ để nhanh qua khu vực nguy hiểm. Các phương pháp này đã được kiểm chứng bởi nhiều tài xế chuyên nghiệp...",
      owner: {
        id: "u-301",
        fullName: "Nguyễn Văn Hiểu",
        avatarUrl: null,
      },
    },
  },
  {
    id: "rpt-post-002",
    type: "post",
    reason: "inappropriate",
    description:
      "Bài viết chứa ngôn từ xúc phạm, phân biệt đối xử đối với những người học viên mới.",
    createdAt: "2026-04-20T15:30:00Z",
    status: "pending",
    reporter: {
      id: "u-202",
      fullName: "Lý Thanh Hà",
      avatarUrl: null,
      role: "teacher",
    },
    reportedPost: {
      id: "p-102",
      title: "Cách phân biệt học viên tài năng và học viên tồi",
      content:
        "Những học viên không thể lái xe sau 10 buổi học là những người không thông minh...",
      owner: {
        id: "u-302",
        fullName: "Phạm Minh Đức",
        avatarUrl: null,
      },
    },
  },
  {
    id: "rpt-post-003",
    type: "post",
    reason: "scam",
    description:
      "Bài viết quảng cáo khóa học với giá ghi trên hồ sơ nhưng thực tế không đúng với giá hiển thị.",
    createdAt: "2026-04-19T08:45:00Z",
    status: "resolved",
    reporter: {
      id: "u-203",
      fullName: "Đỗ Quỳnh Trang",
      avatarUrl: null,
      role: "student",
    },
    reportedPost: {
      id: "p-103",
      title: "Khóa lái xe hạng B2 chỉ 2 triệu - Rẻ nhất thị trường",
      content:
        "Đăng ký khóa lái xe chỉ 2 triệu, hoàn thành trong 7 ngày. Bao thi đỗ 100%...",
      owner: {
        id: "u-303",
        fullName: "Hoàng Tuấn Anh",
        avatarUrl: null,
      },
    },
  },
  {
    id: "rpt-post-004",
    type: "post",
    reason: "price",
    description:
      "Bài viết ghi giá khóa học không phù hợp với mô tả dịch vụ thực tế cung cấp.",
    createdAt: "2026-04-18T12:15:00Z",
    status: "pending",
    reporter: {
      id: "u-204",
      fullName: "Vũ Thị Thanh Vân",
      avatarUrl: null,
      role: "student",
    },
    reportedPost: {
      id: "p-104",
      title: "Khóa lái xe A1 - Học lý thuyết online, thực hành offline",
      content:
        "Giá: 1.5 triệu. Gồm: 12 buổi lý thuyết online, 10 buổi thực hành, cấp chứng chỉ...",
      owner: {
        id: "u-304",
        fullName: "Lê Minh Tuấn",
        avatarUrl: null,
      },
    },
  },
  {
    id: "rpt-post-005",
    type: "post",
    reason: "other",
    description:
      "Bài viết chứa nội dung không liên quan đến lái xe, spam trên hệ thống.",
    createdAt: "2026-04-17T14:00:00Z",
    status: "dismissed",
    reporter: {
      id: "u-205",
      fullName: "Phan Minh Khải",
      avatarUrl: null,
      role: "teacher",
    },
    reportedPost: {
      id: "p-105",
      title: "Cơ hội kiếm tiền với công việc online tại nhà",
      content:
        "Kiếm 10 triệu/tháng mà không cần ra khỏi nhà, chỉ cần tham gia chương trình...",
      owner: {
        id: "u-305",
        fullName: "Nguyễn Thị Kim Anh",
        avatarUrl: null,
      },
    },
  },
  {
    id: "rpt-post-006",
    type: "post",
    reason: "inappropriate",
    description: "Bài viết chứa hình ảnh không phù hợp và ngôn ngữ nhạy cảm.",
    createdAt: "2026-04-16T16:20:00Z",
    status: "pending",
    reporter: {
      id: "u-206",
      fullName: "Trần Hồng Đức",
      avatarUrl: null,
      role: "student",
    },
    reportedPost: {
      id: "p-106",
      title: "Trải nghiệm học lái xe - Câu chuyện thực tế từ học viên",
      content:
        "Sau 3 buổi học với giáo viên Minh, tôi đã có thể lái xe như một chuyên gia...",
      owner: {
        id: "u-306",
        fullName: "Bùi Thị Hương",
        avatarUrl: null,
      },
    },
  },
];
