import axios from 'axios';
import { PaginatedResponse } from '@/types/global';
import { Role, Permission, RoleQueryParams } from '@/api/system/types';

export function getRoleList(params: RoleQueryParams) {
  return axios.get<PaginatedResponse<Role>>('/roles', { params });
}

export async function createRole(role: Pick<Role, 'name' | 'description'>) {
  return axios.post<Role>('/roles', role);
}

export async function updateRole(
  id: number,
  role: Pick<Role, 'name' | 'description'>
) {
  return axios.put(`/roles/${id}`, role);
}

export async function getRolePermissions(id: number) {
  return axios.get<Permission[]>(`/roles/${id}/permissions`);
}

export async function updateRolePermissions(
  id: number,
  permissionIds: number[]
) {
  return axios.put(`/roles/${id}/permissions`, permissionIds);
}

export function getAllRole() {
  return axios.get<Role[]>('/roles/all');
}
