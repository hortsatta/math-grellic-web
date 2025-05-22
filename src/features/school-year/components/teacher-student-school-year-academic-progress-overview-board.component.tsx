import { memo } from 'react';
import cx from 'classix';

import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { TeacherStudentSchoolYearAcademicProgressSummary } from './teacher-student-school-year-academic-progress-summary.component';

import type { ComponentProps } from 'react';
import type { TeacherStudentSchoolYearAcademicProgress } from '../models/school-year.model';

type Props = ComponentProps<'div'> & {
  studentsAcademicProgress: TeacherStudentSchoolYearAcademicProgress | null;
  loading?: boolean;
};

export const TeacherStudentSchoolYearAcademicProgressOverviewBoard = memo(
  function ({
    className,
    loading,
    studentsAcademicProgress,
    ...moreProps
  }: Props) {
    return (
      <div
        className={cx('flex w-full flex-col gap-2.5', className)}
        {...moreProps}
      >
        <h2 className='text-lg'>Students' Academic Progress</h2>
        {loading || !studentsAcademicProgress ? (
          <div className='flex w-full items-center justify-center'>
            <BaseSpinner />
          </div>
        ) : (
          <BaseSurface
            rounded='sm'
            className='flex animate-fastFadeIn flex-col items-center !py-4 -3xs:flex-row'
          >
            <TeacherStudentSchoolYearAcademicProgressSummary
              studentsAcademicProgress={studentsAcademicProgress}
            />
          </BaseSurface>
        )}
      </div>
    );
  },
);
