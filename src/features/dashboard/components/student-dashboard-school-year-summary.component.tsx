import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { studentPerformanceBaseRoute } from '#/performance/route/student-performance-handle.route';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';

import type { ComponentProps } from 'react';
import type { SchoolYear } from '#/school-year/models/school-year.model';

type Props = ComponentProps<'div'> & {
  schoolYear: SchoolYear | null;
  loading?: boolean;
};

export const StudentDashboardSchoolYearSummary = memo(function ({
  className,
  loading,
  schoolYear,
  ...moreProps
}: Props) {
  const [
    schoolYearTitle,
    schoolYearDateRange,
    schoolYearIsActive,
    schoolYearIsDone,
  ] = useMemo(
    () => [
      schoolYear?.title,
      `${dayjs(schoolYear?.startDate).format('MMM DD, YYYY')} — ${dayjs(
        schoolYear?.endDate,
      ).format('MMM DD, YYYY')}`,
      schoolYear?.isActive,
      schoolYear?.isDone,
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

  return loading || !schoolYear ? (
    <div className='flex min-h-[170px] flex-col items-center justify-center gap-5'>
      <BaseSpinner />
    </div>
  ) : (
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
      <div className='flex flex-1 items-center justify-center'>
        <BaseLink
          to={studentPerformanceBaseRoute}
          rightIconName='arrow-circle-right'
          size='xs'
        >
          View Performance
        </BaseLink>
      </div>
    </div>
  );
});
