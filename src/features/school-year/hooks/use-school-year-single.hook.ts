import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getSchoolYearBySlugAndCurrentAdminUser } from '../api/admin-school-year.api';
import { transformToSchoolYear } from '../helpers/school-year-transform.helper';

import type { SchoolYear } from '../models/school-year.model';

type Result = {
  loading: boolean;
  schoolYear?: SchoolYear | null;
};

export function useSchoolYearSingle(): Result {
  const { slug } = useParams();

  const queryConfig = useMemo(
    () =>
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
    [slug],
  );

  const { data: schoolYear, isLoading, isFetching } = useQuery(queryConfig);

  return { loading: isLoading || isFetching, schoolYear };
}
