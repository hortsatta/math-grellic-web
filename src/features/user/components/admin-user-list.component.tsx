import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { superAdminRoutes } from '#/app/routes/super-admin-routes';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import {
  AdminUserSingleCardSkeleton,
  AdminUserSingleCard,
} from './admin-user-single-card.component';

import type { ComponentProps } from 'react';
import type { AdminUserAccount } from '../models/user.model';

type Props = ComponentProps<'div'> & {
  admins: AdminUserAccount[];
  loading?: boolean;
  onAdminDetails?: (admin: AdminUserAccount) => void;
  onAdminEdit?: (id: number) => void;
};

export const AdminUserList = memo(function ({
  className,
  admins,
  loading,
  onAdminDetails,
  onAdminEdit,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => !admins?.length, [admins]);

  const handleAdminDetails = useCallback(
    (admin: AdminUserAccount) => () => {
      onAdminDetails && onAdminDetails(admin);
    },
    [onAdminDetails],
  );

  const handleAdminEdit = useCallback(
    (id: number) => () => {
      onAdminEdit && onAdminEdit(id);
    },
    [onAdminEdit],
  );

  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      role='table'
      {...moreProps}
    >
      {loading ? (
        [...Array(4)].map((_, index) => (
          <AdminUserSingleCardSkeleton key={index} />
        ))
      ) : isEmpty ? (
        <BaseDataEmptyMessage
          message='No admins available'
          linkLabel='Register'
          linkTo={superAdminRoutes.admin.createTo}
        />
      ) : (
        admins.map((admin, index) => (
          <AdminUserSingleCard
            key={`s-${admin.publicId?.toLowerCase() || index}`}
            admin={admin}
            onDetails={handleAdminDetails(admin)}
            onEdit={handleAdminEdit(admin.id)}
            role='row'
          />
        ))
      )}
    </div>
  );
});
