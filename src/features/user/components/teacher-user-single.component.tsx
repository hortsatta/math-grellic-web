import { memo, useMemo } from 'react';
import cx from 'classix';

import { adminRoutes } from '#/app/routes/admin-routes';
import { SchoolYearEnrollmentApprovalStatus } from '#/school-year/models/school-year-enrollment.model';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { StudentSchoolYearEnrollmentCounterList } from '#/school-year/components/student-school-year-enrollment-counter-list.component';
import { LessonCounterList } from '#/lesson/components/lesson-counter-list.component';
import { ExamCounterList } from '#/exam/components/exam-counter-list.component';
import { ActivityCounterList } from '#/activity/components/activity-counter-list.component';
import { formatPhoneNumber, generateFullName } from '../helpers/user.helper';
import { TeacherUserAccountSingle } from './teacher-user-account-single.component';
import { UserMessengerLink } from './user-messenger-link.component';
import { UserAvatarImg } from './user-avatar-img.component';

import type { ComponentProps } from 'react';
import type { TeacherUserAccount, UserGender } from '#/user/models/user.model';

type Props = ComponentProps<'div'> & {
  teacher: TeacherUserAccount;
  lessonCount: number;
  examCount: number;
  activityCount: number;
  lessonCountLoading?: boolean;
  examCountLoading?: boolean;
  activityCountLoading?: boolean;
};

const EDIT_PATH = adminRoutes.teacher.editTo;

export const TeacherUserSingle = memo(function ({
  className,
  lessonCountLoading,
  examCountLoading,
  activityCountLoading,
  teacher,
  lessonCount,
  examCount,
  activityCount,
  ...moreProps
}: Props) {
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const [schoolYearId, schoolYearTitle] = useMemo(
    () => [schoolYear?.id, schoolYear?.title],
    [schoolYear],
  );

  const [
    teacherId,
    email,
    publicId,
    phoneNumber,
    fullName,
    gender,
    messengerLink,
    studentCount,
    isEnrolled,
  ] = useMemo(
    () =>
      teacher
        ? [
            teacher.id,
            teacher.email,
            teacher.publicId,
            formatPhoneNumber(teacher.phoneNumber),
            generateFullName(
              teacher.firstName,
              teacher.lastName,
              teacher.middleName,
            ),
            teacher.gender,
            teacher.messengerLink,
            teacher.studentCount,
            teacher.enrollment?.approvalStatus ===
              SchoolYearEnrollmentApprovalStatus.Approved,
          ]
        : [],
    [teacher],
  );

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <div className='mb-2.5 flex flex-col gap-y-2.5'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <UserAvatarImg gender={gender as UserGender} />
            <div>
              <h2 className='pb-1 text-xl'>{fullName}</h2>
              <span>{email}</span>
            </div>
          </div>
          <div>
            <BaseLink to={EDIT_PATH} className='!px-3' variant='solid'>
              <BaseIcon name='pencil' size={24} />
            </BaseLink>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <BaseChip iconName='identification-badge'>{publicId}</BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='device-mobile'>{phoneNumber}</BaseChip>
          </div>
          <UserMessengerLink userId={messengerLink} />
        </div>
      </div>
      <BaseDivider className='mb-2.5' />
      <div className='flex flex-col gap-4'>
        {teacher && teacherId != null && (
          <>
            <TeacherUserAccountSingle userAccount={teacher} />
            <BaseSurface rounded='sm'>
              <h3 className='mb-2.5 text-base'>
                Details for {schoolYearTitle}
              </h3>
              {schoolYearId != null && isEnrolled ? (
                <div className='flex items-center gap-2.5'>
                  <StudentSchoolYearEnrollmentCounterList
                    studentCount={studentCount || 0}
                    teacherId={teacherId}
                    schoolYearId={schoolYearId}
                  />
                  <BaseDivider className='!h-14' vertical />
                  <div className='flex items-center'>
                    <LessonCounterList
                      loading={lessonCountLoading}
                      lessonCount={lessonCount}
                      teacherId={teacherId}
                      schoolYearId={schoolYearId}
                    />
                    <ExamCounterList
                      loading={examCountLoading}
                      examCount={examCount}
                      teacherId={teacherId}
                      schoolYearId={schoolYearId}
                    />
                    <ActivityCounterList
                      loading={activityCountLoading}
                      activityCount={activityCount}
                      teacherId={teacherId}
                      schoolYearId={schoolYearId}
                    />
                  </div>
                </div>
              ) : (
                'Teacher was not enrolled on this school year.'
              )}
            </BaseSurface>
          </>
        )}
      </div>
    </div>
  );
});
