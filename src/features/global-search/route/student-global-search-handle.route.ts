import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import type { SceneRouteHandle } from '#/base/models/base.model';

export const studentSearchBaseRoute = `/${studentBaseRoute}/${studentRoutes.search.to}`;

export const studentSearchRouteHandle: { [key: string]: SceneRouteHandle } = {
  searchResults: {
    title: 'Search',
  },
};
