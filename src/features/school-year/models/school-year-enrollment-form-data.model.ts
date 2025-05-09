import type { UserUpsertFormData } from '#/user/models/user-form-data.model';
import type { UserRole } from '#/user/models/user.model';

export type SchoolYearEnrollmentCreateFormData = {
  schoolYearId: number;
  role: UserRole;
  teacherId?: string;
};

export type SchoolYearEnrollmentNewCreateFormData = {
  user: UserUpsertFormData;
  enrollment: SchoolYearEnrollmentCreateFormData;
};
