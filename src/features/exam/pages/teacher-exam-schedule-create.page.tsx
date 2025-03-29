import { useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

import { useExamScheduleCreate } from '../hooks/use-exam-schedule-create.hook';
import { ExamScheduleUpsertForm } from '../components/exam-schedule-upsert-form.component';

import type { OutletContextType } from './teacher-exam-schedule-list.page';

export function TeacherExamScheduleCreatePage() {
  const { exam, clearSelectedExamSchedule } =
    useOutletContext<OutletContextType>();

  const { loading, isDone, setIsDone, createExamSchedule } =
    useExamScheduleCreate();

  const examId = useMemo(() => exam?.id, [exam]);

  const handleDone = useCallback(
    (isDone: boolean) => {
      setIsDone(isDone);
      isDone && clearSelectedExamSchedule && clearSelectedExamSchedule();
    },
    [setIsDone, clearSelectedExamSchedule],
  );

  return (
    examId && (
      <ExamScheduleUpsertForm
        examId={examId}
        loading={loading}
        isDone={isDone}
        onDone={handleDone}
        onSubmit={createExamSchedule}
      />
    )
  );
}
