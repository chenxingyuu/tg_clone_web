/** socket 事件枚举 */
// eslint-disable-next-line no-shadow
export const enum ESocketRouter {
  /** 系统通知 */
  systemNotify = 'system_notify',
  /** 站内消息通知 */
  notifyMessage = 'notify_message',
  /** 账号登录更新 */
  tgAccountLoginUpdate = 'tg_account_login_update',
  /** 账号登录成功 */
  tgAccountLoginSuccess = 'tg_account_login_success',
  /** 账号登录失败 */
  tgAccountLoginError = 'tg_account_login_error',
}

export type TListener = {
  [ESocketRouter.notifyMessage]: (res: {
    title: string;
    content: string;
  }) => void;
  [ESocketRouter.systemNotify]: (res: {
    title: string;
    content: string;
  }) => void;
  [ESocketRouter.tgAccountLoginUpdate]: (res: any) => void;
  [ESocketRouter.tgAccountLoginSuccess]: () => void;
  [ESocketRouter.tgAccountLoginError]: () => void;
};

export type TEmitter = {
  /** 加入房间 */
  join_im: (roomId: string | number) => void;
  /** 离开房间 */
  leave_im: (roomId: string | number) => void;
  /** 登录验证 */
  tg_account_login: (phone: string) => void;
  /** 发送验证码 */
  tg_account_send_code: (phone: string, code: string) => void;
};
