import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { teacherLessonRouteHandle } from '../route/teacher-lesson-handle.route';
import { getTeacherLessonBySlugLoader } from '../route/teacher-lesson-loader.route';
import { useTeacherLessonSingle } from '../hooks/use-teacher-lesson-single.hook';
import { TeacherLessonSingle } from '../components/teacher-lesson-single.component';

function TeacherLessonSinglePage() {
  const { lesson, loading } = useTeacherLessonSingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading && <BasePageSpinner />}
      {lesson && (
        <TeacherLessonSingle
          className='mx-auto max-w-compact py-5'
          lesson={lesson}
        />
      )}
    </BaseDataSuspense>
  );
}

export const Component = TeacherLessonSinglePage;
export const handle = teacherLessonRouteHandle.single;
export const loader = getTeacherLessonBySlugLoader(queryClient);
