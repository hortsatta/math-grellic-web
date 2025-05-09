import { Navigate } from 'react-router-dom';

import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { SchoolYearEnrollmentApprovalStatus } from '../models/school-year-enrollment.model';

import type { ReactNode } from 'react';

type Props = { children: ReactNode; redirectTo?: string };

export function SchoolYearEnrollmentProtectedRoute({
  children,
  redirectTo = '/',
}: Props) {
  const syEnrollment = useBoundStore((state) => state.syEnrollment);

  if (syEnrollment) {
    return syEnrollment?.approvalStatus ===
      SchoolYearEnrollmentApprovalStatus.Approved ? (
      children
    ) : (
      <Navigate to={redirectTo} replace />
    );
  } else if (syEnrollment === null) {
    return <Navigate to={redirectTo} />;
  } else {
    return <BasePageSpinner absolute />;
  }
}
