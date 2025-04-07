import { transformToStudentUserAccount } from '#/user/helpers/user-transform.helper';

import type { StudentPerformance } from '../models/performance.model';

export function transformToStudentPerformance({
  examCurrentCount,
  examTotalCount,
  examCompletedCount,
  examPassedCount,
  examFailedCount,
  examExpiredCount,
  overallExamCompletionPercent,
  overallExamRank,
  overallExamScore,
  totalActivityCount,
  activitiesCompletedCount,
  overallActivityCompletionPercent,
  overallActivityRank,
  overallActivityScore,
  lessonTotalCount,
  lessonCurrentCount,
  lessonCompletedCount,
  overallLessonCompletionPercent,
  ...moreProps
}: any): StudentPerformance {
  const student = transformToStudentUserAccount(moreProps);

  return {
    ...student,
    examCurrentCount,
    examTotalCount,
    examCompletedCount,
    examPassedCount,
    examFailedCount,
    examExpiredCount,
    overallExamCompletionPercent,
    overallExamRank,
    overallExamScore,
    totalActivityCount,
    activitiesCompletedCount,
    overallActivityCompletionPercent,
    overallActivityRank,
    overallActivityScore,
    lessonTotalCount,
    lessonCurrentCount,
    lessonCompletedCount,
    overallLessonCompletionPercent,
  };
}
