import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { BaseStaticScene } from '#/base/components/base-static-scene.component';
import { useUserRegisterEmailConfirm } from '../hooks/use-user-register-email-confirm.hook';
import { UserRegisterEmailConfirmDone } from '../components/user-register-email-confirm-done.component';

export function UserRegisterEmailConfirmPage() {
  const { loading, publicId, isConfirmed } = useUserRegisterEmailConfirm();

  return (
    <BaseStaticScene id='user-register-email-confirmation'>
      <section className='mx-auto w-full max-w-full pt-4 lg:max-w-[966px]'>
        {(loading || isConfirmed == null) && <BasePageSpinner />}
        {!loading && isConfirmed != null && (
          <div className='flex flex-col items-start justify-start rounded-none bg-backdrop/50 pb-12 lg:rounded-20px'>
            <UserRegisterEmailConfirmDone
              publicId={publicId}
              isConfirmed={isConfirmed}
            />
          </div>
        )}
      </section>
    </BaseStaticScene>
  );
}
