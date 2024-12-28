<template>
  <a-drawer
    :title="title"
    :visible="visible"
    width="40%"
    :unmount-on-close="true"
    @close="handleClose"
    @ok="handleSave"
    @cancel="handleClose"
  >
    <a-form :model="formModel" :auto-label-width="true" label-align="right">
      <a-divider>账号信息</a-divider>
      <a-col :span="24">
        <a-form-item field="name" required :label="$t('tg.account.name')">
          <a-input
            v-model="formModel.name"
            :placeholder="$t('tg.account.name.placeholder')"
            :readonly="isDetailMode"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="phone" required :label="$t('tg.account.phone')">
          <a-input
            v-model="formModel.phone"
            :placeholder="$t('tg.account.phone.placeholder')"
            :readonly="isDetailMode"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="password" :label="$t('tg.account.password')">
          <a-input
            v-model="formModel.password"
            :placeholder="$t('tg.account.password.placeholder')"
            :readonly="isDetailMode"
          >
            <template #suffix>
              <a-tooltip :content="$t('tg.account.password.tooltip')">
                <icon-info-circle />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="api_id" required :label="$t('tg.account.api_id')">
          <a-input
            v-model="formModel.api_id"
            :placeholder="$t('tg.account.api_id.placeholder')"
            :readonly="isDetailMode"
          >
            <template #suffix>
              <a-tooltip :content="$t('tg.account.api_id.tooltip')">
                <icon-info-circle />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          field="api_hash"
          required
          :label="$t('tg.account.api_hash')"
        >
          <a-input
            v-model="formModel.api_hash"
            :placeholder="$t('tg.account.api_hash.placeholder')"
            :readonly="isDetailMode"
          />
        </a-form-item>
      </a-col>
      <a-divider>基本信息</a-divider>
      <a-col :span="24">
        <a-form-item field="first_name" :label="$t('tg.account.first_name')">
          <a-input
            v-model="formModel.first_name"
            :placeholder="$t('tg.account.first_name.placeholder')"
            :readonly="true"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="last_name" :label="$t('tg.account.last_name')">
          <a-input
            v-model="formModel.last_name"
            :placeholder="$t('tg.account.last_name.placeholder')"
            :readonly="true"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="tg_id" :label="$t('tg.account.tg_id')">
          <a-input
            v-model="formModel.tg_id"
            :placeholder="$t('tg.account.tg_id.placeholder')"
            :readonly="true"
          />
        </a-form-item>
      </a-col>
      <a-divider>账号状态</a-divider>
      <a-col :span="12">
        <a-form-item field="status" :label="$t('tg.account.status')">
          <a-space>
            <a-tag size="large" :color="getAccountStatusColor(formModel.status)"
              >{{ getAccountStatusMessage(formModel.status) }}
            </a-tag>
            <a-button
              v-if="isExpired"
              type="text"
              status="normal"
              size="medium"
              @click="openVerificationModal"
            >
              激活
            </a-button>
          </a-space>
        </a-form-item>
      </a-col>
    </a-form>
    <a-modal
      v-model="isVerificationModalVisible"
      title="激活 TG 账号"
      :unmount-on-close="true"
      @ok="isVerificationModalVisible = false"
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
  </a-drawer>
</template>

<script setup lang="ts">
  import { computed, defineEmits, defineProps, ref, watch } from 'vue';
  import { isEqual } from 'lodash';
  import {
    Account,
    AccountStatus,
    getAccountStatusColor,
    getAccountStatusMessage,
  } from '@/api/tg/types';
  import useSocket from '@/hooks/useSocket';
  import { ESocketRouter } from '@/hooks/useSocket/types';
  import { Message } from '@arco-design/web-vue';

  const { emit: socketEmit, onAndAutoOff } = useSocket();
  const props = defineProps<{
    visible: boolean;
    title: string;
    mode: 'add' | 'edit' | 'detail';
    account: Account;
  }>();

  const emit = defineEmits(['update:visible', 'add', 'edit', 'fetch']);

  const formModel = ref({ ...props.account });
  const originalFormModel = ref({ ...props.account }); // 保存初始状态

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        originalFormModel.value = { ...props.account };
        formModel.value = { ...props.account };
      }
    }
  );

  watch(
    () => props.account,
    (newVal) => {
      formModel.value = { ...newVal };
    }
  );

  const handleClose = () => {
    emit('update:visible', false);
    formModel.value = { ...props.account };
  };

  const handleSave = () => {
    if (isEqual(formModel.value, originalFormModel.value)) {
      handleClose();
      return;
    }
    const emitEvent = props.mode === 'add' ? 'add' : 'edit';
    emit(emitEvent, formModel.value);
  };

  const isDetailMode = computed(() => props.mode === 'detail');
  const isExpired = computed(
    () => formModel.value.status === AccountStatus.EXPIRED
  );

  const isVerificationModalVisible = ref(false);
  const verificationCodeLength = ref(5);
  const verificationFormReadonly = ref(false);
  const verificationFormError = ref(false);
  const verificationForm = ref({ code: '' });
  const isButtonDisabled = ref(false);
  const countdown = ref(0);
  const loginMessageList = ref<string[]>([]);

  const openVerificationModal = () => {
    isVerificationModalVisible.value = true;
  };
  const sendVerificationCode = () => {
    // 发送验证码的逻辑
    socketEmit('tg_account_login', formModel.value.phone);

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
  const handleVerification = () => {
    loginMessageList.value = [];
    // 发送验证码
    socketEmit(
      'tg_account_send_code',
      formModel.value.phone,
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
      emit('fetch');
      // 关闭弹窗
      setTimeout(() => {
        isVerificationModalVisible.value = false;
      }, 3000);
      Message.success('登录成功');
    },
  });
</script>

<style scoped lang="less">
  .gis-map {
    width: 100%;
    height: 400px;
    display: flex;
    flex-direction: column;

    .map-renderer {
      width: 100%;
      height: 100%;
      background-color: #1c4067;
    }
  }
</style>
