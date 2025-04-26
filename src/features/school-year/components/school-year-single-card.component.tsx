import { memo, useCallback, useMemo } from 'react';
import { Menu } from '@headlessui/react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { RecordStatus } from '#/core/models/core.model';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps, MouseEvent } from 'react';
import type { SchoolYear } from '../models/school-year.model';

type Props = ComponentProps<typeof BaseSurface> & {
  schoolYear: SchoolYear;
  isDashboard?: boolean;
  isActive?: boolean;
  onDetails?: () => void;
  onPreview?: () => void;
  onEdit?: () => void;
  onSchedule?: () => void;
};

type ContextMenuProps = ComponentProps<'div'> & {
  onDetails?: () => void;
  onEdit?: () => void;
};

const menuIconProps = { weight: 'bold', size: 48 } as ComponentProps<
  typeof BaseIconButton
>['iconProps'];

const ContextMenu = memo(function ({
  className,
  onDetails,
  onEdit,
  ...moreProps
}: ContextMenuProps) {
  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  }, []);

  return (
    <div
      className={cx('pointer-events-auto relative h-12 w-7', className)}
      {...moreProps}
    >
      <BaseDropdownMenu
        customMenuButton={
          <div className='relative h-12 w-7'>
            <Menu.Button
              as={BaseIconButton}
              name='dots-three-vertical'
              variant='link'
              className='button absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              iconProps={menuIconProps}
              onClick={handleClick}
            />
          </div>
        }
      >
        <Menu.Item
          as={BaseDropdownButton}
          iconName='article'
          onClick={onDetails}
        >
          Details
        </Menu.Item>
        <BaseDivider className='my-1' />
        <Menu.Item as={BaseDropdownButton} iconName='pencil' onClick={onEdit}>
          Edit
        </Menu.Item>
      </BaseDropdownMenu>
    </div>
  );
});

export const SchoolYearSingleCard = memo(function ({
  className,
  schoolYear,
  isDashboard,
  isActive,
  onDetails,
  onEdit,
  ...moreProps
}: Props) {
  const [
    title,
    dateRange,
    enrollmentStartDate,
    enrollmentEndDate,
    totalTeacherCount,
    totalStudentCount,
    isDraft,
  ] = useMemo(
    () => [
      schoolYear.title,
      `${dayjs(schoolYear.startDate).format('MMM DD, YYYY')} — ${dayjs(
        schoolYear.endDate,
      ).format('MMM DD, YYYY')}`,
      dayjs(schoolYear.enrollmentStartDate).format('MMM DD, YYYY'),
      dayjs(schoolYear.enrollmentEndDate).format('MMM DD, YYYY'),
      schoolYear.totalTeacherCount,
      schoolYear.totalStudentCount,
      (schoolYear.status === RecordStatus.Draft) as boolean,
    ],
    [schoolYear],
  );

  const enrollmentDateRange = useMemo(
    () => `${enrollmentStartDate} — ${enrollmentEndDate}`,
    [enrollmentStartDate, enrollmentEndDate],
  );

  return (
    <BaseSurface
      className={cx(
        'pointer-events-none flex items-center gap-5 !p-2.5 transition-all hover:cursor-pointer hover:!border-primary-focus hover:shadow-md hover:ring-1 hover:ring-primary-focus',
        isDashboard && 'xs:!pr-5',
        isActive &&
          '!border-primary-hue-purple-focus ring-1 ring-primary-hue-purple-focus',
        className,
      )}
      rounded='sm'
      {...moreProps}
    >
      <div
        className={cx(
          'group pointer-events-auto relative flex flex-1 flex-col items-start gap-2.5 xs:gap-4 -2lg:flex-row',
          isDashboard
            ? 'flex-wrap -2lg:flex-nowrap xl:flex-wrap 2xl:flex-nowrap'
            : 'flex-wrap md:flex-nowrap',
        )}
        tabIndex={0}
        onClick={onDetails}
      >
        <div
          className={cx(
            'flex flex-1 flex-col items-start gap-4 sm:flex-row sm:items-center md:w-auto',
            isDashboard
              ? 'w-full -2lg:w-auto xl:w-full 2xl:w-auto'
              : 'w-full sm:w-auto',
          )}
        >
          <div className='flex h-[68px] w-full items-center justify-center overflow-hidden rounded border border-primary bg-primary-focus-light/30 text-primary sm:w-[121px]'>
            <BaseIcon name='graduation-cap' size={40} weight='light' />
          </div>
          <div className='flex h-full flex-1 flex-col gap-2'>
            {/* Info chips */}
            <div className='hidden items-center gap-2.5 xs:flex'>
              <BaseChip iconName='calendar-check'>{dateRange}</BaseChip>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName='chalkboard-teacher'>
                {totalTeacherCount}
              </BaseChip>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName='student'>{totalStudentCount}</BaseChip>
              {isDraft && (
                <>
                  <BaseDivider className='!h-6' vertical />
                  <BaseChip iconName='file-dashed'>Draft</BaseChip>
                </>
              )}
            </div>
            {/* Title */}
            <h2 className='font-body text-lg font-medium tracking-normal text-accent group-hover:text-primary-focus'>
              {title}{' '}
              {isActive && (
                <small className='ml-0.5 uppercase leading-none text-primary-hue-purple-focus'>
                  [Current]
                </small>
              )}
            </h2>
          </div>
        </div>
        {/* Mobile info */}
        <div className='flex w-full items-center justify-between gap-2.5 xs:hidden'>
          <div className='flex flex-col gap-1'>
            <BaseChip iconName='calendar-check'>{dateRange}</BaseChip>
            <BaseDivider className='hidden !h-6 sm:block' vertical />
            <BaseChip iconName='chalkboard-teacher'>
              {totalTeacherCount}
            </BaseChip>
            <BaseDivider className='hidden !h-6 sm:block' vertical />
            <BaseChip iconName='student'>{totalStudentCount}</BaseChip>
            {isDraft && <BaseChip iconName='file-dashed'>Draft</BaseChip>}
          </div>
          {!isDashboard && (
            <ContextMenu onDetails={onDetails} onEdit={onEdit} />
          )}
        </div>
        {/* Enrollment start and end date */}
        <div
          className={cx(
            'flex flex-col pt-1',
            isDashboard
              ? 'w-full items-center gap-2.5 -2lg:w-auto xl:w-full 2xl:w-auto'
              : 'min-w-0 gap-1 xs:min-w-[140px] sm:min-w-0 md:w-auto md:min-w-[140px]',
          )}
        >
          <small>Enrollment Date</small>
          <BaseChip
            className='hidden !items-start -2lg:flex'
            iconName='calendar-check'
          >
            <div className='flex flex-col leading-tight'>
              <span>{enrollmentStartDate} —</span>
              <span>{enrollmentEndDate}</span>
            </div>
          </BaseChip>
          <BaseChip className='flex -2lg:hidden' iconName='calendar-check'>
            {enrollmentDateRange}
          </BaseChip>
        </div>
      </div>
      {!isDashboard && (
        <ContextMenu
          className='hidden xs:block'
          onDetails={onDetails}
          onEdit={onEdit}
        />
      )}
    </BaseSurface>
  );
});

export const SchoolYearSingleCardSkeleton = memo(function () {
  return (
    <div className='flex w-full animate-pulse flex-col justify-between gap-5 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-4 xs:flex-row xs:gap-2.5'>
      <div className='flex flex-1 flex-col items-start justify-between gap-4 xs:flex-row xs:items-center md:justify-start'>
        <div className='h-[68px] w-full rounded bg-accent/20 xs:w-[121px]' />
        <div className='flex h-full w-full flex-1 flex-col justify-between gap-2.5'>
          <div className='h-6 w-full rounded bg-accent/20 -3xs:w-[200px] xs:w-full sm:w-[200px]' />
          <div className='h-6 w-28 rounded bg-accent/20' />
        </div>
      </div>
      <div className='flex h-full w-full flex-1 gap-5 -3xs:w-fit md:flex-none'>
        <div className='h-6 w-full rounded bg-accent/20 -3xs:w-[150px] xs:w-full md:w-[150px]' />
        <div className='hidden h-full w-5 rounded bg-accent/20 xs:block' />
      </div>
    </div>
  );
});
