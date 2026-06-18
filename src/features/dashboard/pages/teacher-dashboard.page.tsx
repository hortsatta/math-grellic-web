import cx from 'classix';

import { teacherScheduleBaseRoute } from '#/schedule/route/teacher-schedule-handle.route';
import { SidebarMode } from '#/base/models/base.model';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseSurface } from '#/base/components/base-surface.component';
import { useTeacherScheduleTodayList } from '#/schedule/hooks/use-teacher-schedule-today-list.hook';
import { ScheduleDailyCardList } from '#/schedule/components/schedule-daily-card-list.component';
import { useTeacherAnnouncementList } from '#/announcement/hooks/use-teacher-announcement-list.hook';
import { useAnnouncementCreate } from '#/announcement/hooks/use-announcement-create.hook';
import { useAnnouncementEdit } from '#/announcement/hooks/use-announcement-edit.hook';
import { useTeacherClassPerformance } from '../hooks/use-teacher-class-performance.hook';
import { useTeacherCurriculumSnippets } from '../hooks/use-teacher-curriculum-snippets.hook';
import { useTeacherStudentSchoolYearAcademicProgress } from '#/school-year/hooks/use-teacher-student-school-year-academic-progress.hook';
import { TeacherDashboardUserSummary } from '../components/teacher-dashboard-user-summary.component';
import { TeacherDashboardCurriculumTabList } from '../components/teacher-dashboard-curriculum-tab-list.component';
import { TeacherDashboardStudentLeaderboard } from '../components/teacher-dashboard-student-leaderboard.component';
import { TeacherDashboardAnnouncementList } from '../components/teacher-dashboard-announcement-list.component';
import { TeacherDashboardSchoolYearSummary } from '../components/teacher-dashboard-school-year-summary.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { TeacherDashboardOverallProgressChart } from '../components/teacher-dashboard-overall-progress-chart.component';

function TeacherDashboardPage() {
  const user = useBoundStore((state) => state.user || null);
  const schoolYear = useBoundStore((state) => state.schoolYear || null);
  const isRightSidebarExpanded = useBoundStore(
    (state) => state.rightSidebarMode == SidebarMode.Expanded,
  );

  const {
    classLoading,
    rankingsLoading,
    teacherClassPerformance,
    studentRankingsPerformances,
    currentRankingsPerformance,
    setCurrentRankingsPerformance,
  } = useTeacherClassPerformance();

  const {
    loading: curriculumLoading,
    lessons,
    exams,
    activities,
    handleLessonDetails,
    handleExamDetails,
    handleActivityDetails,
  } = useTeacherCurriculumSnippets();

  const { loading: todayScheduleLoading, schedules } =
    useTeacherScheduleTodayList();

  const {
    loading: announcementListLoading,
    teacherAnnouncements,
    refresh,
  } = useTeacherAnnouncementList();

  const { loading: announcementCreateLoading, createAnnouncement } =
    useAnnouncementCreate();

  const {
    loading: announcemenEditLoading,
    editAnnouncement,
    deleteAnnouncement,
  } = useAnnouncementEdit();

  const { loading: academicProgressLoading, studentsAcademicProgress } =
    useTeacherStudentSchoolYearAcademicProgress();

  return (
    <div
      id='scene-content'
      className={cx(
        'flex w-full flex-1 items-start pt-5',
        isRightSidebarExpanded && 'rsb-expanded',
      )}
    >
      <div className='mx-auto flex w-full max-w-[900px] flex-1 shrink-0 flex-col gap-5 self-stretch pb-12'>
        <div className='flex flex-col justify-stretch gap-5 md:flex-row lg:[.rsb-expanded_&]:flex-col xl:[.rsb-expanded_&]:flex-row'>
          <TeacherDashboardUserSummary
            className='min-h-[262px]'
            user={user}
            loading={!user || classLoading}
          />
          <TeacherDashboardAnnouncementList
            loading={
              announcementListLoading ||
              announcementCreateLoading ||
              announcemenEditLoading
            }
            teacherAnnouncements={teacherAnnouncements}
            onCreate={createAnnouncement}
            onEdit={editAnnouncement}
            onDelete={deleteAnnouncement}
            onRefresh={refresh}
          />
        </div>
        <TeacherDashboardCurriculumTabList
          lessons={lessons}
          exams={exams}
          activities={activities}
          loading={curriculumLoading}
          onLessonDetails={handleLessonDetails}
          onExamDetails={handleExamDetails}
          onActivityDetails={handleActivityDetails}
        />
        <TeacherDashboardStudentLeaderboard
          className='min-h-[224px]'
          performance={currentRankingsPerformance}
          students={studentRankingsPerformances}
          loading={rankingsLoading}
          onTabChange={setCurrentRankingsPerformance}
        />
        <div className='flex flex-col gap-5 md:flex-row lg:[.rsb-expanded_&]:flex-col xl:[.rsb-expanded_&]:flex-row'>
          <BaseSurface className='!px-4 pb-3 -3xs:min-w-[438px]'>
            <h3 className='mb-2.5 text-lg leading-none'>Today's Schedule</h3>
            <ScheduleDailyCardList
              schedules={schedules}
              scheduleTo={teacherScheduleBaseRoute}
              scheduleEmptyLabel='No schedule for today'
              loading={todayScheduleLoading}
            />
          </BaseSurface>
          <div />
        </div>
      </div>
      <BaseRightSidebar>
        <div className='flex w-full flex-col gap-4'>
          <TeacherDashboardOverallProgressChart
            classPerformance={teacherClassPerformance}
            studentsAcademicProgress={studentsAcademicProgress}
            loading={!user || classLoading}
          />
          {schoolYear && (
            <TeacherDashboardSchoolYearSummary
              schoolYear={schoolYear}
              studentsAcademicProgress={studentsAcademicProgress}
              loading={academicProgressLoading}
            />
          )}
        </div>
      </BaseRightSidebar>
    </div>
  );
}

export default TeacherDashboardPage;

//  <div className='max-w-auto mx-auto flex w-full flex-col items-center justify-center gap-5 pb-8 sm:max-w-[592px] -2lg:max-w-[835px] xl:flex-row xl:items-start'>
//         <div className='xl:max-w-auto flex w-full shrink-0 flex-col gap-5 xl:w-[592px] xl:pb-8 2xl:w-auto 2xl:max-w-[835px]'>
//           <TeacherDashboardUserSummary
//             className='min-h-[262px]'
//             user={user}
//             classPerformance={teacherClassPerformance}
//             loading={!user || classLoading}
//           />
//           <TeacherDashboardCurriculumTabList
//             lessons={lessons}
//             exams={exams}
//             activities={activities}
//             loading={curriculumLoading}
//             onLessonDetails={handleLessonDetails}
//             onExamDetails={handleExamDetails}
//             onActivityDetails={handleActivityDetails}
//           />
//           <TeacherDashboardStudentLeaderboard
//             className='min-h-[224px]'
//             performance={currentRankingsPerformance}
//             students={studentRankingsPerformances}
//             loading={rankingsLoading}
//             onTabChange={setCurrentRankingsPerformance}
//           />
//           {schoolYear && (
//             <TeacherDashboardSchoolYearSummary
//               schoolYear={schoolYear}
//               studentsAcademicProgress={studentsAcademicProgress}
//               loading={academicProgressLoading}
//             />
//           )}
//         </div>
//         <div className='flex w-full flex-col gap-5 -2lg:w-fit'>
//           <TeacherDashboardAnnouncementList
//             loading={
//               announcementListLoading ||
//               announcementCreateLoading ||
//               announcemenEditLoading
//             }
//             teacherAnnouncements={teacherAnnouncements}
//             onCreate={createAnnouncement}
//             onEdit={editAnnouncement}
//             onDelete={deleteAnnouncement}
//             onRefresh={refresh}
//           />
//           <BaseSurface className='!px-4 pb-3'>
//             <h3 className='mb-2.5 text-lg leading-none'>Today's Schedule</h3>
//             <ScheduleDailyCardList
//               schedules={schedules}
//               scheduleTo={SCHEDULE_PATH}
//               scheduleEmptyLabel='No schedule for today'
//               loading={todayScheduleLoading}
//               fixedWidth
//             />
//           </BaseSurface>
//         </div>
//       </div>
