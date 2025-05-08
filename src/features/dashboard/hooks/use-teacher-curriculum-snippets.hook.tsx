import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { transformToLesson } from '#/lesson/helpers/lesson-transform.helper';
import { transformToExam } from '#/exam/helpers/exam-transform.helper';
import { transformToActivity } from '#/activity/helpers/activity-transform.helper';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getLessonSnippetsByCurrentTeacherUser } from '#/lesson/api/teacher-lesson.api';
import { getExamSnippetsByCurrentTeacherUser } from '#/exam/api/teacher-exam.api';
import { getActivitySnippetsByCurrentTeacherUser } from '#/activity/api/teacher-activity.api';

import type { Lesson } from '#/lesson/models/lesson.model';
import type { Exam } from '#/exam/models/exam.model';
import type { Activity } from '#/activity/models/activity.model';

type Result = {
  loading: boolean;
  lessons: Lesson[];
  exams: Exam[];
  activities: Activity[];
  refreshLessons: () => void;
  refreshExams: () => void;
  refreshActivities: () => void;
  handleLessonDetails: (slug: string) => void;
  handleExamDetails: (slug: string) => void;
  handleActivityDetails: (slug: string) => void;
};

const LESSON_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.lesson.to}`;
const EXAM_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.exam.to}`;
const ACTIVITY_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.activity.to}`;

export function useTeacherCurriculumSnippets(): Result {
  const navigate = useNavigate();
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    data: lessonsData,
    isLoading: isLessonsLoading,
    isRefetching: isLessonsRefetching,
    refetch: refreshLessons,
  } = useQuery(
    getLessonSnippetsByCurrentTeacherUser(
      { take: undefined, schoolYearId: schoolYear?.id },
      {
        refetchOnWindowFocus: false,
        select: (data: any[]) => {
          if (!Array.isArray(data)) {
            return [];
          }

          return data.map((item: unknown) => transformToLesson(item));
        },
      },
    ),
  );

  const {
    data: examsData,
    isLoading: isExamsLoading,
    isRefetching: isExamsRefetching,
    refetch: refreshExams,
  } = useQuery(
    getExamSnippetsByCurrentTeacherUser(undefined, {
      refetchOnWindowFocus: false,
      select: (data: any[]) => {
        if (!Array.isArray(data)) {
          return [];
        }

        return data.map((item: unknown) => transformToExam(item));
      },
    }),
  );

  const {
    data: activitiesData,
    isLoading: isActivitiesLoading,
    isRefetching: isActivitiesRefetching,
    refetch: refreshActivities,
  } = useQuery(
    getActivitySnippetsByCurrentTeacherUser(undefined, {
      refetchOnWindowFocus: false,
      select: (data: any[]) => {
        if (!Array.isArray(data)) {
          return [];
        }

        return data.map((item: unknown) => transformToActivity(item));
      },
    }),
  );

  const handleLessonDetails = useCallback(
    (slug: string) => {
      navigate(`${LESSON_LIST_PATH}/${slug}`);
    },
    [navigate],
  );

  const handleExamDetails = useCallback(
    (slug: string) => {
      navigate(`${EXAM_LIST_PATH}/${slug}`);
    },
    [navigate],
  );

  const handleActivityDetails = useCallback(
    (slug: string) => {
      navigate(`${ACTIVITY_LIST_PATH}/${slug}`);
    },
    [navigate],
  );

  return {
    loading:
      isLessonsLoading ||
      isExamsLoading ||
      isActivitiesLoading ||
      isLessonsRefetching ||
      isExamsRefetching ||
      isActivitiesRefetching,
    lessons: lessonsData || [],
    exams: examsData || [],
    activities: activitiesData || [],
    refreshLessons,
    refreshExams,
    refreshActivities,
    handleLessonDetails,
    handleExamDetails,
    handleActivityDetails,
  };
}
