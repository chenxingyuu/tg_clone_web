import { io, Socket } from 'socket.io-client';
import { getToken } from '@/utils/auth';
import { onMounted, onUnmounted, shallowRef, watch } from 'vue';
import { TEmitter, TListener } from '@/hooks/useSocket/types';
import { useUserStore } from '@/store';

const SOCKET_URL = `/`;
const SOCKET_TIMEOUT = 1000;
const socketInstance = shallowRef<Socket<TListener, TEmitter> | null>(null); // socket 实例

export default function useSocket() {
  const userStore = useUserStore();
  const close = () => {
    if (!socketInstance.value) {
      return;
    }
    socketInstance.value.close();
    socketInstance.value = null;
  };
  const init = async () => {
    if (!userStore.username) {
      return;
    }
    // 当前id与上次socket发起的id一致, 复用
    if (
      (socketInstance.value?.io.opts.query?.username as string) ===
      userStore.username
    ) {
      return;
    }
    close();
    socketInstance.value = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      path: '/ws/socket.io',
      timeout: SOCKET_TIMEOUT,
      query: {
        username: userStore.username,
        token: getToken(),
      },
      autoConnect: true,
    });
  };
  /** 确保链接状态 */
  const ensureConnect = async (fn: () => void) => {
    if (!socketInstance.value) {
      await init();
    }
    const innerFn = () => {
      fn();
      socketInstance.value?.off('connect', innerFn);
    };
    if (!socketInstance.value?.connected) {
      socketInstance.value?.on('connect', innerFn);
    } else {
      fn();
    }
  };
  const onGlobal = async (arg: Partial<TListener>) => {
    await ensureConnect(() => {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, cb] of Object.entries(arg)) {
        (socketInstance.value as Socket).on(key, cb);
      }
    });
  };
  /** 绑定后, 在unmounted 时候自动解绑 */
  const onAndAutoOff = (arg: Partial<TListener>) => {
    onMounted(async () => {
      await ensureConnect(() => {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, cb] of Object.entries(arg)) {
          (socketInstance.value as Socket).on(key, cb);
        }
      });
    });
    onUnmounted(() => {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, cb] of Object.entries(arg)) {
        if (socketInstance.value) {
          (socketInstance.value as Socket).off(key, cb);
        }
      }
    });
  };
  /** 触发事件 */
  const emit = async <T extends keyof TEmitter>(
    ev: T,
    ...args: Parameters<TEmitter[T]>
  ) => {
    await ensureConnect(() => {
      socketInstance.value?.emit(ev, ...args);
    });
  };

  watch(
    userStore.$state,
    async (newValue) => {
      if (newValue && newValue.username !== '') {
        await init();
      } else {
        close();
      }
    },
    {
      immediate: true,
    }
  );

  return {
    socket: socketInstance,
    onAndAutoOff,
    emit,
    onGlobal,
  };
}
