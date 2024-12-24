import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeMonitor from '@/views/dashboard/monitor/locale/zh-CN';

import localeBasicProfile from '@/views/profile/basic/locale/zh-CN';

import localeSuccess from '@/views/result/success/locale/zh-CN';
import localeError from '@/views/result/error/locale/zh-CN';

import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

import localeUserInfo from '@/views/user/info/locale/zh-CN';
import localeUserSetting from '@/views/user/setting/locale/zh-CN';

import localeSystemPermission from '@/views/system/permission/locale/zh-CN';
import localeSystemMenu from '@/views/system/menu/locale/zh-CN';
import localeSystemRole from '@/views/system/role/locale/zh-CN';
import localeSystemUser from '@/views/system/user/locale/zh-CN';
import localeTG from '@/views/tg/locale/zh-CN';
import localeSettings from './zh-CN/settings';

export default {
  'menu.screen': '跳转大屏',
  'menu.dashboard': '仪表盘',
  'menu.system': '系统管理',
  'menu.system.user': '用户管理',
  'menu.system.role': '角色管理',
  'menu.system.permission': '权限管理',
  'menu.system.menu': '菜单管理',
  'menu.tg': 'TG',
  'menu.tg.account': '账号管理',
  'menu.tg.dialog': '对话管理',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'searchTable.form.reset': '重置',
  'searchTable.form.search': '查询',
  'searchTable.operation.create': '新增',
  'searchTable.operation.edit': '编辑',
  'searchTable.operation.save': '保存',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeMonitor,
  ...localeBasicProfile,
  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserInfo,
  ...localeUserSetting,
  ...localeSystemPermission,
  ...localeSystemRole,
  ...localeSystemUser,
  ...localeSystemMenu,
  ...localeTG,
};
