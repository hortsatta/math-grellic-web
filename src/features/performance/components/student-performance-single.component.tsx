import { memo, useMemo } from 'react';
import cx from 'classix';

import { teacherRoutes } from '#/app/routes/teacher-routes';
import { studentRoutes } from '#/app/routes/student-routes';
import { StudentExamPerformanceOverviewCard } from './student-exam-performance-overview-card.component';
import { StudentActivityPerformanceOverviewCard } from './student-activity-performance-overview-card.component';
import { StudentLessonPerformanceOverviewCard } from './student-lesson-performance-overview-card.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '../models/performance.model';

type Props = ComponentProps<'div'> & {
  student: StudentPerformance;
  isStudent?: boolean;
};

export const StudentPerformanceSingle = memo(function ({
  className,
  student,
  isStudent,
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
