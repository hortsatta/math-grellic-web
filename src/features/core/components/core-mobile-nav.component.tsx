import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cx from 'classix';

import { options } from '#/utils/scrollbar.util';
import { superAdminBaseRoute } from '#/app/routes/super-admin-routes';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { teacherBaseRoute } from '#/app/routes/teacher-routes';
import { adminBaseRoute } from '#/app/routes/admin-routes';
import { UserRole } from '#/user/models/user.model';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseTooltip } from '#/base/components/base-tooltip.component';
import { useBoundStore } from '../hooks/use-store.hook';
import { CoreClock } from './core-clock.component';
import { CoreNavItem } from './core-nav-item.component';

import logoPng from '#/assets/images/logo-only-xs.png';

import type { ComponentProps } from 'react';
import type { IconWeight } from '@phosphor-icons/react';
import type { NavItem } from '#/base/models/base.model';
import type { User } from '#/user/models/user.model';

type Props = ComponentProps<'div'> & {
  links: NavItem[];
  user: User;
  hasRightSidebar: boolean;
  onLogout: () => void;
  onUserAccount?: () => void;
  onSchoolYear?: () => void;
  onSearch?: () => void;
};

const logoStyle = {
  backgroundImage: `url(${logoPng})`,
  backgroundSize: '30px 29px',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const buttonIconProps = {
  weight: 'bold' as IconWeight,
};

export const CoreMobileNav = memo(function ({
  className,
  links,
  user,
  hasRightSidebar,
  onLogout,
  onUserAccount,
  onSchoolYear,
  onSearch,
  ...moreProps
}: Props) {
  const { pathname } = useLocation();

  const toggleRightSidebarMode = useBoundStore(
    (state) => state.toggleRightSidebarMode,
  );

  const [openModal, setOpenModal] = useState(false);

  const [publicId, role] = useMemo(() => [user.publicId, user.role], [user]);

  const dashboardTo = useMemo(() => {
    switch (role) {
      case UserRole.Student:
        return `/${studentBaseRoute}`;
      case UserRole.Teacher:
        return `/${teacherBaseRoute}`;
      case UserRole.Admin:
        return `/${adminBaseRoute}`;
      case UserRole.SuperAdmin:
        return `/${superAdminBaseRoute}`;
    }
  }, [role]);

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => setOpenModal(isOpen),
    [],
  );

  const handleUserAccount = useCallback(() => {
    const partialAccountTo = `${studentRoutes.dashboard.name}/${studentRoutes.account.to}`;
    // Only close modal if current page is already current user account
    if (pathname.includes(partialAccountTo)) {
      handleSetModal(false)();
      return;
    }

    onUserAccount && onUserAccount();
  }, [pathname, onUserAccount, handleSetModal]);

  useEffect(() => {
    handleSetModal(false)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div
        className={cx(
          'flex w-full items-center justify-between lg:hidden',
          className,
        )}
        {...moreProps}
      >
        <div>
          <BaseTooltip content='Menu'>
            <BaseIconButton
              className='box-content !h-full !w-7 px-4'
              name='list'
              variant='link'
              iconProps={buttonIconProps}
              onClick={handleSetModal(true)}
            />
          </BaseTooltip>
          {!!onSearch && (
            <BaseTooltip content='Search'>
              <BaseIconButton
                className='box-content !h-full !w-7 px-2.5 -2xs:px-4'
                name='magnifying-glass'
                variant='link'
                iconProps={buttonIconProps}
                onClick={onSearch}
              />
            </BaseTooltip>
          )}
        </div>
        <Link
          to={dashboardTo}
          className='absolute left-1/2 h-full -translate-x-1/2 px-2.5'
        >
          <div style={logoStyle} className='h-full w-[30px]' />
        </Link>
        <div>
          {hasRightSidebar && (
            <BaseTooltip content='Sidebar'>
              <BaseIconButton
                className='box-content !h-full !w-7 px-2.5 -2xs:px-4'
                name='cards'
                variant='link'
                iconProps={buttonIconProps}
                onClick={toggleRightSidebarMode}
              />
            </BaseTooltip>
          )}
          <BaseTooltip content='School year'>
            <BaseIconButton
              className='box-content !h-full !w-7 px-4'
              name='graduation-cap'
              variant='link'
              iconProps={buttonIconProps}
              onClick={onSchoolYear}
            />
          </BaseTooltip>
        </div>
      </div>
      <BaseModal size='xs' open={openModal} onClose={handleSetModal(false)}>
        <nav className='block h-full lg:hidden'>
          <OverlayScrollbarsComponent
            className='h-full w-full'
            options={options}
            defer
          >
            <div className='flex w-full flex-col items-start justify-between gap-2.5 pb-2 -3xs:flex-row -3xs:items-center'>
              <button
                className={cx(
                  'flex items-center gap-1 overflow-hidden rounded-4px border border-accent/50 p-1.5 pr-2',
                  'text-sm leading-none transition-all hover:border-primary-focus hover:text-primary-focus',
                )}
                onClick={handleUserAccount}
              >
                <BaseIcon name='identification-badge' size={20} />
                <div className='flex flex-col items-start gap-0.5'>
                  <span>{publicId}</span>
                  <small className='text-[12px] opacity-70'>Account</small>
                </div>
              </button>
              <CoreClock className='order-first h-full w-full justify-between -3xs:order-none -3xs:w-auto -3xs:justify-center' />
            </div>
            <BaseDivider />
            <ul className='flex w-full flex-col'>
              {links.map(({ name, label, to, iconName, size, end }) => (
                <li key={name}>
                  <CoreNavItem
                    to={to}
                    label={label}
                    iconName={iconName}
                    size={size}
                    end={end}
                    isMobile
                  />
                </li>
              ))}
              <li>
                <BaseDivider />
                <BaseButton
                  className='!h-12 w-full justify-stretch px-4'
                  variant='link'
                  onClick={onLogout}
                >
                  <div className='flex items-center gap-5 text-base'>
                    <div className='flex w-9 items-center justify-center'>
                      <BaseIcon name='sign-out' size={32} />
                    </div>
                    Logout
                  </div>
                </BaseButton>
              </li>
            </ul>
          </OverlayScrollbarsComponent>
        </nav>
      </BaseModal>
    </>
  );
});
