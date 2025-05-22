import type { UserUpsertFormData } from '#/user/models/user-form-data.model';
import type { UserRole } from '#/user/models/user.model';
import type { SchoolYearAcademicProgress } from './school-year-enrollment.model';

export type SchoolYearEnrollmentCreateFormData = {
  schoolYearId: number;
  role: UserRole;
  teacherId?: string;
};

export type SchoolYearEnrollmentNewCreateFormData = {
  user: UserUpsertFormData;
  enrollment: SchoolYearEnrollmentCreateFormData;
};

export type SchoolYearEnrollmentAcademicProgressFormData = {
  academicProgress: SchoolYearAcademicProgress;
  schoolYearId: number;
  academicProgressRemarks?: string;
};
