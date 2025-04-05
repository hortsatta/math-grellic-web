import { useRef, useState, useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';
import toast from 'react-hot-toast';

import { capitalize } from '#/utils/string.util';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseDataPagination } from '#/base/components/base-data-pagination.component';
import { UserApprovalStatus } from '../models/user.model';
import {
  defaultSort,
  useAdminUserList,
} from '../hooks/use-admin-user-list.hook';
import { useAdminUserOverview } from '../hooks/use-admin-user-overview.hook';
import { useAdminUserPendingRegistrationList } from '../hooks/use-admin-user-pending-registration-list.hook';
import { AdminUserSummary } from '../components/admin-user-summary.component';
import { AdminUserOverviewBoard } from '../components/admin-user-overview-board.component';
import { AdminUserPendingRegistrationList } from '../components/admin-user-pending-registration-list.component';
import { AdminUserList } from '../components/admin-user-list.component';

import type { AdminUserAccount } from '../models/user.model';

const filterOptions = [
  {
    key: 'status-approved',
    name: 'status',
    value: UserApprovalStatus.Approved,
    label: 'Registered',
  },
  {
    key: 'status-mailpending',
    name: 'status',
    value: UserApprovalStatus.MailPending,
    label: 'Email Pending',
  },
  {
    key: 'status-rejected',
    name: 'status',
    value: UserApprovalStatus.Rejected,
    label: capitalize(UserApprovalStatus.Rejected),
  },
];

const defaultFilterOptions = [filterOptions[0]];

const sortOptions = [
  {
    value: 'name',
    label: 'Admin Name',
  },
  {
    value: 'publicId',
    label: 'Admin Id',
  },
];

export function AdminUserListPage() {
  const {
    admins,
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
    handleAdminDetails,
    handleAdminEdit,
  } = useAdminUserList();

  const {
    pendingAdmins,
    loading: pendingLoading,
    refresh: pendingRefresh,
  } = useAdminUserPendingRegistrationList();

  const {
    registeredAdminCount,
    loading: overviewLoading,
    refresh: overviewRefresh,
  } = useAdminUserOverview();

  const data: any = useLoaderData();

  const pendingListRef = useRef<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUserAccount | null>(
    null,
  );

  const handleOpenDetails = useCallback(
    (isOpen: boolean) => (admin?: AdminUserAccount) => {
      if (admin?.approvalStatus === UserApprovalStatus.Approved) {
        handleAdminDetails(admin.id);
        return;
      }

      setCurrentAdmin(admin || null);
      setOpenModal(isOpen);
    },
    [handleAdminDetails],
  );

  const handleEdit = useCallback(() => {
    if (!currentAdmin) {
      return;
    }

    try {
      handleAdminEdit(currentAdmin.id);
      handleOpenDetails(false)();
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [currentAdmin, handleAdminEdit, handleOpenDetails]);

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
              searchInputPlaceholder='Find an Admin'
              sortOptions={sortOptions}
              onSearchChange={setKeyword}
              onRefresh={refresh}
              onFilter={setFilters}
              onSort={setSort}
            />
            <AdminUserList
              admins={admins}
              loading={loading}
              onAdminDetails={handleOpenDetails(true)}
              onAdminEdit={handleAdminEdit}
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
              <AdminUserPendingRegistrationList
                ref={pendingListRef}
                pendingAdmins={pendingAdmins}
                loading={pendingLoading}
                onRefresh={pendingRefresh}
                onAdminDetails={handleOpenDetails(true)}
              />
              <AdminUserOverviewBoard
                registeredAdminCount={registeredAdminCount}
                loading={overviewLoading}
                onRefresh={overviewRefresh}
              />
            </div>
          </BaseRightSidebar>
        </div>
      </BaseDataSuspense>
      <BaseModal open={openModal} size='sm' onClose={handleOpenDetails(false)}>
        {currentAdmin && (
          <AdminUserSummary
            admin={currentAdmin}
            loading={isMutateLoading}
            onEdit={handleEdit}
          />
        )}
      </BaseModal>
    </>
  );
}
