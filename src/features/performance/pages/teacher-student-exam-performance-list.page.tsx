import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { useTeacherStudentExamPerformanceList } from '../hooks/use-teacher-student-exam-performance-list.hook';
import { useTeacherStudentPerformanceSingle } from '../hooks/use-teacher-student-performance-single.hook';
import { TeacherStudentExamPerformanceList } from '../components/teacher-student-exam-performance-list.component';
import { StudentExamPerformanceOverviewCard } from '../components/student-exam-performance-overview-card.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';

export function TeacherStudentExamPerformanceListPage() {
  const { student, loading: studentLoading } =
    useTeacherStudentPerformanceSingle();
  const { exams, loading } = useTeacherStudentExamPerformanceList();

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
          <TeacherStudentExamPerformanceList
            exams={exams || []}
            loading={loading}
          />
        </div>
      </div>
    </BaseDataSuspense>
  );
}
