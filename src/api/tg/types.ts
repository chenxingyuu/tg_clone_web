import { PaginationParams } from '@/types/global';

// eslint-disable-next-line no-shadow
export enum AccountStatus {
  /**
   * 账号状态
   */
  /** 正常 */
  NORMAL = 1,
  /** 暂停 */
  SUSPENDED = 2,
  /** 过期 */
  EXPIRED = 3,
  /** 失败 */
  FAILED = 4,
}

export function getAccountStatusMessage(status: AccountStatus): string {
  switch (status) {
    case AccountStatus.NORMAL:
      return '正常';
    case AccountStatus.SUSPENDED:
      return '暂停';
    case AccountStatus.EXPIRED:
      return '过期';
    case AccountStatus.FAILED:
      return '失败';
    default:
      return '未知';
  }
}

export function getAccountStatusColor(status: AccountStatus): string {
  switch (status) {
    case AccountStatus.NORMAL:
      return 'green';
    case AccountStatus.SUSPENDED:
      return 'orange';
    case AccountStatus.EXPIRED:
      return 'gray';
    case AccountStatus.FAILED:
      return 'red';
    default:
      return 'blue';
  }
}

export interface Account {
  id: number;
  name: string;
  phone: string;
  password: string;
  api_id: string;
  api_hash: string;
  status: AccountStatus;
  first_name: string;
  last_name: string;
  tg_id: string;
}

export interface AccountQueryParams {
  name?: string;
  phone?: string;
}

export interface AccountQueryPaginationParams
  extends AccountQueryParams,
    PaginationParams {}
