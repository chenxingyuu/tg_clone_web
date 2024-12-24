<template>
  <div class="container">
    <Breadcrumb :items="['menu.tg', 'menu.tg.account']" />
    <div class="layout">
      <a-card class="general-card" :title="$t('tg.account.card_title')">
        <account-filter
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
          :data="accounts"
          :stripe="true"
          :bordered="false"
          :size="size"
          @page-change="onPageChange"
        >
          <template #status="{ record }">
            <a-tag :color="getAccountStatusColor(record.status)">{{
              getAccountStatusMessage(record.status)
            }}</a-tag>
          </template>
          <template #created_at="{ record }">
            {{ formatDate(record.created_at) }}
          </template>
          <template #operations="{ record }">
            <a-button
              type="text"
              size="small"
              style="margin-left: 8px"
              @click="() => openDrawer('edit', record)"
            >
              {{ $t('tg.account.operations.edit') }}
            </a-button>
          </template>
        </a-table>
        <account-detail
          :visible="drawerVisible"
          :title="drawerTitle"
          :mode="drawerMode"
          :account="selectedAccount"
          @update:visible="(val) => (drawerVisible = val)"
          @add="addAccount"
          @edit="editAccount"
          @fetch="fetchData"
        />
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { formatDate } from '@/utils/date';
  import { ref, computed, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import useLoading from '@/hooks/loading';
  import {
    Account,
    AccountStatus,
    AccountQueryPaginationParams,
    AccountQueryParams,
    getAccountStatusMessage,
    getAccountStatusColor,
  } from '@/api/tg/types';
  import {
    createAccount,
    getAccountList,
    updateAccount,
  } from '@/api/tg/account';
  import AccountFilter from '@/views/tg/account/components/account-filter.vue';
  import AccountDetail from '@/views/tg/account/components/account-detail.vue';

  const drawerVisible = ref(false);
  const drawerTitle = ref('');
  const drawerMode = ref<'add' | 'edit' | 'detail'>('add');

  const selectedAccount = ref<Account>({
    id: 0,
    name: '',
    phone: '',
    password: '',
    api_id: '',
    api_hash: '',
    status: AccountStatus.EXPIRED,
    first_name: '',
    last_name: '',
    tg_id: '',
  });

  const filterFormModel = ref<AccountQueryParams>({
    name: undefined,
    phone: undefined,
  });

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const accounts = ref<Account[]>([]);

  const size = ref<SizeProps>('medium');
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('tg.account.id'),
      dataIndex: 'id',
      width: 80,
    },
    {
      title: t('tg.account.name'),
      dataIndex: 'name',
    },
    {
      title: t('tg.account.phone'),
      dataIndex: 'phone',
    },
    {
      title: t('tg.account.first_name'),
      dataIndex: 'first_name',
    },
    {
      title: t('tg.account.last_name'),
      dataIndex: 'last_name',
    },
    {
      title: t('tg.account.status'),
      dataIndex: 'status',
      slotName: 'status',
      width: 100,
    },
    {
      title: t('tg.account.createdAt'),
      dataIndex: 'created_at',
      slotName: 'created_at',
      width: 200,
    },
    {
      title: t('tg.account.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 100,
    },
  ]);

  const basePagination: AccountQueryPaginationParams = {
    page: 1,
    limit: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const fetchData = async (
    params: AccountQueryPaginationParams = pagination
  ) => {
    setLoading(true);
    try {
      const { data } = await getAccountList(params);
      accounts.value = data.list;
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
    } as unknown as AccountQueryPaginationParams);
  };

  const onPageChange = (page: number) => {
    fetchData({ ...basePagination, ...filterFormModel.value, page });
  };

  const addAccount = async (account: Account) => {
    try {
      await createAccount({
        name: account.name,
        phone: account.phone,
        password: account.password,
        api_id: account.api_id,
        api_hash: account.api_hash,
      });
      // Refresh or handle after save
      drawerVisible.value = false;
      await fetchData();
    } catch (err) {
      // Handle error
    }
  };

  const editAccount = async (account: Account, equalForm: boolean) => {
    try {
      if (!equalForm) {
        await updateAccount(account.id, {
          name: account.name,
          phone: account.phone,
          password: account.password,
          api_id: account.api_id,
          api_hash: account.api_hash,
        });
      }
      // Refresh or handle after save
      drawerVisible.value = false;
      await fetchData();
    } catch (err) {
      // Handle error
    }
  };

  const openDrawer = (mode: 'add' | 'edit' | 'detail', account?: Account) => {
    drawerMode.value = mode;

    // eslint-disable-next-line default-case
    switch (mode) {
      case 'add':
        drawerTitle.value = t('tg.account.create.title');
        break;
      case 'detail':
        drawerTitle.value = t('tg.account.view.title');
        break;
      case 'edit':
        drawerTitle.value = t('tg.account.edit.title');
        break;
    }
    selectedAccount.value = account || {
      id: 0,
      name: '',
      phone: '',
      password: '',
      api_id: '',
      api_hash: '',
      status: AccountStatus.EXPIRED,
      first_name: '',
      last_name: '',
      tg_id: '',
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
