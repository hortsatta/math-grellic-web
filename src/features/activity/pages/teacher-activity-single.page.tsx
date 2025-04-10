import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { teacherActivityRouteHandle } from '../route/teacher-activity-handle.route';
import { getTeacherActivityBySlugLoader } from '../route/teacher-activity-loader.route';
import { useTeacherActivitySingle } from '../hooks/use-teacher-activity-single.hook';
import { TeacherActivitySingle } from '../components/teacher-activity-single.component';

function TeacherActivitySinglePage() {
  const { activity, loading } = useTeacherActivitySingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading && <BasePageSpinner />}
      {activity && (
        <TeacherActivitySingle
          className='mx-auto max-w-compact py-5'
          activity={activity}
        />
      )}
    </BaseDataSuspense>
  );
}

export const Component = TeacherActivitySinglePage;
export const handle = teacherActivityRouteHandle.single;
export const loader = getTeacherActivityBySlugLoader(queryClient);
