import { useUserStore } from '@/store';
import { Message } from '@arco-design/web-vue';

export default function useUser() {
  const userStore = useUserStore();

  const logout = async () => {
    await userStore.logout();
    Message.success('登出成功');
  };

  return {
    logout,
  };
}
