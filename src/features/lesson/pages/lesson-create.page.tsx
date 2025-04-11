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

export default LessonCreatePage;
