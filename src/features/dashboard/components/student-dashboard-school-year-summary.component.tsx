import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { StudentSchoolYearAcademicProgressResult } from '#/school-year/components/student-school-year-academic-progress-result.component';

import type { ComponentProps } from 'react';
import type { SchoolYear } from '#/school-year/models/school-year.model';
import type { SchoolYearEnrollment } from '#/school-year/models/school-year-enrollment.model';

type Props = ComponentProps<'div'> & {
  schoolYear: SchoolYear;
  enrollment: SchoolYearEnrollment;
};

export const StudentDashboardSchoolYearSummary = memo(function ({
  className,
  schoolYear,
  enrollment,
  ...moreProps
}: Props) {
  const [
    schoolYearTitle,
    schoolYearDateRange,
    schoolYearIsActive,
    schoolYearIsDone,
  ] = useMemo(
    () => [
      schoolYear.title,
      `${dayjs(schoolYear.startDate).format('MMM DD, YYYY')} — ${dayjs(
        schoolYear.endDate,
      ).format('MMM DD, YYYY')}`,
      schoolYear.isActive,
      schoolYear.isDone,
    ],
    [schoolYear],
  );

  const [academicProgress, academicProgressRemarks] = useMemo(
    () => [enrollment.academicProgress, enrollment.academicProgressRemarks],
    [enrollment],
  );

  const [schoolYearIsActiveText, schoolYearIsDoneText] = useMemo(() => {
    if (schoolYearIsActive) {
      return [
        'Current School Year',
        schoolYearIsDone ? 'Completed' : 'Ongoing',
      ];
    }

    return [
      schoolYearIsDone ? 'Previous School Year' : 'Upcoming School Year',
      schoolYearIsDone ? 'Completed' : 'Not Done',
    ];
  }, [schoolYearIsActive, schoolYearIsDone]);

  return (
    <div className={cx('flex flex-col gap-4', className)} {...moreProps}>
      <div className='flex w-full flex-col gap-2.5'>
        <h3 className='text-lg leading-none'>{schoolYearTitle} Details</h3>
        <BaseSurface
          className='flex flex-1 animate-fastFadeIn flex-col gap-4'
          rounded='sm'
        >
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <span className='text-sm leading-none'>Academic Status</span>
              <div className='flex flex-col gap-1'>
                <BaseChip iconName='graduation-cap'>
                  {schoolYearIsActiveText}
                </BaseChip>
                <BaseChip
                  iconName={
                    schoolYearIsDone ? 'check-square' : 'clock-countdown'
                  }
                >
                  {schoolYearIsDoneText}
                </BaseChip>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='text-sm leading-none'>Academic Session</span>
              <BaseChip iconName='calendar-check'>
                {schoolYearDateRange}
              </BaseChip>
            </div>
          </div>
        </BaseSurface>
      </div>
      <div className='flex w-full flex-col gap-2.5'>
        <h3 className='text-lg leading-none'>Academic Progress</h3>
        <BaseSurface className='flex-1 animate-fastFadeIn' rounded='sm'>
          <div className='flex flex-col gap-2.5'>
            <StudentSchoolYearAcademicProgressResult
              academicProgress={academicProgress}
              schoolYearTitle={schoolYearTitle || ''}
              isStudent
            />
            {academicProgressRemarks && (
              <div className='flex flex-col gap-2.5 rounded-lg border border-primary-border/20 bg-primary/5 p-2.5 px-4'>
                <span className='text-sm leading-none'>Remarks</span>
                <span>{academicProgressRemarks}</span>
              </div>
            )}
          </div>
        </BaseSurface>
      </div>
    </div>
  );
});
