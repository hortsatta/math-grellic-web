import { teacherExamRouteHandle } from '../route/teacher-exam-handle.route';
import { useExamCreate } from '../hooks/use-exam-create.hook';
import { ExamUpsertForm } from '../components/exam-upsert-form.component';

function ExamCreatePage() {
  const { loading, isDone, setIsDone, createExam } = useExamCreate();

  return (
    <ExamUpsertForm
      loading={loading}
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={createExam}
    />
  );
}

export const Component = ExamCreatePage;
export const handle = teacherExamRouteHandle.create;
