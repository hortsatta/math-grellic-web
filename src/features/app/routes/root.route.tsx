import { Suspense, lazy } from 'react';
import {
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { RecordStatus } from '#/core/models/core.model';
import { UserRole } from '#/user/models/user.model';
import {
  getAdminUserByIdLoader,
  getPaginatedAdminUserLoader,
} from '#/user/route/admin-user-loader';
import {
  getAdminPaginatedSchoolYearsLoader,
  getAdminSchoolYearBySlugLoader,
} from '#/school-year/route/admin-school-year-loader.route';
import {
  getTeacherLessonBySlugLoader,
  getTeacherPaginatedLessonsLoader,
} from '#/lesson/route/teacher-lesson-loader.route';
import {
  getTeacherExamBySlugLoader,
  getTeacherPaginatedExamsLoader,
} from '#/exam/route/teacher-exam-loader.route';
import {
  getTeacherPaginatedStudentPerformancesLoader,
  getTeacherStudentActivitiesByPublicIdAndCurrentTeacherUserLoader,
  getTeacherStudentExamsByPublicIdAndCurrentTeacherUserLoader,
  getTeacherStudentLessonsByPublicIdAndCurrentTeacherUserLoader,
  getTeacherStudentPerformanceByPublicIdLoader,
} from '#/performance/route/teacher-performance-loader.route';
import {
  getTeacherActivityBySlugLoader,
  getTeacherPaginatedActivitiesLoader,
} from '#/activity/route/teacher-activity-loader.route';
import {
  getTeacherMeetingScheduleByIdLoader,
  getTeacherPaginatedMeetingSchedulesLoader,
  getTeacherSchedulesByDateRangeLoader,
} from '#/schedule/route/teacher-schedule-loader.route';
import {
  getPaginatedStudentUserLoader,
  getStudentUserByIdLoader,
} from '#/user/route/student-user-loader';
import {
  getStudentLessonBySlugLoader,
  getStudentLessonsLoader,
} from '#/lesson/route/student-lesson-loader.route';
import { studentExamRouteHandle } from '#/exam/route/student-exam-handle.route';
import {
  getStudentExamBySlugLoader,
  getStudentExamsLoader,
} from '#/exam/route/student-exam-loader.route';
import { studentActivityRouteHandle } from '#/activity/route/student-activity-handle.route';
import {
  getStudentActivitiesLoader,
  getStudentActivityBySlugLoader,
} from '#/activity/route/student-activity-loader.route';
import {
  getStudentActivitiesByCurrentStudentUserLoader,
  getStudentExamsByCurrentStudentUserLoader,
  getStudentLessonsByCurrentStudentUserLoader,
  getStudentPerformanceByCurrentStudentUserLoader,
} from '#/performance/route/student-performance-loader';
import {
  getStudentMeetingScheduleByIdLoader,
  getStudentMeetingSchedulesLoader,
  getStudentSchedulesByDateRangeLoader,
} from '#/schedule/route/student-schedule-loader.route';
import { getStudentAssignedTeacherLoader } from '#/user/route/student-assigned-teacher-loader.route';
import { coreRouteHandle } from '#/core/core-route-handle';
import { currentUserRouteHandle } from '#/user/route/current-user-handle';
import { adminUserRouteHandle } from '#/user/route/admin-user-handle';
import { dashboardRouteHandle } from '#/dashboard/route/dashboard-handle.route';
import { schoolYearEnrollmentHandle } from '#/school-year/route/school-year-enrollment-handle.route';
import { adminSchoolYearRouteHandle } from '#/school-year/route/admin-school-year-handle.route';
import { teacherLessonRouteHandle } from '#/lesson/route/teacher-lesson-handle.route';
import { teacherExamRouteHandle } from '#/exam/route/teacher-exam-handle.route';
import { teacherActivityRouteHandle } from '#/activity/route/teacher-activity-handle.route';
import { teacherStudentPerformanceRouteHandle } from '#/performance/route/teacher-performance-handle.route';
import { teacherScheduleRouteHandle } from '#/schedule/route/teacher-schedule-handle.route';
import { studentUserRouteHandle } from '#/user/route/student-user-handle';
import { studentLessonRouteHandle } from '#/lesson/route/student-lesson-handle.route';
import { studentPerformanceRouteHandle } from '#/performance/route/student-performance-handle.route';
import { studentScheduleRouteHandle } from '#/schedule/route/student-schedule-handle.route';
import { studentHelpRouteHandle } from '#/help/route/student-help-handle.route';
import { CorePageNotFound } from '#/core/components/core-page-not-found.component';
import { CoreStaticLayout } from '#/core/components/core-static-layout.component';
import { CoreLayout } from '#/core/components/core-layout.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { AuthProtectedRoute } from '#/auth/components/auth-protected-route.component';
import { SchoolYearEnrollmentProtectedRoute } from '#/school-year/components/school-year-enrollment-protected-route.component';

import { HomePage } from '#/static/pages/home.page';
import { AboutPage } from '#/static/pages/about.page';
import { UserRegisterPage } from '#/user/pages/user-register.page';
import { UserRegisterEmailConfirmPage } from '#/user/pages/user-register-email-confirm.page';
import { UserRegisterEmailConfirmLastStepPage } from '#/user/pages/user-register-email-confirm-last-step.page';

import { staticRoutes } from './static-routes';
import { superAdminBaseRoute, superAdminRoutes } from './super-admin-routes';
import { adminBaseRoute, adminRoutes } from './admin-routes';
import { teacherBaseRoute, teacherRoutes } from './teacher-routes';
import { studentBaseRoute, studentRoutes } from './student-routes';

import type { ComponentType } from 'react';

function withSuspense(
  lazyImport: () => Promise<{ default: ComponentType<any> }>,
  fallback = null,
) {
  const LazyComponent = lazy(lazyImport);
  return (
    <Suspense
      fallback={fallback || <BasePageSpinner className='z-40' absolute />}
    >
      <LazyComponent />
    </Suspense>
  );
}

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
        element={withSuspense(
          () => import('#/dashboard/pages/super-admin-dashboard.page'),
        )}
        handle={dashboardRouteHandle}
      />
      {/* SUPER ADMIN CURRENT USER */}
      <Route path={superAdminRoutes.account.to} element={<Outlet />}>
        <Route
          index
          element={withSuspense(
            () => import('#/user/pages/super-admin-current-user-single.page'),
          )}
          handle={currentUserRouteHandle.single}
        />
        {/* TODO account edit page */}
      </Route>
      {/* SUPER ADMIN ADMIN */}
      <Route path={superAdminRoutes.admin.to} element={<Outlet />}>
        <Route
          index
          element={withSuspense(
            () => import('#/user/pages/admin-user-list.page'),
          )}
          handle={adminUserRouteHandle.list}
          loader={getPaginatedAdminUserLoader(queryClient)}
        />
        <Route path=':id' element={<Outlet />}>
          <Route
            index
            element={withSuspense(
              () => import('#/user/pages/admin-user-single.page'),
            )}
            handle={adminUserRouteHandle.single}
            loader={getAdminUserByIdLoader(queryClient)}
          />
          <Route
            path={superAdminRoutes.admin.editTo}
            element={withSuspense(
              () => import('#/user/pages/admin-user-edit.page'),
            )}
            handle={adminUserRouteHandle.edit}
            loader={getAdminUserByIdLoader(queryClient)}
          />
        </Route>
        <Route
          path={superAdminRoutes.admin.createTo}
          element={withSuspense(
            () => import('#/user/pages/admin-user-create.page'),
          )}
          handle={adminUserRouteHandle.create}
        />
      </Route>
      <Route
        path='*'
        element={<CorePageNotFound to={`/${superAdminBaseRoute}`} />}
        handle={coreRouteHandle.notFound}
      />
    </Route>
    {/* ADMIN */}
    <Route
      path={adminBaseRoute}
      element={
        <AuthProtectedRoute roles={[UserRole.Admin]}>
          <CoreLayout />
        </AuthProtectedRoute>
      }
    >
      <Route
        index
        element={withSuspense(
          () => import('#/dashboard/pages/admin-dashboard.page'),
        )}
        handle={dashboardRouteHandle}
      />
      {/* ADMIN CURRENT USER */}
      <Route path={adminRoutes.account.to} element={<Outlet />}>
        <Route
          index
          element={withSuspense(
            () => import('#/user/pages/admin-current-user-single.page'),
          )}
          handle={currentUserRouteHandle.single}
        />
        <Route
          path={adminRoutes.account.editTo}
          element={withSuspense(
            () => import('#/user/pages/admin-current-user-edit.page'),
          )}
          handle={currentUserRouteHandle.edit}
        />
      </Route>
      {/* SCHOOL YEAR */}
      <Route path={adminRoutes.schoolYear.to} element={<Outlet />}>
        <Route
          index
          element={withSuspense(
            () => import('#/school-year/pages/school-year-list.page'),
          )}
          handle={adminSchoolYearRouteHandle.list}
          loader={getAdminPaginatedSchoolYearsLoader(queryClient)}
        />
        <Route path=':slug' element={<Outlet />}>
          <Route
            index
            element={withSuspense(
              () => import('#/school-year/pages/school-year-single.page'),
            )}
            handle={adminSchoolYearRouteHandle.single}
            loader={getAdminSchoolYearBySlugLoader(queryClient)}
          />
          <Route
            path={adminRoutes.schoolYear.editTo}
            element={withSuspense(
              () => import('#/school-year/pages/school-year-edit.page'),
            )}
            handle={adminSchoolYearRouteHandle.edit}
            loader={getAdminSchoolYearBySlugLoader(queryClient)}
          />
        </Route>
        <Route
          path={adminRoutes.schoolYear.createTo}
          element={withSuspense(
            () => import('#/school-year/pages/school-year-create.page'),
          )}
          handle={adminSchoolYearRouteHandle.create}
        />
      </Route>

      {/* ADMIN TEACHER */}
      {/* <Route path={teacherRoutes.student.to} element={<Outlet />}>
        <Route
          index
          element={withSuspense(
            () => import('#/user/pages/student-user-list.page'),
          )}
          handle={studentUserRouteHandle.list}
          loader={getPaginatedStudentUserLoader(queryClient)}
        />
        <Route path=':id' element={<Outlet />}>
          <Route
            index
            element={withSuspense(
              () => import('#/user/pages/student-user-single.page'),
            )}
            handle={studentUserRouteHandle.single}
            loader={getStudentUserByIdLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.student.editTo}
            element={withSuspense(
              () => import('#/user/pages/student-user-edit.page'),
            )}
            handle={studentUserRouteHandle.edit}
            loader={getStudentUserByIdLoader(queryClient)}
          />
        </Route>
        <Route
          path={teacherRoutes.student.createTo}
          element={withSuspense(
            () => import('#/user/pages/student-user-create.page'),
          )}
          handle={studentUserRouteHandle.create}
        />
      </Route> */}
      <Route
        path='*'
        element={<CorePageNotFound to={`/${adminBaseRoute}`} />}
        handle={coreRouteHandle.notFound}
      />
    </Route>
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
        element={
          <SchoolYearEnrollmentProtectedRoute
            redirectTo={`/${teacherBaseRoute}/${teacherRoutes.enrollment.to}`}
          >
            <Outlet />
          </SchoolYearEnrollmentProtectedRoute>
        }
      >
        <Route
          index
          element={withSuspense(
            () => import('#/dashboard/pages/teacher-dashboard.page'),
          )}
          handle={dashboardRouteHandle}
        />
        {/* TEACHER LESSONS */}
        <Route path={teacherRoutes.lesson.to} element={<Outlet />}>
          <Route
            index
            element={withSuspense(
              () => import('#/lesson/pages/teacher-lesson-list.page'),
            )}
            handle={teacherLessonRouteHandle.list}
            loader={getTeacherPaginatedLessonsLoader(queryClient)}
          />
          <Route path=':slug' element={<Outlet />}>
            <Route
              index
              element={withSuspense(
                () => import('#/lesson/pages/teacher-lesson-single.page'),
              )}
              handle={teacherLessonRouteHandle.single}
              loader={getTeacherLessonBySlugLoader(queryClient)}
            />
            <Route
              path={teacherRoutes.lesson.editTo}
              element={withSuspense(
                () => import('#/lesson/pages/lesson-edit.page'),
              )}
              handle={teacherLessonRouteHandle.edit}
              loader={getTeacherLessonBySlugLoader(queryClient)}
            />
            <Route
              path={teacherRoutes.lesson.previewTo}
              element={withSuspense(
                () => import('#/lesson/pages/lesson-preview-slug.page'),
              )}
              handle={teacherLessonRouteHandle.preview}
              loader={getTeacherLessonBySlugLoader(queryClient, {
                exclude: 'schedules',
              })}
            />
            <Route
              path={`${teacherRoutes.lesson.schedule.to}`}
              element={withSuspense(
                () =>
                  import('#/lesson/pages/teacher-lesson-schedule-list.page'),
              )}
              handle={teacherLessonRouteHandle.schedule}
              loader={getTeacherLessonBySlugLoader(queryClient, {
                status: RecordStatus.Published,
              })}
            >
              <Route
                path={`${teacherRoutes.lesson.schedule.createTo}`}
                element={withSuspense(
                  () =>
                    import(
                      '#/lesson/pages/teacher-lesson-schedule-create.page'
                    ),
                )}
                handle={teacherLessonRouteHandle.schedule}
              />
              <Route
                path={`${teacherRoutes.lesson.schedule.editTo}`}
                element={withSuspense(
                  () =>
                    import('#/lesson/pages/teacher-lesson-schedule-edit.page'),
                )}
                handle={teacherLessonRouteHandle.schedule}
              />
            </Route>
          </Route>
          <Route
            path={teacherRoutes.lesson.createTo}
            element={withSuspense(
              () => import('#/lesson/pages/lesson-create.page'),
            )}
            handle={teacherLessonRouteHandle.create}
          />
          <Route
            path={teacherRoutes.lesson.previewTo}
            element={withSuspense(
              () => import('#/lesson/pages/lesson-preview.page'),
            )}
            handle={teacherLessonRouteHandle.preview}
          />
        </Route>
        {/* TEACHER EXAMS */}
        <Route path={teacherRoutes.exam.to} element={<Outlet />}>
          <Route
            index
            element={withSuspense(
              () => import('#/exam/pages/teacher-exam-list.page'),
            )}
            handle={teacherExamRouteHandle.list}
            loader={getTeacherPaginatedExamsLoader(queryClient)}
          />
          <Route path=':slug' element={<Outlet />}>
            <Route
              index
              element={withSuspense(
                () => import('#/exam/pages/teacher-exam-single.page'),
              )}
              handle={teacherExamRouteHandle.single}
              loader={getTeacherExamBySlugLoader(queryClient)}
            />
            <Route
              path={teacherRoutes.exam.editTo}
              element={withSuspense(
                () => import('#/exam/pages/exam-edit.page'),
              )}
              handle={teacherExamRouteHandle.edit}
              loader={getTeacherExamBySlugLoader(queryClient)}
            />
            <Route
              path={teacherRoutes.exam.previewTo}
              element={withSuspense(
                () => import('#/exam/pages/exam-preview-slug.page'),
              )}
              handle={teacherExamRouteHandle.preview}
              loader={getTeacherExamBySlugLoader(queryClient, {
                exclude: 'schedules',
              })}
            />
            <Route
              path={`${teacherRoutes.exam.schedule.to}`}
              element={withSuspense(
                () => import('#/exam/pages/teacher-exam-schedule-list.page'),
              )}
              handle={teacherExamRouteHandle.schedule}
              loader={getTeacherExamBySlugLoader(queryClient, {
                status: RecordStatus.Published,
              })}
            >
              <Route
                path={`${teacherRoutes.exam.schedule.createTo}`}
                element={withSuspense(
                  () =>
                    import('#/exam/pages/teacher-exam-schedule-create.page'),
                )}
                handle={teacherLessonRouteHandle.schedule}
              />
              <Route
                path={`${teacherRoutes.exam.schedule.editTo}`}
                element={withSuspense(
                  () => import('#/exam/pages/teacher-exam-schedule-edit.page'),
                )}
                handle={teacherExamRouteHandle.schedule}
              />
            </Route>
          </Route>
          <Route
            path={teacherRoutes.exam.createTo}
            element={withSuspense(
              () => import('#/exam/pages/exam-create.page'),
            )}
            handle={teacherExamRouteHandle.create}
          />
          <Route
            path={teacherRoutes.exam.previewTo}
            element={withSuspense(
              () => import('#/exam/pages/exam-preview.page'),
            )}
            handle={teacherExamRouteHandle.preview}
          />
        </Route>
        {/* TEACHER ACTIVITIES */}
        <Route path={teacherRoutes.activity.to} element={<Outlet />}>
          <Route
            index
            element={withSuspense(
              () => import('#/activity/pages/teacher-activity-list.page'),
            )}
            handle={teacherActivityRouteHandle.list}
            loader={getTeacherPaginatedActivitiesLoader(queryClient)}
          />
          <Route path=':slug' element={<Outlet />}>
            <Route
              index
              element={withSuspense(
                () => import('#/activity/pages/teacher-activity-single.page'),
              )}
              handle={teacherActivityRouteHandle.single}
              loader={getTeacherActivityBySlugLoader(queryClient)}
            />
            <Route
              path={teacherRoutes.activity.editTo}
              element={withSuspense(
                () => import('#/activity/pages/activity-edit.page'),
              )}
              handle={teacherActivityRouteHandle.edit}
              loader={getTeacherActivityBySlugLoader(queryClient)}
            />
            <Route
              path={teacherRoutes.activity.previewTo}
              element={withSuspense(
                () => import('#/activity/pages/activity-preview-slug.page'),
              )}
              handle={teacherActivityRouteHandle.preview}
              loader={getTeacherActivityBySlugLoader(queryClient)}
            />
          </Route>
          <Route
            path={teacherRoutes.activity.createTo}
            element={withSuspense(
              () => import('#/activity/pages/activity-create.page'),
            )}
            handle={teacherActivityRouteHandle.create}
          />
        </Route>
        {/* TEACHER PERFORMANCE */}
        <Route path={teacherRoutes.performance.to} element={<Outlet />}>
          <Route
            index
            loader={() => redirect(teacherRoutes.performance.studentTo)}
          />
          <Route
            path={teacherRoutes.performance.studentTo}
            element={<Outlet />}
          >
            <Route
              index
              element={withSuspense(
                () =>
                  import('#/performance/pages/student-performance-list.page'),
              )}
              handle={teacherStudentPerformanceRouteHandle.list}
              loader={getTeacherPaginatedStudentPerformancesLoader(queryClient)}
            />
            <Route path=':publicId' element={<Outlet />}>
              <Route
                index
                element={withSuspense(
                  () =>
                    import(
                      '#/performance/pages/teacher-student-performance-single.page'
                    ),
                )}
                handle={teacherStudentPerformanceRouteHandle.single}
                loader={getTeacherStudentPerformanceByPublicIdLoader(
                  queryClient,
                )}
              />
              <Route
                path={teacherRoutes.performance.examTo}
                element={withSuspense(
                  () =>
                    import(
                      '#/performance/pages/teacher-student-exam-performance-list.page'
                    ),
                )}
                handle={teacherStudentPerformanceRouteHandle.exams}
                loader={getTeacherStudentExamsByPublicIdAndCurrentTeacherUserLoader(
                  queryClient,
                )}
              />
              <Route
                path={teacherRoutes.performance.activityTo}
                element={withSuspense(
                  () =>
                    import(
                      '#/performance/pages/teacher-student-activity-performance-list.page'
                    ),
                )}
                handle={teacherStudentPerformanceRouteHandle.activities}
                loader={getTeacherStudentActivitiesByPublicIdAndCurrentTeacherUserLoader(
                  queryClient,
                )}
              />
              <Route
                path={teacherRoutes.performance.lessonTo}
                element={withSuspense(
                  () =>
                    import(
                      '#/performance/pages/teacher-student-lesson-performance-list.page'
                    ),
                )}
                handle={teacherStudentPerformanceRouteHandle.lessons}
                loader={getTeacherStudentLessonsByPublicIdAndCurrentTeacherUserLoader(
                  queryClient,
                )}
              />
            </Route>
          </Route>
        </Route>
        {/* TEACHER SCHEDULE */}
        <Route path={teacherRoutes.schedule.to} element={<Outlet />}>
          <Route
            index
            element={withSuspense(
              () => import('#/schedule/pages/teacher-schedule-calendar.page'),
            )}
            handle={teacherScheduleRouteHandle.calendar}
            loader={getTeacherSchedulesByDateRangeLoader(queryClient)}
          />
          <Route path={teacherRoutes.schedule.meeting.to} element={<Outlet />}>
            <Route
              index
              element={withSuspense(
                () =>
                  import('#/schedule/pages/teacher-meeting-schedule-list.page'),
              )}
              handle={teacherScheduleRouteHandle.list}
              loader={getTeacherPaginatedMeetingSchedulesLoader(queryClient)}
            />
            <Route
              path={teacherRoutes.schedule.meeting.createTo}
              element={withSuspense(
                () => import('#/schedule/pages/meeting-schedule-create.page'),
              )}
              handle={teacherScheduleRouteHandle.create}
            />
            <Route path=':id' element={<Outlet />}>
              <Route
                index
                element={withSuspense(
                  () =>
                    import(
                      '#/schedule/pages/teacher-meeting-schedule-single.page'
                    ),
                )}
                handle={teacherScheduleRouteHandle.single}
                loader={getTeacherMeetingScheduleByIdLoader(queryClient)}
              />
              <Route
                path={teacherRoutes.schedule.meeting.editTo}
                element={withSuspense(
                  () => import('#/schedule/pages/meeting-schedule-edit.page'),
                )}
                handle={teacherScheduleRouteHandle.edit}
                loader={getTeacherMeetingScheduleByIdLoader(queryClient)}
              />
            </Route>
          </Route>
        </Route>
        {/* TEACHER STUDENT */}
        <Route path={teacherRoutes.student.to} element={<Outlet />}>
          <Route
            index
            element={withSuspense(
              () => import('#/user/pages/student-user-list.page'),
            )}
            handle={studentUserRouteHandle.list}
            loader={getPaginatedStudentUserLoader(queryClient)}
          />
          <Route path=':id' element={<Outlet />}>
            <Route
              index
              element={withSuspense(
                () => import('#/user/pages/student-user-single.page'),
              )}
              handle={studentUserRouteHandle.single}
              loader={getStudentUserByIdLoader(queryClient)}
            />
            <Route
              path={teacherRoutes.student.editTo}
              element={withSuspense(
                () => import('#/user/pages/student-user-edit.page'),
              )}
              handle={studentUserRouteHandle.edit}
              loader={getStudentUserByIdLoader(queryClient)}
            />
          </Route>
          <Route
            path={teacherRoutes.student.createTo}
            element={withSuspense(
              () => import('#/user/pages/student-user-create.page'),
            )}
            handle={studentUserRouteHandle.create}
          />
        </Route>
      </Route>
      {/* TEACHER ENROLLMENT */}
      <Route
        path={teacherRoutes.enrollment.to}
        element={withSuspense(
          () =>
            import('#/school-year/pages/teacher-school-year-enrollment.page'),
        )}
        handle={schoolYearEnrollmentHandle}
      />
      {/* TEACHER CURRENT USER */}
      <Route path={teacherRoutes.account.to} element={<Outlet />}>
        <Route
          index
          element={withSuspense(
            () => import('#/user/pages/teacher-current-user-single.page'),
          )}
          handle={currentUserRouteHandle.single}
        />
        <Route
          path={teacherRoutes.account.editTo}
          element={withSuspense(
            () => import('#/user/pages/teacher-current-user-edit.page'),
          )}
          handle={currentUserRouteHandle.edit}
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
        element={
          <SchoolYearEnrollmentProtectedRoute
            redirectTo={`/${teacherBaseRoute}/${studentRoutes.enrollment.to}`}
          >
            <Outlet />
          </SchoolYearEnrollmentProtectedRoute>
        }
      >
        <Route
          index
          element={withSuspense(
            () => import('#/dashboard/pages/student-dashboard.page'),
          )}
          handle={dashboardRouteHandle}
        />
        {/* STUDENT LESSONS */}
        <Route path={studentRoutes.lesson.to} element={<Outlet />}>
          <Route
            index
            element={withSuspense(
              () => import('#/lesson/pages/student-lesson-list.page'),
            )}
            handle={studentLessonRouteHandle.list}
            loader={getStudentLessonsLoader(queryClient)}
          />
          <Route
            path=':slug'
            element={withSuspense(
              () => import('#/lesson/pages/student-lesson-single.page'),
            )}
            handle={studentLessonRouteHandle.single}
            loader={getStudentLessonBySlugLoader(queryClient)}
          />
        </Route>
        {/* STUDENT EXAMS */}
        <Route path={studentRoutes.exam.to} element={<Outlet />}>
          <Route
            index
            element={withSuspense(
              () => import('#/exam/pages/student-exam-list.page'),
            )}
            handle={studentExamRouteHandle.list}
            loader={getStudentExamsLoader(queryClient)}
          />
          <Route
            path=':slug'
            element={withSuspense(
              () => import('#/exam/pages/student-exam-single.page'),
            )}
            handle={studentExamRouteHandle.single}
            loader={getStudentExamBySlugLoader(queryClient)}
          />
        </Route>
        {/* STUDENT ACTIVITIES */}
        <Route path={studentRoutes.activity.to} element={<Outlet />}>
          <Route
            index
            element={withSuspense(
              () => import('#/activity/pages/student-activity-list.page'),
            )}
            handle={studentActivityRouteHandle.list}
            loader={getStudentActivitiesLoader(queryClient)}
          />
          <Route
            path=':slug'
            element={withSuspense(
              () => import('#/activity/pages/student-activity-single.page'),
            )}
            handle={studentActivityRouteHandle.single}
            loader={getStudentActivityBySlugLoader(queryClient)}
          />
        </Route>
        {/* STUDENT PERFORMANCE */}
        <Route path={studentRoutes.performance.to} element={<Outlet />}>
          <Route
            index
            element={withSuspense(
              () =>
                import('#/performance/pages/student-performance-single.page'),
            )}
            handle={studentPerformanceRouteHandle.single}
            loader={getStudentPerformanceByCurrentStudentUserLoader(
              queryClient,
            )}
          />
          <Route
            path={studentRoutes.performance.examTo}
            element={withSuspense(
              () =>
                import(
                  '#/performance/pages/student-exam-performance-list.page'
                ),
            )}
            handle={studentPerformanceRouteHandle.exams}
            loader={getStudentExamsByCurrentStudentUserLoader(queryClient)}
          />
          <Route
            path={studentRoutes.performance.activityTo}
            element={withSuspense(
              () =>
                import(
                  '#/performance/pages/student-activity-performance-list.page'
                ),
            )}
            handle={studentPerformanceRouteHandle.activities}
            loader={getStudentActivitiesByCurrentStudentUserLoader(queryClient)}
          />
          <Route
            path={studentRoutes.performance.lessonTo}
            element={withSuspense(
              () =>
                import(
                  '#/performance/pages/student-lesson-performance-list.page'
                ),
            )}
            handle={studentPerformanceRouteHandle.lessons}
            loader={getStudentLessonsByCurrentStudentUserLoader(queryClient)}
          />
        </Route>
        {/* STUDENT SCHEDULE */}
        <Route path={studentRoutes.schedule.to} element={<Outlet />}>
          <Route
            index
            element={withSuspense(
              () => import('#/schedule/pages/student-schedule-calendar.page'),
            )}
            handle={studentScheduleRouteHandle.calendar}
            loader={getStudentSchedulesByDateRangeLoader(queryClient)}
          />
          <Route path={studentRoutes.schedule.meeting.to} element={<Outlet />}>
            <Route
              index
              element={withSuspense(
                () =>
                  import('#/schedule/pages/student-meeting-schedule-list.page'),
              )}
              handle={studentScheduleRouteHandle.list}
              loader={getStudentMeetingSchedulesLoader(queryClient)}
            />
            <Route path=':id' element={<Outlet />}>
              <Route
                index
                element={withSuspense(
                  () =>
                    import(
                      '#/schedule/pages/student-meeting-schedule-single.page'
                    ),
                )}
                handle={studentScheduleRouteHandle.single}
                loader={getStudentMeetingScheduleByIdLoader(queryClient)}
              />
            </Route>
          </Route>
        </Route>
        {/* STUDENT HELP */}
        <Route
          path={studentRoutes.help.to}
          element={withSuspense(() => import('#/help/pages/student-help.page'))}
          handle={studentHelpRouteHandle}
          loader={getStudentAssignedTeacherLoader(queryClient)}
        />
      </Route>
      {/* STUDENT ENROLLMENT */}
      <Route path={studentRoutes.enrollment.to} element={<div>enroll</div>} />
      {/* STUDENT CURRENT USER */}
      <Route path={studentRoutes.account.to} element={<Outlet />}>
        <Route
          index
          element={withSuspense(
            () => import('#/user/pages/student-current-user-single.page'),
          )}
          handle={currentUserRouteHandle.single}
          loader={getStudentAssignedTeacherLoader(queryClient)}
        />
        <Route
          path={studentRoutes.account.editTo}
          element={withSuspense(
            () => import('#/user/pages/student-current-user-edit.page'),
          )}
          handle={currentUserRouteHandle.edit}
        />
        <Route
          path={studentRoutes.account.teacherAccountTo}
          element={withSuspense(
            () => import('#/user/pages/student-assigned-teacher.page'),
          )}
          handle={currentUserRouteHandle.assignedTeacher}
          loader={getStudentAssignedTeacherLoader(queryClient)}
        />
      </Route>
      <Route
        path='*'
        element={<CorePageNotFound to={`/${studentBaseRoute}`} />}
        handle={coreRouteHandle.notFound}
      />
    </Route>
  </>,
);

export const router = createBrowserRouter(rootRoutes);
