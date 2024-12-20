import { RouteRecordRaw } from 'vue-router';

/**
 * 动态导入组件
 * @param componentPath 组件路径
 * @returns 组件
 */
export function loadView(componentPath: string) {
  // 移除 '@/' 前缀并转换为相对路径
  const path = componentPath.replace(/^@\//, '');
  return () => import(`@/${path}`);
}

/**
 * 将后端菜单数据转换为 Vue Router 期望的格式
 * @param menuData 后端返回的菜单数据
 * @returns Vue Router 期望的路由配置
 */
export function transformMenuData(menuData: any[]): RouteRecordRaw[] {
  return menuData.map((menu) => {
    const route: RouteRecordRaw = {
      path: menu.path,
      name: menu.name,
      // 动态导入组件，确保路径正确
      component: loadView(menu.components),
      meta: menu.meta,
      children:
        menu.children && menu.children.length > 0
          ? transformMenuData(menu.children)
          : [],
    };
    return route;
  });
}
