import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { queryUserKey } from '#/config/react-query-keys.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { SchoolYearEnrollmentApprovalStatus } from '#/school-year/models/school-year-enrollment.model';
import { UserApprovalStatus } from '../models/user.model';
import { getStudentCountByCurrentTeacherUser } from '../api/teacher-user.api';

type Result = {
  enrolledStudentCount: number;
  loading: boolean;
  refresh: () => void;
};

export function useStudentUserOverview(): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getStudentCountByCurrentTeacherUser(
        {
          status: UserApprovalStatus.Approved,
          schoolYearId,
          enrollmentStatus: SchoolYearEnrollmentApprovalStatus.Approved,
        },
        {
          queryKey: queryUserKey.allStudentList,
          refetchOnWindowFocus: false,
          initialData: 0,
        },
      ),
    [schoolYearId],
  );

  const { data, isLoading, isFetching, refetch } = useQuery(queryConfig);

  return {
    enrolledStudentCount: data || 0,
    loading: isLoading || isFetching,
    refresh: refetch,
  };
}
