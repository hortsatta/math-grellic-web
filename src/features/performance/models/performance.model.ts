import type { StudentUserAccount } from '#/user/models/user.model';

export enum StudentPerformanceType {
  Lesson = 'lesson',
  Exam = 'exam',
  Activity = 'activity',
}

export type StudentPerformance = StudentUserAccount & {
  examCurrentCount: number;
  examTotalCount: number;
  examCompletedCount: number;
  examPassedCount: number;
  examFailedCount: number;
  examExpiredCount: number;
  overallExamCompletionPercent: number;
  overallExamRank: number;
  overallExamScore: number | null;
  totalActivityCount: number;
  activitiesCompletedCount: number;
  overallActivityCompletionPercent: number;
  overallActivityRank: number;
  overallActivityScore: number | null;
  lessonTotalCount: number;
  lessonCurrentCount: number;
  lessonCompletedCount: number;
  overallLessonCompletionPercent: number;
};

export type TeacherClassPerformance = {
  overallLessonCompletionPercent: number;
  overallExamCompletionPercent: number;
  overallActivityCompletionPercent: number;
};

export type TeacherLessonPerformance = {
  lessonTotalCount: number;
  totalLessonDurationSeconds: number;
  overallLessonCompletionPercent: number;
};

export type TeacherExamPerformance = {
  totalExamCount: number;
  totalExamPoints: number;
  overallExamCompletionPercent: number;
};

export type TeacherActivityPerformance = {
  totalActivityCount: number;
  overallActivityCompletionPercent: number;
};
