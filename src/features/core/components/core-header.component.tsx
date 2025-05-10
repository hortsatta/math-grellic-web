import { memo, useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import cx from 'classix';

import { UserRole } from '#/user/models/user.model';
import {
  generateSuperAdminRouteLinks,
  superAdminBaseRoute,
  superAdminRoutes,
} from '#/app/routes/super-admin-routes';
import {
  generateAdminRouteLinks,
  adminBaseRoute,
  adminRoutes,
} from '#/app/routes/admin-routes';
import {
  generateTeacherRouteLinks,
  teacherBaseRoute,
  teacherRoutes,
} from '#/app/routes/teacher-routes';
import {
  generateStudentRouteLinks,
  studentBaseRoute,
  studentRoutes,
} from '#/app/routes/student-routes';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { SchoolYearPickerModal } from '#/school-year/components/school-year-picker-modal.component';
import { useAuth } from '#/auth/hooks/use-auth.hook';
import { useBoundStore } from '../hooks/use-store.hook';
import { useScroll } from '../hooks/use-scroll.hook';
import { CoreClock } from './core-clock.component';
import { CoreMobileNav } from './core-mobile-nav.component';

import type { ComponentProps } from 'react';
import type { SchoolYear } from '#/school-year/models/school-year.model';

export const CoreHeader = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'header'>) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isScrollTop } = useScroll();
  const { logout } = useAuth();
  const user = useBoundStore((state) => state.user);
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const setSchoolYear = useBoundStore((state) => state.setSchoolYear);
  const [openSchoolYearModal, setOpenSchoolYearModal] = useState(false);

  // TODO notification

  const [publicId, role] = useMemo(() => [user?.publicId, user?.role], [user]);

  const schoolYearTitle = useMemo(() => schoolYear?.title, [schoolYear]);

  const navLinks = useMemo(() => {
    switch (role) {
      case UserRole.Student:
        return generateStudentRouteLinks();
      case UserRole.Teacher:
        return generateTeacherRouteLinks();
      case UserRole.Admin:
        return generateAdminRouteLinks();
      case UserRole.SuperAdmin:
        return generateSuperAdminRouteLinks();
    }

    return [];
  }, [role]);

  const hasRightSidebar = useMemo(() => {
    const targetNavLink = navLinks.find((link) => link.to === pathname);
    return (targetNavLink as any)?.hasRightSidebar;
  }, [pathname, navLinks]);

  const handleUserAccount = useCallback(() => {
    if (!role) {
      return;
    }

    switch (role) {
      case UserRole.Student:
        navigate(`/${studentBaseRoute}/${studentRoutes.account.to}`);
        break;
      case UserRole.Teacher:
        navigate(`/${teacherBaseRoute}/${teacherRoutes.account.to}`);
        break;
      case UserRole.Admin:
        navigate(`/${adminBaseRoute}/${adminRoutes.account.to}`);
        break;
      case UserRole.SuperAdmin:
        navigate(`/${superAdminBaseRoute}/${superAdminRoutes.account.to}`);
        break;
    }
  }, [role, navigate]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const switchSchoolYear = useCallback(() => {
    setOpenSchoolYearModal(true);
  }, [setOpenSchoolYearModal]);

  const handleSchoolYearModalChange = useCallback(
    (schoolYear: SchoolYear) => {
      setSchoolYear(schoolYear);
      setOpenSchoolYearModal(false);
    },
    [setSchoolYear],
  );

  const handleSchoolYearModalClose = useCallback(() => {
    setOpenSchoolYearModal(false);
  }, []);

  return (
    <>
      <header
        className={cx(
          'fixed bottom-0 left-0 right-auto top-auto z-20 w-full rounded-none px-0 transition-all duration-300 lg:bottom-auto lg:left-auto lg:right-10 lg:top-4 lg:w-fit lg:rounded-lg',
          'flex items-center justify-between border-0 border-t border-t-primary-border-light bg-white lg:block lg:border lg:border-transparent lg:bg-backdrop',
          !isScrollTop && 'drop-shadow-sm lg:!border-accent/20 lg:!px-2.5',
          className,
        )}
        {...moreProps}
      >
        {user && (
          <CoreMobileNav
            className='h-[48px]'
            user={user}
            links={navLinks}
            hasRightSidebar={hasRightSidebar}
            onLogout={handleLogout}
            onUserAccount={handleUserAccount}
            onSchoolYear={switchSchoolYear}
          />
        )}
        <div className='hidden h-[48px] items-center justify-center gap-2.5 lg:flex'>
          <div className='items-center gap-1.5'>
            {/* <BaseIconButton name='bell' variant='solid' size='sm' /> */}
            <BaseDropdownMenu
              customMenuButton={
                <div>
                  <Menu.Button
                    as={BaseIconButton}
                    name='list'
                    variant='solid'
                    size='sm'
                  />
                </div>
              }
            >
              <div className='flex items-center justify-center gap-1 px-2.5 py-1 text-sm opacity-80'>
                <BaseIcon name='identification-badge' size={20} />
                {publicId}
              </div>
              <BaseDivider className='my-1' />
              <Menu.Item
                as={BaseDropdownButton}
                iconName='user'
                onClick={handleUserAccount}
              >
                Account
              </Menu.Item>
              <Menu.Item
                as={BaseDropdownButton}
                iconName='sign-out'
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
              <BaseDivider className='my-1' />
              <Menu.Item
                as={BaseDropdownButton}
                className='!py-1.5'
                iconName='graduation-cap'
                disableFixedHeight
                onClick={switchSchoolYear}
              >
                <div className='flex flex-col'>
                  <span className='text-sm'>{schoolYearTitle}</span>
                  <small className='text-[12px] opacity-70'>
                    Tap to switch school year
                  </small>
                </div>
              </Menu.Item>
            </BaseDropdownMenu>
          </div>
          <BaseDivider className='hidden lg:block' vertical />
          <CoreClock className='h-full' isCompact={!isScrollTop} />
        </div>
      </header>
      <SchoolYearPickerModal
        value={schoolYear}
        open={openSchoolYearModal}
        onChange={handleSchoolYearModalChange}
        onClose={handleSchoolYearModalClose}
      />
    </>
  );
});
