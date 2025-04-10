import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { teacherActivityRouteHandle } from '../route/teacher-activity-handle.route';
import { getTeacherActivityBySlugLoader } from '../route/teacher-activity-loader.route';
import { useActivityPreviewSlug } from '../hooks/use-activity-preview-slug.hook';
import { StudentActivitySingle } from '../components/student-activity-single.component';

function ActivityPreviewSlugPage() {
  const { titlePreview, activity } = useActivityPreviewSlug();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene title={titlePreview} breadcrumbsHidden isClose>
        {activity && (
          <StudentActivitySingle className='mx-auto py-5' activity={activity} />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}

export const Component = ActivityPreviewSlugPage;
export const handle = teacherActivityRouteHandle.preview;
export const loader = getTeacherActivityBySlugLoader(queryClient);
