import { adminBaseRoute, adminRoutes } from '#/app/routes/admin-routes';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import {
  superAdminBaseRoute,
  superAdminRoutes,
} from '#/app/routes/super-admin-routes';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';

import type { SceneRouteHandle } from '#/base/models/base.model';

export const superAdminUserBaseRoute = `/${superAdminBaseRoute}/${superAdminRoutes.account.to}`;
export const adminUserBaseRoute = `/${adminBaseRoute}/${adminRoutes.account.to}`;
export const teacherUserBaseRoute = `/${teacherBaseRoute}/${teacherRoutes.account.to}`;
export const studentUserBaseRoute = `/${studentBaseRoute}/${studentRoutes.account.to}`;

export const currentUserRouteHandle: { [key: string]: SceneRouteHandle } = {
  single: {
    title: 'Account Details',
  },
  edit: {
    title: 'Edit Account',
  },
  assignedTeacher: {
    title: 'Assigned Teacher Details',
  },
};
