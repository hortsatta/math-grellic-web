import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { capitalize } from '#/utils/string.util';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { SearchFilter } from '../models/global-search.model';
import { useStudentGlobalSearchResults } from '../hooks/use-student-global-search-results.hook';
import { StudentGlobalSearchLessonList } from '../components/student-global-search-lesson-list.component';
import { StudentGlobalSearchActivityList } from '../components/student-global-search-activity-list.component';
import { StudentGlobalSearchExamList } from '../components/student-global-search-exam-list.component';
import { StudentGlobalSearchMeetingScheduleList } from '../components/student-global-search-meeting-schedule-list.component';

const filterOptions = [
  {
    key: `filter-${SearchFilter.Lesson}`,
    name: 'filter',
    value: SearchFilter.Lesson,
    label: 'Lessons',
  },
  {
    key: `filter-${SearchFilter.Exam}`,
    name: 'filter',
    value: SearchFilter.Exam,
    label: 'Exams',
  },
  {
    key: `filter-${SearchFilter.Activity}`,
    name: 'filter',
    value: SearchFilter.Activity,
    label: 'Activities',
  },
  {
    key: `filter-${SearchFilter.MeetingSchedule}`,
    name: 'filter',
    value: SearchFilter.MeetingSchedule,
    label: 'Meetings',
  },
  {
    key: `filter-${SearchFilter.Others}`,
    name: 'filter',
    value: SearchFilter.Others,
    label: capitalize(SearchFilter.Others),
  },
];

function StudentGlobalSearchResultsPage() {
  const searchKeyword = useBoundStore((state) => state.searchKeyword);
  const setSearchInputRef = useBoundStore((state) => state.setSearchInputRef);

  const {
    searchResults,
    loading,
    totalCount,
    setKeyword,
    setFilters,
    refresh,
  } = useStudentGlobalSearchResults();

  const data: any = useLoaderData();

  const { lessons, exams, activities, meetingSchedules } = useMemo(
    () => searchResults,
    [searchResults],
  );

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
        <div className='flex w-full flex-1 flex-col self-stretch'>
          <BaseDataToolbar
            className='mb-5'
            filterOptions={filterOptions}
            defaulSelectedtFilterOptions={filterOptions}
            searchInputPlaceholder='Looking for something?'
            searchInputDefaultValue={
              !searchKeyword?.trim().length ? undefined : searchKeyword
            }
            setSearchInputRef={setSearchInputRef}
            onSearchChange={setKeyword}
            onRefresh={refresh}
            onFilter={setFilters}
            filterButtonLabelAsAll
          />
          {loading ? (
            <div className='flex h-full w-full items-center justify-center'>
              <BaseSpinner />
            </div>
          ) : (
            <>
              <h3 className='mb-5 text-lg leading-none'>
                Showing {totalCount} results for "{searchKeyword}"
              </h3>
              <div className='flex flex-col gap-6'>
                {lessons && (
                  <StudentGlobalSearchLessonList
                    className='animate-fastFadeIn'
                    lessons={lessons}
                  />
                )}
                {exams && (
                  <StudentGlobalSearchExamList
                    className='animate-fastFadeIn'
                    exams={exams}
                  />
                )}
                {!!activities.length && (
                  <StudentGlobalSearchActivityList
                    className='animate-fastFadeIn'
                    activities={activities}
                  />
                )}
                {meetingSchedules && (
                  <StudentGlobalSearchMeetingScheduleList
                    className='animate-fastFadeIn'
                    meetingSchedules={meetingSchedules}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </BaseDataSuspense>
  );
}

export default StudentGlobalSearchResultsPage;
