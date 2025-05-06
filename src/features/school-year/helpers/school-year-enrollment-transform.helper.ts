import dayjs from '#/config/dayjs.config';
import { transformToBaseModel } from '#/base/helpers/base.helper';
import { transformToUser } from '#/user/helpers/user-transform.helper';
import { UserRole } from '#/user/models/user.model';

import type { SchoolYearEnrollment } from '../models/school-year-enrollment.model';

export function transformToSchoolYearEnrollment({
  id,
  createdAt,
  updatedAt,
  approvalStatus,
  approvalDate,
  approvalRejectedReason,
  schoolYear,
  user,
  teacherPublicId,
}: any): SchoolYearEnrollment {
  const transformedUser = user ? transformToUser(user) : undefined;

  return {
    approvalStatus,
    approvalDate: approvalDate ? dayjs(approvalDate).toDate() : null,
    approvalRejectedReason,
    schoolYear,
    user: transformedUser,
    teacherPublicId,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToSchoolYearEnrollmentCreateDto({
  schoolYearId,
  role,
  teacherId,
}: any) {
  return role === UserRole.Teacher
    ? { schoolYearId }
    : {
        schoolYearId,
        teacherId,
      };
}
