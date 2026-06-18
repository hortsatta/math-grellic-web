import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import {
  StudentUserSingleCard,
  StudentUserSingleCardSkeleton,
} from '../components/student-user-single-card.component';

import type { ComponentProps } from 'react';
import {
  UserApprovalStatus,
  type StudentUserAccount,
} from '../models/user.model';
import { SchoolYearEnrollmentApprovalStatus } from '#/school-year/models/school-year-enrollment.model';

type Props = ComponentProps<'div'> & {
  students: StudentUserAccount[];
  loading?: boolean;
  onStudentDetails?: (student: StudentUserAccount) => void;
  onStudentPerformanceDetails?: (publicId: string) => void;
  onStudentEdit?: (id: number) => void;
};

export const StudentUserList = memo(function ({
  className,
  students,
  loading,
  onStudentDetails,
  onStudentPerformanceDetails,
  onStudentEdit,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => !students?.length, [students]);

  const handleStudentDetails = useCallback(
    (student: StudentUserAccount) => () => {
      onStudentDetails && onStudentDetails(student);
    },
    [onStudentDetails],
  );

  const handlePerformanceDetails = useCallback(
    (student: StudentUserAccount) => () => {
      if (
        !!onStudentPerformanceDetails &&
        student.publicId &&
        student.approvalStatus === UserApprovalStatus.Approved &&
        student.enrollment?.approvalStatus ===
          SchoolYearEnrollmentApprovalStatus.Approved
      ) {
        return onStudentPerformanceDetails(student.publicId as string);
      }

      return undefined;
    },
    [onStudentPerformanceDetails],
  );

  const handleStudentEdit = useCallback(
    (id: number) => () => {
      onStudentEdit && onStudentEdit(id);
    },
    [onStudentEdit],
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
          <StudentUserSingleCardSkeleton key={index} />
        ))
      ) : isEmpty ? (
        <BaseDataEmptyMessage
          message='No learners available'
          linkLabel='Enroll'
          linkTo={teacherRoutes.student.createTo}
        />
      ) : (
        students.map((student, index) => (
          <StudentUserSingleCard
            key={`s-${student.publicId?.toLowerCase() || index}`}
            student={student}
            onDetails={handleStudentDetails(student)}
            onPerformanceDetails={handlePerformanceDetails(student)}
            onEdit={handleStudentEdit(student.id)}
            role='row'
          />
        ))
      )}
    </div>
  );
});
