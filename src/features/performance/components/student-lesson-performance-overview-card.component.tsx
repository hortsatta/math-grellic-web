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

const LESSON_WRAPPER_CLASSNAME = 'flex flex-col items-center -3xs:w-40 w-auto';
const LESSON_VALUE_CLASSNAME = 'text-2xl font-bold text-primary';

export const StudentLessonPerformanceOverviewCard = memo(function ({
  className,
  student,
  detailsTo,
  compact,
  ...moreProps
}: Props) {
  const [
    lessonTotalCount,
    lessonCurrentCount,
    lessonCompletedCount,
    overallLessonScoreText,
    overallLessonCompletionPercent,
  ] = useMemo(
    () => [
      student.lessonTotalCount,
      student.lessonCurrentCount,
      student.lessonCompletedCount,
      `${student.lessonCompletedCount}/${student.lessonCurrentCount} Completed`,
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
      <div className='flex min-h-[200px] w-full flex-col items-stretch gap-5 md:flex-row'>
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
        <div className='flex w-full flex-1 flex-col items-center justify-center gap-2.5 font-medium'>
          <div className='flex w-full flex-col items-center rounded-lg border p-4'>
            <div className={LESSON_WRAPPER_CLASSNAME}>
              <span className={LESSON_VALUE_CLASSNAME}>
                {lessonCompletedCount}
              </span>
              <span>Lessons Completed</span>
            </div>
          </div>
          <div className='flex flex-col items-center gap-2.5 -3xs:flex-row'>
            <div className={LESSON_WRAPPER_CLASSNAME}>
              <span className={LESSON_VALUE_CLASSNAME}>
                {lessonCurrentCount}
              </span>
              <span>Current Lessons</span>
            </div>
            <div className={LESSON_WRAPPER_CLASSNAME}>
              <span className={LESSON_VALUE_CLASSNAME}>{lessonTotalCount}</span>
              <span>Total Lessons</span>
            </div>
          </div>
        </div>
      </div>
    </BaseSurface>
  );
});
