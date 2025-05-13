import { transformToLessonCompletion } from '../helpers/lesson-transform.helper';
import { generateApiError } from '#/utils/api.util';
import { queryLessonKey } from '#/config/react-query-keys.config';
import { generateSearchParams, kyInstance } from '#/config/ky.config';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  Lesson,
  LessonCompletion,
  StudentLessonList,
} from '../models/lesson.model';

const BASE_URL = 'lessons';

export function getLessonsByCurrentStudentUser(
  keys?: { q?: string; schoolYearId?: number },
  options?: Omit<
    UseQueryOptions<StudentLessonList, Error, StudentLessonList, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const { q, schoolYearId } = keys || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/students/list`;
    const searchParams = generateSearchParams({
      q,
      sy: schoolYearId?.toString(),
    });

    try {
      const lessons = await kyInstance.get(url, { searchParams }).json();
      return lessons;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryLessonKey.list, { q, schoolYearId }],
    queryFn,
    ...options,
  };
}

export function getLessonBySlugAndCurrentStudentUser(
  keys: {
    slug: string;
    schoolYearId?: number;
    exclude?: string;
    include?: string;
  },
  options?: Omit<UseQueryOptions<Lesson, Error, Lesson, any>, 'queryFn'>,
) {
  const { slug, schoolYearId, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${slug}/students`;
    const searchParams = generateSearchParams({
      sy: schoolYearId?.toString(),
      exclude,
      include,
    });

    try {
      const lesson = await kyInstance.get(url, { searchParams }).json();
      return lesson;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...queryLessonKey.single,
      { slug, schoolYearId, exclude, include },
    ],
    queryFn,
    ...options,
  };
}

export function setLessonCompletion(
  options?: Omit<
    UseMutationOptions<
      LessonCompletion | null,
      Error,
      { id: number; isCompleted: boolean },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    id,
    isCompleted,
  }: {
    id: number;
    isCompleted: boolean;
  }): Promise<any> => {
    const url = `${BASE_URL}/${id}/students/completion`;
    const json = { isCompleted };

    try {
      const lessonCompletion = await kyInstance.post(url, { json }).json();
      return lessonCompletion
        ? transformToLessonCompletion(lessonCompletion)
        : null;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
