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
      <a-col :span="24">
        <a-form-item
          field="username"
          required
          :label="$t('tg.dialog.username')"
        >
          <a-input
            v-model="formModel.username"
            :placeholder="$t('tg.dialog.username.placeholder')"
            :readonly="isDetailMode"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="title" required :label="$t('tg.dialog.title')">
          <a-input
            v-model="formModel.title"
            :placeholder="$t('tg.dialog.title.placeholder')"
            :readonly="isDetailMode"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="type" :label="$t('tg.dialog.type')">
          <a-select
            v-model="formModel.type"
            :placeholder="$t('tg.dialog.type.placeholder')"
            :disabled="isDetailMode"
          >
            <a-option
              v-for="option in typeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="tg_id" :label="$t('tg.dialog.tg_id')">
          <a-input
            v-model="formModel.tg_id"
            :placeholder="$t('tg.dialog.tg_id.placeholder')"
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
  import { Dialog, DialogType, getDialogTypeMessage } from '@/api/tg/types';

  const props = defineProps<{
    visible: boolean;
    title: string;
    mode: 'add' | 'edit' | 'detail';
    dialog: Dialog;
  }>();

  const emit = defineEmits(['update:visible', 'add', 'edit', 'fetch']);

  const formModel = ref({ ...props.dialog });
  const originalFormModel = ref({ ...props.dialog }); // 保存初始状态

  const typeOptions = Object.values(DialogType)
    .filter((value) => typeof value === 'number') // 过滤掉反向映射中的键
    .map((value) => ({
      value: value as DialogType,
      label: getDialogTypeMessage(value as DialogType),
    }));

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        originalFormModel.value = { ...props.dialog };
        formModel.value = { ...props.dialog };
      }
    }
  );

  watch(
    () => props.dialog,
    (newVal) => {
      formModel.value = { ...newVal };
    }
  );

  const handleClose = () => {
    emit('update:visible', false);
    formModel.value = { ...props.dialog };
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
