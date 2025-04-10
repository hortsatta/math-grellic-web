import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { getTeacherLessonBySlugLoader } from '../route/teacher-lesson-loader.route';
import { teacherLessonRouteHandle } from '../route/teacher-lesson-handle.route';
import { useLessonPreviewSlug } from '../hooks/use-lesson-preview-slug.hook';
import { StudentLessonSingle } from '../components/student-lesson-single.component';

function LessonPreviewSlugPage() {
  const { titlePreview, lesson } = useLessonPreviewSlug();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene title={titlePreview} breadcrumbsHidden isClose>
        {lesson && <StudentLessonSingle lesson={lesson} preview />}
      </BaseScene>
    </BaseDataSuspense>
  );
}

export const Component = LessonPreviewSlugPage;
export const handle = teacherLessonRouteHandle.preview;
export const loader = getTeacherLessonBySlugLoader(queryClient, {
  exclude: 'schedules',
});
