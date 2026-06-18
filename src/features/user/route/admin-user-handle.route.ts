import {
  superAdminBaseRoute,
  superAdminRoutes,
} from '#/app/routes/super-admin-routes';

import type { GroupLink, SceneRouteHandle } from '#/base/models/base.model';

const adminUserBaseRoute = `/${superAdminBaseRoute}/${superAdminRoutes.admin.to}`;

const adminUserListLink = {
  to: adminUserBaseRoute,
  label: 'Admin List',
  icons: [{ name: 'users-four' }] as GroupLink['icons'],
};

const createAdminUserLink = {
  to: `${adminUserBaseRoute}/${superAdminRoutes.admin.createTo}`,
  label: 'Register Admin',
  icons: [
    { name: 'plus', size: 16 },
    { name: 'users-four' },
  ] as GroupLink['icons'],
};

export const adminUserRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Admins',
    links: [createAdminUserLink],
  },
  single: {
    title: 'Admin Details',
    links: [adminUserListLink, createAdminUserLink],
  },
  create: {
    title: 'Register an Admin',
    links: [adminUserListLink],
  },
  edit: {
    title: 'Edit Admin Details',
    links: [adminUserListLink, createAdminUserLink],
  },
};
