import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { capitalize } from '#/utils/string.util';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { SearchFilter } from '../models/global-search.model';
import {
  defaultSort,
  useTeacherGlobalSearchResults,
} from '../hooks/use-teacher-global-search-results.hook';
import { TeacherGlobalSearchLessonList } from '../components/teacher-global-search-lesson-list.component';
import { TeacherGlobalSearchExamList } from '../components/teacher-global-search-exam-list.component';
import { TeacherGlobalSearchActivityList } from '../components/teacher-global-search-activity-list.component';
import { TeacherGlobalSearchStudentPerformanceList } from '../components/teacher-global-search-student-performance-list.component';
import { TeacherGlobalSearchMeetingScheduleList } from '../components/teacher-global-search-meeting-schedule-list.component';
import { TeacherGlobalSearchOthersList } from '../components/teacher-global-search-others-list.component';

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
    key: `filter-${SearchFilter.StudentPerformance}`,
    name: 'filter',
    value: SearchFilter.StudentPerformance,
    label: 'Learners',
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

const sortOptions = [
  {
    value: 'title',
    label: 'Name',
  },
];

function TeacherGlobalSearchResultsPage() {
  const searchKeyword = useBoundStore((state) => state.searchKeyword);
  const setSearchInputRef = useBoundStore((state) => state.setSearchInputRef);

  const {
    searchResults,
    loading,
    totalCount,
    isSingleGroupResult,
    setKeyword,
    setFilters,
    setSort,
    refresh,
  } = useTeacherGlobalSearchResults();

  const data: any = useLoaderData();

  const {
    lessons,
    exams,
    activities,
    studentPerformances,
    meetingSchedules,
    others,
  } = useMemo(() => searchResults, [searchResults]);

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
        <div className='flex w-full flex-1 flex-col self-stretch'>
          <BaseDataToolbar
            className='mb-5'
            filterOptions={filterOptions}
            defaulSelectedtFilterOptions={filterOptions}
            defaultSelectedSort={defaultSort}
            sortOptions={sortOptions}
            searchInputPlaceholder='Looking for something?'
            searchInputDefaultValue={
              !searchKeyword?.trim().length ? undefined : searchKeyword
            }
            setSearchInputRef={setSearchInputRef}
            onSearchChange={setKeyword}
            onRefresh={refresh}
            onFilter={setFilters}
            onSort={setSort}
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
                {!!lessons.length && (
                  <TeacherGlobalSearchLessonList
                    className='animate-fastFadeIn'
                    lessons={lessons}
                  />
                )}
                {!!exams.length && (
                  <TeacherGlobalSearchExamList
                    className='animate-fastFadeIn'
                    exams={exams}
                  />
                )}
                {!!activities.length && (
                  <TeacherGlobalSearchActivityList
                    className='animate-fastFadeIn'
                    activities={activities}
                  />
                )}
                {!!studentPerformances.length && (
                  <TeacherGlobalSearchStudentPerformanceList
                    className='animate-fastFadeIn'
                    studentPerformances={studentPerformances}
                  />
                )}
                {!!meetingSchedules.length && (
                  <TeacherGlobalSearchMeetingScheduleList
                    className='animate-fastFadeIn'
                    meetingSchedules={meetingSchedules}
                  />
                )}
                {!!others.length && (
                  <TeacherGlobalSearchOthersList
                    className='animate-fastFadeIn'
                    others={others}
                    hideTitle={isSingleGroupResult}
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

export default TeacherGlobalSearchResultsPage;
