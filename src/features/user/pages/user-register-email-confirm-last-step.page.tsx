import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { BaseStaticScene } from '#/base/components/base-static-scene.component';
import { useUserRegisterEmailConfirmLastStep } from '../hooks/use-user-register-email-confirm-last-step.hook';
import { UserRegisterEmailConfirmLastStepForm } from '../components/user-register-email-confirm-last-step-form.component';
import { UserRegisterEmailConfirmLastStepDone } from '../components/user-register-email-confirm-last-step-done.component';

function UserRegisterEmailConfirmLastStepPage() {
  const { loading, publicId, isConfirmed, submitLastStep } =
    useUserRegisterEmailConfirmLastStep();

  return (
    <BaseStaticScene id='user-register-email-last-step'>
      <section className='mx-auto w-full max-w-full pt-4 lg:max-w-[966px]'>
        {loading && <BasePageSpinner />}
        <div className='flex flex-col items-start justify-start rounded-none bg-backdrop/50 pb-12 lg:rounded-20px'>
          {isConfirmed == null ? (
            <UserRegisterEmailConfirmLastStepForm
              loading={loading}
              onSubmit={submitLastStep}
            />
          ) : (
            <UserRegisterEmailConfirmLastStepDone
              publicId={publicId}
              isConfirmed={isConfirmed}
            />
          )}
        </div>
      </section>
    </BaseStaticScene>
  );
}

export default UserRegisterEmailConfirmLastStepPage;
