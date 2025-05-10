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
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const { data, isLoading, isFetching, refetch } = useQuery(
    getTeacherCountByCurrentAdminUser(
      {
        status: UserApprovalStatus.Approved,
        schoolYearId: schoolYear?.id,
        enrollmentStatus: SchoolYearEnrollmentApprovalStatus.Approved,
      },
      {
        queryKey: queryUserKey.allTeacherList,
        refetchOnWindowFocus: false,
        initialData: 0,
      },
    ),
  );

  return {
    enrolledTeacherCount: data || 0,
    loading: isLoading || isFetching,
    refresh: refetch,
  };
}
