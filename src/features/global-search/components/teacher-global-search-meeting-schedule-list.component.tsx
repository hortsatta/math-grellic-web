import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseLink } from '#/base/components/base-link.component';
import { TeacherMeetingScheduleSingleCard } from '#/schedule/components/teacher-meeting-schedule-single-card.component';

import type { ComponentProps } from 'react';
import type { MeetingSchedule } from '#/schedule/models/schedule.model';

type Props = ComponentProps<'div'> & {
  meetingSchedules: MeetingSchedule[];
};

const MEETING_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.schedule.to}/${teacherRoutes.schedule.meeting.to}`;

export const TeacherGlobalSearchMeetingScheduleList = memo(function ({
  className,
  meetingSchedules,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const handleMeetingScheduleDetails = useCallback(
    (id: number) => () => {
      navigate(`${MEETING_LIST_PATH}/${id}`);
    },
    [navigate],
  );

  const handleMeetingScheduleEdit = useCallback(
    (id: number) => () => {
      navigate(
        `${MEETING_LIST_PATH}/${id}/${teacherRoutes.schedule.meeting.editTo}`,
      );
    },
    [navigate],
  );

  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      role='table'
      {...moreProps}
    >
      <div className='flex items-center justify-between'>
        <h3 className='text-lg leading-none'>Lessons</h3>
        <BaseLink
          to={MEETING_LIST_PATH}
          rightIconName='arrow-circle-right'
          size='xs'
        >
          View All Scheduled Meetings
        </BaseLink>
      </div>
      <div className='flex flex-col gap-2.5'>
        {meetingSchedules.map((meetingSchedule) => (
          <TeacherMeetingScheduleSingleCard
            key={`ms-${meetingSchedule.id}`}
            meetingSchedule={meetingSchedule}
            onDetails={handleMeetingScheduleDetails(meetingSchedule.id)}
            onEdit={handleMeetingScheduleEdit(meetingSchedule.id)}
            role='row'
          />
        ))}
      </div>
    </div>
  );
});
