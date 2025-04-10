import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { teacherExamRouteHandle } from '../route/teacher-exam-handle.route';
import { getTeacherExamBySlugLoader } from '../route/teacher-exam-loader.route';
import { useTeacherExamSingle } from '../hooks/use-teacher-exam-single.hook';
import { TeacherExamSingle } from '../components/teacher-exam-single.component';

function TeacherExamSinglePage() {
  const { exam, loading } = useTeacherExamSingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading && <BasePageSpinner />}
      {exam && (
        <TeacherExamSingle className='mx-auto max-w-compact py-5' exam={exam} />
      )}
    </BaseDataSuspense>
  );
}

export const Component = TeacherExamSinglePage;
export const handle = teacherExamRouteHandle.single;
export const loader = getTeacherExamBySlugLoader(queryClient);
