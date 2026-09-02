import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import {
  getCourses,
} from './courseApi';

import type {
  Course,
} from '../types/course';

import type {
  ApiErrorResponse,
} from '../types/apiError';

export type LoadState =
  | 'loading'
  | 'success'
  | 'empty'
  | 'error';

export function useCourses(
  keyword: string,
  page: number,
  size = 10
) {
  const [courses, setCourses] =
    useState<Course[]>([]);

  const [
    totalPages,
    setTotalPages,
  ] = useState(0);

  const [state, setState] =
    useState<LoadState>('loading');

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const fetchCourses =
    useCallback(() => {
      setState('loading');
      setErrorMessage('');

      getCourses(
        keyword,
        page,
        size
      )
        .then((response) => {
          const data = response.data;
          const content =
            data.content ?? [];

          setCourses(content);
          setTotalPages(
            data.totalPages ?? 0
          );

          setState(
            content.length === 0
              ? 'empty'
              : 'success'
          );
        })
        .catch((error: unknown) => {
          let message =
            'Không tải được danh sách môn học.';

          if (
            axios.isAxiosError<ApiErrorResponse>(
              error
            ) &&
            error.response?.data?.message
          ) {
            message =
              error.response.data.message;
          }

          setCourses([]);
          setTotalPages(0);
          setErrorMessage(message);
          setState('error');
        });
    }, [
      keyword,
      page,
      size,
    ]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    totalPages,
    state,
    errorMessage,
    refetch: fetchCourses,
  };
}