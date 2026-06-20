import { memo, useMemo } from 'react';
import cx from 'classix';

import { studentRoutes } from '#/app/routes/student-routes';
import { studentScheduleBaseRoute } from '#/schedule/route/student-schedule-handle.route';
import { BaseLink } from '#/base/components/base-link.component';
import { StudentMeetingScheduleSingleCard } from '#/schedule/components/student-meeting-schedule-single-card.component';

import type { ComponentProps } from 'react';
import type { MeetingSchedule } from '#/schedule/models/schedule.model';
import type { StudentSearchResults } from '../models/global-search.model';

type Props = ComponentProps<'div'> & {
  meetingSchedules: NonNullable<StudentSearchResults['meetingSchedules']>;
};

const MEETING_LIST_PATH = `${studentScheduleBaseRoute}/${studentRoutes.schedule.meeting.to}`;

export const StudentGlobalSearchMeetingScheduleList = memo(function ({
  className,
  meetingSchedules,
  ...moreProps
}: Props) {
  const filteredMeetingSchedules = useMemo(
    () =>
      [
        ...meetingSchedules.upcomingMeetingSchedules,
        ...meetingSchedules.moreMeetingSchedules,
      ].filter((meeting) => meeting != null) as MeetingSchedule[],
    [meetingSchedules],
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
        <h3 className='text-lg leading-none'>Scheduled Meetings</h3>
        <BaseLink
          to={MEETING_LIST_PATH}
          rightIconName='arrow-circle-right'
          size='xs'
        >
          View All Scheduled Meetings
        </BaseLink>
      </div>
      <div className='flex flex-col gap-2.5' role='table'>
        {filteredMeetingSchedules.map((meetingSchedule) => (
          <StudentMeetingScheduleSingleCard
            key={`ms-${meetingSchedule.id}`}
            meetingSchedule={meetingSchedule}
          />
        ))}
      </div>
    </div>
  );
});
