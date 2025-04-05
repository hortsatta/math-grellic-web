import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { useTeacherStudentPerformanceSingle } from '../hooks/use-teacher-student-performance-single.hook';
import { useTeacherStudentLessonPerformanceList } from '../hooks/use-teacher-student-lesson-performance-list.hook';
import { StudentLessonPerformanceOverviewCard } from '../components/student-lesson-performance-overview-card.component';
import { TeacherStudentLessonPerformanceList } from '../components/teacher-student-lesson-performance-list.component';

export function TeacherStudentLessonPerformanceListPage() {
  const { student, loading: studentLoading } =
    useTeacherStudentPerformanceSingle();
  const { lessons, loading } = useTeacherStudentLessonPerformanceList();

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
          <TeacherStudentLessonPerformanceList
            lessons={lessons || []}
            loading={loading}
          />
        </div>
      </div>
    </BaseDataSuspense>
  );
}
