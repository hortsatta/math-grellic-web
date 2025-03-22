import type { UserApprovalStatus, UserGender } from './user.model';

export type UserUpsertFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  phoneNumber: string;
  gender: UserGender;
  middleName?: string;
  teacherId?: string;
  approvalStatus?: UserApprovalStatus;
};

export type TeacherUserUpdateFormData = {
  phoneNumber: string;
  aboutMe: string;
  educationalBackground: string;
  teachingExperience: string;
  teachingCertifications: string;
  website: string;
  socialMediaLinks: string[];
  messengerLink: string;
  emails: string[];
  profileImageUrl?: string;
};

export type StudentUserUpdateFormData = {
  phoneNumber: string;
  aboutMe: string;
  messengerLink: string;
  profileImageUrl?: string;
};
