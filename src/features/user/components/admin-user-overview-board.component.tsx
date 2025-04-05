import { memo } from 'react';
import cx from 'classix';

import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseTooltip } from '#/base/components/base-tooltip.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  registeredAdminCount: number;
  loading?: boolean;
  onRefresh?: () => void;
};

export const AdminUserOverviewBoard = memo(function ({
  className,
  loading,
  registeredAdminCount,
  onRefresh,
  ...moreProps
}: Props) {
  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg'>Admins Overview</h2>
        <BaseTooltip content='Refresh'>
          <BaseIconButton
            name='arrow-clockwise'
            variant='link'
            size='sm'
            onClick={onRefresh}
          />
        </BaseTooltip>
      </div>
      <BaseSurface className='flex flex-col items-center !p-3' rounded='sm'>
        {loading ? (
          <BaseSpinner size='sm' />
        ) : (
          <>
            <span className='text-xl font-bold text-primary'>
              {registeredAdminCount}
            </span>
            <h3 className='font-body text-sm font-normal tracking-normal text-accent'>
              Total Admins Registered
            </h3>
          </>
        )}
      </BaseSurface>
    </div>
  );
});
