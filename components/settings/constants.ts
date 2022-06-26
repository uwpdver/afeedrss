import { NavListItem } from "./types";

export const NAV_LIST: NavListItem[] = [
  {
    key: "account",
    name: "账户",
    desc: '注销登录',
    iconProps: { iconName: "Contact" },
    url: "/settings/account",
  },
  {
    key: "interface",
    name: "界面",
    desc: '自定义界面',
    iconProps: { iconName: "RedEye" },
    url: "/settings/interface",
  },
  {
    key: "subscription_source",
    name: "订阅源",
    desc: '管理订阅源,订阅新的 RSS 源',
    iconProps: { iconName: "Subscribe" },
    url: "/settings/subscription_source",
  },
  {
    key: "about",
    name: "关于",
    desc: '关于此应用的基本信息',
    iconProps: { iconName: "Info" },
    url: "/settings/about",
  },
];
