<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.user']" />
    <div class="layout">
      <a-card class="general-card" :title="$t('system.user.title')">
        <user-filter
          v-model="filterFormModel"
          @search="search"
          @create="() => openDrawer('add')"
          @update:model-value="updateFilterModel"
        />
        <a-divider style="margin-top: 0" />
        <a-table
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          :columns="columns"
          :data="users"
          :stripe="true"
          :bordered="false"
          :size="size"
          @page-change="onPageChange"
        >
          <template #created_at="{ record }">
            {{ formatDate(record.created_at) }}
          </template>
          <template #operations="{ record }">
            <a-button
              type="text"
              size="small"
              @click="() => openDrawer('detail', record)"
            >
              {{ $t('system.user.operations.view') }}
            </a-button>
            <a-button
              type="text"
              size="small"
              style="margin-left: 8px"
              @click="() => openDrawer('edit', record)"
            >
              {{ $t('system.user.operations.edit') }}
            </a-button>
          </template>
        </a-table>
        <user-detail
          :visible="drawerVisible"
          :title="drawerTitle"
          :mode="drawerMode"
          :user="selectedUser"
          @update:visible="(val) => (drawerVisible = val)"
          @add="addUser"
          @edit="editUser"
        />
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { formatDate } from '@/utils/date';
  import UserDetail from '@/views/system/user/components/user-detail.vue';
  import UserFilter from '@/views/system/user/components/user-filter.vue';
  import { computed, reactive, ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    User,
    UserQueryPaginationParams,
    UserQueryParams,
  } from '@/api/system/types';
  import {
    createUser,
    getUserList,
    updateUser,
    updateUserRoles,
  } from '@/api/system/users';
  import { useI18n } from 'vue-i18n';
  import { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  const drawerVisible = ref(false);
  const drawerTitle = ref('');
  const drawerMode = ref<'add' | 'edit' | 'detail'>('add');
  const filterFormModel = ref<UserQueryParams>({
    username: undefined,
    email: undefined,
  });
  const selectedUser = ref<Pick<User, 'id' | 'username' | 'email'>>({
    id: 0,
    username: '',
    email: '',
  });
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const users = ref<User[]>([]);

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  const size = ref<SizeProps>('medium');
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('system.user.id'),
      dataIndex: 'id',
      width: 80,
    },
    {
      title: t('system.user.username'),
      dataIndex: 'username',
    },
    {
      title: t('system.user.email'),
      dataIndex: 'email',
    },
    {
      title: t('system.user.createdAt'),
      dataIndex: 'created_at',
      slotName: 'created_at',
      width: 200,
    },
    {
      title: t('system.user.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 200,
    },
  ]);

  const basePagination: UserQueryPaginationParams = {
    page: 1,
    limit: 10,
  };

  const pagination = reactive({
    ...basePagination,
  });
  const fetchData = async (params: UserQueryPaginationParams = pagination) => {
    setLoading(true);
    try {
      const { data } = await getUserList(params);
      users.value = data.list;
      pagination.page = data.page;
      pagination.total = data.total;
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  fetchData();
  const search = () => {
    fetchData({
      ...basePagination,
      ...filterFormModel.value,
    } as unknown as UserQueryPaginationParams);
  };
  const onPageChange = (page: number) => {
    fetchData({ ...basePagination, ...filterFormModel.value, page });
  };

  const addUser = async (user: User, roles: string[]) => {
    try {
      const { data } = await createUser({
        username: user.username,
        email: user.email,
      });
      await updateUserRoles(
        data.id,
        roles.map((str) => Number(str))
      );
      // Refresh or handle after save
      drawerVisible.value = false;
      await fetchData();
    } catch (err) {
      // Handle error
    }
  };
  const editUser = async (
    user: User,
    roles: string[],
    equalForm: boolean,
    equalRole: boolean
  ) => {
    try {
      if (!equalForm) {
        await updateUser(user.id, {
          username: user.username,
          email: user.email,
        });
      }
      if (!equalRole) {
        await updateUserRoles(
          user.id,
          roles.map((str) => Number(str))
        );
      }

      // Refresh or handle after save
      drawerVisible.value = false;
      await fetchData();
    } catch (err) {
      // Handle error
    }
  };

  const openDrawer = (mode: 'add' | 'edit' | 'detail', user?: User) => {
    drawerMode.value = mode;

    // eslint-disable-next-line default-case
    switch (mode) {
      case 'add':
        drawerTitle.value = t('system.user.operations.create.title');
        break;
      case 'detail':
        drawerTitle.value = t('system.user.operations.view.title');
        break;
      case 'edit':
        drawerTitle.value = t('system.user.operations.edit.title');
        break;
    }
    selectedUser.value = user || {
      id: 0,
      username: '',
      email: '',
    };
    drawerVisible.value = true;
  };
  const updateFilterModel = (newVal: any) => {
    filterFormModel.value = newVal;
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
