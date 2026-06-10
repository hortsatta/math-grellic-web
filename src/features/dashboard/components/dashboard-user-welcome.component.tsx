import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { SidebarMode } from '#/base/models/base.model';
import { useBoundStore } from '#/core/hooks/use-store.hook';
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
  const isRightSidebarExpanded = useBoundStore(
    (state) => state.rightSidebarMode == SidebarMode.Expanded,
  );

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
        'relative flex flex-row items-start justify-between gap-2.5 md:flex-col -2lg:flex-row',
        isRightSidebarExpanded && '1.5xl:flex-row! lg:flex-col',
        className,
      )}
      {...moreProps}
    >
      <div
        className={cx(
          'order-none flex items-center gap-3 md:order-last -2lg:order-none',
          isRightSidebarExpanded && '1.5xl:order-none! lg:order-last',
        )}
      >
        <UserAvatarImg gender={gender} size='base' />
        <h2 className='flex flex-col text-2xl leading-tight transition-colors group-hover:text-primary-focus-light'>
          <span>Hello,</span>
          <span>{firstName}</span>
        </h2>
      </div>
      <Link
        to={to}
        className={cx(
          'absolute right-0 flex items-center gap-1 overflow-hidden rounded-4px border border-accent/50 md:relative -2lg:absolute',
          'px-1.5 py-1 text-sm leading-none transition-all hover:border-primary-focus hover:text-primary-focus',
          isRightSidebarExpanded && '1.5xl:absolute xl:relative',
        )}
      >
        <BaseIcon name='identification-badge' size={18} />
        <span>{publicId}</span>
      </Link>
    </div>
  );
});
