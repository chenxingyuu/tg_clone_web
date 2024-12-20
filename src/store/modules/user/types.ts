export interface UserState {
  username: string;
  avatar: string;
  email?: string;
  roles: string[];
  permissions: string[];
  menus: string[];
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  creator_id: number;
}
