import { memo } from 'react';
import cx from 'classix';

import { adminBaseRoute, adminRoutes } from '#/app/routes/admin-routes';
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

const USER_ACCOUNT_PATH = `/${adminBaseRoute}/${adminRoutes.account.to}`;

const links = [
  {
    to: `/${adminBaseRoute}/${adminRoutes.schoolYear.to}/${adminRoutes.schoolYear.createTo}`,
    label: 'Create school year',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'graduation-cap' },
    ] as GroupLink['icons'],
  },
  {
    to: `/${adminBaseRoute}/${adminRoutes.teacher.to}/${adminRoutes.teacher.createTo}`,
    label: 'Register teacher',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'chalkboard-teacher' },
    ] as GroupLink['icons'],
  },
];

export const AdminDashboardUserSummary = memo(function ({
  className,
  loading,
  user,
  ...moreProps
}: Props) {
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
              <DashboardUserWelcome to={USER_ACCOUNT_PATH} user={user} />
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
