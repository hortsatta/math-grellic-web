import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.components';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { SchoolYearAcademicProgress } from '../models/school-year-enrollment.model';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { StudentPerformance } from '#/performance/models/performance.model';
import type { SchoolYear } from '../models/school-year.model';

type Props = ComponentProps<typeof BaseSurface> & {
  student: StudentPerformance;
  schoolYear: SchoolYear;
  isStudent?: boolean;
  onSetAcademicProgress?: () => void;
};

type ProgressResultProps = {
  schoolYearTitle: string;
  academicProgress?: SchoolYearAcademicProgress;
  isStudent?: boolean;
};

const ProgressResult = memo(function ({
  academicProgress,
  schoolYearTitle,
  isStudent,
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

  if (
    academicProgress === SchoolYearAcademicProgress.Ongoing ||
    academicProgress == null
  ) {
    return (
      <div className='flex w-full items-center'>
        {isStudent ? 'Your progress for the' : `Student's progress for the`}
        <span className='mx-2 font-medium'>{schoolYearTitle}</span> is still
        <p
          className={cx(
            'mx-2 flex items-center gap-1 rounded-4px border-2 px-1.5 py-1 text-sm font-medium',
            resultProgressClassName,
          )}
        >
          <BaseIcon name={resultIconName as IconName} size={24} weight='bold' />
          {resultProgressText}
        </p>
      </div>
    );
  }

  return (
    <div className='flex w-full items-center'>
      {isStudent ? 'You have' : 'Student has'}{' '}
      <p
        className={cx(
          'mx-2 flex items-center gap-1 rounded-4px border-2 px-1.5 py-1 text-sm font-medium',
          resultProgressClassName,
        )}
      >
        <BaseIcon name={resultIconName as IconName} size={24} weight='bold' />
        {resultProgressText}
      </p>
      the <span className='ml-1 font-medium'>{schoolYearTitle}</span>
    </div>
  );
});

export const StudentSchoolYearAcademicProgressOverviewCard = memo(function ({
  className,
  student,
  schoolYear,
  isStudent,
  onSetAcademicProgress,
  ...moreProps
}: Props) {
  const [academicProgress, academicProgressRemarks] = useMemo(
    () => [
      student.enrollment?.academicProgress,
      student.enrollment?.academicProgress !==
      SchoolYearAcademicProgress.Ongoing
        ? student.enrollment?.academicProgressRemarks
        : null,
    ],
    [student],
  );

  const schoolYearTitle = useMemo(() => schoolYear.title, [schoolYear]);

  return (
    <BaseSurface
      className={cx('flex flex-col gap-4', className)}
      rounded='sm'
      {...moreProps}
    >
      <div className='flex items-center justify-between'>
        <h3 className='text-base '>Academic Progress</h3>
        {onSetAcademicProgress && (
          <BaseButton
            variant='link'
            size='xs'
            rightIconName='flow-arrow'
            onClick={onSetAcademicProgress}
          >
            Update Academic Progress
          </BaseButton>
        )}
      </div>
      <ProgressResult
        academicProgress={academicProgress}
        schoolYearTitle={schoolYearTitle || ''}
        isStudent={isStudent}
      />
      {academicProgressRemarks && (
        <>
          <BaseDivider />
          <div>
            <h3 className='text-base'>Progress Remarks</h3>
            <p className='my-2'>{academicProgressRemarks}</p>
          </div>
        </>
      )}
    </BaseSurface>
  );
});
