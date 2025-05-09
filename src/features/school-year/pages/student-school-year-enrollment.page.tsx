import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { studentBaseRoute } from '#/app/routes/student-routes';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { SchoolYearEnrollmentApprovalStatus } from '../models/school-year-enrollment.model';
import { useSchoolYearEnrollmentCreate } from '../hooks/use-school-year-enrollment-create.hook';
import { SchoolYearEnrollmentCreateForm } from '../components/school-year-enrollment-create-form.component';
import { SchoolYearEnrollmentStatus } from '../components/school-year-enrollment-status.component';

import type { SchoolYear } from '../models/school-year.model';

const WRAPPER_CLASSNAME =
  'flex h-full w-full flex-1 animate-fadeIn flex-col items-center justify-center pb-8';

function StudentSchoolYearEnrollmentPage() {
  const navigate = useNavigate();

  const { isDone, setIsDone, createEnrollment } =
    useSchoolYearEnrollmentCreate();

  const user = useBoundStore((state) => state.user);
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const syEnrollment = useBoundStore((state) => state.syEnrollment);

  const formData = useMemo(() => {
    if (!schoolYear || !user) {
      return null;
    }

    return {
      schoolYearId: schoolYear.id,
      role: user.role,
    };
  }, [schoolYear, user]);

  useEffect(() => {
    if (
      !user ||
      syEnrollment?.approvalStatus !==
        SchoolYearEnrollmentApprovalStatus.Approved
    ) {
      return;
    }

    navigate(`/${studentBaseRoute}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, syEnrollment]);

  if (!formData || syEnrollment === undefined) {
    return <BasePageSpinner />;
  }

  if (
    (schoolYear?.isDone && !syEnrollment) ||
    (schoolYear?.isDone &&
      syEnrollment?.approvalStatus !==
        SchoolYearEnrollmentApprovalStatus.Approved)
  ) {
    return (
      <div className={WRAPPER_CLASSNAME}>
        <SchoolYearEnrollmentStatus
          schoolYear={schoolYear as SchoolYear}
          syEnrollment={syEnrollment}
          isDoneAndNotEnrolled
        />
      </div>
    );
  } else if (schoolYear?.isActive && !schoolYear?.isDone && syEnrollment) {
    return (
      <div className={WRAPPER_CLASSNAME}>
        <SchoolYearEnrollmentStatus
          schoolYear={schoolYear as SchoolYear}
          syEnrollment={syEnrollment}
        />
      </div>
    );
  } else {
    return (
      <div className={WRAPPER_CLASSNAME}>
        <SchoolYearEnrollmentCreateForm
          className='mx-auto max-w-compact py-5'
          schoolYear={schoolYear as SchoolYear}
          formData={formData}
          isDone={isDone}
          onDone={setIsDone}
          onSubmit={createEnrollment}
        />
      </div>
    );
  }
}

export default StudentSchoolYearEnrollmentPage;
