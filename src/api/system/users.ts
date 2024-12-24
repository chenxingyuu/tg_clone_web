import axios from 'axios';
import { PaginatedResponse } from '@/types/global';
import { User, Permission, UserQueryParams, Role } from '@/api/system/types';

export function getUserList(params: UserQueryParams) {
  return axios.get<PaginatedResponse<User>>('/users', { params });
}

export async function createUser(user: Pick<User, 'username' | 'email'>) {
  return axios.post<User>('/users', user);
}

export async function updateUser(
  id: number,
  user: Pick<User, 'username' | 'email'>
) {
  return axios.put(`/users/${id}`, user);
}

export async function getUserPermissions(id: number) {
  return axios.get<Permission[]>(`/users/${id}/permissions`);
}

export async function getUserRoles(id: number) {
  return axios.get<Role[]>(`/users/${id}/roles`);
}

export async function updateUserRoles(id: number, roleIds: number[]) {
  return axios.put(`/users/${id}/roles`, roleIds);
}
