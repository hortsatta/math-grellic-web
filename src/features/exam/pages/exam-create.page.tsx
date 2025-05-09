import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useExamCreate } from '../hooks/use-exam-create.hook';
import { ExamUpsertForm } from '../components/exam-upsert-form.component';

function ExamCreatePage() {
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const { loading, isDone, setIsDone, createExam } = useExamCreate();

  return (
    schoolYear && (
      <ExamUpsertForm
        schoolYearId={schoolYear.id}
        loading={loading}
        isDone={isDone}
        onDone={setIsDone}
        onSubmit={createExam}
      />
    )
  );
}

export default ExamCreatePage;
