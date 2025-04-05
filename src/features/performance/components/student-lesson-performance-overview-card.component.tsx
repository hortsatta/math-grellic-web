import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { StudentPerformanceType } from '../models/performance.model';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '../models/performance.model';
import { BaseLink } from '#/base/components/base-link.component';

type Props = ComponentProps<typeof BaseSurface> & {
  student: StudentPerformance;
  detailsTo?: string;
  compact?: boolean;
};

const LESSON_WRAPPER_CLASSNAME = 'flex flex-col items-center w-40';
const LESSON_VALUE_CLASSNAME = 'text-2xl font-bold text-primary';

export const StudentLessonPerformanceOverviewCard = memo(function ({
  className,
  student,
  detailsTo,
  compact,
  ...moreProps
}: Props) {
  const [
    totalLessonCount,
    currentLessonCount,
    lessonsCompletedCount,
    overallLessonScoreText,
    overallLessonCompletionPercent,
  ] = useMemo(
    () => [
      student.totalLessonCount,
      student.currentLessonCount,
      student.lessonsCompletedCount,
      `${student.lessonsCompletedCount}/${student.currentLessonCount} Completed`,
      student.overallLessonCompletionPercent,
    ],
    [student],
  );

  return (
    <BaseSurface
      className={cx('flex flex-col gap-2.5', className)}
      rounded='sm'
      {...moreProps}
    >
      {!compact && (
        <div className='flex items-center justify-between'>
          <h3 className='text-base'>Lessons</h3>
          {detailsTo && (
            <BaseLink to={detailsTo} rightIconName='subtract-square' size='xs'>
              More Details
            </BaseLink>
          )}
        </div>
      )}
      <div className='flex min-h-[200px] w-full flex-col items-stretch gap-5 md:flex-row md:gap-0'>
        <div className='flex flex-1 flex-col items-center justify-center gap-y-8'>
          <div className='flex items-center justify-center gap-5 font-bold text-primary'>
            <span className='font-display text-xl tracking-tighter'>
              {overallLessonScoreText}
            </span>
          </div>
          <BaseProgressCircle
            percent={overallLessonCompletionPercent}
            performance={StudentPerformanceType.Lesson}
            label='Overall Completion'
          />
        </div>
        <BaseDivider className='hidden !h-auto md:block' vertical />
        <BaseDivider className='block md:hidden' />
        <div className='flex flex-1 flex-col items-center justify-center font-medium'>
          <div className='flex w-fit grid-cols-2 flex-col gap-y-4 -3xs:grid -3xs:flex-row xs:flex md:flex-col'>
            <div className={LESSON_WRAPPER_CLASSNAME}>
              <span className={LESSON_VALUE_CLASSNAME}>
                {currentLessonCount}
              </span>
              <span>Current Lessons</span>
            </div>
            <div className={LESSON_WRAPPER_CLASSNAME}>
              <span className={LESSON_VALUE_CLASSNAME}>
                {lessonsCompletedCount}
              </span>
              <span>Lessons Completed</span>
            </div>
            <div className={LESSON_WRAPPER_CLASSNAME}>
              <span className={LESSON_VALUE_CLASSNAME}>{totalLessonCount}</span>
              <span>Total Lessons</span>
            </div>
          </div>
        </div>
      </div>
    </BaseSurface>
  );
});
