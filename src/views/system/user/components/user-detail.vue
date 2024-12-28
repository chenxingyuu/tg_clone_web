<template>
  <a-drawer
    :title="title"
    :visible="visible"
    width="40%"
    unmount-on-close
    @close="handleClose"
    @ok="handleSave"
    @cancel="handleClose"
  >
    <a-form
      :model="formModel"
      :label-col-props="{ span: 6 }"
      :wrapper-col-props="{ span: 18 }"
      :auto-label-width="true"
      label-align="right"
    >
      <a-form-item field="username" :label="$t('system.user.username')">
        <a-input
          v-model="formModel.username"
          :placeholder="$t('system.user.username.placeholder')"
          :readonly="isDetailMode"
        />
      </a-form-item>
      <a-form-item field="email" :label="$t('system.user.email')">
        <a-input
          v-model="formModel.email"
          :placeholder="$t('system.user.email.placeholder')"
          :readonly="isDetailMode"
        />
      </a-form-item>
      <a-form-item field="roles" :label="$t('system.user.roles')">
        <a-spin v-if="roleLoading" />
        <a-transfer
          v-else
          :title="['所有', '当前']"
          :data="allRoles"
          :default-value="userRoles"
          @change="handleRoleChange"
        >
        </a-transfer>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineEmits, watch, computed } from 'vue';
  import { TransferItem } from '@arco-design/web-vue/es/transfer/interface';
  import useLoading from '@/hooks/loading';
  import { isEqual } from 'lodash';
  import { getUserRoles } from '@/api/system/users';
  import { getAllRole } from '@/api/system/roles';
  import { User } from '@/api/system/types';

  const { loading: roleLoading, setLoading: setRoleLoading } =
    useLoading(false);

  const props = defineProps<{
    visible: boolean;
    title: string;
    mode: 'add' | 'edit' | 'detail';
    user: User;
  }>();

  const emit = defineEmits(['update:visible', 'add', 'edit', 'fetch']);

  const formModel = ref({ ...props.user });
  const originalFormModel = ref({ ...props.user }); // 保存初始状态

  const allRoles = ref<TransferItem[]>([]);

  const userRoles = ref<string[]>([]);
  const originalUserRoles = ref<string[]>([]); // 保存初始状态

  const fetchAllRoles = async () => {
    try {
      const { data } = await getAllRole();
      allRoles.value = data.map((role) => ({
        value: `${role.id}`,
        label: role.name,
        disabled: false,
      }));
    } catch (err) {
      // Handle error
    } finally {
      // finally
    }
  };

  fetchAllRoles();

  const fetchUserRoles = async () => {
    try {
      setRoleLoading(true);
      const { data } = await getUserRoles(props.user.id);
      // 将返回的数据转换为 a-transfer 组件需要的格式
      userRoles.value = data.map((role) => `${role.id}`);
      originalUserRoles.value = [...userRoles.value]; // 保存初始状态
    } catch (err) {
      // Handle error
    } finally {
      // finally
      setRoleLoading(false);
    }
  };

  // 处理 a-transfer 中选中的项变化
  const handleRoleChange = (newTargetKeys: string[]) => {
    userRoles.value = newTargetKeys;
    // 这里的 newTargetKeys 是用户当前选中的项的 key 列表
    // 你可以在这里添加其他逻辑，例如保存选中的权限到服务器
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        originalFormModel.value = { ...props.user };
        formModel.value = { ...props.user };
      }
    }
  );

  watch(
    () => props.user,
    (newVal) => {
      formModel.value = { ...newVal };
    }
  );

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        if (props.user.id !== 0) {
          fetchUserRoles();
        }
        originalFormModel.value = { ...props.user }; // 保存初始状态
        formModel.value = { ...props.user };
      } else {
        userRoles.value = [];
        originalUserRoles.value = [...userRoles.value];
      }
    }
  );
  const handleClose = () => {
    emit('update:visible', false);
    formModel.value = { ...props.user };
  };

  const handleSave = () => {
    const equalForm = isEqual(formModel.value, originalFormModel.value);
    const equalRole = isEqual(userRoles.value, originalUserRoles.value);
    if (equalForm && equalRole) {
      // 数据没有改变，不调用接口
      handleClose();
      return;
    }
    switch (props.mode) {
      case 'add':
        emit('add', formModel.value, userRoles.value);
        break;
      case 'edit':
        emit('edit', formModel.value, userRoles.value, equalForm, equalRole);
        break;
      default:
        handleClose();
        break;
    }
  };

  const isDetailMode = computed(() => props.mode === 'detail');
</script>
