import { memo, useEffect } from 'react';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useSchoolYearCurrent } from '../hooks/use-school-year-current.hook';
import { useSchoolYearEnrollment } from '../hooks/use-school-year-enrollment.hook';

export const SchoolYearEnrollmentSessionSubscriber = memo(function () {
  const userPublicId = useBoundStore((state) => state.user?.publicId);
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const { setCurrentSchoolYear } = useSchoolYearCurrent();
  useSchoolYearEnrollment();

  useEffect(() => {
    if (schoolYear != null) {
      return;
    }

    setCurrentSchoolYear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPublicId]);

  return null;
});
