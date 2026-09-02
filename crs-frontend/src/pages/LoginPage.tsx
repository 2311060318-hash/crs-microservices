import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { login as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import type { ApiErrorResponse } from '../types/apiError';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await loginApi({
        username,
        password,
      });

      login(response.data);
      navigate('/courses');
    } catch (err) {
      if (
        axios.isAxiosError<ApiErrorResponse>(err) &&
        err.response?.data?.message
      ) {
        setError(err.response.data.message);
      } else {
        setError(
          'Đăng nhập thất bại, vui lòng thử lại.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 360,
        margin: '80px auto',
        padding: 24,
        border: '1px solid #ddd',
        borderRadius: 8,
      }}
    >
      <h2>Đăng nhập hệ thống CRS</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Tên đăng nhập</label>
          <br />

          <input
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            required
            style={{
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Mật khẩu</label>
          <br />

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
            style={{
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {error && (
          <p style={{ color: '#b91c1c' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{ width: '100%' }}
        >
          {submitting
            ? 'Đang xử lý...'
            : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}