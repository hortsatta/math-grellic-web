import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseTag } from '#/base/components/base-tag.component';

import type { ComponentProps } from 'react';
import type { ExamSchedule } from '../models/exam-schedule.model';
import type { ExamCompletion } from '../models/exam.model';

type Props = ComponentProps<'div'> & {
  totalPoints: number;
  passingPoints: number;
  schedule: ExamSchedule;
  completion?: ExamCompletion;
};

export const StudentExamCompletionHistoryItem = memo(function ({
  className,
  totalPoints,
  passingPoints,
  schedule,
  completion,
  ...moreProps
}: Props) {
  const [score, date, time] = useMemo(() => {
    if (!completion) {
      return [];
    }

    // Get schedule date and time
    const { startDate, endDate } = schedule;

    const date = dayjs(startDate).format('MMM DD, YYYY');
    const time = `${dayjs(startDate).format('hh:mm A')} — ${dayjs(
      endDate,
    ).format('hh:mm A')}`;

    return [completion.score, date, time];
  }, [completion, schedule]);

  const hasPassed = useMemo(
    () => (score || 0) >= passingPoints,
    [score, passingPoints],
  );

  const scoreText = useMemo(() => {
    const totalPointsText = totalPoints.toString().padStart(2, '0');

    if (score == null) {
      return `-/${totalPointsText}`;
    }

    const studentScore = score.toString().padStart(2, '0');

    return `${studentScore}/${totalPointsText}`;
  }, [score, totalPoints]);

  const statusText = useMemo(() => {
    if (score == null) {
      return 'Expired';
    }

    return hasPassed ? 'Passed' : 'Failed';
  }, [hasPassed, score]);

  return (
    <div
      className={cx(
        'flex w-full flex-col gap-2.5 -3xs:flex-row -3xs:items-center -3xs:justify-between',
        className,
      )}
      {...moreProps}
    >
      <div className='flex items-center gap-2.5'>
        {hasPassed ? (
          <BaseIcon
            className='text-green-500'
            name='check-circle'
            size={28}
            weight='bold'
          />
        ) : (
          <BaseIcon
            className={completion ? 'text-red-500' : 'text-accent/40'}
            name='x-circle'
            size={28}
            weight='bold'
          />
        )}
        <span className='w-20 text-center text-lg font-medium text-primary-hue-purple'>
          {scoreText}
        </span>
        <BaseTag className='w-20 !bg-primary-hue-purple !px-2'>
          {statusText}
        </BaseTag>
      </div>
      <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2.5'>
        <BaseChip iconName='calendar-check'>{date}</BaseChip>
        <BaseDivider className='hidden !h-6 sm:inline-block' vertical />
        <BaseChip iconName='clock'>{time}</BaseChip>
      </div>
    </div>
  );
});
