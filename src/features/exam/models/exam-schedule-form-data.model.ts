export type ExamScheduleUpsertFormData = {
  examId: number;
  title: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  studentIds: number[];
};
