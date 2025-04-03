import dayjs from '#/config/dayjs.config';
import { transformToBaseModel } from '#/base/helpers/base.helper';
import { transformToStudentUserAccount } from '#/user/helpers/user-transform.helper';
import { transformToExam } from './exam-transform.helper';

import type { StudentUserAccount } from '#/user/models/user.model';
import type { ExamSchedule } from '../models/exam-schedule.model';
import type { ExamScheduleUpsertFormData } from '../models/exam-schedule-form-data.model';

export function transformToExamSchedule({
  id,
  createdAt,
  updatedAt,
  title,
  startDate,
  endDate,
  students,
  studentCount,
  isRecent,
  isUpcoming,
  isOngoing,
  exam,
}: any): Partial<ExamSchedule> {
  const transformedStudents = !students?.length
    ? null
    : students.map((student: any) => transformToStudentUserAccount(student));

  const transformedExam = exam ? transformToExam(exam) : undefined;

  return {
    title,
    startDate: dayjs(startDate).toDate(),
    endDate: dayjs(endDate).toDate(),
    students: transformedStudents,
    exam: transformedExam,
    studentCount,
    isRecent: isRecent ?? null,
    isUpcoming: isUpcoming ?? null,
    isOngoing: isOngoing ?? null,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToExamScheduleFormData({
  exam,
  title,
  startDate,
  endDate,
  students,
}: any): ExamScheduleUpsertFormData {
  const transformedStudentIds = !students?.length
    ? null
    : students.map((student: StudentUserAccount) => student.id);

  return {
    examId: exam?.id || 0,
    studentIds: transformedStudentIds,
    title,
    startDate: dayjs(startDate).toDate(),
    startTime: dayjs(startDate).format('hh:mm A'),
    endDate: dayjs(endDate).toDate(),
    endTime: dayjs(endDate).format('hh:mm A'),
  };
}

export function transformToExamScheduleCreateDto({
  examId,
  title,
  startDate,
  startTime,
  endDate,
  endTime,
  studentIds,
}: any) {
  const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
  const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

  const transformedStartDate = dayjs(
    `${formattedStartDate} ${startTime}`,
  ).toDate();
  const transformedEndDate = dayjs(`${formattedEndDate} ${endTime}`).toDate();
  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  return {
    examId,
    title,
    startDate: transformedStartDate,
    endDate: transformedEndDate,
    studentIds: transformedStudentsIds,
  };
}

export function transformToExamScheduleUpdateDto({
  title,
  startDate,
  endDate,
  startTime,
  endTime,
  studentIds,
}: any) {
  const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
  const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

  const transformedStartDate = dayjs(
    `${formattedStartDate} ${startTime}`,
  ).toDate();
  const transformedEndDate = dayjs(`${formattedEndDate} ${endTime}`).toDate();
  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  return {
    title,
    startDate: transformedStartDate,
    endDate: transformedEndDate,
    studentIds: transformedStudentsIds,
  };
}
