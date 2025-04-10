import { useLoaderData } from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { adminUserRouteHandle } from '../route/admin-user-handle';
import { getAdminUserByIdLoader } from '../route/admin-user-loader';
import { useAdminUserSingle } from '../hooks/use-admin-user-single.hook';
import { AdminUserSingle } from '../components/admin-user-single.component';

function AdminUserSinglePage() {
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

export const Component = AdminUserSinglePage;
export const handle = adminUserRouteHandle.single;
export const loader = getAdminUserByIdLoader(queryClient);
