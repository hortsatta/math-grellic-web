import { memo, useCallback, useMemo, useState } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { stripHtml } from '#/utils/html.util';
import { adminRoutes } from '#/app/routes/admin-routes';
import { RecordStatus } from '#/core/models/core.model';
import { UserRole } from '#/user/models/user.model';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseRichTextOutput } from '#/base/components/base-rich-text-output.component';
import { SchoolYearEnrollmentUserList } from './school-year-enrollment-user-list.component';

import type { ComponentProps } from 'react';
import type { SchoolYear } from '../models/school-year.model';

type Props = ComponentProps<'div'> & {
  schoolYear: SchoolYear;
};

type EnrolledUserCountProps = {
  totalEnrolledCount: number;
  isStudent?: boolean;
  onClick?: () => void;
};

const EnrolledUserCount = memo(function ({
  totalEnrolledCount,
  isStudent,
  onClick,
}: EnrolledUserCountProps) {
  const totalEnrolledCountText = useMemo(() => {
    if (!totalEnrolledCount || totalEnrolledCount <= 0) {
      return `No ${isStudent ? 'students' : 'teachers'} enrolled`;
    }

    if (isStudent) {
      return `${totalEnrolledCount > 1 ? 'Students' : 'Student'} enrolled`;
    }

    return `${totalEnrolledCount > 1 ? 'Teachers' : 'Teacher'} enrolled`;
  }, [totalEnrolledCount, isStudent]);

  return (
    <button
      className='flex flex-col gap-1 rounded-md px-5 py-2.5 transition-all hover:cursor-pointer hover:!border-primary-focus hover:shadow-md hover:ring-1 hover:ring-primary-focus'
      onClick={onClick}
    >
      <div className='flex items-center gap-2.5'>
        <BaseIcon
          name={isStudent ? 'student' : 'chalkboard-teacher'}
          weight='light'
          size={42}
        />
        <span className='text-4xl font-bold text-primary'>
          {totalEnrolledCount}
        </span>
      </div>
      <span className='text-start leading-tight'>{totalEnrolledCountText}</span>
    </button>
  );
});

export const SchoolYearSingle = memo(function ({
  className,
  schoolYear,
  ...moreProps
}: Props) {
  const [currentEnrolledUserRole, setCurrentEnrolledUserRole] =
    useState<UserRole | null>(null);

  const [
    schoolYearId,
    title,
    description,
    dateRange,
    enrollmentDateRange,
    gracePeriodEndDate,
    totalTeacherCount,
    totalStudentCount,
    isDraft,
  ] = useMemo(
    () => [
      schoolYear.id,
      schoolYear.title,
      schoolYear.description || '',
      `${dayjs(schoolYear.startDate).format('MMM DD, YYYY')} — ${dayjs(
        schoolYear.endDate,
      ).format('MMM DD, YYYY')}`,
      `${dayjs(schoolYear.enrollmentStartDate).format(
        'MMM DD, YYYY',
      )} — ${dayjs(schoolYear.enrollmentEndDate).format('MMM DD, YYYY')}`,
      dayjs(schoolYear.gracePeriodEndDate).format('MMM DD, YYYY'),
      schoolYear.totalTeacherCount,
      schoolYear.totalStudentCount,
      schoolYear.status === RecordStatus.Draft,
    ],
    [schoolYear],
  );

  const isEmpty = useMemo(() => {
    const result = stripHtml(description);
    return !result.trim().length;
  }, [description]);

  const handleEnrolledUsersView = useCallback(
    (role?: UserRole) => () => setCurrentEnrolledUserRole(role || null),
    [],
  );

  return (
    <>
      <div className={cx('w-full pb-16', className)} {...moreProps}>
        <div className='flex w-full flex-col flex-wrap items-start justify-between gap-2.5 -3xs:flex-row -2lg:flex-nowrap -2lg:items-center'>
          <div>
            <h2 className='pb-1 text-xl'>{title}</h2>
            <div className='flex flex-col items-start gap-1 -2lg:flex-row -2lg:gap-2.5'>
              <BaseChip iconName='calendar-check'>{dateRange}</BaseChip>
              <BaseDivider className='hidden !h-6 -2lg:block' vertical />
              <BaseChip iconName='chalkboard-teacher'>
                {totalTeacherCount}
              </BaseChip>
              <BaseDivider className='hidden !h-6 -2lg:block' vertical />
              <BaseChip iconName='student'>{totalStudentCount}</BaseChip>
              {isDraft && (
                <>
                  <BaseDivider className='hidden !h-6 -2lg:block' vertical />
                  <BaseChip iconName='file-dashed'>Draft</BaseChip>
                </>
              )}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <BaseLink
              to={adminRoutes.schoolYear.editTo}
              className='!px-3'
              variant='solid'
            >
              <BaseIcon name='pencil' size={24} />
            </BaseLink>
          </div>
        </div>
        <div className='mt-2.5 flex flex-col gap-y-2.5'>
          <BaseDivider />
          <BaseSurface className='flex flex-col gap-y-2.5' rounded='sm'>
            <div className='flex-1'>
              <h3 className='text-base'>Enrollments</h3>
              <div className='flex items-center gap-4 py-2.5'>
                <EnrolledUserCount
                  totalEnrolledCount={totalTeacherCount}
                  onClick={handleEnrolledUsersView(UserRole.Teacher)}
                />
                <EnrolledUserCount
                  totalEnrolledCount={totalStudentCount}
                  onClick={handleEnrolledUsersView(UserRole.Student)}
                  isStudent
                />
              </div>
            </div>
            <BaseDivider />
            <div className='flex flex-col items-start gap-2.5 md:flex-row md:gap-0'>
              <div className='mr-4 flex-1 border-0 border-accent/20 md:border-r'>
                <h3 className='text-base'>Enrollment Period</h3>
                <BaseChip className='my-2' iconName='calendar-check'>
                  {enrollmentDateRange}
                </BaseChip>
              </div>
              <div className='flex-1'>
                <h3 className='text-base'>Enrollment Grace Period End Date</h3>
                <BaseChip className='my-2' iconName='calendar-check'>
                  {gracePeriodEndDate}
                </BaseChip>
              </div>
            </div>
            <BaseDivider />
            <div className='flex-1'>
              <h3 className='text-base'>
                {!isEmpty ? 'Description' : 'School Year has no description'}
              </h3>
              {!isEmpty && (
                <div className='base-rich-text rt-output pr-2.5'>
                  <BaseRichTextOutput
                    className='border-0 p-0'
                    label='Description'
                    text={description}
                    unboxed
                  />
                </div>
              )}
            </div>
          </BaseSurface>
        </div>
      </div>
      <BaseModal
        className='!min-h-0 !border-0 !px-0 !pb-8 xs:!px-10'
        size='sm'
        open={!!currentEnrolledUserRole}
        onClose={handleEnrolledUsersView()}
      >
        {!!currentEnrolledUserRole && (
          <SchoolYearEnrollmentUserList
            schoolYearId={schoolYearId}
            isStudent={currentEnrolledUserRole === UserRole.Student}
          />
        )}
      </BaseModal>
    </>
  );
});
