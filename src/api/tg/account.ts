import { Account, AccountQueryPaginationParams } from '@/api/tg/types';
import axios from 'axios';
import { PaginatedResponse } from '@/types/global';

export function getAccountList(params: AccountQueryPaginationParams) {
  return axios.get<PaginatedResponse<Account>>('/accounts', { params });
}
export async function createAccount(
  account: Pick<Account, 'name' | 'phone' | 'password' | 'api_id' | 'api_hash'>
) {
  return axios.post<Account>('/accounts', account);
}

export async function updateAccount(
  id: number,
  account: Pick<Account, 'name' | 'phone' | 'password' | 'api_id' | 'api_hash'>
) {
  return axios.patch<Account>(`/accounts/${id}`, account);
}
