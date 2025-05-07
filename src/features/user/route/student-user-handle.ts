import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';

import type { GroupLink, SceneRouteHandle } from '#/base/models/base.model';

const studentUserBaseRoute = `/${teacherBaseRoute}/${teacherRoutes.student.to}`;

const studentUserListLink = {
  to: studentUserBaseRoute,
  label: 'Student List',
  icons: [{ name: 'student' }] as GroupLink['icons'],
};

const createStudentUserLink = {
  to: `${studentUserBaseRoute}/${teacherRoutes.student.createTo}`,
  label: 'Enroll Student',
  icons: [
    { name: 'plus', size: 16 },
    { name: 'student' },
  ] as GroupLink['icons'],
};

const performanceLink = {
  to: `/${teacherBaseRoute}/${teacherRoutes.performance.to}`,
  label: 'Performances',
  icons: [{ name: 'chart-donut' }] as GroupLink['icons'],
};

export const studentUserRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Students',
    links: [createStudentUserLink, performanceLink],
  },
  single: {
    title: 'Student Details',
    links: [studentUserListLink, createStudentUserLink],
  },
  create: {
    title: 'Enroll a New Student',
    links: [studentUserListLink, performanceLink],
  },
  edit: {
    title: 'Edit Student Details',
    links: [studentUserListLink, createStudentUserLink],
  },
};
