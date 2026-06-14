import { memo, useMemo } from 'react';
import cx from 'classix';

import { StudentPerformanceType } from '#/performance/models/performance.model';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { StudentSchoolYearAcademicProgressResult } from '#/school-year/components/student-school-year-academic-progress-result.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '#/performance/models/performance.model';
import type { SchoolYearEnrollment } from '#/school-year/models/school-year-enrollment.model';
import type { SchoolYear } from '#/school-year/models/school-year.model';

type Props = ComponentProps<'div'> & {
  schoolYear: SchoolYear | null;
  enrollment: SchoolYearEnrollment | null;
  studentPerformance?: StudentPerformance | null;
  loading?: boolean;
};

export const StudentDashboardOverallProgressChart = memo(function ({
  className,
  loading,
  schoolYear,
  enrollment,
  studentPerformance,
  ...moreProps
}: Props) {
  const performances = useMemo(() => {
    const {
      overallLessonCompletionPercent,
      overallExamCompletionPercent,
      overallActivityCompletionPercent,
    } = studentPerformance || {};

    return [
      {
        value: overallExamCompletionPercent || 0,
        performace: StudentPerformanceType.Exam,
        label: 'Exams',
      },
      {
        value: overallActivityCompletionPercent || 0,
        performace: StudentPerformanceType.Activity,
        label: 'Activities',
      },
      {
        value: overallLessonCompletionPercent || 0,
        performace: StudentPerformanceType.Lesson,
        label: 'Lessons',
      },
    ];
  }, [studentPerformance]);

  const schoolYearTitle = useMemo(() => schoolYear?.title, [schoolYear]);

  const [academicProgress, academicProgressRemarks] = useMemo(
    () => [enrollment?.academicProgress, enrollment?.academicProgressRemarks],
    [enrollment],
  );

  return (
    <div
      className={cx('flex w-full flex-col gap-2.5', className)}
      {...moreProps}
    >
      <h3 className='text-lg leading-none'>Overall Progress</h3>
      {!performance || loading ? (
        <div className='flex w-full items-center justify-center'>
          <BaseSpinner />
        </div>
      ) : (
        <BaseSurface
          className='flex animate-fastFadeIn flex-col gap-4'
          rounded='sm'
        >
          <div className='flex flex-col gap-4'>
            <span className='text-sm leading-none'>
              Track your academic journey
            </span>
            <div className='flex flex-wrap justify-center gap-2 -3xs:flex-nowrap'>
              {performances.map(({ value, performace, label }, index) => (
                <BaseProgressCircle
                  key={`progress-${index}`}
                  percent={value}
                  performance={performace}
                  label={label}
                  bottomLabelPosition
                />
              ))}
            </div>
          </div>
          <BaseDivider />
          <div className='flex flex-col gap-4'>
            <StudentSchoolYearAcademicProgressResult
              className='px-2.5'
              academicProgress={academicProgress}
              schoolYearTitle={schoolYearTitle || ''}
              isStudent
              compact
            />
            {academicProgressRemarks && (
              <div className='flex flex-col gap-2.5 rounded-lg border border-primary-border/20 bg-primary/5 p-2.5 px-4'>
                <span className='text-sm leading-none'>Remarks</span>
                <span>{academicProgressRemarks}</span>
              </div>
            )}
          </div>
        </BaseSurface>
      )}
    </div>
  );
});
