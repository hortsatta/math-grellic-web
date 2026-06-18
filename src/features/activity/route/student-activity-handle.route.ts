import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import type { SceneRouteHandle } from '#/base/models/base.model';

export const studentActivityBaseRoute = `/${studentBaseRoute}/${studentRoutes.activity.to}`;

export const studentActivityRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Activities',
  },
  single: { disabledSceneWrapper: true },
};
