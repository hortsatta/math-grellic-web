import { memo, useMemo } from 'react';
import cx from 'classix';

import {
  superAdminBaseRoute,
  superAdminRoutes,
} from '#/app/routes/super-admin-routes';
import { UserGender } from '#/user/models/user.model';
import { ADMIN_NAME } from '#/user/helpers/user.helper';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { DashboardShortcutMenu } from './dashboard-shortcut-menu.component';
import { DashboardUserWelcome } from './dashboard-user-welcome.component';

import type { ComponentProps } from 'react';
import type { User } from '#/user/models/user.model';
import type { GroupLink } from '#/base/models/base.model';

type Props = ComponentProps<typeof BaseSurface> & {
  user: User | null;
  loading?: boolean;
};

const USER_ACCOUNT_PATH = `/${superAdminBaseRoute}/${superAdminRoutes.account.to}`;

const links = [
  {
    to: `/${superAdminBaseRoute}/${superAdminRoutes.admin.to}/${superAdminRoutes.admin.createTo}`,
    label: 'Register administrator',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'users-four' },
    ] as GroupLink['icons'],
  },
  {
    to: `/${superAdminBaseRoute}/${superAdminRoutes.admin.to}`,
    label: 'View all administrator',
    icons: [{ name: 'users-four' }] as GroupLink['icons'],
  },
];

export const SuperAdminDashboardUserSummary = memo(function ({
  className,
  loading,
  user,
  ...moreProps
}: Props) {
  const transformedUser = useMemo(
    () => ({
      ...user,
      userAccount: { firstName: ADMIN_NAME, gender: UserGender },
    }),
    [user],
  );

  return (
    <BaseSurface
      className={cx(
        'flex flex-col gap-4 -2lg:flex-row xl:flex-col 2xl:flex-row',
        loading ? 'items-center justify-center' : 'items-stretch',
        className,
      )}
      {...moreProps}
    >
      {loading ? (
        <BaseSpinner />
      ) : (
        <>
          <div className='flex w-full animate-fastFadeIn flex-col gap-4 2xl:min-w-[400px]'>
            {user && (
              <DashboardUserWelcome
                to={USER_ACCOUNT_PATH}
                user={transformedUser as any}
              />
            )}
            <BaseDivider />
            <DashboardShortcutMenu
              className='h-full min-h-[100px]'
              links={links}
            />
          </div>
          {/* <div className='hidden -2lg:block xl:hidden 2xl:block'>
            <BaseDivider vertical />
          </div> */}
        </>
      )}
    </BaseSurface>
  );
});
