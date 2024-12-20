import { LocationQueryRaw, Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';

export default function setupUserInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    const redirectToLogin = () => {
      next({
        name: 'login',
        query: {
          redirect: to.path,
          ...to.query,
        } as LocationQueryRaw,
      });
    };

    if (isLogin()) {
      try {
        if (!userStore.username) {
          await userStore.info();
        }
      } catch (error) {
        await userStore.logout();
        redirectToLogin();
      }
      next();
    } else if (to.name === 'login') {
      next();
    } else {
      redirectToLogin();
    }

    NProgress.done();
  });
}
