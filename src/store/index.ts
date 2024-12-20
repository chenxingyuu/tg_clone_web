import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';

const pinia = createPinia();
pinia.use(piniaPersist);

export { useAppStore, useUserStore, useTabBarStore };
export default pinia;
