import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { capitalize } from '#/utils/string.util';
import { RecordStatus } from '#/core/models/core.model';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseDataPagination } from '#/base/components/base-data-pagination.component';
import {
  defaultSort,
  useAdminSchoolYearList,
} from '../hooks/use-admin-school-year-list.hook';
import { useSchoolYearCurrent } from '../hooks/use-school-year-current.hook';
import { SchoolYearList } from '../components/school-year-list.component';
import { SchoolYearOverviewBoard } from '../components/school-year-overview-board.component';

const filterOptions = [
  {
    key: 'status-published',
    name: 'status',
    value: RecordStatus.Published,
    label: capitalize(RecordStatus.Published),
  },
  {
    key: 'status-draft',
    name: 'status',
    value: RecordStatus.Draft,
    label: capitalize(RecordStatus.Draft),
  },
];

const sortOptions = [
  {
    value: 'startDate',
    label: 'Date',
  },
];

function SchoolYearListPage() {
  const {
    schoolYears,
    loading,
    setKeyword,
    setFilters,
    setSort,
    refresh,
    totalCount,
    pagination,
    nextPage,
    prevPage,
    handleSchoolYearEdit,
    handleSchoolYearDetails,
  } = useAdminSchoolYearList();

  const { loading: currentSchoolYearLoading, schoolYear: currentSchoolYear } =
    useSchoolYearCurrent();

  const data: any = useLoaderData();

  const transformedSchoolYears = useMemo(
    () =>
      schoolYears.map((schoolYear) =>
        schoolYear.id === currentSchoolYear?.id
          ? currentSchoolYear
          : schoolYear,
      ),
    [schoolYears, currentSchoolYear],
  );

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
        <div className='flex w-full flex-1 flex-col self-stretch'>
          <BaseDataToolbar
            className='mb-5'
            filterOptions={filterOptions}
            defaulSelectedtFilterOptions={filterOptions}
            defaultSelectedSort={defaultSort}
            searchInputPlaceholder='Find a Lesson'
            sortOptions={sortOptions}
            onSearchChange={setKeyword}
            onRefresh={refresh}
            onFilter={setFilters}
            onSort={setSort}
          />
          <SchoolYearList
            schoolYears={transformedSchoolYears}
            loading={loading || currentSchoolYearLoading}
            onSchoolYearDetails={handleSchoolYearDetails}
            onSchoolYearEdit={handleSchoolYearEdit}
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
        <BaseRightSidebar>
          <SchoolYearOverviewBoard
            schoolYear={currentSchoolYear ?? undefined}
            loading={currentSchoolYearLoading}
            onDetails={handleSchoolYearDetails}
          />
        </BaseRightSidebar>
      </div>
    </BaseDataSuspense>
  );
}

export default SchoolYearListPage;
