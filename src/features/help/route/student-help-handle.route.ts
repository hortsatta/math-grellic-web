import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import type { SceneRouteHandle } from '#/base/models/base.model';

export const studentHelpBaseRoute = `/${studentBaseRoute}/${studentRoutes.help.to}`;

export const studentHelpRouteHandle: SceneRouteHandle = {
  title: 'Help & Support',
};
