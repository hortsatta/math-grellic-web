import { ComponentProps, memo, useMemo } from 'react';
import cx from 'classix';

import { BaseIcon } from '#/base/components/base-icon.component';
import { SchoolYearAcademicProgress } from '../models/school-year-enrollment.model';

import type { IconName } from '#/base/models/base.model';

type ProgressResultProps = ComponentProps<'div'> & {
  schoolYearTitle: string;
  academicProgress?: SchoolYearAcademicProgress;
  isStudent?: boolean;
  compact?: boolean;
};

export const StudentSchoolYearAcademicProgressResult = memo(function ({
  className,
  academicProgress,
  schoolYearTitle,
  isStudent,
  compact,
  ...moreProps
}: ProgressResultProps) {
  const [resultProgressText, resultIconName, resultProgressClassName] =
    useMemo(() => {
      switch (academicProgress) {
        case SchoolYearAcademicProgress.Passed:
          return [
            SchoolYearAcademicProgress.Passed.toUpperCase(),
            'check-circle',
            'text-green-500 border-green-500',
          ];
        case SchoolYearAcademicProgress.Failed:
          return [
            SchoolYearAcademicProgress.Failed.toUpperCase(),
            'x-circle',
            'text-red-500 border-red-500',
          ];
        default:
          return [
            SchoolYearAcademicProgress.Ongoing.toUpperCase(),
            'clock-countdown',
            'border-accent',
          ];
      }
    }, [academicProgress]);

  return (
    <div
      className={cx(
        'flex w-full flex-wrap items-center gap-2',
        compact && 'text-sm leading-none',
        className,
      )}
      {...moreProps}
    >
      {academicProgress === SchoolYearAcademicProgress.Ongoing ||
      academicProgress == null ? (
        <>
          {isStudent ? 'Your progress for the' : `Learner's progress for the`}
          <span className='font-medium'>{schoolYearTitle}</span> is still
          <p
            className={cx(
              'flex items-center gap-1 rounded-4px border-2 px-1.5 py-1 text-sm font-medium',
              resultProgressClassName,
            )}
          >
            <BaseIcon
              name={resultIconName as IconName}
              size={24}
              weight='bold'
            />
            {resultProgressText}
          </p>
        </>
      ) : (
        <>
          {isStudent ? 'You have' : 'Learner has'}{' '}
          <p
            className={cx(
              'flex items-center gap-1 rounded-4px border-2 px-1.5 py-1 text-sm font-medium',
              resultProgressClassName,
            )}
          >
            <BaseIcon
              name={resultIconName as IconName}
              size={24}
              weight='bold'
            />
            {resultProgressText}
          </p>
          the <span className='font-medium'>{schoolYearTitle}</span>
        </>
      )}
    </div>
  );
});
