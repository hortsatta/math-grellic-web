import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { studentPerformanceRouteHandle } from '../route/student-performance-handle.route';
import { getStudentExamsByCurrentStudentUserLoader } from '../route/student-performance-loader';
import { useStudentExamPerformanceList } from '../hooks/use-student-exam-performance-list.hook';
import { useStudentPerformanceSingle } from '../hooks/use-student-performance-single.hook';
import { StudentExamPerformanceList } from '../components/student-exam-performance-list.component';
import { StudentExamPerformanceOverviewCard } from '../components/student-exam-performance-overview-card.component';

function StudentExamPerformanceListPage() {
  const { student, loading: studentLoading } = useStudentPerformanceSingle();
  const { exams, loading } = useStudentExamPerformanceList();

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
            <StudentExamPerformanceOverviewCard student={student} compact />
          )}
          <StudentExamPerformanceList exams={exams || []} loading={loading} />
        </div>
      </div>
    </BaseDataSuspense>
  );
}

export const Component = StudentExamPerformanceListPage;
export const handle = studentPerformanceRouteHandle.exams;
export const loader = getStudentExamsByCurrentStudentUserLoader(queryClient);
