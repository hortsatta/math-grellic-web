import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { StudentSchoolYearAcademicProgressResult } from '#/school-year/components/student-school-year-academic-progress-result.component';

import type { ComponentProps } from 'react';
import type { SchoolYear } from '#/school-year/models/school-year.model';
import type { SchoolYearEnrollment } from '#/school-year/models/school-year-enrollment.model';

type Props = ComponentProps<typeof BaseSurface> & {
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
    <BaseSurface
      className={cx(
        'flex min-h-[224px] flex-col gap-4 -2lg:flex-row xl:flex-col 2xl:flex-row',
        className,
      )}
      {...moreProps}
    >
      <div className='flex flex-1 animate-fastFadeIn flex-col gap-4'>
        <div className='flex h-full flex-col'>
          <h3 className='mb-3.5 text-lg leading-none'>
            {schoolYearTitle} Details
          </h3>
          <div className='flex flex-col gap-1 text-sm'>
            <BaseChip iconName='graduation-cap'>
              {schoolYearIsActiveText}
            </BaseChip>
            <BaseChip
              iconName={schoolYearIsDone ? 'check-square' : 'clock-countdown'}
            >
              {schoolYearIsDoneText}
            </BaseChip>
            <BaseDivider className='my-2 hidden max-w-[250px] -2lg:block xl:hidden 2xl:block' />
            <BaseChip iconName='calendar-check'>{schoolYearDateRange}</BaseChip>
          </div>
        </div>
      </div>
      <div className='hidden -2lg:block xl:hidden 2xl:block'>
        <BaseDivider vertical />
      </div>
      <BaseDivider className='mb-1.5 mt-1 block -2lg:hidden xl:block 2xl:hidden' />
      <div className='flex-1 animate-fastFadeIn'>
        <div className='flex h-full flex-col'>
          <h3 className='mb-3.5 text-lg leading-none'>Academic Progress</h3>
          <div className='flex flex-col gap-5'>
            <StudentSchoolYearAcademicProgressResult
              academicProgress={academicProgress}
              schoolYearTitle={schoolYearTitle || ''}
              isStudent
            />
            {academicProgressRemarks && (
              <div className='flex flex-col gap-2.5 rounded-lg border border-primary-border/20 bg-primary/5 p-2.5 px-4'>
                <span className='font-medium'>Remarks</span>
                <span>{academicProgressRemarks}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseSurface>
  );
});
