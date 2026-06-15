import { memo } from 'react';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { DashboardUserWelcome } from './dashboard-user-welcome.component';
import { DashboardShortcutMenu } from './dashboard-shortcut-menu.component';

import type { ComponentProps } from 'react';
import type { GroupLink } from '#/base/models/base.model';
import type { User } from '#/user/models/user.model';

type Props = ComponentProps<typeof BaseSurface> & {
  user: User | null;
  loading?: boolean;
};

const USER_ACCOUNT_PATH = `/${teacherBaseRoute}/${teacherRoutes.account.to}`;

const links = [
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.lesson.to}/${teacherRoutes.lesson.createTo}`,
    label: 'New lesson',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'chalkboard' },
    ] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.exam.to}/${teacherRoutes.exam.createTo}`,
    label: 'New exam',
    icons: [{ name: 'plus', size: 16 }, { name: 'exam' }] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.activity.to}/${teacherRoutes.activity.createTo}`,
    label: 'New activity',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'game-controller' },
    ] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.schedule.to}/${teacherRoutes.schedule.meeting.to}/${teacherRoutes.schedule.meeting.createTo}`,
    label: 'Schedule meeting',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'calendar' },
    ] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.student.to}/${teacherRoutes.student.createTo}`,
    label: 'Enroll learner',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'student' },
    ] as GroupLink['icons'],
  },
];

export const TeacherDashboardUserSummary = memo(function ({
  className,
  loading,
  user,
  ...moreProps
}: Props) {
  return (
    <BaseSurface
      className={cx(
        'flex w-full gap-4',
        loading ? 'items-center justify-center' : 'items-stretch',
        className,
      )}
      {...moreProps}
    >
      {loading ? (
        <BaseSpinner />
      ) : (
        <div className='flex w-full animate-fastFadeIn flex-col gap-4'>
          {user && <DashboardUserWelcome to={USER_ACCOUNT_PATH} user={user} />}
          <BaseDivider />
          <div className='flex h-full flex-col gap-2.5'>
            <span className='text-sm'>
              Create and manage class content — including lessons, exams, and
              activities.
            </span>
            <DashboardShortcutMenu
              className='h-full min-h-[100px]'
              links={links}
            />
          </div>
        </div>
      )}
    </BaseSurface>
  );
});
