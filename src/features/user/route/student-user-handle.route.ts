import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';

import type { GroupLink, SceneRouteHandle } from '#/base/models/base.model';

export const teacherStudentUserBaseRoute = `/${teacherBaseRoute}/${teacherRoutes.student.to}`;

const studentUserListLink = {
  to: teacherStudentUserBaseRoute,
  label: 'Learner List',
  icons: [{ name: 'student' }] as GroupLink['icons'],
};

const createStudentUserLink = {
  to: `${teacherStudentUserBaseRoute}/${teacherRoutes.student.createTo}`,
  label: 'Enroll Learner',
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
    title: 'Learners',
    links: [createStudentUserLink, performanceLink],
  },
  single: {
    title: 'Learner Details',
    links: [studentUserListLink, createStudentUserLink],
  },
  create: {
    title: 'Enroll a New Learner',
    links: [studentUserListLink, performanceLink],
  },
  edit: {
    title: 'Edit Learner Details',
    links: [studentUserListLink, createStudentUserLink],
  },
};
