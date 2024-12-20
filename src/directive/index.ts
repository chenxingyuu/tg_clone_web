import { App } from 'vue';
import permission from './permission';
import role from './role';
import { setupScrollDirective } from './scroll';

export default {
  install(Vue: App) {
    Vue.directive('permission', permission);
    Vue.directive('role', role);
    setupScrollDirective(Vue);
  },
};
