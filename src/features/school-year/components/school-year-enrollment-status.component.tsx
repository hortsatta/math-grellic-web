import { memo, useMemo } from 'react';

import { BaseIcon } from '#/base/components/base-icon.component';
import { SchoolYearEnrollmentApprovalStatus } from '../models/school-year-enrollment.model';

import type { ComponentProps } from 'react';
import type { SchoolYear } from '../models/school-year.model';
import type { SchoolYearEnrollment } from '../models/school-year-enrollment.model';

type Props = ComponentProps<'div'> & {
  schoolYear: SchoolYear;
  syEnrollment: SchoolYearEnrollment | null;
  isDoneAndNotEnrolled?: boolean;
};

export const SchoolYearEnrollmentStatus = memo(function ({
  schoolYear,
  syEnrollment,
  isDoneAndNotEnrolled,
}: Props) {
  const enrollmentStatuIcon = useMemo(() => {
    if (isDoneAndNotEnrolled) {
      return 'x-circle';
    }

    if (
      syEnrollment?.approvalStatus ===
      SchoolYearEnrollmentApprovalStatus.Approved
    ) {
      return null;
    }

    return syEnrollment?.approvalStatus ===
      SchoolYearEnrollmentApprovalStatus.Pending
      ? 'clock-countdown'
      : 'x-circle';
  }, [syEnrollment, isDoneAndNotEnrolled]);

  const enrollmentStatusText = useMemo(() => {
    if (isDoneAndNotEnrolled) {
      return `${schoolYear?.title} has already been completed. You have not enrolled on this school year, please select another.`;
    }

    if (
      syEnrollment?.approvalStatus ===
      SchoolYearEnrollmentApprovalStatus.Pending
    ) {
      return `Your enrollment for ${schoolYear?.title} is now being reviewed — we'll notify you as soon as you're approved!`;
    } else if (
      syEnrollment?.approvalStatus ===
      SchoolYearEnrollmentApprovalStatus.Rejected
    ) {
      return `Your enrollment for ${schoolYear?.title} has been rejected due to ${syEnrollment.approvalRejectedReason}`;
    }
  }, [syEnrollment, schoolYear, isDoneAndNotEnrolled]);

  return (
    <div className='mx-auto flex w-full max-w-lg items-center gap-2.5 py-5'>
      {enrollmentStatuIcon && (
        <div className='flex-1'>
          <BaseIcon
            className={
              syEnrollment?.approvalStatus ===
                SchoolYearEnrollmentApprovalStatus.Rejected ||
              isDoneAndNotEnrolled
                ? 'text-red-500'
                : 'text-orange-500'
            }
            name={enrollmentStatuIcon}
            size={44}
            weight='bold'
          />
        </div>
      )}
      {enrollmentStatusText}
    </div>
  );
});
