import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { SchoolYearAcademicProgress } from '../models/school-year-enrollment.model';
import { StudentSchoolYearAcademicProgressResult } from './student-school-year-academic-progress-result.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '#/performance/models/performance.model';
import type { SchoolYear } from '../models/school-year.model';

type Props = ComponentProps<typeof BaseSurface> & {
  student: StudentPerformance;
  schoolYear: SchoolYear;
  isStudent?: boolean;
  onSetAcademicProgress?: () => void;
};

export const StudentSchoolYearAcademicProgressOverviewCard = memo(function ({
  className,
  student,
  schoolYear,
  isStudent,
  onSetAcademicProgress,
  ...moreProps
}: Props) {
  const [academicProgress, academicProgressRemarks] = useMemo(
    () => [
      student.enrollment?.academicProgress,
      student.enrollment?.academicProgress !==
      SchoolYearAcademicProgress.Ongoing
        ? student.enrollment?.academicProgressRemarks
        : null,
    ],
    [student],
  );

  const schoolYearTitle = useMemo(() => schoolYear.title, [schoolYear]);

  return (
    <BaseSurface
      className={cx('flex flex-col gap-4', className)}
      rounded='sm'
      {...moreProps}
    >
      <div className='flex items-center justify-between'>
        <h3 className='text-base '>Academic Progress</h3>
        {onSetAcademicProgress && (
          <BaseButton
            variant='link'
            size='xs'
            rightIconName='flow-arrow'
            onClick={onSetAcademicProgress}
          >
            Update Academic Progress
          </BaseButton>
        )}
      </div>
      <StudentSchoolYearAcademicProgressResult
        academicProgress={academicProgress}
        schoolYearTitle={schoolYearTitle || ''}
        isStudent={isStudent}
      />
      {academicProgressRemarks && (
        <>
          <BaseDivider />
          <div>
            <h3 className='text-base'>Progress Remarks</h3>
            <p className='my-2'>{academicProgressRemarks}</p>
          </div>
        </>
      )}
    </BaseSurface>
  );
});
