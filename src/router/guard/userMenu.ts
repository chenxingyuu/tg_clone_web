import { Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useAppStore, useUserStore } from '@/store';
import { NOT_FOUND, WHITE_LIST } from '@/router/constants';
import { AddRoutesFromMenuTree } from '@/router/routes/base';

NProgress.configure({
  showSpinner: false,
});

export default function setupUserMenuGuard(router: Router) {
  let dynamicRoutesAdded = false;
  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    const userStore = useUserStore();
    const appStore = useAppStore();
    if (!userStore.userInfo.username) {
      dynamicRoutesAdded = false;
    }
    // 如果用户已登录且动态路由未加载
    if (userStore.userInfo.username && !dynamicRoutesAdded) {
      if (!appStore.appAsyncMenus.length) {
        // 获取服务端菜单配置
        await appStore.fetchServerMenuConfig();
      }
      dynamicRoutesAdded = true;
      // 动态添加路由
      appStore.appAsyncMenus.forEach((menu) => {
        AddRoutesFromMenuTree([menu], router); // 将树形结构传入
      });
      // 立即重定向到目标路由，避免进入未找到的逻辑
      NProgress.done();
      // 返回重定向目标
      next({
        path: to.path,
        query: to.query,
        replace: true,
      });
      return;
    }
    // 校验当前路由是否存在于服务端菜单或白名单中
    const serverMenuConfig = [...appStore.appAsyncMenus, ...WHITE_LIST];
    let exist = false;
    while (serverMenuConfig.length && !exist) {
      const element = serverMenuConfig.shift();
      if (element && element?.name === to.name) {
        exist = true;
      }
      if (element?.children) {
        serverMenuConfig.push(...element.children);
      }
    }

    if (exist) {
      // 允许导航
      next();
    } else {
      // 跳转到 NOT_FOUND 路由
      next(NOT_FOUND);
    }

    NProgress.done();
  });
}
