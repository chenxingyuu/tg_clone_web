<script setup lang="ts">
  import { defineEmits, defineProps, ref, watch } from 'vue';
  import useSocket from '@/hooks/useSocket';
  import { ESocketRouter } from '@/hooks/useSocket/types';
  import { Message } from '@arco-design/web-vue';

  const emit = defineEmits(['update:visible']);

  const { emit: socketEmit, onAndAutoOff } = useSocket();
  const props = defineProps<{
    visible: boolean;
    title: string;
    phone: string;
  }>();
  const verificationForm = ref({ code: '' });
  const verificationCodeLength = ref(5);
  const verificationFormReadonly = ref(false);
  const verificationFormError = ref(false);
  const isButtonDisabled = ref(false);
  const countdown = ref(0);
  const loginMessageList = ref<string[]>([]);

  const sendVerificationCode = () => {
    // 发送验证码的逻辑
    socketEmit('tg_account_login', props.phone);

    // 禁用按钮并开始倒计时
    isButtonDisabled.value = true;
    countdown.value = 60;
    const interval = setInterval(() => {
      countdown.value -= 1;
      if (countdown.value <= 0) {
        clearInterval(interval);
        isButtonDisabled.value = false;
      }
    }, 1000);
  };

  const handleClose = () => {
    emit('update:visible', false);
  };

  const handleVerification = () => {
    loginMessageList.value = [];
    // 发送验证码
    socketEmit(
      'tg_account_send_code',
      props.phone,
      verificationForm.value.code
    );
  };

  watch(
    () => verificationForm.value.code,
    (newCode) => {
      if (newCode.length === verificationCodeLength.value) {
        // 假设验证码长度为6
        handleVerification();
      }
    }
  );

  // 自动滚动到底部
  const scrollToBottom = () => {
    const list = document.querySelector('.arco-list');
    list?.scrollTo(0, list.scrollHeight);
  };

  onAndAutoOff({
    [ESocketRouter.tgAccountLoginUpdate]: (msg: string) => {
      verificationFormReadonly.value = true;
      verificationFormError.value = false;
      // 接收登录状态更新，进行显示
      loginMessageList.value = [...loginMessageList.value, msg];
      scrollToBottom();
    },
    [ESocketRouter.tgAccountLoginError]: () => {
      // 登录失败
      loginMessageList.value = [...loginMessageList.value, '登录失败'];
      scrollToBottom();
      verificationFormError.value = true;
    },
    [ESocketRouter.tgAccountLoginSuccess]: () => {
      // 登录成功
      loginMessageList.value = [...loginMessageList.value, '登录成功'];
      scrollToBottom();
      // 重新获取账号列表
      // search();
      // 关闭弹窗

      setTimeout(() => {
        emit('update:visible', false);
      }, 3000);
      Message.success('登录成功');
    },
  });
</script>

<template>
  <a-modal
    :title="title"
    :visible="visible"
    :unmount-on-close="true"
    :footer="null"
    @cancel="handleClose"
  >
    <a-form :model="verificationForm">
      <a-form-item label="验证码">
        <a-space align="center" size="large">
          <a-verification-code
            v-model="verificationForm.code"
            :length="verificationCodeLength"
            :readonly="verificationFormReadonly"
            :error="verificationFormError"
          />
          <a-button
            :disabled="isButtonDisabled"
            type="primary"
            @click="sendVerificationCode"
          >
            {{ isButtonDisabled ? `${countdown}秒后重试` : '发送' }}
          </a-button>
        </a-space>
      </a-form-item>
      <a-list
        v-if="loginMessageList.length > 0"
        max-height="40px"
        :bordered="false"
        :split="false"
        size="small"
      >
        <a-list-item
          v-for="item in loginMessageList"
          :key="item"
          style="padding: 0 20px"
          >{{ item }}</a-list-item
        >
      </a-list>
    </a-form>
  </a-modal>
</template>

<style scoped lang="less"></style>
