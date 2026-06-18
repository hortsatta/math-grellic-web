import { memo, useMemo } from 'react';
import cx from 'classix';

import { superAdminRoutes } from '#/app/routes/super-admin-routes';
import { UserGender } from '#/user/models/user.model';
import { ADMIN_NAME } from '#/user/helpers/user.helper';
import { saAdminUserBaseRoute } from '#/user/route/admin-user-handle.route';
import { superAdminUserBaseRoute } from '#/user/route/current-user-handle.route';
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

const links = [
  {
    to: `${saAdminUserBaseRoute}/${superAdminRoutes.admin.createTo}`,
    label: 'Register administrator',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'users-four' },
    ] as GroupLink['icons'],
  },
  {
    to: saAdminUserBaseRoute,
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
      userAccount: { firstName: ADMIN_NAME, gender: UserGender.Male },
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
                to={superAdminUserBaseRoute}
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
