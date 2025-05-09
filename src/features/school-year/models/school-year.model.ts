import type { AuditTrail, RecordStatus } from '#/core/models/core.model';
import type { SchoolYearEnrollment } from './school-year-enrollment.model';

export type SchoolYear = Partial<AuditTrail> & {
  id: number;
  status: RecordStatus;
  slug: string;
  startDate: Date;
  endDate: Date;
  enrollmentStartDate: Date;
  enrollmentEndDate: Date;
  gracePeriodEndDate: Date;
  isActive: boolean;
  isDone: boolean;
  isEnrolled: boolean;
  canEnroll: boolean;
  totalTeacherCount: number;
  totalStudentCount: number;
  title?: string;
  description?: string;
};

export type SchoolYearSlice = {
  schoolYear?: SchoolYear | null;
  syEnrollment?: SchoolYearEnrollment | null;
  setSchoolYear: (schoolYear?: SchoolYear) => void;
  setSyEnrollment: (syEnrollment?: SchoolYearEnrollment) => void;
};
