<template>
  <div class="container">
    <Breadcrumb :items="['menu.tg', 'menu.tg.dialog']" />
    <div class="layout">
      <a-card class="general-card" :title="$t('tg.dialog.card_title')">
        <dialog-filter
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
          :data="dialogs"
          :stripe="true"
          :bordered="false"
          :size="size"
          @page-change="onPageChange"
        >
          <template #type="{ record }">
            {{ getDialogTypeMessage(record.type) }}
          </template>
          <template #created_at="{ record }">
            {{ formatDate(record.created_at) }}
          </template>
          <template #operations="{ record }">
            <a-button
              type="text"
              size="small"
              style="margin-left: 8px"
              @click="() => openDrawer('detail', record)"
            >
              {{ $t('tg.dialog.operations.view') }}
            </a-button>
          </template>
        </a-table>
        <dialog-detail
          :visible="drawerVisible"
          :title="drawerTitle"
          :mode="drawerMode"
          :dialog="selectedDialog"
          @update:visible="(val) => (drawerVisible = val)"
          @fetch="fetchData"
        />
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { formatDate } from '@/utils/date';
  import { ref, computed, reactive, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import useLoading from '@/hooks/loading';
  import {
    Dialog,
    DialogQueryPaginationParams,
    DialogQueryParams,
    DialogType,
    getDialogTypeMessage,
  } from '@/api/tg/types';
  import { getDialogList } from '@/api/tg/dialog';
  import DialogFilter from '@/views/tg/dialog/components/dialog-filter.vue';
  import DialogDetail from '@/views/tg/dialog/components/dialog-detail.vue';

  const drawerVisible = ref(false);
  const drawerTitle = ref('');
  const drawerMode = ref<'add' | 'edit' | 'detail'>('add');

  const selectedDialog = ref<Dialog>({
    id: 0,
    title: '',
    username: '',
    type: DialogType.CHAT,
    status: '',
    tg_id: '',
    account_id: 0,
  });

  const filterFormModel = ref<DialogQueryParams>({
    title: undefined,
    username: undefined,
    account_id: undefined,
  });

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const dialogs = ref<Dialog[]>([]);

  const size = ref<SizeProps>('medium');
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('tg.dialog.id'),
      dataIndex: 'id',
      width: 80,
    },
    {
      title: t('tg.dialog.title'),
      dataIndex: 'title',
    },
    {
      title: t('tg.dialog.username'),
      dataIndex: 'username',
    },
    {
      title: t('tg.dialog.tg_id'),
      dataIndex: 'tg_id',
      width: 150,
    },
    {
      title: t('tg.dialog.type'),
      dataIndex: 'type',
      slotName: 'type',
    },
    {
      title: t('tg.dialog.createdAt'),
      dataIndex: 'created_at',
      slotName: 'created_at',
      width: 180,
    },
    {
      title: t('tg.dialog.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 100,
    },
  ]);

  const basePagination: DialogQueryPaginationParams = {
    page: 1,
    limit: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const fetchData = async (
    params: DialogQueryPaginationParams = pagination
  ) => {
    setLoading(true);
    try {
      const { data } = await getDialogList(params);
      dialogs.value = data.list;
      pagination.page = data.page;
      pagination.total = data.total;
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const search = async () => {
    await fetchData({
      ...basePagination,
      ...filterFormModel.value,
    } as unknown as DialogQueryPaginationParams);
  };

  const onPageChange = (page: number) => {
    fetchData({ ...basePagination, ...filterFormModel.value, page });
  };

  const openDrawer = (mode: 'add' | 'edit' | 'detail', dialog?: Dialog) => {
    drawerMode.value = mode;

    // eslint-disable-next-line default-case
    switch (mode) {
      case 'add':
        drawerTitle.value = t('tg.dialog.create.title');
        break;
      case 'detail':
        drawerTitle.value = t('tg.dialog.view.title');
        break;
      case 'edit':
        drawerTitle.value = t('tg.dialog.edit.title');
        break;
    }
    selectedDialog.value = dialog || {
      id: 0,
      title: '',
      username: '',
      type: DialogType.CHAT,
      status: '',
      tg_id: '',
      account_id: 0,
    };
    drawerVisible.value = true;
  };
  const updateFilterModel = (newVal: any) => {
    filterFormModel.value = newVal;
  };

  onMounted(async () => {
    await search();
  });
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
