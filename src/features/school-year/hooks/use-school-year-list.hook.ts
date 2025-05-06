import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getSchoolYearsByCurrentUser } from '../api/school-year.api';

import type { QueryObserverBaseResult } from '@tanstack/react-query';
import type { SchoolYear } from '../models/school-year.model';

type Result = {
  schoolYears: SchoolYear[];
  loading: boolean;
  refetch: QueryObserverBaseResult['refetch'];
  currentSchoolYear?: SchoolYear | null;
};

export function useSchoolYearList(): Result {
  const {
    data: list,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery(
    getSchoolYearsByCurrentUser({
      refetchOnWindowFocus: false,
    }),
  );

  const currentSchoolYear = useMemo(
    () => list?.find((item) => item.isActive),
    [list],
  );

  return {
    schoolYears: list ?? [],
    currentSchoolYear,
    loading: isLoading || isRefetching,
    refetch,
  };
}
