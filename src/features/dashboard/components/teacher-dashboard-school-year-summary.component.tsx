import { memo, useMemo } from 'react';

import dayjs from '#/config/dayjs.config';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';

import type {
  SchoolYear,
  TeacherStudentSchoolYearAcademicProgress,
} from '#/school-year/models/school-year.model';

type Props = {
  schoolYear: SchoolYear;
  studentsAcademicProgress: TeacherStudentSchoolYearAcademicProgress | null;
  loading?: boolean;
};

export const TeacherDashboardSchoolYearSummary = memo(function ({
  loading,
  schoolYear,
  studentsAcademicProgress,
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

  return loading || !studentsAcademicProgress ? (
    <div className='flex flex-col items-center justify-center gap-5'>
      <BaseSpinner />
    </div>
  ) : (
    <div className='flex w-full flex-col gap-2.5'>
      <h3 className='text-lg leading-none'>{title}</h3>
      <BaseSurface
        className='flex flex-1 animate-fastFadeIn flex-col gap-4'
        rounded='sm'
      >
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <span className='text-sm leading-none'>Academic Status</span>
            <div className='flex flex-col gap-1'>
              <BaseChip iconName='graduation-cap'>{isActiveText}</BaseChip>
              <BaseChip iconName={isDone ? 'check-square' : 'clock-countdown'}>
                {isDoneText}
              </BaseChip>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <span className='text-sm leading-none'>Academic Session</span>
            <BaseChip iconName='calendar-check'>{dateRange}</BaseChip>
          </div>
        </div>
      </BaseSurface>
    </div>
  );
});
