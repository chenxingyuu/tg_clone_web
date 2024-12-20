import { defineStore } from 'pinia';
import { logout as userLogout, login as userLogin } from '@/api/system/auth';
import { setToken, clearToken, setScopes, clearScopes } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { AuthRes, LoginData } from '@/api/system/types';
import { getUserInfo } from '@/api/user';
import { UserState } from './types';

// Helper functions
async function handleLoginSuccess(data: AuthRes) {
  setToken(`${data.access_token}`);
  setScopes(data.scopes);
}

async function handleLoginError() {
  clearToken();
  clearScopes();
}

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    username: '',
    avatar: 'https://dummyimage.com/200x200/4A7BF7&text=Hello',
    email: undefined,
    roles: [],
    permissions: [],
    menus: [],
  }),
  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },
  actions: {
    resetStore() {
      this.$reset(); // 重置 store
      localStorage.removeItem('user'); // 删除 localStorage 中的持久化数据（替换为正确的键名）
      clearToken();
      clearScopes();
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    setPermissions(permissions: string[]) {
      return new Promise((resolve) => {
        this.permissions = permissions;
        resolve(this.permissions);
      });
    },

    clearPermissions() {
      return new Promise((resolve) => {
        this.permissions = [];
        resolve(this.permissions);
      });
    },

    setMenus(menus: string[]) {
      return new Promise((resolve) => {
        this.menus = menus;
        resolve(this.menus);
      });
    },

    clearMenus() {
      return new Promise((resolve) => {
        this.menus = [];
        resolve(this.menus);
      });
    },

    // Get user's information
    async info() {
      const { data } = await getUserInfo();
      this.setInfo(data);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const { data } = await userLogin(loginForm);
        await handleLoginSuccess(data);
        await this.setPermissions(data.scopes);
      } catch (err) {
        await handleLoginError();
        await this.clearPermissions();
        throw err;
      }
    },
    // loginByGithub
    logoutCallBack() {
      this.resetStore();
      removeRouteListener();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
  persist: true,
});

export default useUserStore;
