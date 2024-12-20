import { Router } from 'vue-router';

import { useAppStore, useTabBarStore, useUserStore } from '@/store';

export default function setupRemoveStateGuard(router: Router) {
  router.afterEach(async (to) => {
    if (to.name === 'login') {
      const tabStore = useTabBarStore();
      const userStore = useUserStore();
      const appStore = useAppStore();
      tabStore.resetStore();
      userStore.resetStore();
      appStore.resetStore();
    }
  });
}
