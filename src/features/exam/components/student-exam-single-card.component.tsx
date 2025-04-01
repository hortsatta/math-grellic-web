import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import {
  convertSecondsToDuration,
  generateCountdownDate,
  getDayJsDuration,
} from '#/utils/time.util';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { StudentExamSingleCardScore } from './student-exam-single-card-score.component';
import { StudentExamSingleCardStatus } from './student-exam-single-card-status.component';

import type { ComponentProps } from 'react';
import type { Duration } from 'dayjs/plugin/duration';
import type { Exam } from '../models/exam.model';

type Props = ComponentProps<typeof BaseSurface> & {
  exam: Exam;
  primary?: boolean;
  upcomingDuration?: Duration | null;
  ongoingDuration?: Duration | null;
  isDashboard?: boolean;
};

const EXAM_LIST_PATH = `/${studentBaseRoute}/${studentRoutes.exam.to}`;

export const StudentExamSingleCard = memo(function ({
  className,
  exam,
  primary,
  upcomingDuration,
  ongoingDuration,
  isDashboard,
  ...moreProps
}: Props) {
  const [
    singleTo,
    orderNumber,
    title,
    totalPoints,
    passingPoints,
    hasMultipleSchedules,
  ] = useMemo(
    () => [
      `${EXAM_LIST_PATH}/${exam.slug}`,
      exam.orderNumber,
      exam.title,
      exam.pointsPerQuestion * exam.visibleQuestionsCount,
      exam.passingPoints,
      (exam.schedules?.length || 0) > 1,
    ],
    [exam],
  );

  const totalPointsText = useMemo(
    () =>
      totalPoints > 1
        ? `${totalPoints} Total Points`
        : `${totalPoints} Total Point`,
    [totalPoints],
  );

  const passingPointsText = useMemo(
    () =>
      passingPoints > 1
        ? `${passingPoints} Passing Points`
        : `${passingPoints} Passing Point`,
    [passingPoints],
  );

  const [scheduleDate, scheduleTime, scheduleDuration] = useMemo(() => {
    if (!exam.schedules?.length) {
      return [];
    }

    const { startDate, endDate } = exam.schedules[0];

    if (!dayjs(startDate).isSame(endDate, 'day')) {
      return [];
    }

    const date = dayjs(startDate).format('MMM DD, YYYY');
    const time = `${dayjs(startDate).format('hh:mm A')} — ${dayjs(
      endDate,
    ).format('hh:mm A')}`;
    const duration = getDayJsDuration(endDate, startDate).asSeconds();

    return [date, time, convertSecondsToDuration(duration)];
  }, [exam]);

  const upcomingCountdown = useMemo(() => {
    if (!upcomingDuration) {
      return null;
    }
    return generateCountdownDate(upcomingDuration);
  }, [upcomingDuration]);

  const { score, hasPassed } = useMemo(() => {
    if (!exam.completions?.length) {
      return { score: null, hasPassed: false };
    }

    // Get highest score if multiple completions
    // or return first completion score
    const score =
      exam.completions.find((com) => com.isHighest)?.score ||
      exam.completions[0].score;

    const hasPassed = (score || 0) >= exam.passingPoints;

    return { score, hasPassed };
  }, [exam]);

  return (
    <Link to={singleTo} className='group'>
      <BaseSurface
        className={cx(
          'flex w-full flex-col gap-2.5 !py-2.5 !pl-2.5 !pr-2.5 transition-all group-hover:-translate-y-1 group-hover:ring-1 sm:!pr-5',
          primary
            ? 'primary !border-accent !bg-primary-hue-purple group-hover:!border-primary-hue-purple-focus group-hover:ring-primary-hue-purple-focus group-hover:drop-shadow-primary'
            : 'group-hover:ring-primary-hue-purple-focus group-hover:drop-shadow-primary',
          className,
        )}
        rounded='sm'
        {...moreProps}
      >
        <div
          className={cx(
            'flex w-full flex-col items-center gap-4 sm:flex-row',
            upcomingCountdown &&
              isDashboard &&
              'flex-wrap justify-between -2lg:flex-nowrap xl:flex-wrap 2xl:flex-nowrap 2xl:justify-start',
          )}
        >
          <StudentExamSingleCardScore
            score={score}
            hasPassed={hasPassed}
            hasMultipleSchedules={hasMultipleSchedules}
            isUpcoming={!!upcomingCountdown}
            isOngoing={!!ongoingDuration}
          />
          <div
            className={cx(
              'flex w-full flex-1',
              upcomingCountdown &&
                isDashboard &&
                'basis-full sm:order-last -2lg:order-none -2lg:basis-0 xl:order-last xl:basis-full 2xl:order-none 2xl:basis-0',
            )}
          >
            <div className='flex flex-1 flex-col gap-3'>
              {/* Title and status */}
              <div className='flex min-h-fit w-full items-center 2xl:min-h-[44px]'>
                <h2 className='flex-1 font-body text-lg font-medium tracking-normal text-accent [.primary_&]:text-white'>
                  {title}
                </h2>
                {!upcomingCountdown && (
                  <StudentExamSingleCardStatus
                    score={score}
                    ongoingDuration={ongoingDuration}
                  />
                )}
              </div>
              {/* Info chips */}
              <div className='flex w-full flex-col items-start justify-between gap-5 -2xs:flex-row -2xs:items-center -2xs:gap-0 [.primary_&]:text-white'>
                <div className='flex flex-col gap-1'>
                  <BaseChip iconName='exam'>Exam {orderNumber}</BaseChip>
                  <BaseChip iconName='list-numbers'>{totalPointsText}</BaseChip>
                  <BaseChip iconName='list-checks'>
                    {passingPointsText}
                  </BaseChip>
                </div>
                {!upcomingCountdown && scheduleDate && (
                  <div className='flex flex-col gap-1'>
                    <BaseChip iconName='calendar-check'>
                      {scheduleDate}
                    </BaseChip>
                    <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
                    <BaseChip iconName='hourglass'>{scheduleDuration}</BaseChip>
                  </div>
                )}
              </div>
            </div>
          </div>
          {upcomingCountdown && scheduleDate && (
            <div className='order-first w-[250px] self-end sm:order-none sm:self-auto'>
              <small className='mb-1 flex w-full items-center justify-end font-medium uppercase [.primary_&]:text-white'>
                <span className='relative mr-4 flex gap-1'>
                  <span className='relative inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-primary-focus-light [.primary_&]:bg-white'></span>
                  <span className='relative inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-primary-focus-light animation-delay-100 [.primary_&]:bg-white'></span>
                  <span className='relative inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-primary-focus-light animation-delay-200 [.primary_&]:bg-white'></span>
                </span>
                Available In
              </small>
              <div className='w-full overflow-hidden rounded border border-accent [.primary_&]:border-white'>
                <div className='flex min-h-[24px] w-full items-center justify-center bg-primary-hue-purple [.primary_&]:bg-white'>
                  <span className='text-sm font-medium uppercase text-white [.primary_&]:text-primary'>
                    {upcomingCountdown}
                  </span>
                </div>
                <div className='flex flex-col px-2.5 py-0.5 [.primary_&]:text-white'>
                  <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
                  <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
                  <BaseChip iconName='hourglass'>{scheduleDuration}</BaseChip>
                </div>
              </div>
            </div>
          )}
        </div>
      </BaseSurface>
    </Link>
  );
});

export const StudentExamSingleCardSkeleton = memo(function () {
  return (
    <div className='flex w-full animate-pulse flex-col items-center justify-between gap-4 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-2.5 sm:flex-row sm:pr-5'>
      <div className='h-[133px] w-full rounded bg-accent/20 sm:w-[100px]' />
      <div className='flex h-fit w-full flex-1 flex-col gap-4'>
        <div className='h-6 w-[200px] rounded bg-accent/20' />
        <div className='flex items-center justify-between gap-2.5'>
          <div className='flex flex-col gap-y-1.5'>
            <div className='h-6 w-40 rounded bg-accent/20' />
            <div className='h-6 w-40 rounded bg-accent/20' />
            <div className='h-6 w-40 rounded bg-accent/20' />
          </div>
          <div className='flex flex-col gap-y-1.5'>
            <div className='h-6 w-40 rounded bg-accent/20' />
            <div className='h-6 w-40 rounded bg-accent/20' />
            <div className='h-6 w-40 rounded bg-accent/20' />
          </div>
        </div>
      </div>
    </div>
  );
});
