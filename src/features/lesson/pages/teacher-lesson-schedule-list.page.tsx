import { useMemo } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';

import { teacherScheduleBaseRoute } from '#/schedule/route/teacher-schedule-handle.route';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseGroupLink } from '#/base/components/base-group-link.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { teacherLessonBaseRoute } from '../route/teacher-lesson-handle.route';
import { useTeacherLessonSingle } from '../hooks/use-teacher-lesson-single.hook';
import { TeacherLessonScheduleListOverviewBoard } from '../components/teacher-lesson-schedule-list-overview-board.component';

import type { Lesson, LessonSchedule } from '../models/lesson.model';
import type { GroupLink } from '#/base/models/base.model';

export type OutletContextType = {
  lesson?: Lesson | null;
  lessonSchedule?: LessonSchedule;
};

const sceneTitle = 'Lesson Schedule';
const sceneLinks = [
  {
    to: teacherLessonBaseRoute,
    label: 'Lesson List',
    icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard' }],
  },
  {
    to: teacherScheduleBaseRoute,
    label: 'Calendar',
    icons: [{ name: 'calendar' }],
  },
] as GroupLink[];

function TeacherLessonScheduleListPage() {
  const { lesson } = useTeacherLessonSingle();
  const data: any = useLoaderData();

  const lessonSchedule = useMemo(
    () =>
      (lesson?.schedules?.length
        ? lesson.schedules[0]
        : undefined) as LessonSchedule,
    [lesson],
  );

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        title={sceneTitle}
        headerRightContent={<BaseGroupLink links={sceneLinks} />}
      >
        {lesson && (
          <div className='w-full py-5'>
            <TeacherLessonScheduleListOverviewBoard
              lesson={lesson}
              className='mx-auto max-w-compact'
            />
            <Outlet
              context={{ lesson, lessonSchedule } satisfies OutletContextType}
            />
          </div>
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}

export default TeacherLessonScheduleListPage;
