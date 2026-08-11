package vn.edu.crs.registrationservice.service;

import vn.edu.crs.registrationservice.client.CourseClient;
import vn.edu.crs.registrationservice.dto.RegistrationRequestDTO;
import vn.edu.crs.registrationservice.entity.Registration;
import vn.edu.crs.registrationservice.repository.RegistrationRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private static final String DA_DANG_KY =
            "DA_DANG_KY";

    private static final String DA_HUY =
            "DA_HUY";

    private final RegistrationRepository
            registrationRepository;

    private final CourseClient courseClient;

    public Registration register(
            RegistrationRequestDTO dto
    ) {

        if (
                registrationRepository
                        .existsByStudentIdAndCourseIdAndTrangThai(
                                dto.getStudentId(),
                                dto.getCourseId(),
                                DA_DANG_KY
                        )
        ) {

            throw new IllegalStateException(
                    "Sinh vien da dang ky mon hoc nay roi"
            );
        }

        // 1. Trừ chỗ ở course-service trước.
        // Nếu lỗi -> dừng ở đây, không lưu Registration.
        courseClient.reserveSeat(
                dto.getCourseId()
        );

        // 2. Chỉ lưu khi trừ chỗ thành công.
        Registration registration =
                new Registration();

        registration.setStudentId(
                dto.getStudentId()
        );

        registration.setCourseId(
                dto.getCourseId()
        );

        registration.setTrangThai(
                DA_DANG_KY
        );

        registration.setNgayDangKy(
                LocalDateTime.now()
        );

        return registrationRepository.save(
                registration
        );
    }

    public void cancel(Long registrationId) {

        Registration registration =
                registrationRepository
                        .findById(registrationId)
                        .orElseThrow(() ->
                                new NoSuchElementException(
                                        "Khong tim thay dang ky id = "
                                                + registrationId
                                )
                        );

        if (
                DA_HUY.equals(
                        registration.getTrangThai()
                )
        ) {

            throw new IllegalStateException(
                    "Dang ky nay da duoc huy truoc do"
            );
        }

        // Hoàn chỗ trước
        courseClient.releaseSeat(
                registration.getCourseId()
        );

        // Sau đó mới đổi trạng thái
        registration.setTrangThai(
                DA_HUY
        );

        registrationRepository.save(
                registration
        );
    }
}