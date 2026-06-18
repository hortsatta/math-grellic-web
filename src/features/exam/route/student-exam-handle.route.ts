import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import type { SceneRouteHandle } from '#/base/models/base.model';

export const studentExamBaseRoute = `/${studentBaseRoute}/${studentRoutes.exam.to}`;

export const studentExamRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Exams',
  },
  single: { disabledSceneWrapper: true },
};
