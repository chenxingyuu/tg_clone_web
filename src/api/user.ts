import axios from 'axios';
import { Permission, UserState } from '@/store/modules/user/types';
import { MenuTree } from '@/api/system/types';

export function getUserInfo() {
  return axios.get<UserState>('/users/me');
}

export function getUserMePermissions() {
  return axios.get<Permission[]>('/users/me/permissions');
}

export function getUserRoles() {
  return axios.get<UserState>('/users/me/roles');
}

export async function getMenuList() {
  return axios.get<MenuTree[]>('/users/me/menus');
}
