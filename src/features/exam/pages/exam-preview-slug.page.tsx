import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { teacherExamRouteHandle } from '../route/teacher-exam-handle.route';
import { getTeacherExamBySlugLoader } from '../route/teacher-exam-loader.route';
import { useExamPreviewSlug } from '../hooks/use-exam-preview-slug.hook';
import { StudentExamTakeDone } from '../components/student-exam-take-done.component';
import { StudentExamTakeForm } from '../components/student-exam-take-form.component';

function ExamPreviewSlugPage() {
  const { isDone, setIsDone, titlePreview, exam, examCompletion, submitExam } =
    useExamPreviewSlug();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene title={titlePreview} breadcrumbsHidden isClose>
        {exam &&
          (examCompletion && isDone ? (
            <StudentExamTakeDone
              className='mx-auto max-w-screen-sm'
              exam={exam}
              examCompletion={examCompletion}
            />
          ) : (
            <StudentExamTakeForm
              className='flex-1 py-5'
              exam={exam}
              isDone={isDone}
              onSubmit={submitExam}
              onDone={setIsDone}
              ongoingDuration={null}
              preview
            />
          ))}
      </BaseScene>
    </BaseDataSuspense>
  );
}

export const Component = ExamPreviewSlugPage;
export const handle = teacherExamRouteHandle.preview;
export const loader = getTeacherExamBySlugLoader(queryClient, {
  exclude: 'schedules',
});
