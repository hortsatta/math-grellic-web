import { useAdminUserCreate } from '../hooks/use-admin-user-create.hook';
import { AdminUserUpsertForm } from '../components/admin-user-upsert-form.component';

export function AdminUserCreatePage() {
  const { isDone, setIsDone, register } = useAdminUserCreate();

  return (
    <AdminUserUpsertForm
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={register}
    />
  );
}
