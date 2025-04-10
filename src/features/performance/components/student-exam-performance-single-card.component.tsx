import { memo, useCallback, useMemo, useState } from 'react';
import cx from 'classix';

import { generateOrdinalSuffix } from '#/utils/string.util';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseTag } from '#/base/components/base-tag.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { StudentExamCompletionHistoryItem } from '#/exam/components/student-exam-completion-history-item.component';
import { PerformanceRankAwardImg } from './performance-rank-award-img.component';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { Exam } from '#/exam/models/exam.model';
import type { ExamSchedule } from '#/exam/models/exam-schedule.model';

type Props = ComponentProps<typeof BaseSurface> & {
  exam: Exam;
  onResult?: (exam: Exam) => void;
};

type HistoryListProps = {
  exam: Exam;
  onResult?: (exam: Exam) => void;
};

const HistoryList = memo(({ exam, onResult }: HistoryListProps) => {
  const [totalPoints, passingPoints, schedulesAndCompletions] = useMemo(
    () => [
      exam.visibleQuestionsCount * exam.pointsPerQuestion,
      exam.passingPoints,
      exam.schedules?.map((schedule) => ({
        schedule,
        completion: exam.completions?.find(
          (com) => com.schedule.id === schedule.id,
        ),
      })) || [],
    ],
    [exam],
  );

  const handleResult = useCallback(
    (schedule: ExamSchedule) => () => {
      onResult && onResult({ ...exam, schedules: [schedule] });
    },
    [exam, onResult],
  );

  return (
    <div className='flex flex-col px-2.5 pb-2.5'>
      <BaseDivider />
      {schedulesAndCompletions.map(({ schedule, completion }) => (
        <StudentExamCompletionHistoryItem
          key={`sched-${schedule.id}`}
          className='p-2.5'
          totalPoints={totalPoints}
          passingPoints={passingPoints}
          schedule={schedule}
          completion={completion}
          onClick={onResult ? handleResult(schedule) : undefined}
        />
      ))}
    </div>
  );
});

export const StudentExamPerformanceSingleCard = memo(function ({
  className,
  exam,
  onResult,
  ...moreProps
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [orderNumber, title, totalPoints, passingPoints, completion, rank] =
    useMemo(
      () => [
        exam.orderNumber,
        exam.title,
        exam.visibleQuestionsCount * exam.pointsPerQuestion,
        exam.passingPoints,
        exam.completions?.find((com) => com.isHighest) ||
          (exam.completions || [])[0],
        exam.rank,
      ],
      [exam],
    );

  const [schedule, isUpcoming] = useMemo(() => {
    if (!exam.schedules?.length) return [];

    return [
      exam.schedules[0],
      exam.schedules.length > 1 ? false : exam.schedules[0].isUpcoming,
    ];
  }, [exam]);

  const hasPassed = useMemo(
    () => (completion?.score || 0) >= passingPoints,
    [completion, passingPoints],
  );

  const scoreText = useMemo(() => {
    const totalPointsText = totalPoints.toString().padStart(2, '0');

    if (!completion) {
      return `-/${totalPointsText}`;
    }

    const studentScore = (completion.score || 0).toString().padStart(2, '0');

    return `${studentScore}/${totalPointsText}`;
  }, [completion, totalPoints]);

  const statusText = useMemo(() => {
    if (isUpcoming) return 'Upcoming';

    if (!completion) {
      return schedule && schedule.isOngoing ? 'Pending' : 'Expired';
    }

    return hasPassed ? 'Passed' : 'Failed';
  }, [isUpcoming, hasPassed, schedule, completion]);

  const rankText = useMemo(
    () => (rank == null ? '-' : generateOrdinalSuffix(rank)),
    [rank],
  );

  const toggleHistoryList = useCallback(
    () => setIsCollapsed((prev) => !prev),
    [],
  );

  return (
    <BaseSurface className={cx('!p-0', className)} rounded='sm' {...moreProps}>
      <div
        className='flex h-auto w-full flex-col items-start justify-between gap-2.5 rounded-md px-4 py-2.5 transition-all hover:cursor-pointer hover:!border-primary-hue-purple-focus hover:shadow-md hover:ring-1 hover:ring-primary-hue-purple-focus sm:flex-row sm:items-center sm:gap-5'
        onClick={toggleHistoryList}
      >
        <div className='flex items-center gap-x-2.5'>
          <BaseIcon
            className='text-primary'
            name={(isCollapsed ? 'caret-right' : 'caret-down') as IconName}
            size={22}
          />
          {isUpcoming ? (
            <BaseIcon
              className='text-accent/40'
              name='x-circle'
              size={28}
              weight='bold'
            />
          ) : hasPassed ? (
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
          <span>
            Exam {orderNumber} - {title}
          </span>
        </div>
        <div className='flex w-full items-center justify-start gap-x-4 text-primary-hue-purple group-hover:text-white sm:w-auto'>
          <div className='flex flex-col gap-x-4 sm:flex-row'>
            <div className='w-20 text-center text-lg font-medium'>
              {scoreText}
            </div>
            <BaseTag className='w-20 !bg-primary-hue-purple !px-2'>
              {statusText}
            </BaseTag>
          </div>
          <div className='flex min-w-[104px] items-center justify-end gap-x-2.5'>
            <span className='text-2xl font-bold'>{rankText}</span>
            {rank != null && rank <= 10 && (
              <PerformanceRankAwardImg rank={rank} size='sm' />
            )}
          </div>
        </div>
      </div>
      {!isCollapsed && <HistoryList exam={exam} onResult={onResult} />}
    </BaseSurface>
  );
});

export const StudentExamPerformanceSingleCardSkeleton = memo(function () {
  return (
    <div className='flex w-full animate-pulse flex-col justify-between gap-2.5 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-4 sm:h-[54px] sm:flex-row'>
      <div className='flex items-center gap-2.5'>
        <div className='h-[34px] w-[34px] shrink-0 rounded bg-accent/20' />
        <div className='h-6 w-[200px] rounded bg-accent/20' />
      </div>
      <div className='flex w-full items-center gap-2.5 sm:w-auto'>
        <div className='flex w-[80px] flex-col gap-2.5 sm:w-full sm:flex-row sm:gap-4'>
          <div className='h-6 w-full rounded bg-accent/20 -3xs:w-20 sm:w-20' />
          <div className='h-6 w-full rounded bg-accent/20 -3xs:w-20 sm:w-20' />
        </div>
        <div className='h-full w-28 rounded bg-accent/20' />
      </div>
    </div>
  );
});
