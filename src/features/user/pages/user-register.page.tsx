import cx from 'classix';

import { BaseStaticScene } from '#/base/components/base-static-scene.component';
import { useUserRegister } from '../hooks/use-user-register.hook';
import { useUserRegisterForm } from '../hooks/use-user-register-form.hook';
import { UserRegisterDone } from '../components/user-register-done.component';
import { UserRegisterForm } from '../components/user-register-form.component';
import { UserRegisterRoleTab } from '../components/user-register-role-tab.component';

export function UserRegisterPage() {
  const {
    loading,
    isDone,
    setIsDone,
    selectedUserRole,
    handleRoleChange,
    handleLogin,
  } = useUserRegisterForm();

  const { register } = useUserRegister();

  return (
    <BaseStaticScene id='user-register'>
      <section className='mx-auto w-full max-w-full pt-4 lg:max-w-[966px]'>
        {!loading && !!selectedUserRole && (
          <div
            className={cx(
              'flex flex-col items-start justify-start rounded-none bg-backdrop/50 pb-12 lg:rounded-b-20px',
              isDone ? 'lg:rounded-t-20px' : 'lg:rounded-t-lg',
            )}
          >
            {isDone ? (
              <UserRegisterDone />
            ) : (
              <>
                <UserRegisterRoleTab
                  className='lg-rounded-t-lg mb-12 overflow-hidden rounded-t-none'
                  userRole={selectedUserRole}
                  isDone={isDone}
                  onChange={handleRoleChange}
                  onLogin={handleLogin}
                />
                <UserRegisterForm
                  className='px-4 lg:px-11'
                  userRole={selectedUserRole}
                  isDone={isDone}
                  onDone={setIsDone}
                  onSubmit={register}
                />
              </>
            )}
          </div>
        )}
      </section>
    </BaseStaticScene>
  );
}
