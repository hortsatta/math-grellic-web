import { useCallback, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import toast from 'react-hot-toast';

import { capitalize } from '#/utils/string.util';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseDataPagination } from '#/base/components/base-data-pagination.component';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { SchoolYearEnrollmentApprovalStatus } from '#/school-year/models/school-year-enrollment.model';
import {
  defaultSort,
  useTeacherUserList,
} from '../hooks/use-teacher-user-list.hook';
import { useTeacherUserPendingEnrollmentList } from '../hooks/use-teacher-user-pending-enrollment-list.hook';
import { useTeacherUserOverview } from '../hooks/use-teacher-user-overview.hook';
import { TeacherUserSummary } from '../components/teacher-user-summary.component';
import { TeacherUserList } from '../components/teacher-user-list.component';
import { TeacherUserOverviewBoard } from '../components/teacher-user-overview-board.component';
import { TeacherUserPendingEnrollmentList } from '../components/teacher-user-pending-enrollment-list.component';

import type { TeacherUserAccount } from '../models/user.model';

const filterOptions = [
  {
    key: 'estatus-approved',
    name: 'estatus',
    value: SchoolYearEnrollmentApprovalStatus.Approved,
    label: 'Enrolled',
  },
  {
    key: 'estatus-pending',
    name: 'estatus',
    value: SchoolYearEnrollmentApprovalStatus.Pending,
    label: capitalize(SchoolYearEnrollmentApprovalStatus.Pending),
  },
  {
    key: 'estatus-rejected',
    name: 'estatus',
    value: SchoolYearEnrollmentApprovalStatus.Rejected,
    label: capitalize(SchoolYearEnrollmentApprovalStatus.Rejected),
  },
];

const defaultFilterOptions = [filterOptions[0]];

const sortOptions = [
  {
    value: 'name',
    label: 'Teacher Name',
  },
  {
    value: 'publicId',
    label: 'Teacher Id',
  },
];

function TeacherUserListPage() {
  const {
    teachers,
    loading,
    isMutateLoading,
    totalCount,
    pagination,
    setKeyword,
    setFilters,
    setSort,
    refresh,
    nextPage,
    prevPage,
    handleTeacherDetails,
    handleTeacherEdit,
    setTeacherApprovalStatus,
  } = useTeacherUserList();

  const {
    pendingTeachers,
    loading: pendingLoading,
    refresh: pendingRefresh,
  } = useTeacherUserPendingEnrollmentList();

  const {
    enrolledTeacherCount,
    loading: overviewLoading,
    refresh: overviewRefresh,
  } = useTeacherUserOverview();

  const data: any = useLoaderData();

  const pendingListRef = useRef<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentTeacher, setCurrentTeacher] =
    useState<TeacherUserAccount | null>(null);

  const handleOpenDetails = useCallback(
    (isOpen: boolean) => (teacher?: TeacherUserAccount) => {
      if (
        teacher?.enrollment?.approvalStatus ===
        SchoolYearEnrollmentApprovalStatus.Approved
      ) {
        handleTeacherDetails(teacher.id);
        return;
      }

      setCurrentTeacher(teacher || null);
      setOpenModal(isOpen);
    },
    [handleTeacherDetails],
  );

  const handleTeacherStatus = useCallback(
    (approvalStatus: SchoolYearEnrollmentApprovalStatus) => () => {
      if (!currentTeacher || !currentTeacher.enrollment) {
        return;
      }

      try {
        setTeacherApprovalStatus(currentTeacher.enrollment.id, approvalStatus);
        handleOpenDetails(false)();
        pendingListRef?.current?.handleRefresh();
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [currentTeacher, setTeacherApprovalStatus, handleOpenDetails],
  );

  const handleEdit = useCallback(() => {
    if (!currentTeacher) {
      return;
    }

    try {
      handleTeacherEdit(currentTeacher.id);
      handleOpenDetails(false)();
      pendingListRef?.current?.handleRefresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [currentTeacher, handleTeacherEdit, handleOpenDetails]);

  return (
    <>
      <BaseDataSuspense resolve={data?.main}>
        <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
          <div className='flex w-full flex-1 flex-col self-stretch'>
            <BaseDataToolbar
              className='mb-5'
              filterOptions={filterOptions}
              defaulSelectedtFilterOptions={defaultFilterOptions}
              defaultSelectedSort={defaultSort}
              searchInputPlaceholder='Find a Teacher'
              sortOptions={sortOptions}
              onSearchChange={setKeyword}
              onRefresh={refresh}
              onFilter={setFilters}
              onSort={setSort}
            />
            <TeacherUserList
              teachers={teachers}
              loading={loading}
              onTeacherDetails={handleOpenDetails(true)}
              onTeacherEdit={handleTeacherEdit}
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
            <div className='flex flex-col gap-2.5'>
              <TeacherUserOverviewBoard
                enrolledTeacherCount={enrolledTeacherCount}
                loading={overviewLoading}
                onRefresh={overviewRefresh}
              />
              <TeacherUserPendingEnrollmentList
                ref={pendingListRef}
                pendingTeachers={pendingTeachers}
                loading={pendingLoading}
                onRefresh={pendingRefresh}
                onTeacherDetails={handleOpenDetails(true)}
              />
            </div>
          </BaseRightSidebar>
        </div>
      </BaseDataSuspense>
      <BaseModal open={openModal} size='sm' onClose={handleOpenDetails(false)}>
        {currentTeacher && (
          <TeacherUserSummary
            teacher={currentTeacher}
            loading={isMutateLoading}
            onApprove={handleTeacherStatus(
              SchoolYearEnrollmentApprovalStatus.Approved,
            )}
            onReject={handleTeacherStatus(
              SchoolYearEnrollmentApprovalStatus.Rejected,
            )}
            onEdit={handleEdit}
          />
        )}
      </BaseModal>
    </>
  );
}

export default TeacherUserListPage;
