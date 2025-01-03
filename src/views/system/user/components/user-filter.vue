<template>
  <a-row>
    <a-col :flex="1">
      <a-form
        :model="localFormModel"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
        :auto-label-width="true"
        label-align="right"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="username" :label="$t('system.user.username')">
              <a-input
                v-model="localFormModel.username"
                :placeholder="$t('system.user.username.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="email" :label="$t('system.user.email')">
              <a-input
                v-model="localFormModel.email"
                :placeholder="$t('system.user.email.placeholder')"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider style="height: 32px" direction="vertical" />
    <a-col :flex="'54px'" style="text-align: right">
      <a-space direction="horizontal" :size="18">
        <a-button @click="onReset">
          <template #icon>
            <icon-refresh />
          </template>
          {{ $t('searchTable.form.reset') }}
        </a-button>
        <a-button type="primary" @click="onSearch">
          <template #icon>
            <icon-search />
          </template>
          {{ $t('searchTable.form.search') }}
        </a-button>
        <a-button
          v-permission="['system:user:update', 'system:user:read']"
          type="primary"
          @click="onCreate"
        >
          <template #icon>
            <icon-plus />
          </template>
          {{ $t('searchTable.operation.create') }}
        </a-button>
      </a-space>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
  import { defineEmits, ref, watch } from 'vue';
  import { UserQueryParams } from '@/api/system/types';

  const props = defineProps<{ modelValue: UserQueryParams }>();
  // 初始化本地表单模型
  const localFormModel = ref<UserQueryParams>({ ...props.modelValue });
  const emit = defineEmits(['search', 'create', 'update:model-value']);

  // 监听 localFormModel 的变化，自动同步到父组件
  watch(
    localFormModel,
    (newVal) => {
      emit('update:model-value', newVal);
    },
    { deep: true }
  );

  const onReset = () => {
    Object.assign(localFormModel.value, {
      username: undefined,
      email: undefined,
    });

    emit('search');
  };

  const onSearch = () => {
    emit('search');
  };

  const onCreate = () => {
    emit('create');
  };
</script>
