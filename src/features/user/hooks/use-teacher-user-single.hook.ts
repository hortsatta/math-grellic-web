import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getLessonCountByTeacherId } from '#/lesson/api/admin-lesson.api';
import { getExamCountByTeacherId } from '#/exam/api/admin-exam.api';
import { getActivityCountByTeacherId } from '#/activity/api/admin-activity.api';
import { transformToTeacherUserAccount } from '../helpers/user-transform.helper';
import { getTeacherById } from '../api/admin-user.api';

import type { TeacherUserAccount } from '../models/user.model';

type Result = {
  loading: boolean;
  lessonCountLoading: boolean;
  examCountLoading: boolean;
  activityCountLoading: boolean;
  lessonCount: number;
  examCount: number;
  activityCount: number;
  teacher?: TeacherUserAccount;
};

export function useTeacherUserSingle(): Result {
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const { id } = useParams();

  const {
    data: teacher,
    isLoading,
    isFetching,
  } = useQuery(
    getTeacherById(
      { id: +(id || 0), schoolYearId: schoolYear?.id, withStats: true },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToTeacherUserAccount(data);
        },
      },
    ),
  );

  const {
    data: lessonCount,
    isLoading: isLessonCountLoading,
    isFetching: isLessonCountFetching,
  } = useQuery(
    getLessonCountByTeacherId(
      { teacherId: +(id || 0), schoolYearId: schoolYear?.id },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
      },
    ),
  );

  const {
    data: examCount,
    isLoading: isExamCountLoading,
    isFetching: isExamCountFetching,
  } = useQuery(
    getExamCountByTeacherId(
      { teacherId: +(id || 0), schoolYearId: schoolYear?.id },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
      },
    ),
  );

  const {
    data: activityCount,
    isLoading: isActivityCountLoading,
    isFetching: isActivityCountFetching,
  } = useQuery(
    getActivityCountByTeacherId(
      { teacherId: +(id || 0), schoolYearId: schoolYear?.id },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
      },
    ),
  );

  return {
    loading: isLoading || isFetching,
    lessonCountLoading: isLessonCountLoading || isLessonCountFetching,
    examCountLoading: isExamCountLoading || isExamCountFetching,
    activityCountLoading: isActivityCountLoading || isActivityCountFetching,
    teacher,
    lessonCount: lessonCount ?? 0,
    examCount: examCount ?? 0,
    activityCount: activityCount ?? 0,
  };
}
