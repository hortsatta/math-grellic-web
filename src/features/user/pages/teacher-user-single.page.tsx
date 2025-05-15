import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { useTeacherUserSingle } from '../hooks/use-teacher-user-single.hook';
import { TeacherUserSingle } from '../components/teacher-user-single.component';

function TeacherUserSinglePage() {
  const {
    loading,
    lessonCountLoading,
    examCountLoading,
    activityCountLoading,
    teacher,
    lessonCount,
    examCount,
    activityCount,
  } = useTeacherUserSingle();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading && <BasePageSpinner />}
      {teacher && (
        <TeacherUserSingle
          className='mx-auto max-w-compact py-5 pb-16'
          lessonCountLoading={lessonCountLoading}
          examCountLoading={examCountLoading}
          activityCountLoading={activityCountLoading}
          teacher={teacher}
          lessonCount={lessonCount}
          examCount={examCount}
          activityCount={activityCount}
        />
      )}
    </BaseDataSuspense>
  );
}

export default TeacherUserSinglePage;
