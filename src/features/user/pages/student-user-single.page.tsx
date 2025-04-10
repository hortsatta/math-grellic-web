import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { studentUserRouteHandle } from '../route/student-user-handle';
import { getStudentUserByIdLoader } from '../route/student-user-loader';
import { useStudentUserSingle } from '../hooks/use-student-user-single.hook';
import { StudentUserSingle } from '../components/student-user-single.component';

function StudentUserSinglePage() {
  const { loading, student } = useStudentUserSingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading && <BasePageSpinner />}
      {student && (
        <StudentUserSingle
          className='mx-auto max-w-compact py-5 pb-16'
          student={student}
        />
      )}
    </BaseDataSuspense>
  );
}

export const Component = StudentUserSinglePage;
export const handle = studentUserRouteHandle.single;
export const loader = getStudentUserByIdLoader(queryClient);
