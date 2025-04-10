import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { getStudentLessonBySlugLoader } from '../route/student-lesson-loader.route';
import { studentLessonRouteHandle } from '../route/student-lesson-handle.route';
import { useStudentLessonSingle } from '../hooks/use-student-lesson-single.hook';
import { StudentLessonSingle } from '../components/student-lesson-single.component';

function StudentLessonSinglePage() {
  const { loading, title, lesson, upcomingDayJsDuration, setLessonCompletion } =
    useStudentLessonSingle();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene title={title}>
        {lesson && (
          <StudentLessonSingle
            loading={loading}
            lesson={lesson}
            upcomingDuration={upcomingDayJsDuration}
            onSetCompletion={setLessonCompletion}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}

export const Component = StudentLessonSinglePage;
export const handle = studentLessonRouteHandle.single;
export const loader = getStudentLessonBySlugLoader(queryClient);
