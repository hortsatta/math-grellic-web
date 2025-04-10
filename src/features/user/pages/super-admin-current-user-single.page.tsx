import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { BaseChip } from '#/base/components/base-chip.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { UserGender, UserRole } from '../models/user.model';
import { ADMIN_NAME } from '../helpers/user.helper';
import { currentUserRouteHandle } from '../route/current-user-handle';
import { useCurrentUserSingle } from '../hooks/use-current-user-single.hook';
import { UserAvatarImg } from '../components/user-avatar-img.component';

// const USER_ACCOUNT_PATH = `/${superAdminBaseRoute}/${superAdminRoutes.account.to}/${superAdminRoutes.account.editTo}`;

function SuperAdminCurrentUserSinglePage() {
  const { loading, user } = useCurrentUserSingle();
  const data: any = useLoaderData();

  const [email, publicId, gender, isSuperAdmin] = useMemo(
    () => [
      user?.email,
      user?.publicId,
      user?.userAccount?.gender,
      user?.role === UserRole.SuperAdmin,
    ],
    [user],
  );

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading || !isSuperAdmin ? (
        <BasePageSpinner />
      ) : (
        <div className='mx-auto w-full max-w-compact py-5 pb-16'>
          <div className='mb-2.5 flex flex-col gap-y-2.5'>
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center gap-2.5'>
                <UserAvatarImg gender={gender as UserGender} />
                <div>
                  <h2 className='pb-1 text-xl'>{ADMIN_NAME}</h2>
                  <span>{email}</span>
                </div>
              </div>
              {/* <div>
                <BaseLink
                  to={USER_ACCOUNT_PATH}
                  className='!px-3'
                  variant='solid'
                >
                  <BaseIcon name='pencil' size={24} />
                </BaseLink>
              </div> */}
            </div>
            <div className='flex flex-col items-start justify-between gap-2.5 xs:flex-row xs:items-center xs:gap-0'>
              <div className='flex items-center gap-2.5'>
                <BaseChip iconName='identification-badge'>{publicId}</BaseChip>
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseDataSuspense>
  );
}

export const Component = SuperAdminCurrentUserSinglePage;
export const handle = currentUserRouteHandle.single;
