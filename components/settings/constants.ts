import { NavListItem } from "./types";

export const NAV_LIST: NavListItem[] = [
  {
    name: "账户",
    iconProps: { iconName: "Contact" },
    pathname: "/settings/account",
  },
  {
    name: "界面",
    iconProps: { iconName: "RedEye" },
    pathname: "/settings/interface",
  },
  {
    name: "阅读偏好",
    iconProps: { iconName: "ReadingMode" },
    pathname: "/settings/reading",
  },
  {
    name: "关于",
    iconProps: { iconName: "Info" },
    pathname: "/settings/about",
  },
];
