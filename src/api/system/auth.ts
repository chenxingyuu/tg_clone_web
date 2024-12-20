import axios from 'axios';
import { AuthRes, LoginData } from '@/api/system/types';

export async function login(data: LoginData) {
  const params = new URLSearchParams();
  params.append('username', data.username);
  params.append('password', data.password);
  return axios.post<AuthRes>('/auth/password', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function logout() {
  return axios.post('/auth/logout');
}
