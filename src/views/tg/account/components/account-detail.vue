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
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
  import { computed, defineEmits, defineProps, ref, watch } from 'vue';
  import { isEqual } from 'lodash';
  import { Account } from '@/api/tg/types';

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
