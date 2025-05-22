import { memo, useMemo } from 'react';
import cx from 'classix';

import { teacherRoutes } from '#/app/routes/teacher-routes';
import { studentRoutes } from '#/app/routes/student-routes';
import { StudentSchoolYearAcademicProgressOverviewCard } from '#/school-year/components/student-school-year-academic-progress-overview-card.component';
import { StudentExamPerformanceOverviewCard } from './student-exam-performance-overview-card.component';
import { StudentActivityPerformanceOverviewCard } from './student-activity-performance-overview-card.component';
import { StudentLessonPerformanceOverviewCard } from './student-lesson-performance-overview-card.component';

import type { ComponentProps } from 'react';
import type { SchoolYear } from '#/school-year/models/school-year.model';
import type { SchoolYearEnrollment } from '#/school-year/models/school-year-enrollment.model';
import type { StudentPerformance } from '../models/performance.model';

type Props = ComponentProps<'div'> & {
  student: StudentPerformance;
  enrollment?: SchoolYearEnrollment;
  schoolYear?: SchoolYear;
  isStudent?: boolean;
  onSetAcademicProgress?: () => void;
};

export const StudentPerformanceSingle = memo(function ({
  className,
  student,
  schoolYear,
  isStudent,
  onSetAcademicProgress,
  ...moreProps
}: Props) {
  const [examDetailsTo, activityDetailsTo, lessonDetailsTo] = useMemo(
    () =>
      isStudent
        ? [
            studentRoutes.performance.examTo,
            studentRoutes.performance.activityTo,
            studentRoutes.performance.lessonTo,
          ]
        : [
            teacherRoutes.performance.examTo,
            teacherRoutes.performance.activityTo,
            teacherRoutes.performance.lessonTo,
          ],
    [isStudent],
  );

  return (
    <div
      className={cx('flex w-full flex-col gap-y-2.5', className)}
      {...moreProps}
    >
      {schoolYear && (
        <StudentSchoolYearAcademicProgressOverviewCard
          student={student}
          schoolYear={schoolYear}
          isStudent={isStudent}
          onSetAcademicProgress={onSetAcademicProgress}
        />
      )}
      <StudentExamPerformanceOverviewCard
        student={student}
        detailsTo={examDetailsTo}
      />
      <StudentActivityPerformanceOverviewCard
        className='min-h-[280px]'
        student={student}
        detailsTo={activityDetailsTo}
      />
      <StudentLessonPerformanceOverviewCard
        className='min-h-[280px]'
        student={student}
        detailsTo={lessonDetailsTo}
      />
    </div>
  );
});
