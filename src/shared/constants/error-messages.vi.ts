// src/constants/error-messages.vi.ts
import { type ErrorCode } from "@/shared/types/errorCode.type";

export const ERROR_MESSAGE_VI: Record<ErrorCode, string> = {
  AUTHENTICATION_REQUIRED: "Bạn cần đăng nhập để tiếp tục",
  ACCOUNT_SUSPENDED: "Tài khoản của bạn đã bị tạm ngưng",
  SIGN_UP_FAILED: "Đăng ký không thành công",
  INVITE_FAILED: "Gửi lời mời thất bại",
  USER_ALREADY_INVITED: "Người dùng đã được mời trước đó",
  WEBHOOK_INVALID_SIGNATURE: "Chữ ký webhook không hợp lệ",

  INVALID_TOKEN: "Token không hợp lệ",
  TOKEN_EXPIRED: "Phiên đăng nhập đã hết hạn",
  REFRESH_TOKEN_INVALID: "Refresh token không hợp lệ hoặc đã hết hạn",
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng",
  ACCOUNT_LOCKED: "Tài khoản đã bị khóa",
  ACCOUNT_NOT_FOUND: "Không tìm thấy tài khoản",

  ACCESS_DENIED: "Bạn không có quyền truy cập",

  VALIDATION_FAILED: "Dữ liệu không hợp lệ",
  INVALID_REQUEST_BODY: "Dữ liệu gửi lên không đúng định dạng",
  MANDATORY_FIELD_MISSING: "Thiếu thông tin bắt buộc",
  INVALID_EMAIL_FORMAT: "Email không đúng định dạng",
  PASSWORD_TOO_WEAK: "Mật khẩu quá yếu",
  METHOD_NOT_ALLOWED: "Phương thức không được hỗ trợ",

  EMAIL_ALREADY_EXISTS: "Email đã tồn tại",
  RESOURCE_ALREADY_EXISTS: "Dữ liệu đã tồn tại",

  RESOURCE_NOT_FOUND: "Không tìm thấy dữ liệu",

  PROVINCE_ALREADY_EXISTS: "Tỉnh đã tồn tại",
  PROVINCE_NOT_FOUND: "Không tìm thấy tỉnh",
  DISTRICT_LINKED_TO_DRIVING_CENTER: "Quận/Huyện đang được sử dụng",
  DISTRICT_ALREADY_EXISTS: "Quận/Huyện đã tồn tại",
  DISTRICT_NOT_FOUND: "Không tìm thấy quận/huyện",
  DUPLICATE_DISTRICT_IN_PROVINCE: "Tên quận/huyện bị trùng trong cùng tỉnh",
  DRIVING_CENTER_NOT_FOUND: "Không tìm thấy trung tâm đào tạo",
  DRIVING_CENTER_ALREADY_EXISTS: "Trung tâm đào tạo đã tồn tại",
  PROVINCE_LINKED_TO_DRIVING_CENTER: "Tỉnh đang được sử dụng",

  TRAINING_LEVEL_NOT_FOUND: "Không tìm thấy hạng đào tạo",
  TRAINING_LEVEL_ALREADY_EXISTS: "Hạng đào tạo đã tồn tại",
  TRAINING_LEVEL_LINKED_TO_TEACHERS: "Hạng đào tạo đang được sử dụng",
  TEACHER_TRAINING_NOT_FOUND: "Không tìm thấy thông tin phân công",
  TEACHER_TRAINING_ALREADY_EXISTS: "Giáo viên đã có hạng đào tạo này",

  PROFILE_NOT_FOUND: "Không tìm thấy hồ sơ",
  PROFILE_ALREADY_EXISTS: "Hồ sơ đã tồn tại",

  OPERATION_NOT_ALLOWED: "Thao tác không được phép",
  CANNOT_SUBMIT_TEST: "Không thể nộp bài",
  MUST_ANSWER_AT_LEAST_ONE_QUESTION: "Bạn phải trả lời ít nhất một câu hỏi",

  INTERNAL_SERVER_ERROR: "Lỗi hệ thống",
  DATABASE_ERROR: "Lỗi cơ sở dữ liệu",
  SERVICE_UNAVAILABLE: "Dịch vụ hiện không khả dụng",
  EXTERNAL_SERVICE_ERROR: "Lỗi dịch vụ bên ngoài",

  INVALID_ROLE: "Vai trò người dùng không hợp lệ",
  DO_NOT_ALLOW: "Không cho phép thực hiện thao tác này",
  SUPABASE_CONNECTION_FAILED: "Không thể kết nối dịch vụ xác thực",
  CURRENT_USER_NOT_FOUND: "Không tìm thấy người dùng hiện tại",

  PROFILE_MUST_BE_PENDING_TO_REJECT: "Hồ sơ phải ở trạng thái chờ để từ chối",
  PROFILE_MUST_BE_PENDING_TO_APPROVE: "Hồ sơ phải ở trạng thái chờ để duyệt",
  TEACHER_PROFILE_NOT_FOUND: "Không tìm thấy hồ sơ giáo viên",
  TEACHER_PROFILE_ALREADY_EXISTS: "Giáo viên đã có hồ sơ",
  PROFILE_NOT_AWAITING_CONFIRMATION: "Hồ sơ không ở trạng thái chờ xác nhận",
  DISTRICT_LINKED_TO_TEACHER: "Quận/Huyện đang được sử dụng bởi giáo viên",
  USER_NOT_FOUND: "Không tìm thấy người dùng",
  REVIEW_ALREADY_EXISTS: "Bạn đã đánh giá giáo viên này rồi",
  REVIEW_NOT_FOUND: "Không tìm thấy đánh giá",
  CANNOT_REVIEW_SELF: "Bạn không thể đánh giá chính mình",
  YOU_CANNOT_REVIEW_YOUR_OWN_PROFILE:
    "Bạn không thể đánh giá hồ sơ của chính mình",
  ENROLLMENT_DUPLICATE_PHONE: "Số điện thoại này đã có trong khóa học",
  COURSE_NOT_ACTIVE: "Khóa học đã được đánh dấu là hoàn thành",
};
