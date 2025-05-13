import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseIcon } from '#/base/components/base-icon.component';
import { generateFullName } from '../helpers/user.helper';
import { UserAvatarImg } from './user-avatar-img.component';

import type { ComponentProps } from 'react';
import type {
  AdminUserAccount,
  StudentUserAccount,
  TeacherUserAccount,
} from '../models/user.model';

type Props = ComponentProps<'button'> & {
  userAccount: StudentUserAccount | TeacherUserAccount | AdminUserAccount;
  selected?: boolean;
  onClick?: () => void;
};

export const UserSingleItem = memo(function ({
  className,
  userAccount,
  selected,
  onClick,
  ...moreProps
}: Props) {
  const [publicId, gender, fullName] = useMemo(
    () => [
      userAccount.publicId,
      userAccount.gender,
      generateFullName(
        userAccount.firstName,
        userAccount.lastName,
        userAccount.middleName,
      ),
    ],
    [userAccount],
  );

  return (
    <button
      className={cx(
        'group/usrpicker flex w-full items-center justify-between overflow-hidden rounded-md px-4 py-2',
        onClick ? 'hover:bg-primary' : 'pointer-events-none',
        className,
      )}
      onClick={onClick}
      {...moreProps}
    >
      <div className='flex items-center gap-4'>
        <div className='flex h-11 w-11 items-center justify-center rounded bg-slate-200'>
          <UserAvatarImg gender={gender} size='base' />
        </div>
        <div
          className={cx(
            'flex flex-col items-start',
            onClick && 'group-hover/usrpicker:text-white',
          )}
        >
          <span className='text-left font-medium'>{fullName}</span>
          <small>{publicId}</small>
        </div>
      </div>
      <div className='flex h-9 w-9 items-center justify-center'>
        {selected && (
          <BaseIcon
            name='check-fat'
            className='text-green-500'
            size={28}
            weight='fill'
          />
        )}
      </div>
    </button>
  );
});
