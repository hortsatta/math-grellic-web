import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseSpinner } from '#/base/components/base-spinner.component';

import type { ComponentProps } from 'react';
import type { SchoolYear } from '../models/school-year.model';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseChip } from '#/base/components/base-chip.component';

type Props = ComponentProps<'div'> & {
  schoolYear?: SchoolYear;
  loading?: boolean;
  onDetails?: (slug: string) => void;
};

const VALUE_CLASSNAME = 'text-xl font-bold text-primary';

export const SchoolYearOverviewBoard = memo(function ({
  loading,
  className,
  schoolYear,
  onDetails,
  ...moreProps
}: Props) {
  const [slug, title, dateRange, totalTeacherCount, totalStudentCount] =
    useMemo(
      () =>
        schoolYear
          ? [
              schoolYear.slug,
              schoolYear.title,
              `${dayjs(schoolYear.startDate).format('MMM DD, YYYY')} — ${dayjs(
                schoolYear.endDate,
              ).format('MMM DD, YYYY')}`,
              schoolYear.totalTeacherCount <= 0
                ? 'No teachers enrolled yet'
                : schoolYear.totalTeacherCount,
              schoolYear.totalStudentCount <= 0
                ? 'No students enrolled yet'
                : schoolYear.totalStudentCount,
            ]
          : [],
      [schoolYear],
    );

  const handleDetails = useCallback(
    () => slug && onDetails && onDetails(slug),
    [slug, onDetails],
  );

  return (
    <div
      className={cx('flex w-full flex-col gap-2.5', className)}
      {...moreProps}
    >
      <h2 className='text-lg'>Current School Year</h2>
      {loading ? (
        <div className='flex w-full items-center justify-center'>
          <BaseSpinner />
        </div>
      ) : (
        <BaseSurface
          rounded='sm'
          className='flex animate-fastFadeIn justify-center !p-0 font-medium'
          onClick={handleDetails}
        >
          <div className='flex w-full flex-col gap-2.5 rounded-lg p-2.5 transition-all hover:cursor-pointer hover:!border-primary-focus hover:shadow-md hover:ring-1 hover:ring-primary-focus'>
            <span className={VALUE_CLASSNAME}>{title}</span>
            <div>
              <BaseChip iconName='calendar-check'>{dateRange}</BaseChip>
              <BaseChip
                className={cx(
                  typeof totalTeacherCount === 'string' && 'normal-case',
                )}
                iconName='chalkboard-teacher'
              >
                {totalTeacherCount}
              </BaseChip>
              <BaseChip
                className={cx(
                  typeof totalTeacherCount === 'string' && 'normal-case',
                )}
                iconName='student'
              >
                {totalStudentCount}
              </BaseChip>
            </div>
          </div>
        </BaseSurface>
      )}
    </div>
  );
});
