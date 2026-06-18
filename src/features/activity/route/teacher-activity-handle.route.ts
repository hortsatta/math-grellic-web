import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import type { GroupLink, SceneRouteHandle } from '#/base/models/base.model';

export const teacherActivityBaseRoute = `/${teacherBaseRoute}/${teacherRoutes.activity.to}`;

const activityListLink = {
  to: teacherActivityBaseRoute,
  label: 'Activity List',
  icons: [{ name: 'game-controller' }] as GroupLink['icons'],
};

const createActivityLink = {
  to: `${teacherActivityBaseRoute}/${teacherRoutes.activity.createTo}`,
  label: 'Create Activity',
  icons: [
    { name: 'plus', size: 16 },
    { name: 'game-controller' },
  ] as GroupLink['icons'],
};

export const teacherActivityRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Activities',
    links: [createActivityLink],
  },
  single: {
    title: 'Activity Details',
    links: [activityListLink],
  },
  create: {
    title: 'Create an Activity',
    links: [activityListLink],
  },
  edit: {
    title: 'Edit Activity',
    links: [activityListLink],
  },
  preview: { disabledSceneWrapper: true },
};
