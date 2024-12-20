import { defineStore } from 'pinia';
import { Notification } from '@arco-design/web-vue';
import defaultSettings from '@/config/settings.json';
import { getMenuList } from '@/api/user';
import { MenuTree } from '@/api/system/types';
import { AppState } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => ({
    ...defaultSettings,
  }),
  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): MenuTree[] {
      return state.serverMenu;
    },
  },
  actions: {
    resetStore() {
      this.$reset(); // 重置 store
      localStorage.removeItem('app'); // 删除 localStorage 中的持久化数据（替换为正确的键名）
    },
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    async fetchServerMenuConfig() {
      try {
        const { data } = await getMenuList();
        // 将路由数据存储在 store 中，以便在其他地方使用
        this.serverMenu = data;
        // 返回路由数据
        return data;
      } catch (error) {
        Notification.error({
          id: 'menuNotice',
          content: 'error',
          closable: true,
        });
        throw error; // 抛出错误，以便在调用处处理
      }
    },
  },
  persist: true,
});

export default useAppStore;
