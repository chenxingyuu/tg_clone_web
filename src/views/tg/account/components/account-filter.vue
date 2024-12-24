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
          <a-col :span="8">
            <a-form-item field="name" :label="$t('tg.account.name')">
              <a-input
                v-model="localFormModel.name"
                :placeholder="$t('tg.account.name.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="phone" :label="$t('tg.account.phone')">
              <a-input
                v-model="localFormModel.phone"
                :placeholder="$t('tg.account.phone.placeholder')"
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
          v-permission="['tg:account:update', 'tg:account:read']"
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
  import { AccountQueryParams } from '@/api/tg/types';

  const props = defineProps<{ modelValue: AccountQueryParams }>();
  // 初始化本地表单模型
  const localFormModel = ref<AccountQueryParams>({ ...props.modelValue });

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
      name: undefined,
      phone: undefined,
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
