import { PaginationParams } from '@/types/global';

// eslint-disable-next-line no-shadow
export enum DialogType {
  /**
   * 对话类型
   */
  /** 用户 */
  USER = 1,
  /** 群组 */
  GROUP = 2,
  /** 频道 */
  CHANNEL = 3,
  /** 聊天 */
  CHAT = 4,
  /** 被禁止的聊天 */
  CHAT_FORBIDDEN = 5,
}

export function getDialogTypeMessage(type: DialogType): string {
  switch (type) {
    case DialogType.USER:
      return '用户';
    case DialogType.GROUP:
      return '群组';
    case DialogType.CHANNEL:
      return '频道';
    case DialogType.CHAT:
      return '聊天';
    case DialogType.CHAT_FORBIDDEN:
      return '被禁止的聊天';
    default:
      return '未知';
  }
}
export interface Dialog {
  id: number;
  title: string;
  username: string;
  type: DialogType;
  status: string;
  tg_id: string;
  account_id: number;
}

export interface DialogQueryParams {
  title?: string;
  username?: string;
  account_id?: number;
}
export interface DialogQueryPaginationParams
  extends DialogQueryParams,
    PaginationParams {}
