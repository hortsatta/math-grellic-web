import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useLessonCreate } from '../hooks/use-lesson-create.hook';
import { LessonUpsertForm } from '../components/lesson-upsert-form.component';

function LessonCreatePage() {
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const { isDone, setIsDone, createLesson } = useLessonCreate();

  return (
    schoolYear && (
      <LessonUpsertForm
        schoolYearId={schoolYear.id}
        isDone={isDone}
        onDone={setIsDone}
        onSubmit={createLesson}
      />
    )
  );
}

export default LessonCreatePage;
