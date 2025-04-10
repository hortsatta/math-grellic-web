import { memo, useMemo } from 'react';
import cx from 'classix';

import { generateOrdinalSuffix } from '#/utils/string.util';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { StudentPerformanceType } from '../models/performance.model';
import { PerformanceRankAwardImg } from './performance-rank-award-img.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '../models/performance.model';

type Props = ComponentProps<typeof BaseSurface> & {
  student: StudentPerformance;
  detailsTo?: string;
  compact?: boolean;
};

const ACTIVITY_WRAPPER_CLASSNAME =
  'flex w-auto flex-col -3xs:leading-normal leading-tight -3xs:w-40 items-center';
const ACTIVITY_VALUE_CLASSNAME = 'text-2xl font-bold text-primary-hue-teal';

export const StudentActivityPerformanceOverviewCard = memo(function ({
  className,
  student,
  detailsTo,
  compact,
  ...moreProps
}: Props) {
  const [
    activityTotalcount,
    activityCompletedCount,
    activityIncompleteCount,
    overallActivityCompletionPercent,
    overallActivityRank,
  ] = useMemo(
    () => [
      student.activityTotalCount,
      student.activityCompletedCount,
      student.activityIncompleteCount,
      student.overallActivityCompletionPercent,
      student.overallActivityRank,
    ],
    [student],
  );

  const overallActivityRankText = useMemo(
    () =>
      overallActivityRank == null
        ? '-'
        : generateOrdinalSuffix(overallActivityRank),
    [overallActivityRank],
  );

  return (
    <BaseSurface
      className={cx('flex flex-col gap-2.5', className)}
      rounded='sm'
      {...moreProps}
    >
      {!compact && (
        <div className='flex items-center justify-between'>
          <h3 className='text-base '>Activities</h3>
          {detailsTo && (
            <BaseLink to={detailsTo} rightIconName='subtract-square' size='xs'>
              More Details
            </BaseLink>
          )}
        </div>
      )}
      <div className='flex min-h-[200px] w-full flex-col items-center gap-5 md:flex-row md:items-stretch'>
        <div className='flex flex-1 flex-col items-center justify-center gap-y-8'>
          <div className='flex items-center justify-center gap-5 font-bold text-primary-hue-teal'>
            <div className='flex items-center gap-x-2.5'>
              <span className='text-4xl'>{overallActivityRankText}</span>
              {overallActivityRank != null && overallActivityRank <= 10 && (
                <PerformanceRankAwardImg rank={overallActivityRank} />
              )}
            </div>
          </div>
          <BaseProgressCircle
            percent={overallActivityCompletionPercent}
            performance={StudentPerformanceType.Activity}
            label='Overall Completion'
          />
        </div>
        <BaseDivider className='hidden !h-auto md:block' vertical />
        <BaseDivider className='block md:hidden' />
        <div className='flex flex-1 flex-col items-center justify-center gap-2.5 font-medium'>
          <div className='flex w-full items-center gap-2.5 rounded-lg border p-2.5 -2xs:p-4'>
            <div className={ACTIVITY_WRAPPER_CLASSNAME}>
              <span className={ACTIVITY_VALUE_CLASSNAME}>
                {activityCompletedCount}
              </span>
              <span className='text-center'>Activities Completed</span>
            </div>
            <BaseDivider className='!h-14' vertical />
            <div className={ACTIVITY_WRAPPER_CLASSNAME}>
              <span className={ACTIVITY_VALUE_CLASSNAME}>
                {activityIncompleteCount}
              </span>
              <span className='text-center'>Incomplete Activities</span>
            </div>
          </div>
          <div className={ACTIVITY_WRAPPER_CLASSNAME}>
            <span className={ACTIVITY_VALUE_CLASSNAME}>
              {activityTotalcount}
            </span>
            <span>Total Activities</span>
          </div>
        </div>
      </div>
    </BaseSurface>
  );
});
