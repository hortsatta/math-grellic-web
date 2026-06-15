import { useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getCurrentSchoolYear } from '../api/school-year.api';
import { transformToSchoolYear } from '../helpers/school-year-transform.helper';

import type { SchoolYear } from '../models/school-year.model';

type Result = {
  loading: boolean;
  setCurrentSchoolYear: () => void;
  schoolYear?: SchoolYear | null;
};

export function useSchoolYearCurrent(): Result {
  const setSchoolYear = useBoundStore((state) => state.setSchoolYear);

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

  const setCurrentSchoolYear = async () => {
    let schoolYear = undefined;
    try {
      const data = await queryClient.fetchQuery(getCurrentSchoolYear({}));
      if (data) {
        schoolYear = transformToSchoolYear(data);
      }
    } finally {
      setSchoolYear(schoolYear);
    }
  };

  return {
    loading: isLoading || isFetching,
    schoolYear,
    setCurrentSchoolYear,
  };
}
