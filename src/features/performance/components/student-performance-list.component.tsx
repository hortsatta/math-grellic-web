import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import {
  StudentPerformanceSingleCard,
  StudentPerformanceSingleCardSkeleton,
} from './student-performance-single-card.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '../models/performance.model';
import { StudentPerformanceAcademicProgressSingleCard } from './student-performance-academic-progress-single-card.component';

const STUDENT_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.student.to}`;

type Props = ComponentProps<'div'> & {
  students: StudentPerformance[];
  performance: string;
  loading?: boolean;
  onPerformanceDetails?: (publicId: string) => void;
  onAcademicProgress?: (publicId: string) => void;
};

export const StudentPerformanceList = memo(function ({
  className,
  loading,
  students,
  performance,
  onPerformanceDetails,
  onAcademicProgress,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => !students?.length, [students]);

  const handlePerformanceDetails = useCallback(
    (publicId?: string) => () => {
      if (!publicId) {
        return;
      }

      onPerformanceDetails && onPerformanceDetails(publicId);
    },
    [onPerformanceDetails],
  );

  const handleAcademicProgress = useCallback(
    (publicId?: string) => () => {
      if (!publicId) {
        return;
      }

      onAcademicProgress && onAcademicProgress(publicId);
    },
    [onAcademicProgress],
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
      {loading ? (
        [...Array(4)].map((_, index) => (
          <StudentPerformanceSingleCardSkeleton key={index} />
        ))
      ) : isEmpty ? (
        <BaseDataEmptyMessage
          message='No students available'
          linkTo={STUDENT_LIST_PATH}
          linkLabel='View All Students'
        />
      ) : (
        students.map((student) =>
          performance !== 'academic-progress' ? (
            <StudentPerformanceSingleCard
              key={student.publicId?.toLowerCase()}
              student={student}
              performance={performance}
              onDetails={handlePerformanceDetails(student.publicId)}
              onAcademicProgress={handleAcademicProgress(student.publicId)}
              role='row'
            />
          ) : (
            <StudentPerformanceAcademicProgressSingleCard
              key={student.publicId?.toLowerCase()}
              student={student}
              onDetails={handlePerformanceDetails(student.publicId)}
              onAcademicProgress={handleAcademicProgress(student.publicId)}
              role='row'
            />
          ),
        )
      )}
    </div>
  );
});
