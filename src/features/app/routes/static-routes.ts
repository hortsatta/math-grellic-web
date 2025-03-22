import type { IconName, NavItem } from '#/base/models/base.model';

[
  {
    name: '',
    to: '/about',
    label: 'About Math Grellic',
  },
  {
    name: 'training',
    to: '/training',
    label: 'Training',
  },
];

export const staticRoutes = {
  about: {
    name: 'about',
    to: 'about',
    label: 'About Math Grellic',
  },
  training: {
    name: 'training',
    to: 'training',
    label: 'Training',
  },
  userRegister: {
    name: 'register',
    to: 'user/register',
    label: 'Register',
    confirm: {
      to: 'confirm',
      lastStepTo: 'last-step',
    },
  },
};

export const staticRouteLinks = [staticRoutes.about, staticRoutes.training];

export const staticHomeNavItem: NavItem = {
  name: 'home',
  to: '',
  label: 'Home',
  end: true,
};

export const homeNavItem = {
  className: 'w-full',
  to: '/',
  label: 'Home',
  iconName: 'house' as IconName,
  end: true,
};
