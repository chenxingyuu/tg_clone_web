import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SYSTEM: AppRouteRecordRaw = {
  path: '/system',
  name: 'System',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.system',
    requiresAuth: true,
    icon: 'icon-menu',
    order: 5,
  },
  children: [
    {
      path: 'users',
      name: 'Users',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        locale: 'menu.system.user',
        requiresAuth: true,
        icon: 'icon-user',
      },
    },
    {
      path: 'roles',
      name: 'Roles',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        locale: 'menu.system.role',
        requiresAuth: true,
        icon: 'icon-skin',
      },
    },
    {
      path: 'permissions',
      name: 'Permissions',
      component: () => import('@/views/system/permission/index.vue'),
      meta: {
        locale: 'menu.system.permission',
        requiresAuth: true,
        icon: 'icon-safe',
      },
    },
    // {
    //   path: 'menus',
    //   name: 'Menus',
    //   component: () => import('@/views/system/menu/index.vue'),
    //   meta: {
    //     locale: 'menu.system.menu',
    //     requiresAuth: true,
    //     icon: 'icon-safe',
    //     roles: ['*'],
    //   },
    // },
  ],
};

export default SYSTEM;
