import type { AuditTrail } from '#/core/models/core.model';
import type { StudentUserAccount } from '#/user/models/user.model';
import type { Exam } from './exam.model';

export enum ExamScheduleStatus {
  Upcoming = 'upcoming',
  Ongoing = 'ongoing',
  Past = 'past',
}

export type ExamSchedule = Partial<AuditTrail> & {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  exam: Exam;
  students: StudentUserAccount[];
  studentCount?: string;
};
