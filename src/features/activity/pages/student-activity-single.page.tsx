import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { getStudentActivityBySlugLoader } from '../route/student-activity-loader.route';
import { studentActivityRouteHandle } from '../route/student-activity-handle.route';
import { useStudentActivitySingle } from '../hooks/use-student-activity-single.hook';
import { StudentActivitySingle } from '../components/student-activity-single.component';

function StudentActivitySinglePage() {
  const { loading, title, activity } = useStudentActivitySingle();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene title={title}>
        {activity && (
          <StudentActivitySingle
            className='mx-auto py-5'
            activity={activity}
            loading={loading}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}

export const Component = StudentActivitySinglePage;
export const handle = studentActivityRouteHandle.single;
export const loader = getStudentActivityBySlugLoader(queryClient);
