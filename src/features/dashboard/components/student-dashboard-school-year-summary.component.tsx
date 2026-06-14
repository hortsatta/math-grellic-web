import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { SchoolYear } from '#/school-year/models/school-year.model';
import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  schoolYear: SchoolYear;
};

export const StudentDashboardSchoolYearSummary = memo(function ({
  schoolYear,
  className,
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
    <div
      className={cx('flex w-full flex-col gap-2.5', className)}
      {...moreProps}
    >
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
                iconName={schoolYearIsDone ? 'check-square' : 'clock-countdown'}
              >
                {schoolYearIsDoneText}
              </BaseChip>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <span className='text-sm leading-none'>Academic Session</span>
            <BaseChip iconName='calendar-check'>{schoolYearDateRange}</BaseChip>
          </div>
        </div>
      </BaseSurface>
    </div>
  );
});
