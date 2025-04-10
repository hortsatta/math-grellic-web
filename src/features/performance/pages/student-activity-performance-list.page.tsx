import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { studentPerformanceRouteHandle } from '../route/student-performance-handle.route';
import { getStudentActivitiesByCurrentStudentUserLoader } from '../route/student-performance-loader';
import { useStudentActivityPerformanceList } from '../hooks/use-student-activity-performance-list.hook';
import { useStudentPerformanceSingle } from '../hooks/use-student-performance-single.hook';
import { StudentActivityPerformanceOverviewCard } from '../components/student-activity-performance-overview-card.component';
import { StudentActivityPerformanceList } from '../components/student-activity-performance-list.component';

function StudentActivityPerformanceListPage() {
  const { student, loading: studentLoading } = useStudentPerformanceSingle();
  const { activities, loading } = useStudentActivityPerformanceList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div
        id='scene-content'
        className='mx-auto flex w-full max-w-compact flex-1 items-start py-5 pb-16'
      >
        <div className='flex w-full flex-1 flex-col gap-2.5 self-stretch'>
          {!student || studentLoading ? (
            <BasePageSpinner />
          ) : (
            <StudentActivityPerformanceOverviewCard student={student} compact />
          )}
          <StudentActivityPerformanceList
            activities={activities || []}
            loading={loading}
          />
        </div>
      </div>
    </BaseDataSuspense>
  );
}

export const Component = StudentActivityPerformanceListPage;
export const handle = studentPerformanceRouteHandle.activities;
export const loader =
  getStudentActivitiesByCurrentStudentUserLoader(queryClient);
