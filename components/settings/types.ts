import { IIconProps } from "@fluentui/react";

export interface NavListItem {
  key: string;
  name: string;
  desc?: string;
  iconProps?: IIconProps;
  url: string;
}
