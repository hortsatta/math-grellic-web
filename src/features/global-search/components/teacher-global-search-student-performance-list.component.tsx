import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classix';

import { StudentPerformanceType } from '#/performance/models/performance.model';
import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseLink } from '#/base/components/base-link.component';
import { StudentPerformanceSingleCard } from '#/performance/components/student-performance-single-card.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '#/performance/models/performance.model';
import { teacherPerformanceBaseRoute } from '#/performance/route/teacher-performance-handle.route';

type Props = ComponentProps<'div'> & {
  studentPerformances: StudentPerformance[];
};

const PERFORMANCE_PATH = `${teacherPerformanceBaseRoute}/${teacherRoutes.performance.studentTo}`;

export const TeacherGlobalSearchStudentPerformanceList = memo(function ({
  className,
  studentPerformances,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const handlePerformanceDetails = useCallback(
    (publicId?: string) => () => {
      publicId && navigate(`${PERFORMANCE_PATH}/${publicId.toLowerCase()}`);
    },
    [navigate],
  );

  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      role='table'
      {...moreProps}
    >
      <div className='flex items-center justify-between'>
        <h3 className='text-lg leading-none'>Learners</h3>
        <BaseLink
          to={PERFORMANCE_PATH}
          rightIconName='arrow-circle-right'
          size='xs'
        >
          View Performances
        </BaseLink>
      </div>
      <div className='flex flex-col gap-2.5'>
        {studentPerformances.map((student) => (
          <StudentPerformanceSingleCard
            key={student.publicId?.toLowerCase()}
            student={student}
            performance={StudentPerformanceType.Exam}
            onDetails={handlePerformanceDetails(student.publicId)}
            role='row'
          />
        ))}
      </div>
    </div>
  );
});
