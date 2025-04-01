import { memo, useCallback, useMemo, useState } from 'react';

import { ExamScheduleStatus } from '../models/exam-schedule.model';
import { StudentExamTakeStart } from '../components/student-exam-take-start.component';
import { StudentExamTakeForm } from '../components/student-exam-take-form.component';
import { StudentExamTakeDone } from '../components/student-exam-take-done.component';

import type { Duration } from 'dayjs/plugin/duration';
import type { Exam, ExamCompletion } from '../models/exam.model';
import type { StudentExamFormData } from '../models/exam-form-data.model';

type Props = {
  isExpired: boolean;
  isDone: boolean;
  exam: Exam;
  formData: StudentExamFormData | null;
  ongoingDuration: Duration | null;
  onSyncAnswers: (data: StudentExamFormData) => Promise<ExamCompletion>;
  onSubmit: (data: StudentExamFormData) => Promise<ExamCompletion | null>;
  onDone: (isDone: boolean) => void;
};

export const StudentExamTake = memo(function ({
  isExpired,
  isDone,
  exam,
  formData,
  ongoingDuration,
  onSyncAnswers,
  onSubmit,
  onDone,
}: Props) {
  const [startExam, setStartExam] = useState(false);
  const [examCompletion, isPast] = useMemo(
    () => [
      exam.completions?.find((com) => com.isRecent) || null,
      exam.scheduleStatus === ExamScheduleStatus.Past,
    ],
    [exam],
  );

  const isOngoing = useMemo(
    () => ongoingDuration && !!ongoingDuration.asSeconds(),
    [ongoingDuration],
  );

  const handleStartExam = useCallback(() => {
    setStartExam(true);
  }, []);

  if (examCompletion && (isDone || !isOngoing)) {
    return (
      <StudentExamTakeDone
        className='mx-auto max-w-screen-sm'
        exam={exam}
        examCompletion={examCompletion}
      />
    );
  } else if (!examCompletion && isPast) {
    return (
      <StudentExamTakeDone
        className='mx-auto max-w-screen-sm'
        exam={exam}
        isExpired
      />
    );
  }

  return (
    <>
      {!startExam ? (
        <StudentExamTakeStart
          className='mx-auto max-w-screen-sm'
          exam={exam}
          onStart={handleStartExam}
        />
      ) : (
        formData && (
          <StudentExamTakeForm
            className='flex-1 py-5'
            isExpired={isExpired}
            isDone={isDone}
            exam={exam}
            formData={formData}
            ongoingDuration={ongoingDuration}
            onSyncAnswers={onSyncAnswers}
            onSubmit={onSubmit}
            onDone={onDone}
          />
        )
      )}
    </>
  );
});
