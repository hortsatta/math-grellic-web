import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { BaseStaticScene } from '#/base/components/base-static-scene.component';
import { UserRegisterEmailConfirmLastStepDone } from '#/user/components/user-register-email-confirm-last-step-done.component';
import { UserRegisterEmailConfirmLastStepForm } from '#/user/components/user-register-email-confirm-last-step-form.component';
import { useSchoolYearEnrollmentNewLastStep } from '../hooks/use-school-year-enrollment-new-last-step.hook';

function SchoolYearEnrollmentNewLastStepPage() {
  const { loading, publicId, isConfirmed, submitLastStep } =
    useSchoolYearEnrollmentNewLastStep();

  return (
    <BaseStaticScene id='sy-enrollment-new-last-step'>
      <section className='mx-auto w-full max-w-full pt-4 lg:max-w-[966px]'>
        {loading && <BasePageSpinner />}
        <div className='flex flex-col items-start justify-start rounded-none bg-backdrop/50 pb-12 lg:rounded-20px'>
          {isConfirmed == null ? (
            <UserRegisterEmailConfirmLastStepForm
              title='Confirm Registration and Enrollment'
              subtitle='Please create your password to procceed.'
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

export default SchoolYearEnrollmentNewLastStepPage;
