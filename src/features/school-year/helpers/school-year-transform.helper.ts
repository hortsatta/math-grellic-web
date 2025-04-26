import dayjs from '#/config/dayjs.config';
import { transformToBaseModel } from '#/base/helpers/base.helper';

import type { SchoolYear } from '../models/school-year.model';
import type { SchoolYearUpsertFormData } from '../models/school-year-form-data.model';

export function transformToSchoolYear({
  id,
  createdAt,
  updatedAt,
  status,
  slug,
  title,
  description,
  startDate,
  endDate,
  enrollmentStartDate,
  enrollmentEndDate,
  gracePeriodEndDate,
  totalTeacherCount,
  totalStudentCount,
  isActive,
  isDone,
}: any): SchoolYear {
  return {
    status,
    slug,
    title,
    description,
    startDate: dayjs(startDate).toDate(),
    endDate: dayjs(endDate).toDate(),
    enrollmentStartDate: dayjs(enrollmentStartDate).toDate(),
    enrollmentEndDate: dayjs(enrollmentEndDate).toDate(),
    gracePeriodEndDate,
    totalTeacherCount,
    totalStudentCount,
    isActive,
    isDone,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToSchoolYearFormData({
  status,
  title,
  description,
  startDate,
  endDate,
  enrollmentStartDate,
  enrollmentEndDate,
  gracePeriodEndDate,
}: any): SchoolYearUpsertFormData {
  return {
    status,
    startDate: dayjs(startDate).toDate(),
    endDate: dayjs(endDate).toDate(),
    enrollmentStartDate: dayjs(enrollmentStartDate).toDate(),
    enrollmentEndDate: dayjs(enrollmentEndDate).toDate(),
    gracePeriodEndDate: dayjs(gracePeriodEndDate).toDate(),
    title,
    description: description || undefined,
  };
}

export function transformToSchoolYearUpsertDto({
  status,
  startDate,
  endDate,
  enrollmentStartDate,
  enrollmentEndDate,
  isActive,
  title,
  description,
  gracePeriodEndDate,
  teacherIds,
}: any) {
  const transformedStartDate = dayjs(startDate).startOf('day').toDate();
  const transformedEndDate = dayjs(endDate).endOf('day').toDate();
  const transformedEnrollmentStartDate = dayjs(enrollmentStartDate)
    .startOf('day')
    .toDate();
  const transformedEnrollmentEndDate = dayjs(enrollmentEndDate)
    .endOf('day')
    .toDate();
  const transformedTeacherIds = teacherIds == null ? null : teacherIds;

  return {
    status,
    startDate: transformedStartDate,
    endDate: transformedEndDate,
    enrollmentStartDate: transformedEnrollmentStartDate,
    enrollmentEndDate: transformedEnrollmentEndDate,
    isActive,
    title,
    description,
    gracePeriodEndDate,
    teacherIds: transformedTeacherIds,
  };
}
