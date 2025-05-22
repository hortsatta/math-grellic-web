import { memo, useMemo } from 'react';
import cx from 'classix';

import { SchoolYearAcademicProgress } from '#/school-year/models/school-year-enrollment.model';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { generateFullName } from '#/user/helpers/user.helper';
import { UserAvatarImg } from '#/user/components/user-avatar-img.component';
import { ContextMenu } from './student-performance-single-card.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '../models/performance.model';
import type { IconName } from '#/base/models/base.model';

type Props = ComponentProps<typeof BaseSurface> & {
  student: StudentPerformance;
  onDetails?: () => void;
  onAcademicProgress?: () => void;
};

export const StudentPerformanceAcademicProgressSingleCard = memo(function ({
  className,
  student,
  onDetails,
  onAcademicProgress,
  ...moreProps
}: Props) {
  const [publicId, email, gender, academicProgress] = useMemo(
    () => [
      student.publicId,
      student.email,
      student.gender,
      student.enrollment?.academicProgress,
    ],
    [student],
  );

  const fullName = useMemo(
    () =>
      generateFullName(student.firstName, student.lastName, student.middleName),
    [student],
  );

  const [resultProgressText, resultIconName] = useMemo(() => {
    switch (academicProgress) {
      case SchoolYearAcademicProgress.Passed:
        return [
          SchoolYearAcademicProgress.Passed.toUpperCase(),
          'check-circle',
        ];
      case SchoolYearAcademicProgress.Failed:
        return [SchoolYearAcademicProgress.Failed.toUpperCase(), 'x-circle'];
      default:
        return [
          SchoolYearAcademicProgress.Ongoing.toUpperCase(),
          'clock-countdown',
          'border-accent',
        ];
    }
  }, [academicProgress]);

  return (
    <BaseSurface
      className={cx(
        'pointer-events-none flex w-full items-center gap-5 !p-2.5 transition-all hover:cursor-pointer hover:!border-primary-focus hover:shadow-md hover:ring-1 hover:ring-primary-focus',
        className,
      )}
      rounded='sm'
      {...moreProps}
    >
      <div
        className='group pointer-events-auto flex flex-1 flex-col items-start gap-4 -2lg:flex-row -2lg:items-center'
        tabIndex={0}
        onClick={onDetails}
      >
        <div className='flex w-full flex-1 flex-col items-center gap-4 xs:flex-row'>
          <UserAvatarImg className='shrink-0' gender={gender} />
          <div className='flex w-full items-center justify-between'>
            <div className='flex flex-1 flex-col gap-2'>
              {/* Info chips */}
              <div className='flex flex-col items-start gap-1 xs:flex-row xs:items-center xs:gap-2.5'>
                <BaseChip iconName='identification-badge' className='shrink-0'>
                  {publicId}
                </BaseChip>
                <BaseDivider className='hidden !h-6 xs:block' vertical />
                <BaseChip iconName='at' className='!lowercase'>
                  {email}
                </BaseChip>
              </div>
              {/* Title */}
              <h2 className='font-body text-lg font-medium tracking-normal text-accent group-hover:text-primary-focus'>
                {fullName}
              </h2>
            </div>
            <ContextMenu
              className='block xs:hidden'
              onDetails={onDetails}
              onAcademicProgress={onAcademicProgress}
            />
          </div>
        </div>
        {/* Ranking + score */}
        <div
          className={cx(
            'flex h-full w-full min-w-[230px] items-center gap-1.5 font-bold text-primary -2lg:w-auto',
            academicProgress === SchoolYearAcademicProgress.Passed &&
              '!text-green-500',
            academicProgress === SchoolYearAcademicProgress.Failed &&
              '!text-red-500',
          )}
        >
          <BaseIcon name={resultIconName as IconName} size={26} weight='bold' />
          <span className='font-display text-xl tracking-tighter'>
            {resultProgressText}
          </span>
        </div>
      </div>
      <ContextMenu
        className='hidden xs:block'
        onDetails={onDetails}
        onAcademicProgress={onAcademicProgress}
      />
    </BaseSurface>
  );
});
