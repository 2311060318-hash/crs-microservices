import axiosClient from './axiosClient';

import type {
  Course,
  CourseFormValues,
} from '../types/course';

export interface CoursePageResponse {
  content: Course[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const getCourses = (
  keyword: string,
  page: number,
  size: number
) => {
  return axiosClient.get<CoursePageResponse>(
    '/api/courses',
    {
      params: {
        keyword,
        page,
        size,
      },
    }
  );
};

export const createCourse = (
  payload: CourseFormValues
) => {
  return axiosClient.post<Course>(
    '/api/courses',
    payload
  );
};

export const updateCourse = (
  id: number,
  payload: CourseFormValues
) => {
  return axiosClient.put<Course>(
    `/api/courses/${id}`,
    payload
  );
};

export const deleteCourse = (
  id: number
) => {
  return axiosClient.delete(
    `/api/courses/${id}`
  );
};

export const getCourseById = (
  id: number
) => {
  return axiosClient.get<Course>(
    `/api/courses/${id}`
  );
};