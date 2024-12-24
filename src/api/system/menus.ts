import axios from 'axios';
import { Menu, MenuQueryParams, MenuTree } from '@/api/system/types';

export async function getMenuListAllTree(params: MenuQueryParams) {
  return axios.get<MenuTree[]>('/menus/all/tree', {
    params,
  });
}

export async function createMenu(menu: Pick<Menu, 'name' | 'description'>) {
  return axios.post('/menus', menu);
}

export async function updateMenu(
  id: number,
  menu: Pick<Menu, 'name' | 'description'>
) {
  return axios.put(`/menus/${id}`, menu);
}
