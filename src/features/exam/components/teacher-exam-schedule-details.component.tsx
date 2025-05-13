import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { convertSecondsToDuration, getDayJsDuration } from '#/utils/time.util';
import { UserSingleItem } from '#/user/components/user-single-item.component';

import type { ComponentProps } from 'react';
import type { ExamSchedule } from '../models/exam-schedule.model';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';

type Props = ComponentProps<'div'> & {
  schedule: ExamSchedule;
};

export const TeacherExamScheduleDetails = memo(function ({
  className,
  schedule,
  ...moreProps
}: Props) {
  const [title, date, time, duration, studentCount, students] = useMemo(() => {
    const { title, startDate, endDate, studentCount } = schedule;
    const date = dayjs(startDate).format('MMM DD, YYYY');
    const time = `${dayjs(startDate).format('hh:mm A')} — ${dayjs(
      endDate,
    ).format('hh:mm A')}`;
    const duration = getDayJsDuration(endDate, startDate).asSeconds();

    return [
      title,
      date,
      time,
      convertSecondsToDuration(duration),
      studentCount,
      schedule.students,
    ];
  }, [schedule]);

  return (
    <div
      className={cx('flex flex-col gap-4 p-2.5 sm:p-0', className)}
      {...moreProps}
    >
      <div className='flex flex-col gap-1'>
        <h4 className='text-lg'>{title}</h4>
        <div className='flex flex-col items-start gap-1 pb-1 sm:flex-row sm:items-center sm:gap-2.5'>
          <BaseChip iconName='calendar-check'>{date}</BaseChip>
          <BaseDivider className='hidden !h-6 sm:block' vertical />
          <BaseChip iconName='clock'>{time}</BaseChip>
          <BaseDivider className='hidden !h-6 sm:block' vertical />
          <BaseChip iconName='hourglass'>{duration}</BaseChip>
        </div>
        <BaseDivider />
      </div>
      <div>
        <div className='flex flex-row items-start justify-between gap-0 pb-1 -3xs:gap-4'>
          <span className='font-medium'>Assigned Students</span>
          <BaseChip iconName='student'>{studentCount}</BaseChip>
        </div>
        <ul className='w-full'>
          {students.map((student) => (
            <li key={student.id} className='w-full'>
              <UserSingleItem className='!px-1 !py-1' userAccount={student} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});
