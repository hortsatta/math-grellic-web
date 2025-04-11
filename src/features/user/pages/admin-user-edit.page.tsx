import { useCallback, useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  superAdminBaseRoute,
  superAdminRoutes,
} from '#/app/routes/super-admin-routes';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { useAdminUserEdit } from '../hooks/use-admin-user-edit.hook';
import { AdminUserUpsertForm } from '../components/admin-user-upsert-form.component';

const ADMIN_LIST_PATH = `/${superAdminBaseRoute}/${superAdminRoutes.admin.to}`;

function AdminUserEditPage() {
  const { id } = useParams();

  const { loading, isDone, setIsDone, adminFormData, editAdmin, deleteAdmin } =
    useAdminUserEdit(+(id || 0));

  const data: any = useLoaderData();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      !loading && setOpenModal(isOpen);
    },
    [loading],
  );

  const handleDeleteAdmin = useCallback(async () => {
    if (!id || !adminFormData) {
      return;
    }

    try {
      await deleteAdmin();
      toast.success(`Admin deleted`);
      navigate(ADMIN_LIST_PATH);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [id, adminFormData, deleteAdmin, navigate]);

  return (
    <>
      <BaseDataSuspense resolve={data?.main}>
        <AdminUserUpsertForm
          loading={loading}
          isDone={isDone}
          formData={adminFormData}
          onDone={setIsDone}
          onSubmit={editAdmin}
          onDelete={handleSetModal(true)}
        />
      </BaseDataSuspense>
      <BaseModal size='xs' open={openModal} onClose={handleSetModal(false)}>
        <div>
          <div className='mb-4 flex items-center gap-2'>
            <BaseIcon name='trash' size={28} />
            <span>Delete admin?</span>
          </div>
          <BaseButton
            className='!w-full'
            loading={loading}
            onClick={handleDeleteAdmin}
          >
            Delete Admin
          </BaseButton>
        </div>
      </BaseModal>
    </>
  );
}

export default AdminUserEditPage;
