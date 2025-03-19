import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { stripHtml } from '#/utils/html.util';
import { getDayJsDuration, convertSecondsToDuration } from '#/utils/time.util';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseRichTextOutput } from '#/base/components/base-rich-text-output.component';

import type { ComponentProps } from 'react';
import type { MeetingSchedule } from '../models/schedule.model';

type Props = ComponentProps<'div'> & {
  meetingSchedule: MeetingSchedule;
};

export const StudentMeetingScheduleSingle = memo(function ({
  className,
  meetingSchedule,
  ...moreProps
}: Props) {
  const [meetingUrl, startDate, endDate, description] = useMemo(
    () => [
      meetingSchedule.meetingUrl,
      meetingSchedule.startDate,
      meetingSchedule.endDate,
      meetingSchedule.description || '',
    ],
    [meetingSchedule],
  );

  const isEmpty = useMemo(() => {
    const result = stripHtml(description);
    return !result.trim().length;
  }, [description]);

  const [scheduleDate, scheduleTime, scheduleDuration] = useMemo(() => {
    const date = dayjs(startDate).format('MMM DD, YYYY');

    const time = `${dayjs(startDate).format('hh:mm A')} — ${dayjs(
      endDate,
    ).format('hh:mm A')}`;

    const duration = getDayJsDuration(endDate, startDate).asSeconds();

    return [date, time, convertSecondsToDuration(duration)];
  }, [startDate, endDate]);

  return (
    <div className={cx('flex w-full flex-col', className)} {...moreProps}>
      <BaseSurface className='flex flex-col gap-y-2.5' rounded='sm'>
        <div className='mb-1.5 flex w-full items-center justify-between'>
          <h3 className='text-base'>Schedule</h3>
          <div className='flex items-center gap-2.5'>
            <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='hourglass'>{scheduleDuration}</BaseChip>
          </div>
        </div>
        <BaseDivider />
        <div className='flex w-full items-center justify-between'>
          <h3 className='text-base'>Meeting Link</h3>
          <div className='flex justify-start'>
            <BaseLink
              to={meetingUrl}
              target='_blank'
              className='!font-body font-medium'
              rightIconName='arrow-square-out'
              size='sm'
            >
              {meetingUrl}
            </BaseLink>
          </div>
        </div>
      </BaseSurface>
      {!isEmpty && (
        <div className='base-rich-text rt-output py-8'>
          <BaseRichTextOutput
            className='border-0 p-0'
            label='Description'
            text={description}
            unboxed
          />
        </div>
      )}
    </div>
  );
});
