import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getStudentPerformanceByPublicIdAndCurrentTeacherUser } from '../api/teacher-performance.api';
import { transformToStudentPerformance } from '../helpers/performance-transform.helper';

import type { StudentPerformance } from '../models/performance.model';

type Result = {
  loading: boolean;
  student?: StudentPerformance | null;
};

export function useTeacherStudentPerformanceSingle(): Result {
  const { publicId } = useParams();
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    data: student,
    isLoading,
    isFetching,
  } = useQuery(
    getStudentPerformanceByPublicIdAndCurrentTeacherUser(
      { publicId: publicId || '', schoolYearId: schoolYear?.id },
      {
        enabled: !!publicId,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToStudentPerformance(data);
        },
      },
    ),
  );

  return { loading: isLoading || isFetching, student };
}
