import {
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from 'react-router-dom';

import { UserRole } from '#/user/models/user.model';
import { coreRouteHandle } from '#/core/core-route-handle';
import { CorePageNotFound } from '#/core/components/core-page-not-found.component';
import { CoreStaticLayout } from '#/core/components/core-static-layout.component';
import { CoreLayout } from '#/core/components/core-layout.component';
import { AuthProtectedRoute } from '#/auth/components/auth-protected-route.component';

import { HomePage } from '#/static/pages/home.page';
import { AboutPage } from '#/static/pages/about.page';
import { UserRegisterPage } from '#/user/pages/user-register.page';
import { UserRegisterEmailConfirmPage } from '#/user/pages/user-register-email-confirm.page';
import { UserRegisterEmailConfirmLastStepPage } from '#/user/pages/user-register-email-confirm-last-step.page';

import { staticRoutes } from './static-routes';
import { superAdminBaseRoute, superAdminRoutes } from './super-admin-routes';
import { teacherBaseRoute, teacherRoutes } from './teacher-routes';
import { studentBaseRoute, studentRoutes } from './student-routes';

const rootRoutes = createRoutesFromElements(
  <>
    <Route path='/' element={<CoreStaticLayout />}>
      <Route index element={<HomePage />} />
      <Route path={staticRoutes.about.to} element={<AboutPage />} />
      <Route
        path={staticRoutes.training.to}
        element={
          // TODO training page
          <div className='hidden'>TRAINING PAGE</div>
        }
      />
      <Route path={staticRoutes.userRegister.to} element={<Outlet />}>
        <Route index element={<UserRegisterPage />} />
        <Route path={staticRoutes.userRegister.confirm.to} element={<Outlet />}>
          <Route index element={<UserRegisterEmailConfirmPage />} />
          <Route
            path={staticRoutes.userRegister.confirm.lastStepTo}
            element={<UserRegisterEmailConfirmLastStepPage />}
          />
        </Route>
      </Route>
      <Route
        path='*'
        element={
          <CorePageNotFound className='!h-screen' linkLabel='Return to home' />
        }
      />
    </Route>
    {/* SUPER ADMIN */}
    <Route
      path={superAdminBaseRoute}
      element={
        <AuthProtectedRoute roles={[UserRole.SuperAdmin]}>
          <CoreLayout />
        </AuthProtectedRoute>
      }
    >
      <Route
        index
        lazy={() => import('#/dashboard/pages/super-admin-dashboard.page')}
      />
      {/* SUPER ADMIN CURRENT USER */}
      <Route path={superAdminRoutes.account.to} element={<Outlet />}>
        <Route
          index
          lazy={() =>
            import('#/user/pages/super-admin-current-user-single.page')
          }
        />
        {/* TODO account edit page */}
      </Route>
      {/* SUPER ADMIN ADMIN */}
      <Route path={superAdminRoutes.admin.to} element={<Outlet />}>
        <Route index lazy={() => import('#/user/pages/admin-user-list.page')} />
        <Route path=':id' element={<Outlet />}>
          <Route
            index
            lazy={() => import('#/user/pages/admin-user-single.page')}
          />
          <Route
            path={superAdminRoutes.admin.editTo}
            lazy={() => import('#/user/pages/admin-user-edit.page')}
          />
        </Route>
        <Route
          path={superAdminRoutes.admin.createTo}
          lazy={() => import('#/user/pages/admin-user-create.page')}
        />
      </Route>
      <Route
        path='*'
        element={<CorePageNotFound to={`/${superAdminBaseRoute}`} />}
        handle={coreRouteHandle.notFound}
      />
    </Route>
    {/* TODO admin */}

    {/* TEACHER */}
    <Route
      path={teacherBaseRoute}
      element={
        <AuthProtectedRoute roles={[UserRole.Teacher]}>
          <CoreLayout />
        </AuthProtectedRoute>
      }
    >
      <Route
        index
        lazy={() => import('#/dashboard/pages/teacher-dashboard.page')}
      />
      {/* TEACHER CURRENT USER */}
      <Route path={teacherRoutes.account.to} element={<Outlet />}>
        <Route
          index
          lazy={() => import('#/user/pages/teacher-current-user-single.page')}
        />
        <Route
          path={teacherRoutes.account.editTo}
          lazy={() => import('#/user/pages/teacher-current-user-edit.page')}
        />
      </Route>
      {/* TEACHER LESSONS */}
      <Route path={teacherRoutes.lesson.to} element={<Outlet />}>
        <Route
          index
          lazy={() => import('#/lesson/pages/teacher-lesson-list.page')}
        />
        <Route path=':slug' element={<Outlet />}>
          <Route
            index
            lazy={() => import('#/lesson/pages/teacher-lesson-single.page')}
          />
          <Route
            path={teacherRoutes.lesson.editTo}
            lazy={() => import('#/lesson/pages/lesson-edit.page')}
          />
          <Route
            path={teacherRoutes.lesson.previewTo}
            lazy={() => import('#/lesson/pages/lesson-preview-slug.page')}
          />
          <Route
            path={`${teacherRoutes.lesson.schedule.to}`}
            lazy={() =>
              import('#/lesson/pages/teacher-lesson-schedule-list.page')
            }
          >
            <Route
              path={`${teacherRoutes.lesson.schedule.createTo}`}
              lazy={() =>
                import('#/lesson/pages/teacher-lesson-schedule-create.page')
              }
            />
            <Route
              path={`${teacherRoutes.lesson.schedule.editTo}`}
              lazy={() =>
                import('#/lesson/pages/teacher-lesson-schedule-edit.page')
              }
            />
          </Route>
        </Route>
        <Route
          path={teacherRoutes.lesson.createTo}
          lazy={() => import('#/lesson/pages/lesson-create.page')}
        />
        <Route
          path={teacherRoutes.lesson.previewTo}
          lazy={() => import('#/lesson/pages/lesson-preview.page')}
        />
      </Route>
      {/* TEACHER EXAMS */}
      <Route path={teacherRoutes.exam.to} element={<Outlet />}>
        <Route
          index
          lazy={() => import('#/exam/pages/teacher-exam-list.page')}
        />
        <Route path=':slug' element={<Outlet />}>
          <Route
            index
            lazy={() => import('#/exam/pages/teacher-exam-single.page')}
          />
          <Route
            path={teacherRoutes.exam.editTo}
            lazy={() => import('#/exam/pages/exam-edit.page')}
          />
          <Route
            path={teacherRoutes.exam.previewTo}
            lazy={() => import('#/exam/pages/exam-preview-slug.page')}
          />
          <Route
            path={`${teacherRoutes.exam.schedule.to}`}
            lazy={() => import('#/exam/pages/teacher-exam-schedule-list.page')}
          >
            <Route
              path={`${teacherRoutes.exam.schedule.createTo}`}
              lazy={() =>
                import('#/exam/pages/teacher-exam-schedule-create.page')
              }
            />
            <Route
              path={`${teacherRoutes.exam.schedule.editTo}`}
              lazy={() =>
                import('#/exam/pages/teacher-exam-schedule-edit.page')
              }
            />
          </Route>
        </Route>
        <Route
          path={teacherRoutes.exam.createTo}
          lazy={() => import('#/exam/pages/exam-create.page')}
        />
        <Route
          path={teacherRoutes.exam.previewTo}
          lazy={() => import('#/exam/pages/exam-preview.page')}
        />
      </Route>
      {/* TEACHER ACTIVITIES */}
      <Route path={teacherRoutes.activity.to} element={<Outlet />}>
        <Route
          index
          lazy={() => import('#/activity/pages/teacher-activity-list.page')}
        />
        <Route path=':slug' element={<Outlet />}>
          <Route
            index
            lazy={() => import('#/activity/pages/teacher-activity-single.page')}
          />
          <Route
            path={teacherRoutes.activity.editTo}
            lazy={() => import('#/activity/pages/activity-edit.page')}
          />
          <Route
            path={teacherRoutes.activity.previewTo}
            lazy={() => import('#/activity/pages/activity-preview-slug.page')}
          />
        </Route>
        <Route
          path={teacherRoutes.activity.createTo}
          lazy={() => import('#/activity/pages/activity-create.page')}
        />
      </Route>
      {/* TEACHER PERFORMANCE */}
      <Route path={teacherRoutes.performance.to} element={<Outlet />}>
        <Route
          index
          loader={() => redirect(teacherRoutes.performance.studentTo)}
        />
        <Route path={teacherRoutes.performance.studentTo} element={<Outlet />}>
          <Route
            index
            lazy={() =>
              import('#/performance/pages/student-performance-list.page')
            }
          />
          <Route path=':publicId' element={<Outlet />}>
            <Route
              index
              lazy={() =>
                import(
                  '#/performance/pages/teacher-student-performance-single.page'
                )
              }
            />
            <Route
              path={teacherRoutes.performance.examTo}
              lazy={() =>
                import(
                  '#/performance/pages/teacher-student-exam-performance-list.page'
                )
              }
            />
            <Route
              path={teacherRoutes.performance.activityTo}
              lazy={() =>
                import(
                  '#/performance/pages/teacher-student-activity-performance-list.page'
                )
              }
            />
            <Route
              path={teacherRoutes.performance.lessonTo}
              lazy={() =>
                import(
                  '#/performance/pages/teacher-student-lesson-performance-list.page'
                )
              }
            />
          </Route>
        </Route>
      </Route>
      {/* TEACHER SCHEDULE */}
      <Route path={teacherRoutes.schedule.to} element={<Outlet />}>
        <Route
          index
          lazy={() => import('#/schedule/pages/teacher-schedule-calendar.page')}
        />
        <Route path={teacherRoutes.schedule.meeting.to} element={<Outlet />}>
          <Route
            index
            lazy={() =>
              import('#/schedule/pages/teacher-meeting-schedule-list.page')
            }
          />
          <Route
            path={teacherRoutes.schedule.meeting.createTo}
            lazy={() => import('#/schedule/pages/meeting-schedule-create.page')}
          />
          <Route path=':id' element={<Outlet />}>
            <Route
              index
              lazy={() =>
                import('#/schedule/pages/teacher-meeting-schedule-single.page')
              }
            />
            <Route
              path={teacherRoutes.schedule.meeting.editTo}
              lazy={() => import('#/schedule/pages/meeting-schedule-edit.page')}
            />
          </Route>
        </Route>
      </Route>
      {/* TEACHER STUDENT */}
      <Route path={teacherRoutes.student.to} element={<Outlet />}>
        <Route
          index
          lazy={() => import('#/user/pages/student-user-list.page')}
        />
        <Route path=':id' element={<Outlet />}>
          <Route
            index
            lazy={() => import('#/user/pages/student-user-single.page')}
          />
          <Route
            path={teacherRoutes.student.editTo}
            lazy={() => import('#/user/pages/student-user-edit.page')}
          />
        </Route>
        <Route
          path={teacherRoutes.student.createTo}
          lazy={() => import('#/user/pages/student-user-create.page')}
        />
      </Route>
      <Route
        path='*'
        element={<CorePageNotFound to={`/${teacherBaseRoute}`} />}
        handle={coreRouteHandle.notFound}
      />
    </Route>
    {/* STUDENT */}
    <Route
      path={studentBaseRoute}
      element={
        <AuthProtectedRoute roles={[UserRole.Student]}>
          <CoreLayout />
        </AuthProtectedRoute>
      }
    >
      <Route
        index
        lazy={() => import('#/dashboard/pages/student-dashboard.page')}
      />
      {/* STUDENT CURRENT USER */}
      <Route path={studentRoutes.account.to} element={<Outlet />}>
        <Route
          index
          lazy={() => import('#/user/pages/student-current-user-single.page')}
        />
        <Route
          path={studentRoutes.account.editTo}
          lazy={() => import('#/user/pages/student-current-user-edit.page')}
        />
        <Route
          path={studentRoutes.account.teacherAccountTo}
          lazy={() => import('#/user/pages/student-assigned-teacher.page')}
        />
      </Route>
      {/* STUDENT LESSONS */}
      <Route path={studentRoutes.lesson.to} element={<Outlet />}>
        <Route
          index
          lazy={() => import('#/lesson/pages/student-lesson-list.page')}
        />
        <Route
          path=':slug'
          lazy={() => import('#/lesson/pages/student-lesson-single.page')}
        />
      </Route>
      {/* STUDENT EXAMS */}
      <Route path={studentRoutes.exam.to} element={<Outlet />}>
        <Route
          index
          lazy={() => import('#/exam/pages/student-exam-list.page')}
        />
        <Route
          path=':slug'
          lazy={() => import('#/exam/pages/student-exam-single.page')}
        />
      </Route>
      {/* STUDENT ACTIVITIES */}
      <Route path={studentRoutes.activity.to} element={<Outlet />}>
        <Route
          index
          lazy={() => import('#/activity/pages/student-activity-list.page')}
        />
        <Route
          path=':slug'
          lazy={() => import('#/activity/pages/student-activity-single.page')}
        />
      </Route>
      {/* STUDENT PERFORMANCE */}
      <Route path={studentRoutes.performance.to} element={<Outlet />}>
        <Route
          index
          lazy={() =>
            import('#/performance/pages/student-performance-single.page')
          }
        />
        <Route
          path={studentRoutes.performance.examTo}
          lazy={() =>
            import('#/performance/pages/student-exam-performance-list.page')
          }
        />
        <Route
          path={studentRoutes.performance.activityTo}
          lazy={() =>
            import('#/performance/pages/student-activity-performance-list.page')
          }
        />
        <Route
          path={studentRoutes.performance.lessonTo}
          lazy={() =>
            import('#/performance/pages/student-lesson-performance-list.page')
          }
        />
      </Route>
      {/* STUDENT SCHEDULE */}
      <Route path={studentRoutes.schedule.to} element={<Outlet />}>
        <Route
          index
          lazy={() => import('#/schedule/pages/student-schedule-calendar.page')}
        />
        <Route path={studentRoutes.schedule.meeting.to} element={<Outlet />}>
          <Route
            index
            lazy={() =>
              import('#/schedule/pages/student-meeting-schedule-list.page')
            }
          />
          <Route path=':id' element={<Outlet />}>
            <Route
              index
              lazy={() =>
                import('#/schedule/pages/student-meeting-schedule-single.page')
              }
            />
          </Route>
        </Route>
      </Route>
      {/* STUDENT HELP */}
      <Route
        path={studentRoutes.help.to}
        lazy={() => import('#/help/pages/student-help.page')}
      />
      <Route
        path='*'
        element={<CorePageNotFound to={`/${studentBaseRoute}`} />}
        handle={coreRouteHandle.notFound}
      />
    </Route>
  </>,
);

export const router = createBrowserRouter(rootRoutes);
