\# BLUEPRINT API



\## Auth Service - cổng 8081



| Method | Endpoint | Mô tả | Yêu cầu |

|---|---|---|---|

| POST | /auth/login | Đăng nhập, trả về JWT | Public |

| POST | /auth/register | Đăng ký tài khoản | Public |



\## Course Service - cổng 8082



| Method | Endpoint | Mô tả | Yêu cầu |

|---|---|---|---|

| GET | /courses | Danh sách môn học, search + phân trang | Public |

| GET | /courses/{id} | Chi tiết môn học | Public |

| POST | /courses | Thêm môn học | ADMIN |

| PUT | /courses/{id} | Sửa môn học | ADMIN |

| DELETE | /courses/{id} | Xóa môn học | ADMIN |



\## API nội bộ Course Service



| Method | Endpoint | Mô tả |

|---|---|---|

| PATCH | /internal/courses/{id}/reserve-seat | Kiểm tra còn chỗ và trừ một chỗ |

| PATCH | /internal/courses/{id}/release-seat | Hoàn trả một chỗ khi hủy |



\## Registration Service - cổng 8083



| Method | Endpoint | Mô tả | Yêu cầu |

|---|---|---|---|

| POST | /registrations | Đăng ký học phần | STUDENT |

| GET | /registrations/my | Danh sách đăng ký của tôi | STUDENT |

| DELETE | /registrations/{id} | Hủy đăng ký | STUDENT/ADMIN |

