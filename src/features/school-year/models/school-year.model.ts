import type { AuditTrail, RecordStatus } from '#/core/models/core.model';

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
  totalTeacherCount: number;
  totalStudentCount: number;
  title?: string;
  description?: string;
};
