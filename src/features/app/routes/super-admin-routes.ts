import type { NavItem } from '#/base/models/base.model';

export const superAdminPath = 'sad';

export const superAdminBaseRoute = `${superAdminPath}/dashboard`;

export const superAdminRoutes = {
  dashboard: {
    name: 'dashboard',
    to: superAdminBaseRoute,
    label: 'Dashboard',
    iconName: 'squares-four',
    end: true,
    size: 36,
  },
  admin: {
    name: 'admins',
    to: 'admins',
    label: 'Administrators',
    iconName: 'users-four',
    createTo: 'register',
    editTo: 'edit',
    hasRightSidebar: true,
  },
  account: {
    name: 'account',
    to: 'account',
    label: 'Account',
    editTo: 'edit',
    hidden: true,
  },
};

export function generateSuperAdminRouteLinks() {
  const links = Object.entries(superAdminRoutes)
    .map((route) => route[1])
    .filter(({ hidden }: any) => !hidden);

  return links.map(({ to, ...t }) => ({
    ...t,
    to: to === superAdminBaseRoute ? `/${to}` : `/${superAdminBaseRoute}/${to}`,
  })) as NavItem[];
}
