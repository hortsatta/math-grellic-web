import { adminBaseRoute, adminRoutes } from '#/app/routes/admin-routes';

import type { GroupLink, SceneRouteHandle } from '#/base/models/base.model';

const schoolYearBaseRoute = `/${adminBaseRoute}/${adminRoutes.schoolYear.to}`;

const schoolYearListLink = {
  to: schoolYearBaseRoute,
  label: 'School Year List',
  icons: [{ name: 'graduation-cap' }] as GroupLink['icons'],
};

const createSchoolYearLink = {
  to: `${schoolYearBaseRoute}/${adminRoutes.schoolYear.createTo}`,
  label: 'Create School Year',
  icons: [
    { name: 'plus', size: 16 },
    { name: 'graduation-cap' },
  ] as GroupLink['icons'],
};

const teacherUserListLink = {
  to: `/${adminBaseRoute}/${adminRoutes.teacher.to}`,
  label: 'Teacher List',
  icons: [{ name: 'chalkboard-teacher' }] as GroupLink['icons'],
};

export const adminSchoolYearRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'School Year',
    links: [createSchoolYearLink, teacherUserListLink],
  },
  single: {
    title: 'School Year Details',
    links: [schoolYearListLink, createSchoolYearLink],
  },
  create: {
    title: 'Create a School Year',
    links: [schoolYearListLink, teacherUserListLink],
  },
  edit: {
    title: 'Edit School Year',
    links: [schoolYearListLink, createSchoolYearLink],
  },
};
