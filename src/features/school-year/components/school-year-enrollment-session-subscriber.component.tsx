import { memo, useEffect } from 'react';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useSchoolYearCurrent } from '../hooks/use-school-year-current.hook';
import { useSchoolYearEnrollment } from '../hooks/use-school-year-enrollment.hook';

export const SchoolYearEnrollmentSessionSubscriber = memo(function () {
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const setSchoolYear = useBoundStore((state) => state.setSchoolYear);
  const { schoolYear: currentSchoolYear } = useSchoolYearCurrent();
  useSchoolYearEnrollment();

  useEffect(() => {
    if (schoolYear != null) {
      return;
    }

    setSchoolYear(currentSchoolYear ?? undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSchoolYear]);

  return null;
});
