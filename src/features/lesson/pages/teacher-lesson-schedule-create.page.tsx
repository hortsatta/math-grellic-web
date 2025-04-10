import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

import { teacherLessonRouteHandle } from '../route/teacher-lesson-handle.route';
import { useLessonScheduleUpsert } from '../hooks/use-lesson-schedule-upsert.hook';
import { LessonScheduleUpsertForm } from '../components/lesson-schedule-upsert-form.component';

import type { OutletContextType } from './teacher-lesson-schedule-list.page';

function TeacherLessonScheduleCreatePage() {
  const { lesson } = useOutletContext<OutletContextType>();
  const { isDone, setIsDone, createLessonSchedule } = useLessonScheduleUpsert();
  const lessonId = useMemo(() => lesson?.id, [lesson]);

  return (
    lessonId && (
      <LessonScheduleUpsertForm
        lessonId={lessonId}
        isDone={isDone}
        onDone={setIsDone}
        onSubmit={createLessonSchedule}
      />
    )
  );
}

export const Component = TeacherLessonScheduleCreatePage;
export const handle = teacherLessonRouteHandle.schedule;
