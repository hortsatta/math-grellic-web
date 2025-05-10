import dayjs from '#/config/dayjs.config';
import {
  transformToLessonCompletion,
  transformToLessonSchedule,
} from '#/lesson/helpers/lesson-transform.helper';
import { transformToExamCompletion } from '#/exam/helpers/exam-transform.helper';
import { transformToExamSchedule } from '#/exam/helpers/exam-schedule-transform.helper';
import { transformToActivityCategoryCompletion } from '#/activity/helpers/activity-transform.helper';
import { UserRole } from '../models/user.model';

import type {
  AdminUserAccount,
  StudentUserAccount,
  TeacherUserAccount,
  User,
} from '../models/user.model';
import type {
  AdminUserUpdateFormData,
  StudentUserUpdateFormData,
  TeacherUserUpdateFormData,
  UserUpsertFormData,
} from '../models/user-form-data.model';
import { transformToSchoolYearEnrollment } from '#/school-year/helpers/school-year-enrollment-transform.helper';

export function transformToUser({
  id,
  createdAt,
  updatedAt,
  publicId,
  role,
  email,
  profileImageUrl,
  approvalStatus,
  approvalDate,
  userAccount: userAccountData,
}: any): User {
  let userAccount = undefined;

  switch (role) {
    case UserRole.Student:
      userAccount = transformToStudentUserAccount(userAccountData);
      break;
    case UserRole.Teacher:
      userAccount = transformToTeacherUserAccount(userAccountData);
      break;
    case UserRole.Admin:
      userAccount = transformToAdminUserAccount(userAccountData);
      break;
  }

  return {
    id,
    createdAt: dayjs(createdAt).toDate(),
    updatedAt: dayjs(updatedAt).toDate(),
    publicId,
    role,
    email,
    profileImageUrl,
    approvalStatus,
    approvalDate: approvalDate ? dayjs(approvalDate).toDate() : null,
    userAccount,
  };
}

export function transformToAdminUserAccount({
  id,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  messengerLink,
  emails,
  user,
}: any): AdminUserAccount {
  const { email, publicId, approvalStatus } = user || {};

  return {
    id,
    email,
    publicId,
    approvalStatus,
    firstName,
    lastName,
    middleName,
    birthDate: dayjs(birthDate).toDate(),
    phoneNumber,
    gender,
    aboutMe,
    messengerLink,
    emails,
  } as AdminUserAccount;
}

export function transformToTeacherUserAccount({
  id,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  educationalBackground,
  teachingExperience,
  teachingCertifications,
  website,
  socialMediaLinks,
  messengerLink,
  emails,
  user,
}: any): TeacherUserAccount {
  const { email, publicId, approvalStatus, enrollment } = user || {};

  const transformedEnrollment = enrollment
    ? transformToSchoolYearEnrollment(enrollment)
    : undefined;

  return {
    id,
    email,
    publicId,
    approvalStatus,
    firstName,
    lastName,
    middleName,
    birthDate: dayjs(birthDate).toDate(),
    phoneNumber,
    gender,
    aboutMe,
    educationalBackground,
    teachingExperience,
    teachingCertifications,
    website,
    socialMediaLinks,
    messengerLink,
    emails,
    enrollment: transformedEnrollment,
    //  students,
  } as TeacherUserAccount;
}

export function transformToStudentUserAccount({
  id,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  messengerLink,
  user,
  lessonSchedules,
  examSchedules,
  lessonCompletions,
  examCompletions,
  activityCategoryCompletions,
}: any): StudentUserAccount {
  const { email, publicId, approvalStatus, enrollment } = user || {};

  const transformedLessonSchedules =
    lessonSchedules && lessonSchedules.length
      ? lessonSchedules.map((schedule: any) =>
          transformToLessonSchedule(schedule),
        )
      : undefined;

  const transformedExamSchedules =
    examSchedules && examSchedules.length
      ? examSchedules.map((schedule: any) => transformToExamSchedule(schedule))
      : undefined;

  const transformedLessonCompletions =
    lessonCompletions && lessonCompletions.length
      ? lessonCompletions.map((completion: any) =>
          transformToLessonCompletion(completion),
        )
      : undefined;

  const transformedExamCompletions =
    examCompletions && examCompletions.length
      ? examCompletions.map((completion: any) =>
          transformToExamCompletion(completion),
        )
      : undefined;

  const transformedActivityCategoryCompletions =
    activityCategoryCompletions && activityCategoryCompletions.length
      ? activityCategoryCompletions.map((completion: any) =>
          transformToActivityCategoryCompletion(completion),
        )
      : undefined;

  const transformedEnrollment = enrollment
    ? transformToSchoolYearEnrollment(enrollment)
    : undefined;

  return {
    id,
    email,
    publicId,
    approvalStatus,
    firstName,
    lastName,
    middleName,
    birthDate: dayjs(birthDate).toDate(),
    phoneNumber,
    gender,
    aboutMe,
    messengerLink,
    lessonSchedules: transformedLessonSchedules,
    examSchedules: transformedExamSchedules,
    lessonCompletions: transformedLessonCompletions,
    examCompletions: transformedExamCompletions,
    activityCategoryCompletions: transformedActivityCategoryCompletions,
    enrollment: transformedEnrollment,
  } as StudentUserAccount;
}

export function transformToAdminUserUpsertDtoBySuperAdmin(
  {
    email,
    profileImageUrl,
    firstName,
    lastName,
    middleName,
    birthDate,
    phoneNumber,
    gender,
  }: any,
  isEdit?: boolean,
) {
  const dto = {
    profileImageUrl,
    firstName,
    lastName,
    middleName,
    birthDate,
    phoneNumber: phoneNumber.replace(/\D/g, ''),
    gender,
  };

  return isEdit
    ? dto
    : {
        ...dto,
        email,
      };
}

export function transformToAdminUserUpdateDto({
  profileImageUrl,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  messengerLink,
  emails,
}: any) {
  return {
    profileImageUrl,
    firstName,
    lastName,
    middleName,
    birthDate,
    phoneNumber: phoneNumber.replace(/\D/g, ''),
    gender,
    aboutMe,
    messengerLink,
    emails,
  };
}

export function transformToTeacherUserCreateDto({
  email,
  password,
  profileImageUrl,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  educationalBackground,
  teachingExperience,
  teachingCertifications,
  website,
  socialMediaLinks,
  emails,
}: any) {
  return {
    email,
    password,
    profileImageUrl,
    firstName,
    lastName,
    middleName,
    birthDate,
    phoneNumber: phoneNumber.replace(/\D/g, ''),
    gender,
    aboutMe,
    educationalBackground,
    teachingExperience,
    teachingCertifications,
    website,
    socialMediaLinks,
    emails,
  };
}

export function transformToTeacherUserUpdateDto({
  profileImageUrl,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  educationalBackground,
  teachingExperience,
  teachingCertifications,
  website,
  socialMediaLinks,
  messengerLink,
  emails,
}: any) {
  return {
    profileImageUrl,
    firstName,
    lastName,
    middleName,
    birthDate,
    phoneNumber: phoneNumber.replace(/\D/g, ''),
    gender,
    aboutMe,
    educationalBackground,
    teachingExperience,
    teachingCertifications,
    website,
    socialMediaLinks,
    messengerLink,
    emails,
  };
}

export function transformToStudentUserCreateDto({
  email,
  password,
  profileImageUrl,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
}: any) {
  return {
    email,
    password,
    profileImageUrl,
    firstName,
    lastName,
    middleName,
    birthDate,
    phoneNumber: phoneNumber.replace(/\D/g, ''),
    gender,
    aboutMe,
  };
}

export function transformToStudentUserUpdateDto({
  profileImageUrl,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  messengerLink,
}: any) {
  return {
    profileImageUrl,
    firstName,
    lastName,
    middleName,
    birthDate,
    phoneNumber: phoneNumber.replace(/\D/g, ''),
    gender,
    aboutMe,
    messengerLink,
  };
}

export function transformToUserRegisterFormData({
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  email,
}: any): UserUpsertFormData {
  return {
    email,
    firstName,
    lastName,
    birthDate,
    phoneNumber: phoneNumber?.length
      ? phoneNumber?.slice(1, phoneNumber.length)
      : undefined,
    gender,
    middleName,
    password: 'xxxxxxxxxxxx',
    confirmPassword: 'xxxxxxxxxxxx',
  };
}

export function transformToAdminUserAccountFormData({
  profileImageUrl,
  userAccount,
}: any): AdminUserUpdateFormData {
  const { phoneNumber, aboutMe, messengerLink, emails } = userAccount || {};

  return {
    phoneNumber: phoneNumber?.length
      ? phoneNumber?.slice(1, phoneNumber.length)
      : undefined,
    aboutMe: aboutMe || undefined,
    messengerLink: messengerLink || undefined,
    emails: emails || undefined,
    profileImageUrl: profileImageUrl || undefined,
  };
}

export function transformToTeacherUserAccountFormData({
  profileImageUrl,
  userAccount,
}: any): TeacherUserUpdateFormData {
  const {
    phoneNumber,
    aboutMe,
    educationalBackground,
    teachingExperience,
    teachingCertifications,
    website,
    socialMediaLinks,
    messengerLink,
    emails,
  } = userAccount || {};

  return {
    phoneNumber: phoneNumber?.length
      ? phoneNumber?.slice(1, phoneNumber.length)
      : undefined,
    aboutMe: aboutMe || undefined,
    educationalBackground: educationalBackground || undefined,
    teachingExperience: teachingExperience || undefined,
    teachingCertifications: teachingCertifications || undefined,
    website: website || undefined,
    socialMediaLinks: socialMediaLinks || undefined,
    messengerLink: messengerLink || undefined,
    emails: emails || undefined,
    profileImageUrl: profileImageUrl || undefined,
  };
}

export function transformToStudentUserAccountFormData({
  profileImageUrl,
  userAccount,
}: any): StudentUserUpdateFormData {
  const { phoneNumber, aboutMe, messengerLink } = userAccount || {};

  return {
    phoneNumber: phoneNumber?.length
      ? phoneNumber?.slice(1, phoneNumber.length)
      : undefined,
    aboutMe: aboutMe || undefined,
    messengerLink: messengerLink || undefined,
    profileImageUrl: profileImageUrl || undefined,
  };
}
