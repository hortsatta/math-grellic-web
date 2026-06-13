import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { queryUserKey } from '#/config/react-query-keys.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { SchoolYearEnrollmentApprovalStatus } from '#/school-year/models/school-year-enrollment.model';
import { UserApprovalStatus } from '../models/user.model';
import { getTeacherCountByCurrentAdminUser } from '../api/admin-user.api';

type Result = {
  enrolledTeacherCount: number;
  loading: boolean;
  refresh: () => void;
};

export function useTeacherUserOverview(): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getTeacherCountByCurrentAdminUser(
        {
          status: UserApprovalStatus.Approved,
          schoolYearId,
          enrollmentStatus: SchoolYearEnrollmentApprovalStatus.Approved,
        },
        {
          queryKey: queryUserKey.allTeacherList,
          refetchOnWindowFocus: false,
          initialData: 0,
        },
      ),
    [schoolYearId],
  );

  const { data, isLoading, isFetching, refetch } = useQuery(queryConfig);

  return {
    enrolledTeacherCount: data || 0,
    loading: isLoading || isFetching,
    refresh: refetch,
  };
}
