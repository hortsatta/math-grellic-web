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
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const { data, isLoading, isFetching, refetch } = useQuery(
    getStudentCountByCurrentTeacherUser(
      {
        status: UserApprovalStatus.Approved,
        schoolYearId: schoolYear?.id,
        enrollmentStatus: SchoolYearEnrollmentApprovalStatus.Approved,
      },
      {
        queryKey: queryUserKey.studentList,
        refetchOnWindowFocus: false,
        initialData: 0,
      },
    ),
  );

  return {
    enrolledStudentCount: data || 0,
    loading: isLoading || isFetching,
    refresh: refetch,
  };
}
