import { teacherLessonRouteHandle } from '../route/teacher-lesson-handle.route';
import { useLessonCreate } from '../hooks/use-lesson-create.hook';
import { LessonUpsertForm } from '../components/lesson-upsert-form.component';

function LessonCreatePage() {
  const { isDone, setIsDone, createLesson } = useLessonCreate();

  return (
    <LessonUpsertForm
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={createLesson}
    />
  );
}

export const Component = LessonCreatePage;
export const handle = teacherLessonRouteHandle.create;
