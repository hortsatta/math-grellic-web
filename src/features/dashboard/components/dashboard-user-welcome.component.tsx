import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { UserGender } from '#/user/models/user.model';
import { BaseIcon } from '#/base/components/base-icon.component';
import { UserAvatarImg } from '#/user/components/user-avatar-img.component';

import type { ComponentProps } from 'react';
import type { User } from '#/user/models/user.model';

type Props = ComponentProps<'div'> & {
  user: User;
  to: string;
};

export const DashboardUserWelcome = memo(function ({
  className,
  user,
  to,
  ...moreProps
}: Props) {
  const [publicId, firstName, gender] = useMemo(
    () => [
      user.publicId,
      user.userAccount?.firstName,
      user.userAccount?.gender || UserGender.Female,
    ],
    [user],
  );

  return (
    <div
      className={cx(
        'relative flex flex-col items-start justify-between gap-2.5 -3xs:flex-row md:flex-col -2lg:flex-row lg:[.rsb-expanded_&]:flex-col 1.5xl:[.rsb-expanded_&]:flex-row',
        className,
      )}
      {...moreProps}
    >
      <div className='order-last flex items-center gap-3 -3xs:order-none md:order-last -2lg:order-none lg:[.rsb-expanded_&]:order-last 1.5xl:[.rsb-expanded_&]:order-none'>
        <UserAvatarImg gender={gender} size='base' />
        <h2 className='flex flex-col text-2xl leading-tight transition-colors group-hover:text-primary-focus-light'>
          <span>Hello,</span>
          <span>{firstName}</span>
        </h2>
      </div>
      <Link
        to={to}
        className={cx(
          'relative right-0 flex items-center gap-1 overflow-hidden -3xs:absolute md:relative -2lg:absolute xl:[.rsb-expanded_&]:relative 1.5xl:[.rsb-expanded_&]:absolute',
          'rounded-4px border border-accent/50 px-1.5 py-1 text-sm leading-none transition-all hover:border-primary-focus hover:text-primary-focus',
        )}
      >
        <BaseIcon name='identification-badge' size={18} />
        <span>{publicId}</span>
      </Link>
    </div>
  );
});
