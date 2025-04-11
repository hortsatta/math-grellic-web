import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { useTeacherStudentActivityPerformanceList } from '../hooks/use-teacher-student-activity-performance-list.hook';
import { useTeacherStudentPerformanceSingle } from '../hooks/use-teacher-student-performance-single.hook';
import { StudentActivityPerformanceOverviewCard } from '../components/student-activity-performance-overview-card.component';
import { TeacherStudentActivityPerformanceList } from '../components/teacher-student-activity-performance-list.component';

function TeacherStudentActivityPerformanceListPage() {
  const { student, loading: studentLoading } =
    useTeacherStudentPerformanceSingle();
  const { activities, loading } = useTeacherStudentActivityPerformanceList();

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
          <TeacherStudentActivityPerformanceList
            activities={activities || []}
            loading={loading}
          />
        </div>
      </div>
    </BaseDataSuspense>
  );
}

export default TeacherStudentActivityPerformanceListPage;
