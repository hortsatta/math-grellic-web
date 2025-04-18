import { useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { UserRole } from '../models/user.model';
import { useAdminCurrenUserEdit } from '../hooks/use-admin-current-user-edit.hook';
import { CurrentUserUpdateForm } from '../components/current-user-update-form.component';

import type {
  AdminUserUpdateFormData,
  StudentUserUpdateFormData,
  TeacherUserUpdateFormData,
} from '../models/user-form-data.model';

function AdminUserAccountEditPage() {
  const {
    loading,
    isDone,
    setIsDone,
    adminUserFormData,
    editCurrentAdminUser,
  } = useAdminCurrenUserEdit();

  const data: any = useLoaderData();

  const handleSubmit = useCallback(
    (
      data:
        | AdminUserUpdateFormData
        | TeacherUserUpdateFormData
        | StudentUserUpdateFormData,
    ) => editCurrentAdminUser(data as AdminUserUpdateFormData),
    [editCurrentAdminUser],
  );

  return (
    <BaseDataSuspense resolve={data?.main}>
      {!!adminUserFormData && (
        <CurrentUserUpdateForm
          isDone={isDone}
          loading={loading}
          formData={adminUserFormData}
          onSubmit={handleSubmit}
          onDone={setIsDone}
          role={UserRole.Admin}
        />
      )}
    </BaseDataSuspense>
  );
}

export default AdminUserAccountEditPage;
