import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { SchoolYearAcademicProgress } from '#/school-year/models/school-year-enrollment.model';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
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
      `${schoolYear.title} Details`,
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

  const [
    academicProgressText,
    academicProgressIconName,
    academicProgressClassName,
  ] = useMemo(() => {
    switch (enrollment.academicProgress) {
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
  }, [enrollment]);

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
          <h3 className='mb-3.5 text-lg leading-none'>{schoolYearTitle}</h3>
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
          {academicProgress === SchoolYearAcademicProgress.Ongoing ||
          academicProgress == null ? (
            <div className='flex w-full items-center'>
              Your progress for the{' '}
              <span className='mx-2 font-medium'>{schoolYearTitle}</span> is
              still
              <p
                className={cx(
                  'mx-2 flex items-center gap-1 rounded-4px border-2 px-1.5 py-1 text-sm font-medium',
                  academicProgressClassName,
                )}
              >
                <BaseIcon
                  name={academicProgressIconName as IconName}
                  size={24}
                  weight='bold'
                />
                {academicProgressText}
              </p>
            </div>
          ) : (
            <div className='flex flex-col gap-5'>
              <div className='flex w-full items-center'>
                You have{' '}
                <p
                  className={cx(
                    'mx-2 flex items-center gap-1 rounded-4px border-2 px-1.5 py-1 text-sm font-medium',
                    academicProgressClassName,
                  )}
                >
                  <BaseIcon
                    name={academicProgressIconName as IconName}
                    size={24}
                    weight='bold'
                  />
                  {academicProgressText}
                </p>
                the <span className='ml-1 font-medium'>{schoolYearTitle}</span>
              </div>
              {academicProgressRemarks && (
                <div className='flex flex-col gap-2.5 rounded border border-accent/20 px-4 py-2.5'>
                  <span className='font-medium'>Remarks</span>
                  <span>{academicProgressRemarks}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </BaseSurface>
  );
});
