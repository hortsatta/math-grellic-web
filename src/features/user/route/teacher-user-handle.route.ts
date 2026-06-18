import { adminBaseRoute, adminRoutes } from '#/app/routes/admin-routes';

import type { GroupLink, SceneRouteHandle } from '#/base/models/base.model';

const teacherUserBaseRoute = `/${adminBaseRoute}/${adminRoutes.teacher.to}`;

const teacherUserListLink = {
  to: teacherUserBaseRoute,
  label: 'Teacher List',
  icons: [{ name: 'chalkboard-teacher' }] as GroupLink['icons'],
};

const createTeacherUserLink = {
  to: `${teacherUserBaseRoute}/${adminRoutes.teacher.createTo}`,
  label: 'Enroll Teacher',
  icons: [
    { name: 'plus', size: 16 },
    { name: 'teacher' },
  ] as GroupLink['icons'],
};

export const teacherUserRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Teachers',
    links: [createTeacherUserLink],
  },
  single: {
    title: 'Teacher Details',
    links: [teacherUserListLink, createTeacherUserLink],
  },
  create: {
    title: 'Enroll a New Teacher',
    links: [teacherUserListLink],
  },
  edit: {
    title: 'Edit Teacher Details',
    links: [teacherUserListLink, createTeacherUserLink],
  },
};
