import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import type { SceneRouteHandle } from '#/base/models/base.model';

export const teacherSearchBaseRoute = `/${teacherBaseRoute}/${teacherRoutes.search.to}`;

export const teacherSearchRouteHandle: { [key: string]: SceneRouteHandle } = {
  searchResults: {
    title: 'Search',
  },
};
