import { StateCreator } from 'zustand';

import type { SchoolYearEnrollment } from '../models/school-year-enrollment.model';
import type { SchoolYear, SchoolYearSlice } from '../models/school-year.model';

export const createSchoolYearSlice: StateCreator<
  SchoolYearSlice,
  [],
  [],
  SchoolYearSlice
> = (set) => ({
  schoolYear: undefined,
  syEnrollment: undefined,
  setSchoolYear: (schoolYear?: SchoolYear) =>
    set({
      schoolYear: schoolYear === undefined ? undefined : schoolYear,
    }),
  setSyEnrollment: (syEnrollment?: SchoolYearEnrollment) =>
    set({
      syEnrollment: syEnrollment === undefined ? undefined : syEnrollment,
    }),
});
