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

  const {
    data: schoolYear,
    isLoading,
    isFetching,
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

  return { loading: isLoading || isFetching, schoolYear };
}
