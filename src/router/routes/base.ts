import type { Router, RouteRecordRaw } from 'vue-router';
import { REDIRECT_ROUTE_NAME } from '@/router/constants';
import { MenuTree } from '@/api/system/types';

export const DEFAULT_LAYOUT = () => import('@/layout/default-layout.vue');

export const REDIRECT_MAIN: RouteRecordRaw = {
  path: '/redirect',
  name: 'redirectWrapper',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
    hideInMenu: true,
  },
  children: [
    {
      path: '/redirect/:path',
      name: REDIRECT_ROUTE_NAME,
      component: () => import('@/views/redirect/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};

export const NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  component: () => import('@/views/not-found/index.vue'),
  meta: {
    requiresAuth: false,
    hideInMenu: true,
  },
};

// 定义可用的组件模块
const modules = import.meta.glob('@/views/**/index.vue');

// 创建一个函数，根据路径获取组件
function getComponent(componentPath: string) {
  if (!componentPath) {
    return () => import('@/layout/default-layout.vue');
  }
  return modules[`/src/views${componentPath}/index.vue`];
}

// 定义一个函数，将 MenuTree 转换为 RouteRecordRaw
export function ConvertMenuTreeToRoute(menu: MenuTree): RouteRecordRaw {
  return {
    path: menu.path,
    name: menu.name,
    component: getComponent(menu.components),
    meta: {
      requiresAuth: menu.meta.requires_auth,
      locale: menu.meta.locale,
      icon: menu.meta.icon,
      ignoreCache: menu.meta.ignore_cache,
      hideInMenu: menu.meta.hide_in_menu,
      noAffix: menu.meta.no_affix,
      order: menu.meta.order,
    },
    children: menu.children ? menu.children.map(ConvertMenuTreeToRoute) : [],
  };
}

// 遍历并递归添加路由
export function AddRoutesFromMenuTree(menuTree: MenuTree[], router: Router) {
  menuTree.forEach((menu) => {
    const route = ConvertMenuTreeToRoute(menu);

    // 添加当前路由
    if (route.name && !router.hasRoute(route.name)) {
      router.addRoute(route);
    }

    // 如果有子菜单，递归添加
    if (menu.children && menu.children.length > 0) {
      AddRoutesFromMenuTree(menu.children, router);
    }
  });
}
