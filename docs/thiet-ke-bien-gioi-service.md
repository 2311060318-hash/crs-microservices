\# THIẾT KẾ BIÊN GIỚI SERVICE



\## 1. Danh sách Service



| Service | Cổng | Database | Trách nhiệm chính |

|---|---:|---|---|

| api-gateway | 8080 | Không có DB | Điểm vào duy nhất, định tuyến, xác thực sơ bộ, CORS |

| auth-service | 8081 | auth\_db | Quản lý User, Student, đăng nhập, sinh/xác thực JWT |

| course-service | 8082 | course\_db | Quản lý Course, tìm kiếm, phân trang, quản lý số chỗ |

| registration-service | 8083 | registration\_db | Quản lý Registration, gọi sang course-service để đăng ký |



\## 2. Nguyên tắc sở hữu dữ liệu



\- Mỗi service có database riêng.

\- Không service nào được truy cập trực tiếp database của service khác.

\- Muốn lấy hoặc thay đổi dữ liệu của service khác phải gọi REST API sang service đó.

\- registration-service không có bảng Course, chỉ lưu courseId.



\## 3. Bảng định tuyến Gateway dự kiến



| Route | Forward tới | Ghi chú |

|---|---|---|

| /api/auth/\*\* | http://localhost:8081 | Public login, phần còn lại cần JWT |

| /api/courses/\*\* | http://localhost:8082 | GET public, POST/PUT/DELETE cần ADMIN |

| /api/registrations/\*\* | http://localhost:8083 | Cần JWT STUDENT/ADMIN |

| /api/public/courses | http://localhost:8082 | Dùng API Key cho đối tác ngoài |

