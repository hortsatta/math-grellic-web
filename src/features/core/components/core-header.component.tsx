import { Fragment, memo, useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import cx from 'classix';

import { UserRole } from '#/user/models/user.model';
import { generateSuperAdminRouteLinks } from '#/app/routes/super-admin-routes';
import { generateAdminRouteLinks } from '#/app/routes/admin-routes';
import { generateTeacherRouteLinks } from '#/app/routes/teacher-routes';
import { generateStudentRouteLinks } from '#/app/routes/student-routes';
import {
  studentUserBaseRoute,
  teacherUserBaseRoute,
  adminUserBaseRoute,
  superAdminUserBaseRoute,
} from '#/user/route/current-user-handle.route';
import { teacherSearchBaseRoute } from '#/global-search/route/teacher-global-search-handle.route';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { GlobalSearchBarModal } from '#/global-search/components/global-search-bar-modal.component';
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
  const searchInputRef = useBoundStore((state) => state.searchInputRef);
  const setSchoolYear = useBoundStore((state) => state.setSchoolYear);
  const setSearchKeyword = useBoundStore((state) => state.setSearchKeyword);
  const [openSchoolYearModal, setOpenSchoolYearModal] = useState(false);
  const [openGlobalSearchModal, setOpenGlobalSearchModal] = useState(false);

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
        navigate(studentUserBaseRoute);
        break;
      case UserRole.Teacher:
        navigate(teacherUserBaseRoute);
        break;
      case UserRole.Admin:
        navigate(adminUserBaseRoute);
        break;
      case UserRole.SuperAdmin:
        navigate(superAdminUserBaseRoute);
        break;
    }
  }, [role, navigate]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleSearchSubmit = useCallback(
    (keyword: string | null) => {
      if (!keyword?.trim().length || !role) return;

      setSearchKeyword(keyword);
      setOpenGlobalSearchModal(false);

      switch (role) {
        case UserRole.Student:
          // navigate(studentSearchBaseRoute);
          // navigate(`/${studentBaseRoute}/${studentRoutes.search.to}`);
          break;
        case UserRole.Teacher:
          navigate(teacherSearchBaseRoute);
          break;
        // case UserRole.Admin:
        // navigate(adminSearchBaseRoute);
        //   break;
        // case UserRole.SuperAdmin:
        //   navigate(`/${superAdminBaseRoute}/${superAdminRoutes.account.to}`);
        //   break;
      }
    },
    [role, setSearchKeyword, navigate],
  );

  const showGlobalSearch = useCallback(() => {
    if (pathname.includes('/search')) {
      searchInputRef?.current?.focus();
      return;
    }

    setOpenGlobalSearchModal(true);
    setOpenSchoolYearModal(false);
  }, [pathname, searchInputRef]);

  const switchSchoolYear = useCallback(() => {
    setOpenSchoolYearModal(true);
    setOpenGlobalSearchModal(false);
  }, []);

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

  const handleGlobalSearchModalClose = useCallback(() => {
    setOpenGlobalSearchModal(false);
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
          <div className='flex items-center'>
            <BaseDropdownMenu
              customMenuButton={
                <div>
                  <Menu.Button as={Fragment}>
                    <Menu.Button
                      as={BaseIconButton}
                      name='list'
                      className='rounded-r-none'
                      variant={isScrollTop ? 'solid' : 'link'}
                      size='sm'
                    />
                  </Menu.Button>
                </div>
              }
            >
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
              <BaseDivider className='my-1' />
              <Menu.Item
                as={BaseDropdownButton}
                className='!py-1.5'
                iconName='identification-badge'
                disableFixedHeight
                onClick={handleUserAccount}
              >
                <div className='flex flex-col'>
                  <span className='text-sm'>{publicId}</span>
                  <small className='text-[12px] opacity-70'>Account</small>
                </div>
              </Menu.Item>
              <Menu.Item
                as={BaseDropdownButton}
                iconName='sign-out'
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </BaseDropdownMenu>
            <BaseIconButton
              name='magnifying-glass'
              className='rounded-l-none border-l-transparent'
              variant={isScrollTop ? 'solid' : 'link'}
              size='sm'
              onClick={showGlobalSearch}
            />
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
      <GlobalSearchBarModal
        open={openGlobalSearchModal}
        onSubmit={handleSearchSubmit}
        onClose={handleGlobalSearchModalClose}
      />
    </>
  );
});
