import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getSchoolYearEnrollment } from '../api/school-year-enrollment.api';
import { transformToSchoolYearEnrollment } from '../helpers/school-year-enrollment-transform.helper';

import type { SchoolYearEnrollment } from '../models/school-year-enrollment.model';

type Result = {
  loading: boolean;
  enrollment: SchoolYearEnrollment | null | undefined;
};

export function useSchoolYearEnrollment(): Result {
  const user = useBoundStore((state) => state.user);
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const syEnrollment = useBoundStore((state) => state.syEnrollment);
  const setSyEnrollment = useBoundStore((state) => state.setSyEnrollment);

  const { data, isLoading, isRefetching, refetch } = useQuery(
    getSchoolYearEnrollment(schoolYear?.id, {
      refetchOnWindowFocus: false,
      initialData: syEnrollment,
      select: (data: unknown) =>
        data ? transformToSchoolYearEnrollment(data) : null,
    }),
  );

  useEffect(() => {
    setSyEnrollment((data as SchoolYearEnrollment) ?? undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id]);

  useEffect(() => {
    if (!schoolYear || !user) {
      return;
    }

    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, schoolYear]);

  return {
    loading: isLoading || isRefetching || syEnrollment === undefined,
    enrollment: syEnrollment,
  };
}
