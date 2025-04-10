import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { studentExamRouteHandle } from '../route/student-exam-handle.route';
import { getStudentExamBySlugLoader } from '../route/student-exam-loader.route';
import { useStudentExamSingle } from '../hooks/use-student-exam-single.hook';
import { StudentExamTake } from '../components/student-exam-take.component';
import { StudentExamSingleUpcomingNote } from '../components/student-exam-single-upcoming-note.component';

function StudentExamSinglePage() {
  const {
    isExpired,
    isDone,
    setIsDone,
    loading,
    title,
    exam,
    formData,
    upcomingDayJsDuration,
    ongoingDayJsDuration,
    syncAnswers,
    setExamCompletion,
  } = useStudentExamSingle();

  const data: any = useLoaderData();

  // Prevent student from copy and pasting questions and choices
  useEffect(() => {
    const handleCopyPaste = (event: ClipboardEvent) => {
      event.preventDefault();
    };

    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);

    return () => {
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, []);

  if (!exam) {
    return null;
  }

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene title={title}>
        {upcomingDayJsDuration ? (
          <StudentExamSingleUpcomingNote
            loading={loading}
            exam={exam}
            upcomingDuration={upcomingDayJsDuration}
          />
        ) : (
          <StudentExamTake
            isExpired={isExpired}
            isDone={isDone}
            exam={exam}
            formData={formData}
            ongoingDuration={ongoingDayJsDuration}
            onSyncAnswers={syncAnswers}
            onSubmit={setExamCompletion}
            onDone={setIsDone}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}

export const Component = StudentExamSinglePage;
export const handle = studentExamRouteHandle.single;
export const loader = getStudentExamBySlugLoader(queryClient);
