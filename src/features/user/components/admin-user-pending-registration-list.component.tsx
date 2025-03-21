import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseTooltip } from '#/base/components/base-tooltip.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { formatPhoneNumber, generateFullName } from '../helpers/user.helper';

import type { ComponentProps } from 'react';
import type { AdminUserAccount } from '../models/user.model';

type Props = ComponentProps<'div'> & {
  pendingAdmins: AdminUserAccount[];
  loading?: boolean;
  onAdminDetails?: (admin: AdminUserAccount) => void;
  onRefresh?: () => void;
};

export const AdminUserPendingRegistrationList = memo(
  forwardRef<any, Props>(function (
    {
      className,
      loading,
      pendingAdmins,
      onAdminDetails,
      onRefresh,
      ...moreProps
    },
    ref,
  ) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentAdmin = useMemo(() => {
      if (!pendingAdmins.length) {
        null;
      }

      return pendingAdmins[currentIndex];
    }, [pendingAdmins, currentIndex]);

    const [date, email, phoneNumber, fullName] = useMemo(
      () => [
        dayjs(currentAdmin?.createdAt).format('DD-MM-YYYY'),
        currentAdmin?.email,
        currentAdmin ? formatPhoneNumber(currentAdmin?.phoneNumber) : '',
        currentAdmin
          ? generateFullName(
              currentAdmin.firstName,
              currentAdmin.lastName,
              currentAdmin.middleName,
            )
          : '',
      ],
      [currentAdmin],
    );

    const pendingCountText = useMemo(() => {
      const count = pendingAdmins.length;

      if (count <= 1) {
        return `${!count ? 'No' : count} Pending Registration`;
      }

      return `${count} Pending Registrations`;
    }, [pendingAdmins]);

    const handlePrev = useCallback(() => {
      setCurrentIndex((prev) => (prev <= 0 ? 0 : prev - 1));
    }, []);

    const handleNext = useCallback(() => {
      setCurrentIndex((prev) =>
        prev >= pendingAdmins.length - 1 ? prev : prev + 1,
      );
    }, [pendingAdmins]);

    const handleAdminDetails = useCallback(
      () => onAdminDetails && onAdminDetails(currentAdmin),
      [currentAdmin, onAdminDetails],
    );

    const handleRefresh = useCallback(() => {
      setCurrentIndex(0);
      onRefresh && onRefresh();
    }, [onRefresh]);

    useImperativeHandle(
      ref,
      () => ({
        handleRefresh,
      }),
      [handleRefresh],
    );

    return (
      <div className={cx('w-full', className)} {...moreProps}>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg'>{pendingCountText}</h2>
          <BaseTooltip content='Refresh'>
            <BaseIconButton
              name='arrow-clockwise'
              variant='link'
              size='sm'
              onClick={handleRefresh}
            />
          </BaseTooltip>
        </div>
        {currentAdmin && (
          <BaseSurface
            className={cx(
              'flex min-h-[125px] flex-col justify-between gap-4 !p-3 -3xs:gap-0',
              onAdminDetails && 'cursor-pointer hover:!border-primary',
              loading &&
                'pointer-events-none w-full !items-center !justify-center',
            )}
            rounded='sm'
            onClick={handleAdminDetails}
            role={onAdminDetails ? 'button' : 'article'}
          >
            {loading ? (
              <BaseSpinner size='sm' />
            ) : (
              <>
                <div className='flex flex-col items-start gap-2.5 -3xs:flex-row'>
                  <h3 className='order-last flex-1 font-body text-base font-medium !tracking-normal !text-accent -3xs:order-none'>
                    {fullName}
                  </h3>
                  <BaseChip iconName='calendar-check'>{date}</BaseChip>
                </div>
                <div className='flex flex-col gap-1'>
                  <span className='text-sm font-medium'>{email}</span>
                  <BaseChip iconName='device-mobile'>{phoneNumber}</BaseChip>
                </div>
              </>
            )}
          </BaseSurface>
        )}
        <div className='flex w-full items-center justify-between'>
          {!!pendingAdmins.length && (
            <div className='flex items-center'>
              <BaseIconButton
                name='caret-circle-left'
                variant='link'
                className='w-9'
                disabled={loading}
                onClick={handlePrev}
              />
              <BaseIconButton
                name='caret-circle-right'
                variant='link'
                className='w-9'
                disabled={loading}
                onClick={handleNext}
              />
            </div>
          )}
          <div className='flex items-center gap-[5px]'>
            {pendingAdmins.map((_, index) => (
              <div
                key={index}
                className={cx(
                  'h-2.5 w-2.5 overflow-hidden rounded-full',
                  index === currentIndex ? 'bg-primary' : 'bg-primary/50',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }),
);
