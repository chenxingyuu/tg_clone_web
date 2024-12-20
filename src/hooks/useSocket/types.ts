/** socket 事件枚举 */
// eslint-disable-next-line no-shadow
export const enum ESocketRouter {
  /** 系统通知 */
  systemNotify = 'system_notify',
  /** 站内消息通知 */
  notifyMessage = 'notify_message',
  /** 位置更新 */
  positionUpdate = 'position_update',
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
  [ESocketRouter.positionUpdate]: (res: any) => void;
};

export type TEmitter = {
  /** 加入房间 */
  join_im: (roomId: string | number) => void;
  /** 离开房间 */
  leave_im: (roomId: string | number) => void;
};
