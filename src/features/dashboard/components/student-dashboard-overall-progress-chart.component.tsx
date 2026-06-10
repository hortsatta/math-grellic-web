import { memo, useMemo } from 'react';
import cx from 'classix';

import { StudentPerformanceType } from '#/performance/models/performance.model';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '#/performance/models/performance.model';

type Props = ComponentProps<'div'> & {
  studentPerformance?: StudentPerformance | null;
  loading?: boolean;
};

export const StudentDashboardOverallProgressChart = memo(function ({
  className,
  loading,
  studentPerformance,
  ...moreProps
}: Props) {
  const performances = useMemo(() => {
    const {
      overallLessonCompletionPercent,
      overallExamCompletionPercent,
      overallActivityCompletionPercent,
    } = studentPerformance || {};

    return [
      {
        value: overallExamCompletionPercent || 0,
        performace: StudentPerformanceType.Exam,
        label: 'Exams',
      },
      {
        value: overallActivityCompletionPercent || 0,
        performace: StudentPerformanceType.Activity,
        label: 'Activities',
      },
      {
        value: overallLessonCompletionPercent || 0,
        performace: StudentPerformanceType.Lesson,
        label: 'Lessons',
      },
    ];
  }, [studentPerformance]);

  return (
    <div
      className={cx('flex w-full flex-col gap-2.5', className)}
      {...moreProps}
    >
      <h3 className='text-lg leading-none'>Overall Progress</h3>
      {!performance || loading ? (
        <div className='flex w-full items-center justify-center'>
          <BaseSpinner />
        </div>
      ) : (
        <BaseSurface
          className='flex animate-fastFadeIn flex-col gap-4'
          rounded='sm'
        >
          <span className='text-sm leading-none'>
            Track your academic journey
          </span>
          <div className='flex flex-wrap justify-center gap-2 -3xs:flex-nowrap'>
            {performances.map(({ value, performace, label }, index) => (
              <BaseProgressCircle
                key={`progress-${index}`}
                percent={value}
                performance={performace}
                label={label}
                bottomLabelPosition
              />
            ))}
          </div>
        </BaseSurface>
      )}
    </div>
  );
});
