import { memo, useMemo } from 'react';
import cx from 'classix';

import { superAdminRoutes } from '#/app/routes/super-admin-routes';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseLink } from '#/base/components/base-link.component';
import { formatPhoneNumber, generateFullName } from '../helpers/user.helper';
import { UserAvatarImg } from './user-avatar-img.component';
import { UserMessengerLink } from './user-messenger-link.component';

import type { ComponentProps } from 'react';
import type { AdminUserAccount, UserGender } from '#/user/models/user.model';

type Props = ComponentProps<'div'> & {
  admin: AdminUserAccount;
};

const EDIT_PATH = superAdminRoutes.admin.editTo;

export const AdminUserSingle = memo(function ({
  className,
  admin,
  ...moreProps
}: Props) {
  const [
    email,
    publicId,
    phoneNumber,
    fullName,
    gender,
    messengerLink,
    aboutMe,
  ] = useMemo(
    () =>
      admin
        ? [
            admin.email,
            admin.publicId,
            formatPhoneNumber(admin.phoneNumber),
            generateFullName(admin.firstName, admin.lastName, admin.middleName),
            admin.gender,
            admin.messengerLink,
            admin.aboutMe,
          ]
        : [],
    [admin],
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
      <BaseSurface className='flex flex-col gap-4' rounded='sm'>
        <div>
          <h3 className='mb-2.5 text-base'>About Me</h3>
          <p className={cx(!aboutMe && 'pl-2')}>{aboutMe || '—'}</p>
        </div>
      </BaseSurface>
    </div>
  );
});
