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
    name: "阅读偏好",
    iconProps: { iconName: "ReadingMode" },
    url: "/settings/reading",
  },
  {
    name: "关于",
    iconProps: { iconName: "Info" },
    url: "/settings/about",
  },
];
