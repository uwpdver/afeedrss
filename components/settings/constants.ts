import { NavListItem } from "./types";

export const NAV_LIST: NavListItem[] = [
  {
    name: "账户",
    iconProps: { iconName: "Contact" },
    url: "/settings/account",
  },
  {
    name: "界面",
    iconProps: { iconName: "RedEye" },
    url: "/settings/interface",
  },
  {
    name: "订阅源",
    iconProps: { iconName: "Subscribe" },
    url: "/settings/subscription_source",
  },
  {
    name: "关于",
    iconProps: { iconName: "Info" },
    url: "/settings/about",
  },
];
