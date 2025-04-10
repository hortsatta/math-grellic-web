import { adminUserRouteHandle } from '../route/admin-user-handle';
import { useAdminUserCreate } from '../hooks/use-admin-user-create.hook';
import { AdminUserUpsertForm } from '../components/admin-user-upsert-form.component';

function AdminUserCreatePage() {
  const { isDone, setIsDone, register } = useAdminUserCreate();

  return (
    <AdminUserUpsertForm
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={register}
    />
  );
}

export const Component = AdminUserCreatePage;
export const handle = adminUserRouteHandle.create;
