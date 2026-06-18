import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';

import type { SceneRouteHandle } from '#/base/models/base.model';

export const teacherEnrollmentBaseRoute = `/${teacherBaseRoute}/${teacherRoutes.enrollment.to}`;
export const studentEnrollmentBaseRoute = `/${studentBaseRoute}/${studentRoutes.enrollment.to}`;

export const schoolYearEnrollmentHandle: SceneRouteHandle = {
  title: 'Enrollment',
  toolbarHidden: true,
};
