import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { queryClient } from '#/config/react-query-client.config';
import {
  queryStudentPerformanceKey,
  queryUserKey,
} from '#/config/react-query-keys.config';
import { transformToSchoolYearEnrollment } from '../helpers/school-year-enrollment-transform.helper';
import {
  getStudentEnrollmentByPublicIdAndCurrentTeacherUser,
  setStudentAcademicProgressByPublicIdAndTeacherId as setStudentAcademicProgressByPublicIdAndTeacherIdApi,
} from '../api/teacher-school-year-enrollment.api';

import type { SchoolYearEnrollmentAcademicProgressFormData } from '../models/school-year-enrollment-form-data.model';

type Result = {
  loading: boolean;
  academicProgressUpdateLoading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  apFormData: Partial<SchoolYearEnrollmentAcademicProgressFormData> | undefined;
  setStudentAcademicProgress: (
    data: Partial<SchoolYearEnrollmentAcademicProgressFormData>,
  ) => Promise<
    | {
        academicProgress: string;
        academicProgressRemarks?: string;
      }
    | undefined
  >;
};

export function useStudentSchoolYearAcademicProgressUpdate(
  publicId?: string,
  schoolYearId?: number,
): Result {
  const [isDone, setIsDone] = useState(false);

  const {
    data: enrollment,
    isLoading,
    isRefetching,
  } = useQuery(
    getStudentEnrollmentByPublicIdAndCurrentTeacherUser(
      { publicId: publicId ?? '', schoolYearId: schoolYearId ?? 0 },
      {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        enabled: !!publicId && !!schoolYearId,
        select: (data: unknown) => transformToSchoolYearEnrollment(data),
      },
    ),
  );

  const { mutateAsync, isLoading: isAcademicProgressUpdateLoading } =
    useMutation(setStudentAcademicProgressByPublicIdAndTeacherIdApi({}));

  const apFormData = useMemo(() => {
    if (!enrollment || !schoolYearId) {
      return undefined;
    }

    const { academicProgress, academicProgressRemarks } = enrollment;

    return {
      academicProgress,
      academicProgressRemarks: academicProgressRemarks ?? undefined,
      schoolYearId,
    };
  }, [enrollment, schoolYearId]);

  const setStudentAcademicProgress = useCallback(
    async (data: Partial<SchoolYearEnrollmentAcademicProgressFormData>) => {
      if (!publicId) return;

      const result = await mutateAsync({
        publicId,
        data,
      } as {
        publicId: string;
        data: SchoolYearEnrollmentAcademicProgressFormData;
      });

      toast.success(`Student's academic progress updated`);

      queryClient.invalidateQueries({
        queryKey: queryUserKey.studentList,
      });

      queryClient.invalidateQueries({
        queryKey: queryUserKey.studentSingle,
      });

      queryClient.invalidateQueries({
        queryKey: queryStudentPerformanceKey.list,
      });

      queryClient.invalidateQueries({
        queryKey: queryStudentPerformanceKey.single,
      });

      return result;
    },
    [publicId, mutateAsync],
  );

  return {
    loading: isLoading || isRefetching,
    isDone,
    setIsDone,
    apFormData,
    academicProgressUpdateLoading: isAcademicProgressUpdateLoading,
    setStudentAcademicProgress,
  };
}
