import type { UserRole } from '#/user/models/user.model';

export type SchoolYearEnrollmentCreateFormData = {
  schoolYearId: number;
  role: UserRole;
  teacherId?: string;
};
