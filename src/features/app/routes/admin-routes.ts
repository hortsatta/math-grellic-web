import type { NavItem } from '#/base/models/base.model';

export const adminPath = 'adm';

export const adminBaseRoute = `${adminPath}/dashboard`;

export const adminRoutes = {
  dashboard: {
    name: 'dashboard',
    to: adminBaseRoute,
    label: 'Dashboard',
    iconName: 'squares-four',
    end: true,
    size: 36,
  },
  schoolYear: {
    name: 'school-year',
    to: 'school-year',
    label: 'School Year',
    iconName: 'graduation-cap',
    createTo: 'create',
    editTo: 'edit',
    hasRightSidebar: true,
  },
  teacher: {
    name: 'teachers',
    to: 'teachers',
    label: 'Teachers',
    iconName: 'chalkboard-teacher',
    createTo: 'enroll',
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

export function generateAdminRouteLinks() {
  const links = Object.entries(adminRoutes)
    .map((route) => route[1])
    .filter(({ hidden }: any) => !hidden);

  return links.map(({ to, ...t }) => ({
    ...t,
    to: to === adminBaseRoute ? `/${to}` : `/${adminBaseRoute}/${to}`,
  })) as NavItem[];
}
