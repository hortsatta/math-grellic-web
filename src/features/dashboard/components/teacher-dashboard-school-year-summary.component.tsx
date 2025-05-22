import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { TeacherStudentSchoolYearAcademicProgressSummary } from '#/school-year/components/teacher-student-school-year-academic-progress-summary.component';

import type { ComponentProps } from 'react';
import type {
  SchoolYear,
  TeacherStudentSchoolYearAcademicProgress,
} from '#/school-year/models/school-year.model';

type Props = ComponentProps<typeof BaseSurface> & {
  schoolYear: SchoolYear;
  studentsAcademicProgress: TeacherStudentSchoolYearAcademicProgress | null;
  loading?: boolean;
};

export const TeacherDashboardSchoolYearSummary = memo(function ({
  className,
  loading,
  schoolYear,
  studentsAcademicProgress,
  ...moreProps
}: Props) {
  const [title, dateRange, isActive, isDone] = useMemo(
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

  const [isActiveText, isDoneText] = useMemo(() => {
    if (isActive) {
      return ['Current School Year', isDone ? 'Completed' : 'Ongoing'];
    }

    return [
      isDone ? 'Previous School Year' : 'Upcoming School Year',
      isDone ? 'Completed' : 'Not Done',
    ];
  }, [isActive, isDone]);

  return (
    <BaseSurface
      className={cx(
        'flex min-h-[224px] flex-col gap-4 -2lg:flex-row xl:flex-col 2xl:flex-row',
        loading ? 'items-center justify-center' : 'items-stretch',
        className,
      )}
      {...moreProps}
    >
      {loading || !studentsAcademicProgress ? (
        <BaseSpinner />
      ) : (
        <>
          <div className='flex flex-1 animate-fastFadeIn flex-col gap-4'>
            <div className='flex h-full flex-col'>
              <h3 className='mb-3.5 text-lg leading-none'>{title}</h3>
              <div className='flex flex-col gap-1 text-sm'>
                <BaseChip iconName='graduation-cap'>{isActiveText}</BaseChip>
                <BaseChip
                  iconName={isDone ? 'check-square' : 'clock-countdown'}
                >
                  {isDoneText}
                </BaseChip>
                <BaseDivider className='my-2 hidden max-w-[250px] -2lg:block xl:hidden 2xl:block' />
                <BaseChip iconName='calendar-check'>{dateRange}</BaseChip>
              </div>
            </div>
          </div>
          <div className='hidden -2lg:block xl:hidden 2xl:block'>
            <BaseDivider vertical />
          </div>
          <BaseDivider className='mb-1.5 mt-1 block -2lg:hidden xl:block 2xl:hidden' />
          <div className='flex-1 animate-fastFadeIn'>
            <div className='flex h-full flex-col'>
              <h3 className='mb-3.5 text-lg leading-none'>
                Students' Academic Progress
              </h3>
              <TeacherStudentSchoolYearAcademicProgressSummary
                className='flex-1 items-center justify-center'
                studentsAcademicProgress={studentsAcademicProgress}
              />
            </div>
          </div>
        </>
      )}
    </BaseSurface>
  );
});
