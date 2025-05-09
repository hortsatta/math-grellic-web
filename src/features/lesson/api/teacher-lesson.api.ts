import { generateApiError } from '#/utils/api.util';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryLessonKey } from '#/config/react-query-keys.config';
import {
  transformToLesson,
  transformToLessonUpsertDto,
} from '../helpers/lesson-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { PaginatedQueryData } from '#/core/models/core.model';
import type { QueryPagination } from '#/base/models/base.model';
import type { Lesson } from '../models/lesson.model';
import type { LessonUpsertFormData } from '../models/lesson-form-data.model';

const BASE_URL = 'lessons';

export function getPaginatedLessonsByCurrentTeacherUser(
  keys?: {
    q?: string;
    status?: string;
    sort?: string;
    pagination?: Omit<QueryPagination, 'totalCount'>;
    schoolYearId?: number;
  },
  options?: Omit<
    UseQueryOptions<
      PaginatedQueryData<Lesson>,
      Error,
      PaginatedQueryData<Lesson>,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const { q, status, sort, pagination, schoolYearId } = keys || {};
  const { take, skip } = pagination || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/teachers/list`;
    const searchParams = generateSearchParams({
      q,
      status,
      sort,
      skip: skip?.toString() || '0',
      take: take?.toString() || '0',
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
    queryKey: [...queryLessonKey.list, { q, status, sort, skip, take }],
    queryFn,
    ...options,
  };
}

export function getLessonsByCurrentTeacherUser(
  keys?: {
    ids?: number[];
    q?: string;
    status?: string;
    sort?: string;
    schoolYearId?: number;
  },
  options?: Omit<UseQueryOptions<Lesson[], Error, Lesson[], any>, 'queryFn'>,
) {
  const { ids, q, status, sort, schoolYearId } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/teachers/list/all`;
    const searchParams = generateSearchParams({
      ids: ids?.join(','),
      q,
      status,
      sort,
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
    queryKey: [
      ...(queryKey?.length ? queryKey : queryLessonKey.list),
      { q, ids, status, sort },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getLessonSnippetsByCurrentTeacherUser(
  keys?: { take?: number; schoolYearId?: number },
  options?: Omit<UseQueryOptions<Lesson[], Error, Lesson[], any>, 'queryFn'>,
) {
  const { take, schoolYearId } = keys || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/teachers/list/snippets`;
    const searchParams = generateSearchParams({
      take: take?.toString(),
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
    queryKey: [...queryLessonKey.list, { take }],
    queryFn,
    ...options,
  };
}

export function getLessonBySlugAndCurrentTeacherUser(
  keys: {
    slug: string;
    status?: string;
    schoolYearId?: number;
    exclude?: string;
    include?: string;
  },
  options?: Omit<UseQueryOptions<Lesson, Error, Lesson, any>, 'queryFn'>,
) {
  const { slug, status, schoolYearId, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${slug}/teachers`;
    const searchParams = generateSearchParams({
      status,
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
    queryKey: [...queryLessonKey.single, { slug, status, exclude, include }],
    queryFn,
    ...options,
  };
}

export function createLesson(
  options?: Omit<
    UseMutationOptions<Lesson, Error, LessonUpsertFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: LessonUpsertFormData): Promise<any> => {
    const json = transformToLessonUpsertDto(data);

    try {
      const lesson = await kyInstance.post(BASE_URL, { json }).json();
      return transformToLesson(lesson);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editLesson(
  options?: Omit<
    UseMutationOptions<
      Lesson,
      Error,
      { id: number; data: LessonUpsertFormData },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    id,
    data,
  }: {
    id: number;
    data: LessonUpsertFormData;
  }): Promise<any> => {
    const url = `${BASE_URL}/${id}`;
    const json = transformToLessonUpsertDto(data);

    try {
      const lesson = await kyInstance.patch(url, { json }).json();
      return transformToLesson(lesson);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function deleteLesson(
  options?: Omit<UseMutationOptions<boolean, Error, number, any>, 'mutationFn'>,
) {
  const mutationFn = async (id: number): Promise<boolean> => {
    const url = `${BASE_URL}/${id}`;

    try {
      const success: boolean = await kyInstance.delete(url).json();
      return success;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
