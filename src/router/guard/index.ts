import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import setupUserInfoGuard from '@/router/guard/userInfo';
import setupUserMenuGuard from '@/router/guard/userMenu';
import setupRemoveStateGuard from '@/router/guard/removeState';

function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    // emit route change
    setRouteEmitter(to);
  });
}

export default function createRouteGuard(router: Router) {
  setupPageGuard(router);
  setupUserInfoGuard(router);
  setupUserMenuGuard(router);
  setupRemoveStateGuard(router);
}
