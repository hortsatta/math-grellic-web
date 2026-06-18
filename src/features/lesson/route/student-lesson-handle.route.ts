import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import type { SceneRouteHandle } from '#/base/models/base.model';

export const studentLessonBaseRoute = `/${studentBaseRoute}/${studentRoutes.lesson.to}`;

export const studentLessonRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Lessons',
  },
  single: { disabledSceneWrapper: true },
};
