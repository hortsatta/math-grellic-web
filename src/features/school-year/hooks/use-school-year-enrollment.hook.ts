import { useEffect, useMemo } from 'react';
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
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);
  const syEnrollment = useBoundStore((state) => state.syEnrollment);
  const setSyEnrollment = useBoundStore((state) => state.setSyEnrollment);

  const queryConfig = useMemo(
    () =>
      getSchoolYearEnrollment(schoolYearId, {
        refetchOnWindowFocus: false,
        initialData: syEnrollment,
        select: (data: unknown) =>
          data ? transformToSchoolYearEnrollment(data) : null,
      }),
    [schoolYearId, syEnrollment],
  );

  const { data, isLoading, isRefetching, refetch } = useQuery(queryConfig);

  useEffect(() => {
    if (data === null || data === undefined || data?.id !== syEnrollment?.id) {
      setSyEnrollment(data as SchoolYearEnrollment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syEnrollment, data]);

  useEffect(() => {
    if (!schoolYearId || !user) {
      return;
    }

    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, schoolYearId]);

  return {
    loading: isLoading || isRefetching || syEnrollment === undefined,
    enrollment: syEnrollment,
  };
}
