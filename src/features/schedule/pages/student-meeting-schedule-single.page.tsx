import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { studentScheduleRouteHandle } from '../route/student-schedule-handle.route';
import { getStudentMeetingScheduleByIdLoader } from '../route/student-schedule-loader.route';
import { useStudentMeetingScheduleSingle } from '../hooks/use-student-meeting-schedule-single.hook';
import { StudentMeetingScheduleSingle } from '../components/student-meeting-schedule-single.component';

function StudentMeetingScheduleSinglePage() {
  const { title, meetingSchedule } = useStudentMeetingScheduleSingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene title={title}>
        {meetingSchedule && (
          <StudentMeetingScheduleSingle
            meetingSchedule={meetingSchedule}
            className='mx-auto max-w-compact pt-5'
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}

export const Component = StudentMeetingScheduleSinglePage;
export const handle = studentScheduleRouteHandle.single;
export const loader = getStudentMeetingScheduleByIdLoader(queryClient);
