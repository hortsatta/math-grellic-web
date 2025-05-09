import { useQuery } from '@tanstack/react-query';

import { getCurrentSchoolYear } from '../api/school-year.api';
import { transformToSchoolYear } from '../helpers/school-year-transform.helper';

import type { SchoolYear } from '../models/school-year.model';

type Result = {
  loading: boolean;
  schoolYear?: SchoolYear | null;
};

export function useSchoolYearCurrent(): Result {
  const {
    data: schoolYear,
    isLoading,
    isFetching,
  } = useQuery(
    getCurrentSchoolYear(
      {},
      {
        refetchOnWindowFocus: false,
        select: (data: any) => {
          if (!data) {
            return null;
          }

          return transformToSchoolYear(data);
        },
      },
    ),
  );

  return { loading: isLoading || isFetching, schoolYear };
}
