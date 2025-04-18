import { memo, useCallback, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import { options } from '#/utils/scrollbar.util';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { useStudentScheduleTimelineCalendar } from '../hooks/use-student-schedule-timeline-calendar.hook';
import { useStudentScheduleMonthlyCalendar } from '../hooks/use-student-schedule-monthly-calendar.hook';
import { ScheduleWeeklyCalendarSelector } from '../components/schedule-weekly-calendar-selector.component';
import { ScheduleWeeklyCalendar } from '../components/schedule-weekly-calendar.component';
import { ScheduleCalendarInfo } from '../components/schedule-calendar-info.component';
import { ScheduleMonthlyCalendar } from '../components/schedule-monthly-calendar.component';

import type { ScheduleCard } from '../models/schedule.model';

type ScheduleMonthlyCalendarProps = {
  today: Date;
  weekIndex: number;
  onWeekChange?: (value: number) => void;
};

const StudentScheduleMonthlyCalendar = memo(function ({
  today,
  weekIndex,
  onWeekChange,
}: ScheduleMonthlyCalendarProps) {
  const { loading, currentDate, setCurrentDate, timelineSchedules } =
    useStudentScheduleMonthlyCalendar(today);

  return (
    <ScheduleMonthlyCalendar
      loading={loading}
      today={today}
      currentDate={currentDate || today}
      weekIndex={weekIndex}
      timelineSchedules={timelineSchedules}
      onDateChange={setCurrentDate}
      onWeekChange={onWeekChange}
    />
  );
});

function StudentScheduleCalendarPage() {
  const {
    loading,
    timelineSchedules,
    today,
    weekIndex,
    handleWeekChange,
    refresh,
  } = useStudentScheduleTimelineCalendar();

  const data: any = useLoaderData();

  const [openModal, setOpenModal] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleCard | null>(
    null,
  );

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      !loading && setOpenModal(isOpen);
    },
    [loading],
  );

  const handleScheduleClick = useCallback(
    (schedule: ScheduleCard) => {
      setCurrentSchedule(schedule);
      handleSetModal(true)();
    },
    [handleSetModal],
  );

  return (
    <>
      <BaseDataSuspense resolve={data?.main}>
        <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
          <OverlayScrollbarsComponent
            className='h-full w-full'
            options={options}
            defer
          >
            <div className='flex w-full flex-1 flex-col self-stretch pb-5'>
              {!!today && (
                <>
                  <ScheduleWeeklyCalendarSelector
                    className='mb-5'
                    loading={loading}
                    today={today}
                    weekIndex={weekIndex}
                    onWeekChange={handleWeekChange}
                    onRefresh={refresh}
                  />
                  {!!timelineSchedules && (
                    <ScheduleWeeklyCalendar
                      loading={loading}
                      today={today}
                      weekIndex={weekIndex}
                      timelineSchedules={timelineSchedules}
                      onScheduleClick={handleScheduleClick}
                    />
                  )}
                </>
              )}
            </div>
          </OverlayScrollbarsComponent>
          <BaseRightSidebar>
            {today && (
              <StudentScheduleMonthlyCalendar
                today={today}
                weekIndex={weekIndex}
                onWeekChange={handleWeekChange}
              />
            )}
          </BaseRightSidebar>
        </div>
      </BaseDataSuspense>
      <BaseModal size='sm' open={openModal} onClose={handleSetModal(false)}>
        <div>
          <ScheduleCalendarInfo schedule={currentSchedule} isStudent />
        </div>
      </BaseModal>
    </>
  );
}

export default StudentScheduleCalendarPage;
