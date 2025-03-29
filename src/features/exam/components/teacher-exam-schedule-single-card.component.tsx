import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { convertSecondsToDuration, getDayJsDuration } from '#/utils/time.util';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';

import type { ComponentProps, MouseEvent } from 'react';
import type { ExamSchedule } from '../models/exam-schedule.model';

type Props = ComponentProps<'div'> & {
  schedule: ExamSchedule;
  isUpsert?: boolean;
  onUpsert?: () => void;
};

export const TeacherExamScheduleSingleCard = memo(function ({
  className,
  schedule,
  isUpsert,
  onUpsert,
  onClick,
  ...moreProps
}: Props) {
  const [title, date, time, duration, studentCount] = useMemo(() => {
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
    ];
  }, [schedule]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isUpsert) return;
      onClick && onClick(event);
    },
    [isUpsert, onClick],
  );

  const handleUpsert = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onUpsert && onUpsert();
    },
    [onUpsert],
  );

  return (
    <div
      className={cx(
        'flex flex-col items-start gap-1',
        !isUpsert && onClick && 'group/schedule cursor-pointer',
        className,
      )}
      role='button'
      onClick={handleClick}
      {...moreProps}
    >
      <div className='flex w-full flex-col items-start justify-between -3xs:flex-row -3xs:items-center'>
        <span
          className={cx(
            'font-medium',
            !isUpsert &&
              onClick &&
              'group-hover/schedule:text-primary-hue-purple-focus',
          )}
        >
          {title}
        </span>
        {onUpsert && (
          <BaseButton
            className='!text-base'
            variant='link'
            onClick={handleUpsert}
            bodyFont
          >
            {isUpsert ? 'Cancel' : 'Edit Schedule'}
          </BaseButton>
        )}
      </div>
      <div className='flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2.5'>
        <BaseChip iconName='calendar-check'>{date}</BaseChip>
        <BaseDivider className='hidden !h-6 sm:block' vertical />
        <BaseChip iconName='clock'>{time}</BaseChip>
        <BaseDivider className='hidden !h-6 sm:block' vertical />
        <BaseChip iconName='hourglass'>{duration}</BaseChip>
        <BaseDivider className='hidden !h-6 sm:block' vertical />
        <BaseChip iconName='users-four'>{studentCount}</BaseChip>
      </div>
    </div>
  );
});
