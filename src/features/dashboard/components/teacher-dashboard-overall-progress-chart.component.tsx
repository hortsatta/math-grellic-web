import { memo, useMemo } from 'react';
import cx from 'classix';

import { StudentPerformanceType } from '#/performance/models/performance.model';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { TeacherStudentSchoolYearAcademicProgressSummary } from '#/school-year/components/teacher-student-school-year-academic-progress-summary.component';

import type { ComponentProps } from 'react';
import type { TeacherClassPerformance } from '#/performance/models/performance.model';
import type { TeacherStudentSchoolYearAcademicProgress } from '#/school-year/models/school-year.model';

type Props = ComponentProps<'div'> & {
  classPerformance: TeacherClassPerformance | null;
  studentsAcademicProgress: TeacherStudentSchoolYearAcademicProgress | null;
  loading?: boolean;
};

export const TeacherDashboardOverallProgressChart = memo(function ({
  className,
  loading,
  classPerformance,
  studentsAcademicProgress,
  ...moreProps
}: Props) {
  const performances = useMemo(() => {
    const {
      overallLessonCompletionPercent,
      overallExamCompletionPercent,
      overallActivityCompletionPercent,
    } = classPerformance || {};

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
  }, [classPerformance]);

  return (
    <div
      className={cx('flex w-full flex-col gap-2.5', className)}
      {...moreProps}
    >
      <h3 className='text-lg leading-none'>Overall Class Progress</h3>
      {!performance || loading ? (
        <div className='flex min-h-[200px] w-full items-center justify-center'>
          <BaseSpinner />
        </div>
      ) : (
        <BaseSurface
          className='flex animate-fastFadeIn flex-col gap-4'
          rounded='sm'
        >
          <div className='flex flex-col gap-4'>
            <span className='text-sm leading-none'>
              Track your class overall completion
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
          {studentsAcademicProgress && (
            <>
              <BaseDivider />
              <div className='flex flex-col gap-4'>
                <span className='text-sm leading-none'>
                  Learners' academic progress
                </span>
                <TeacherStudentSchoolYearAcademicProgressSummary
                  className='flex-1 items-center justify-center'
                  studentsAcademicProgress={studentsAcademicProgress}
                />
              </div>
            </>
          )}
        </BaseSurface>
      )}
    </div>
  );
});
