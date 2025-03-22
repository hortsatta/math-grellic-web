import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { useAdminUserSingle } from '../hooks/use-admin-user-single.hook';
import { AdminUserSingle } from '../components/admin-user-single.component';

export function AdminUserSinglePage() {
  const { loading, admin } = useAdminUserSingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading && <BasePageSpinner />}
      {admin && (
        <AdminUserSingle
          className='mx-auto max-w-compact py-5 pb-16'
          admin={admin}
        />
      )}
    </BaseDataSuspense>
  );
}
