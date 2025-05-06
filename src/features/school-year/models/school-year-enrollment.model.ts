import type { AuditTrail } from '#/core/models/core.model';
import type { User } from '#/user/models/user.model';
import type { SchoolYear } from './school-year.model';

export enum SchoolYearEnrollmentApprovalStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export type SchoolYearEnrollment = Partial<AuditTrail> & {
  id: number;
  approvalStatus: SchoolYearEnrollmentApprovalStatus;
  schoolYear: SchoolYear;
  approvalDate: Date | null;
  user?: User;
  approvalRejectedReason?: string;
  teacherPublicId?: string;
};
