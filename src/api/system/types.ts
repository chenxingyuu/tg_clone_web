import { PaginationParams } from '@/types/global';

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthRes {
  access_token: string;
  token_type: string;
  scopes: string[];
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface RoleQueryParams extends PaginationParams {
  name?: string;
  description?: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface PermissionQueryParams extends PaginationParams {
  name?: string;
  description?: string;
}

export interface Menu {
  id: number;
  name: string;
  description: string;
}

export interface MenuTree {
  id: number;
  path: string;
  name: string;
  components: string;
  children: MenuTree[];
  meta: {
    locale: string;
    icon: string;
    requires_auth: boolean;
    order: number;
    hide_in_menu: boolean;
    hide_children_in_menu: boolean;
    no_affix: boolean;
    ignore_cache: boolean;
  };
}

export interface MenuQueryParams extends PaginationParams {
  name?: string;
  description?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface UserQueryParams {
  username?: string;
  email?: string;
}

export interface UserQueryPaginationParams
  extends UserQueryParams,
    PaginationParams {}
