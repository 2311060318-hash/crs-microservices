import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import {
  cancelRegistration,
  getMyRegistrations,
} from '../api/registrationApi';

import {
  getCourseById,
} from '../api/courseApi';

import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

import type {
  Registration,
} from '../types/registration';

import type {
  ApiErrorResponse,
} from '../types/apiError';

interface RegistrationRow
  extends Registration {
  courseName: string;
}

export default function MyRegistrationsPage() {
  const [rows, setRows] =
    useState<RegistrationRow[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [
    cancellingId,
    setCancellingId,
  ] = useState<number | null>(null);

  const {
    toast,
    showToast,
    clearToast,
  } = useToast();

  const loadData =
    useCallback(async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const response =
          await getMyRegistrations();

        const active =
          response.data.filter(
            (registration) =>
              registration.trangThai ===
              'DA_DANG_KY'
          );

        const enriched =
          await Promise.all(
            active.map(
              async (registration) => {
                try {
                  const courseResponse =
                    await getCourseById(
                      registration.courseId
                    );

                  return {
                    ...registration,
                    courseName:
                      courseResponse.data
                        .tenMonHoc,
                  };
                } catch {
                  return {
                    ...registration,
                    courseName:
                      `Môn học #${registration.courseId} ` +
                      '(không tìm thấy thông tin)',
                  };
                }
              }
            )
          );

        setRows(enriched);
      } catch (error) {
        let message =
          'Không tải được danh sách đăng ký.';

        if (
          axios.isAxiosError<ApiErrorResponse>(
            error
          ) &&
          error.response?.data?.message
        ) {
          message =
            error.response.data.message;
        }

        setLoadError(message);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCancel = async (
    row: RegistrationRow
  ) => {
    const confirmed =
      window.confirm(
        `Hủy đăng ký môn "${row.courseName}"?`
      );

    if (!confirmed) {
      return;
    }

    setCancellingId(row.id);

    try {
      await cancelRegistration(row.id);

      showToast(
        `Đã hủy đăng ký môn "${row.courseName}"`,
        'success'
      );

      await loadData();
    } catch (error) {
      let message =
        'Hủy đăng ký không thành công.';

      if (
        axios.isAxiosError<ApiErrorResponse>(
          error
        ) &&
        error.response?.data?.message
      ) {
        message =
          error.response.data.message;
      }

      showToast(
        message,
        'error'
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 800,
        margin: '0 auto',
      }}
    >
      <h1>Môn học đã đăng ký</h1>

      {loading && (
        <p>Đang tải...</p>
      )}

      {!loading && loadError && (
        <p style={{ color: '#b91c1c' }}>
          {loadError}
        </p>
      )}

      {!loading &&
        !loadError &&
        rows.length === 0 && (
          <p>
            Bạn chưa đăng ký môn học nào.
          </p>
        )}

      {!loading &&
        !loadError &&
        rows.length > 0 && (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign: 'left',
                  borderBottom:
                    '2px solid #333',
                }}
              >
                <th>Tên môn học</th>
                <th>Ngày đăng ký</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom:
                      '1px solid #eee',
                  }}
                >
                  <td>{row.courseName}</td>

                  <td>
                    {new Date(
                      row.ngayDangKy
                    ).toLocaleString(
                      'vi-VN'
                    )}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        handleCancel(row)
                      }
                      disabled={
                        cancellingId ===
                        row.id
                      }
                    >
                      {cancellingId ===
                      row.id
                        ? 'Đang hủy...'
                        : 'Hủy đăng ký'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}
    </div>
  );
}