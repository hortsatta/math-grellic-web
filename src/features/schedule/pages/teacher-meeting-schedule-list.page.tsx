import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseDataPagination } from '#/base/components/base-data-pagination.component';
import { teacherScheduleRouteHandle } from '../route/teacher-schedule-handle.route';
import { getTeacherPaginatedMeetingSchedulesLoader } from '../route/teacher-schedule-loader.route';
import {
  defaultSort,
  useTeacherMeetingScheduleList,
} from '../hooks/use-teacher-meeting-schedule-list.hook';
import { TeacherMeetingScheduleList } from '../components/teacher-meeting-schedule-list.component';

const sortOptions = [
  {
    value: 'scheduleDate',
    label: 'Schedule Date',
  },
  {
    value: 'title',
    label: 'Meeting Title',
  },
];

function TeacherMeetingScheduleListPage() {
  const {
    meetingSchedules,
    loading,
    totalCount,
    pagination,
    setKeyword,
    setSort,
    refresh,
    nextPage,
    prevPage,
    handleMeetingScheduleEdit,
    handleMeetingScheduleDetails,
  } = useTeacherMeetingScheduleList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
        <div className='flex w-full flex-1 flex-col self-stretch'>
          <BaseDataToolbar
            className='mb-5'
            defaultSelectedSort={defaultSort}
            sortOptions={sortOptions}
            searchInputPlaceholder='Find a Meeting'
            onSearchChange={setKeyword}
            onRefresh={refresh}
            onSort={setSort}
          />
          <TeacherMeetingScheduleList
            meetingSchedules={meetingSchedules}
            loading={loading}
            onMeetingScheduleDetails={handleMeetingScheduleDetails}
            onMeetingScheduleEdit={handleMeetingScheduleEdit}
          />
          {!!totalCount && (
            <BaseDataPagination
              totalCount={totalCount}
              pagination={pagination}
              onNext={nextPage}
              onPrev={prevPage}
            />
          )}
        </div>
        {/* TODO sidebar components */}
        {/* <BaseRightSidebar /> */}
      </div>
    </BaseDataSuspense>
  );
}

export const Component = TeacherMeetingScheduleListPage;
export const handle = teacherScheduleRouteHandle.list;
export const loader = getTeacherPaginatedMeetingSchedulesLoader(queryClient);
