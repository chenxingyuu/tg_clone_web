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
            <a-form-item field="username" :label="$t('tg.dialog.username')">
              <a-input
                v-model="localFormModel.username"
                :placeholder="$t('tg.dialog.username.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="title" :label="$t('tg.dialog.title')">
              <a-input
                v-model="localFormModel.title"
                :placeholder="$t('tg.dialog.title.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="account_id" :label="$t('tg.dialog.account_id')">
              <a-select
                v-model="localFormModel.account_id"
                :placeholder="$t('tg.dialog.account_id.placeholder')"
                allow-clear
                @clear="localFormModel.account_id = undefined"
              >
                <a-option
                  v-for="option in accountIDOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </a-option>
              </a-select>
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
      </a-space>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
  import { defineEmits, onMounted, ref, watch } from 'vue';
  import { DialogQueryParams } from '@/api/tg/types';
  import { getAccountListAll } from '@/api/tg/account';

  const props = defineProps<{ modelValue: DialogQueryParams }>();
  // 初始化本地表单模型
  const localFormModel = ref<DialogQueryParams>({
    ...props.modelValue,
  });

  const emit = defineEmits(['search', 'update:model-value']);

  // 监听 localFormModel 的变化，自动同步到父组件
  watch(
    localFormModel,
    (newVal) => {
      emit('update:model-value', newVal);
    },
    { deep: true }
  );

  const accountIDOptions = ref<{ value: string; label: string }[]>([]);
  // 初始化 accountIDOptions
  onMounted(async () => {
    const response = await getAccountListAll();
    accountIDOptions.value = response.data.map((item: any) => ({
      value: item.id,
      label: item.name,
    }));
  });
  const onReset = () => {
    Object.assign(localFormModel.value, {
      username: undefined,
      title: undefined,
      account_id: undefined,
    });

    emit('search');
  };

  const onSearch = () => {
    emit('search');
  };
</script>
