import cx from 'classix';

import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { SidebarMode } from '#/base/models/base.model';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useStudentPerformanceSingle } from '#/performance/hooks/use-student-performance-single.hook';
import { useStudentScheduleTodayList } from '#/schedule/hooks/use-student-schedule-today-list.hook';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { ScheduleDailyCardList } from '#/schedule/components/schedule-daily-card-list.component';
import { useStudentAnnouncementList } from '#/announcement/hooks/use-student-announcement-list.hook';
import { useStudentCurriculumSnippets } from '../hooks/use-student-curriculum-snippets.hook';
import { StudentDashboardUserSummary } from '../components/student-dashboard-user-summary.component';
import { StudentDashboardCurriculumTabList } from '../components/student-dashboard-curriculum-tab-list.component';
import { StudentDashboardAnnouncementList } from '../components/student-dashboard-announcement-list.component';
import { StudentDashboardHelpCard } from '../components/student-dashboard-help-card.component';
import { StudentDashboardSchoolYearSummary } from '../components/student-dashboard-school-year-summary.component';
import { StudentDashboardOverallProgressChart } from '../components/student-dashboard-overall-progress-chart.component';

const SCHEDULE_PATH = `/${studentBaseRoute}/${studentRoutes.schedule.to}`;

function StudentDashboardPage() {
  const user = useBoundStore((state) => state.user || null);
  const schoolYear = useBoundStore((state) => state.schoolYear || null);
  const syEnrollment = useBoundStore((state) => state.syEnrollment || null);
  const isRightSidebarExpanded = useBoundStore(
    (state) => state.rightSidebarMode == SidebarMode.Expanded,
  );

  const { loading: performanceLoading, student: studentPerformance } =
    useStudentPerformanceSingle();

  const {
    loading,
    latestLesson,
    upcomingLessonWithDuration,
    previousLessons,
    latestExam,
    previousExams,
    upcomingExamWithDuration,
    ongoingExamsWithDurations,
    activities,
    refresh,
  } = useStudentCurriculumSnippets();

  const { loading: todayScheduleLoading, schedules } =
    useStudentScheduleTodayList();

  const {
    loading: announcementListLoading,
    studentAnnouncements,
    refresh: refreshAnnouncements,
  } = useStudentAnnouncementList();

  return (
    <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
      <div className='mx-auto flex w-full max-w-[900px] flex-1 shrink-0 flex-col gap-5 self-stretch pb-8'>
        <div
          className={cx(
            'flex flex-col justify-stretch gap-5 md:flex-row',
            isRightSidebarExpanded && 'lg:flex-col xl:flex-row',
          )}
        >
          <StudentDashboardUserSummary
            className='min-h-[262px] min-w-0 1.5xl:min-w-[442px]'
            user={user}
            studentPerformance={studentPerformance}
            loading={!user || performanceLoading}
          />
          <StudentDashboardAnnouncementList
            className='min-h-[262px]'
            loading={announcementListLoading}
            studentAnnouncements={studentAnnouncements}
            onRefresh={refreshAnnouncements}
          />
        </div>
        <StudentDashboardCurriculumTabList
          latestLesson={latestLesson}
          upcomingLessonWithDuration={upcomingLessonWithDuration}
          previousLessons={previousLessons}
          latestExam={latestExam}
          previousExams={previousExams}
          upcomingExamWithDuration={upcomingExamWithDuration}
          ongoingExamsWithDurations={ongoingExamsWithDurations}
          activities={activities}
          loading={loading}
          refresh={refresh}
        />
        <div
          className={cx(
            'flex flex-col gap-5 md:flex-row',
            isRightSidebarExpanded && 'lg:flex-col xl:flex-row',
          )}
        >
          <BaseSurface className='!px-4 pb-3 -3xs:min-w-[438px]'>
            <h3 className='mb-2.5 text-lg leading-none'>Today's Schedule</h3>
            <ScheduleDailyCardList
              schedules={schedules}
              scheduleTo={SCHEDULE_PATH}
              scheduleEmptyLabel='No schedule for today'
              loading={todayScheduleLoading}
              isStudent
            />
          </BaseSurface>
          <StudentDashboardHelpCard
            isRightSidebarExpanded={isRightSidebarExpanded}
          />
        </div>
        <div className='bg-gradient sticky bottom-0 h-20 w-full bg-gradient-to-t from-backdrop from-60% to-transparent' />
      </div>
      <BaseRightSidebar>
        <div className='flex w-full flex-col gap-5'>
          <StudentDashboardOverallProgressChart
            studentPerformance={studentPerformance}
            loading={!user || performanceLoading}
          />
          {schoolYear && syEnrollment && (
            <StudentDashboardSchoolYearSummary
              schoolYear={schoolYear}
              enrollment={syEnrollment}
            />
          )}
        </div>
      </BaseRightSidebar>
    </div>
  );
}

export default StudentDashboardPage;
