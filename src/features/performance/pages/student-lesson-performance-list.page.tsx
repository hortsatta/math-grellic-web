import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { useStudentPerformanceSingle } from '../hooks/use-student-performance-single.hook';
import { useStudentLessonPerformanceList } from '../hooks/use-student-lesson-performance-list.hook';
import { StudentLessonPerformanceList } from '../components/student-lesson-performance-list.component';
import { StudentLessonPerformanceOverviewCard } from '../components/student-lesson-performance-overview-card.component';

export function StudentLessonPerformanceListPage() {
  const { student, loading: studentLoading } = useStudentPerformanceSingle();
  const { lessons, loading } = useStudentLessonPerformanceList();

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
            <StudentLessonPerformanceOverviewCard student={student} compact />
          )}
          <StudentLessonPerformanceList
            lessons={lessons || []}
            loading={loading}
          />
        </div>
      </div>
    </BaseDataSuspense>
  );
}
