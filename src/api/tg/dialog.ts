import { Dialog, DialogQueryPaginationParams } from '@/api/tg/types';
import axios from 'axios';
import { PaginatedResponse } from '@/types/global';

// eslint-disable-next-line import/prefer-default-export
export function getDialogList(params: DialogQueryPaginationParams) {
  return axios.get<PaginatedResponse<Dialog>>('/dialogs', { params });
}
