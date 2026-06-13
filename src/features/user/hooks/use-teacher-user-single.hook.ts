import { useMemo } from 'react';
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
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);
  const { id } = useParams();

  const teacherQueryConfig = useMemo(
    () =>
      getTeacherById(
        { id: +(id || 0), schoolYearId, withStats: true },
        {
          enabled: !!id,
          refetchOnWindowFocus: false,
          select: (data: any) => {
            return transformToTeacherUserAccount(data);
          },
        },
      ),
    [id, schoolYearId],
  );

  const lessonCountQueryConfig = useMemo(
    () =>
      getLessonCountByTeacherId(
        { teacherId: +(id || 0), schoolYearId },
        {
          enabled: !!id,
          refetchOnWindowFocus: false,
        },
      ),
    [id, schoolYearId],
  );

  const examCountQueryConfig = useMemo(
    () =>
      getExamCountByTeacherId(
        { teacherId: +(id || 0), schoolYearId },
        {
          enabled: !!id,
          refetchOnWindowFocus: false,
        },
      ),
    [id, schoolYearId],
  );

  const activityCountQueryConfig = useMemo(
    () =>
      getActivityCountByTeacherId(
        { teacherId: +(id || 0), schoolYearId },
        {
          enabled: !!id,
          refetchOnWindowFocus: false,
        },
      ),
    [id, schoolYearId],
  );
  const { data: teacher, isLoading, isFetching } = useQuery(teacherQueryConfig);

  const {
    data: lessonCount,
    isLoading: isLessonCountLoading,
    isFetching: isLessonCountFetching,
  } = useQuery(lessonCountQueryConfig);

  const {
    data: examCount,
    isLoading: isExamCountLoading,
    isFetching: isExamCountFetching,
  } = useQuery(examCountQueryConfig);

  const {
    data: activityCount,
    isLoading: isActivityCountLoading,
    isFetching: isActivityCountFetching,
  } = useQuery(activityCountQueryConfig);

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
