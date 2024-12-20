<template>
  <a-config-provider :locale="locale">
    <router-view />
    <global-setting />
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue';
  import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
  import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
  import GlobalSetting from '@/components/global-setting/index.vue';
  import useLocale from '@/hooks/locale';
  import useSocket from '@/hooks/useSocket/index';
  import { ESocketRouter } from '@/hooks/useSocket/types';
  import { Notification as ArcoNotification } from '@arco-design/web-vue';

  const { onGlobal } = useSocket();

  // 浏览器通知
  const notification = (name: string, content: string) => {
    const { permission } = Notification;
    if (Notification.permission === 'granted') {
      const n = new Notification(name, {
        body: content,
      });
      // eslint-disable-next-line no-console
      console.log(n);
    }

    // 否则，我们需要向用户获取权限
    else if (permission !== 'denied') {
      Notification.requestPermission((p) => {
        if (p === 'granted') {
          const n = new Notification(name, {
            body: content,
          });
          // eslint-disable-next-line no-console
          console.log(n);
        }
      });
    }
  };
  const notificationInner = (name: string, content: string) => {
    ArcoNotification.info({
      title: name,
      content,
    });
  };
  const globalSocket = () => {
    onGlobal({
      [ESocketRouter.systemNotify]: async (res) => {
        notification(res.title, res.content);
      },
      [ESocketRouter.notifyMessage]: async (res) => {
        notificationInner(res.title, res.content);
      },
    });
  };

  const { currentLocale } = useLocale();
  const locale = computed(() => {
    switch (currentLocale.value) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return enUS;
    }
  });
  onMounted(() => {
    globalSocket();
  });
</script>
