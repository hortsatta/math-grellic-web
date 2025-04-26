import { useState, useMemo, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { querySchoolYearKey } from '#/config/react-query-keys.config';
import { getSchoolYearBySlugAndCurrentAdminUser } from '../api/admin-school-year.api';
import {
  transformToSchoolYear,
  transformToSchoolYearFormData,
} from '../helpers/school-year-transform.helper';
import {
  deleteSchoolYear as deleteSchoolYearApi,
  editSchoolYear as editSchoolYearApi,
} from '../api/admin-school-year.api';

import type { SchoolYear } from '../models/school-year.model';
import type { SchoolYearUpsertFormData } from '../models/school-year-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  schoolYearFormData: SchoolYearUpsertFormData | undefined;
  editSchoolYear: (data: SchoolYearUpsertFormData) => Promise<SchoolYear>;
  deleteSchoolYear: () => Promise<boolean>;
};

export function useSchoolYearEdit(slug?: string): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateEditSchoolYear, isLoading } = useMutation(
    editSchoolYearApi({
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: querySchoolYearKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: [...querySchoolYearKey.single, { slug: data?.slug }],
          }),
        ]),
    }),
  );

  const { mutateAsync: mutateDeleteSchoolYear, isLoading: isDeleteLoading } =
    useMutation(
      deleteSchoolYearApi({
        onSuccess: () =>
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: querySchoolYearKey.list,
            }),
            queryClient.invalidateQueries({
              queryKey: [...querySchoolYearKey.single, { slug }],
            }),
          ]),
      }),
    );

  const {
    data: schoolYear,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getSchoolYearBySlugAndCurrentAdminUser(
      { slug: slug || '' },
      {
        enabled: !!slug,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToSchoolYear(data);
        },
      },
    ),
  );

  const schoolYearFormData = useMemo(
    () => (schoolYear ? transformToSchoolYearFormData(schoolYear) : undefined),
    [schoolYear],
  );

  const editSchoolYear = useCallback(
    (data: SchoolYearUpsertFormData) => {
      return mutateEditSchoolYear({
        slug: slug || '',
        data,
      });
    },
    [slug, mutateEditSchoolYear],
  );

  const deleteSchoolYear = useCallback(async () => {
    if (!slug?.trim()) {
      return false;
    }

    return mutateDeleteSchoolYear(slug);
  }, [slug, mutateDeleteSchoolYear]);

  return {
    loading: isLoading || isDeleteLoading || isQueryLoading || isQueryFetching,
    isDone,
    setIsDone,
    schoolYearFormData,
    editSchoolYear,
    deleteSchoolYear,
  };
}
