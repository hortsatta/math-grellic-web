import type { RecordStatus } from '#/core/models/core.model';

export type SchoolYearUpsertFormData = {
  status: RecordStatus;
  startDate: Date;
  endDate: Date;
  enrollmentStartDate: Date;
  enrollmentEndDate: Date;
  title?: string;
  description?: string;
  gracePeriodEndDate?: Date;
  teacherIds?: number[];
};
