import { Outlet, ScrollRestoration } from 'react-router-dom';

import { UserRegisterModal } from '#/user/components/user-register-modal.component';
import { AuthLoginModal } from '#/auth/components/auth-login-modal.component';

import { CoreStaticHeader } from './core-static-header.component';
import { CoreStaticFooter } from './core-static-footer.component';
import { CoreStaticMain } from './core-static-main.component';

export function CoreStaticLayout() {
  return (
    <>
      <CoreStaticHeader />
      <CoreStaticMain id='main'>
        <Outlet />
      </CoreStaticMain>
      <CoreStaticFooter />
      <UserRegisterModal />
      <AuthLoginModal />
      <ScrollRestoration />
    </>
  );
}
